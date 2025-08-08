import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  useCreateQuestionMutation,
  useGetAllQuestionsQuery,
  useGetSingleQuestionQuery,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} from "@/redux/features/admin/question.api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Edit, Trash2, Plus, X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";

type TQuestion = {
  _id?: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  competency: string;
  durationInSeconds: number;
};

const QuestionManagement = () => {
  // State for modal and form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Redux API hooks
  const { data: questions, isLoading, refetch } = useGetAllQuestionsQuery([]);
  const { data: singleQuestion } = useGetSingleQuestionQuery(editingId || "", {
    skip: !editingId,
  });
  const [createQuestion] = useCreateQuestionMutation();
  const [updateQuestion] = useUpdateQuestionMutation();
  const [deleteQuestion] = useDeleteQuestionMutation();

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<TQuestion>({
    defaultValues: {
      durationInSeconds: 60,
    },
  });

  // Load editing data into form
  React.useEffect(() => {
    if (singleQuestion && editingId) {
      reset({
        questionText: singleQuestion.data.questionText,
        options: singleQuestion.data.options,
        correctAnswer: singleQuestion.data.correctAnswer,
        level: singleQuestion.data.level,
        competency: singleQuestion.data.competency,
        durationInSeconds: singleQuestion.data.durationInSeconds,
      });
    }
  }, [singleQuestion, editingId, reset]);

  const onSubmit = async (data: TQuestion) => {
    console.log("this is data", data);
    try {
      if (editingId) {
        await updateQuestion({ id: editingId, data }).unwrap();
      } else {
        await createQuestion(data).unwrap();
      }
      resetForm();
      refetch();
    } catch (error) {
      console.error("Error saving question:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await deleteQuestion(id).unwrap();
        refetch();
      } catch (error) {
        console.error("Error deleting question:", error);
      }
    }
  };

  const resetForm = () => {
    reset();
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    reset();
    setEditingId(null);
    setIsFormOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Question Management</CardTitle>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Competency</TableHead>
                <TableHead>Options</TableHead>
                <TableHead>Correct Answer</TableHead>
                <TableHead>Duration (s)</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions?.data?.map((question: any) => (
                <TableRow key={question._id}>
                  <TableCell className="font-medium">
                    {question.questionText}
                  </TableCell>
                  <TableCell>{question.level}</TableCell>
                  <TableCell>{question.competency}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {question.options.map((opt: any, i: any) => (
                        <Badge key={i} variant="outline">
                          {opt}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{question.correctAnswer}</Badge>
                  </TableCell>
                  <TableCell>{question.durationInSeconds}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(question._id!)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(question._id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Form Modal */}
      {isFormOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setIsFormOpen(false)}
        >
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            exit={{ y: 20 }}
            className="bg-white rounded-lg w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>
                  {editingId ? "Edit Question" : "Add New Question"}
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={resetForm}>
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="questionText">Question Text</Label>
                    <Input
                      id="questionText"
                      {...register("questionText", {
                        required: "Question text is required",
                      })}
                      placeholder="Enter question..."
                    />
                    {errors.questionText && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.questionText.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="options">Options (comma separated)</Label>
                    <Input
                      id="options"
                      {...register("options", {
                        required: "Options are required",
                        setValueAs: (val) =>
                          typeof val === "string"
                            ? val.split(",").map((s) => s.trim())
                            : val,
                        validate: (val) =>
                          (Array.isArray(val) && val.length >= 2) ||
                          "At least 2 options required",
                      })}
                      placeholder="Option1, Option2, Option3..."
                    />
                    {errors.options && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.options.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="correctAnswer">Correct Answer</Label>
                    <Input
                      id="correctAnswer"
                      {...register("correctAnswer", {
                        required: "Correct answer is required",
                      })}
                      placeholder="Enter correct answer"
                    />
                    {errors.correctAnswer && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.correctAnswer.message}
                      </p>
                    )}
                  </div>

                  <Controller
                    name="level"
                    control={control}
                    rules={{ required: "Level is required" }}
                    render={({ field }) => (
                      <div>
                        <Label htmlFor="level">Level</Label>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            {["A1", "A2", "B1", "B2", "C1", "C2"].map((lvl) => (
                              <SelectItem key={lvl} value={lvl}>
                                {lvl}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.level && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.level.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                  <div>
                    <Label htmlFor="competency">Competency</Label>
                    <Input
                      id="competency"
                      {...register("competency", {
                        required: "Competency is required",
                      })}
                      placeholder="e.g., Digital Communication"
                    />
                    {errors.competency && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.competency.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="durationInSeconds">
                      Duration (seconds)
                    </Label>
                    <Input
                      id="durationInSeconds"
                      type="number"
                      {...register("durationInSeconds", {
                        valueAsNumber: true,
                        min: { value: 10, message: "Minimum 10 seconds" },
                      })}
                      placeholder="Default is 60"
                    />
                    {errors.durationInSeconds && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.durationInSeconds.message}
                      </p>
                    )}
                  </div>

                  <CardFooter className="flex justify-end gap-2 p-0">
                    <Button variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : editingId ? (
                        "Update Question"
                      ) : (
                        "Create Question"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default QuestionManagement;

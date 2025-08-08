import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState } from "react";

import {
  useGetAcademicFacultiesQuery,
  useGetAcademicDepartmentsQuery,
} from "@/redux/features/admin/academicManagement.api";

import {
  useCreateSupervisorMutation,
  useUpdateSupervisorMutation,
} from "@/redux/supervisoer/supervisoerApi";

import { CustomFormField } from "@/components/ui/form-field";
import type { TSupervisor } from "@/types/supervisor";

// Enums
const Gender = ["male", "female", "other"] as const;
const BloodGroup = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

// Name schema
const nameValidationSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(20)
    .refine((value) => /^[A-Z]/.test(value), {
      message: "First Name must start with a capital letter",
    }),
  middleName: z.string().optional(),
  lastName: z.string().min(1).max(20),
});

// Supervisor form schema
const formSchema = z.object({
  password: z.string().max(20),
  supervisor: z.object({
    designation: z.string().min(1),
    name: nameValidationSchema,
    gender: z.enum([...Gender] as [string, ...string[]]),
    dateOfBirth: z.string().or(z.date()).nullable().optional(),
    email: z.string().email(),
    contactNo: z.string().min(1),
    emergencyContactNo: z.string().min(1),
    bloodGroup: z.enum([...BloodGroup] as [string, ...string[]]),
    presentAddress: z.string().min(1),
    permanentAddress: z.string().min(1),
    academicDepartment: z.string().min(1),
    academicFaculty: z.string().min(1),
    profileImg: z.string().optional(),
  }),
});

interface SupervisorFormProps {
  supervisor?: TSupervisor;
  onSuccess: () => void;
}

export default function SupervisorForm({
  supervisor,
  onSuccess,
}: SupervisorFormProps) {
  const [createSupervisor] = useCreateSupervisorMutation();
  const [updateSupervisor] = useUpdateSupervisorMutation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: departmentsData } = useGetAcademicDepartmentsQuery(undefined);
  const { data: facultiesData } = useGetAcademicFacultiesQuery(undefined);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      supervisor: {
        designation: supervisor?.designation || "Professor",
        name: supervisor?.name,
        gender: supervisor?.gender,
        dateOfBirth: supervisor?.dateOfBirth,
        email: supervisor?.email,
        contactNo: supervisor?.contactNo,
        emergencyContactNo: supervisor?.emergencyContactNo,
        bloodGroup: supervisor?.bloodGroup,
        presentAddress: supervisor?.presentAddress,
        permanentAddress: supervisor?.permanentAddress,
        academicFaculty: supervisor?.academicFaculty,
        academicDepartment: supervisor?.academicDepartment,
        profileImg: supervisor?.profileImg,
      },
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
      form.setValue("supervisor.profileImg", e.target.files[0].name);
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const formattedData = {
        ...data,
        supervisor: {
          ...data.supervisor,
          dateOfBirth: data.supervisor.dateOfBirth
            ? new Date(data.supervisor.dateOfBirth).toISOString()
            : undefined,
        },
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(formattedData));
      if (selectedFile) formData.append("file", selectedFile);

      if (supervisor) {
        const result = await updateSupervisor({
          id: supervisor.id,
          data: formData,
        }).unwrap();
        if (result) {
          toast.success("Supervisor updated successfully");
          onSuccess();
        }
      } else {
        const result = await createSupervisor(formData).unwrap();
        if (result) {
          toast.success("Supervisor created successfully");
          onSuccess();
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Form submission failed");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Profile Image Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Profile Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
          />
          {supervisor?.profileImg && !selectedFile && (
            <img
              src={supervisor.profileImg}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
          )}
        </div>

        {!supervisor && (
          <CustomFormField
            form={form}
            name="password"
            label="Password"
            type="password"
            placeholder="Enter password"
            required
          />
        )}

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <CustomFormField
            form={form}
            name="supervisor.name.firstName"
            label="First Name"
            placeholder="John"
            required
          />
          <CustomFormField
            form={form}
            name="supervisor.name.lastName"
            label="Last Name"
            placeholder="Doe"
            required
          />
        </div>

        {/* Email & Designation */}
        <div className="grid grid-cols-2 gap-4">
          <CustomFormField
            form={form}
            name="supervisor.email"
            label="Email"
            placeholder="john@example.com"
            required
          />
          <CustomFormField
            form={form}
            name="supervisor.designation"
            label="Designation"
            placeholder="Professor"
            required
          />
        </div>

        {/* Contact */}
        <div className="grid grid-cols-2 gap-4">
          <CustomFormField
            form={form}
            name="supervisor.contactNo"
            label="Contact No"
            required
          />
          <CustomFormField
            form={form}
            name="supervisor.emergencyContactNo"
            label="Emergency Contact No"
            required
          />
        </div>

        {/* Gender & Blood Group */}
        <div className="grid grid-cols-2 gap-4">
          <CustomFormField
            form={form}
            name="supervisor.gender"
            label="Gender"
            required
            customRender={({ value, onChange }) => (
              <select
                className="w-full border rounded-md p-2"
                value={value}
                onChange={onChange}
              >
                {Gender.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            )}
          />
          <CustomFormField
            form={form}
            name="supervisor.bloodGroup"
            label="Blood Group"
            required
            customRender={({ value, onChange }) => (
              <select
                className="w-full border rounded-md p-2"
                value={value}
                onChange={onChange}
              >
                {BloodGroup.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            )}
          />
        </div>

        {/* Address Fields */}
        <div className="grid grid-cols-2 gap-4">
          <CustomFormField
            form={form}
            name="supervisor.presentAddress"
            label="Present Address"
            required
            customRender={({ value, onChange }) => (
              <Textarea value={value} onChange={onChange} />
            )}
          />
          <CustomFormField
            form={form}
            name="supervisor.permanentAddress"
            label="Permanent Address"
            required
            customRender={({ value, onChange }) => (
              <Textarea value={value} onChange={onChange} />
            )}
          />
        </div>

        {/* Academic Faculty & Department */}
        <div className="grid grid-cols-2 gap-4">
          <CustomFormField
            form={form}
            name="supervisor.academicFaculty"
            label="Academic Faculty"
            required
            customRender={({ value, onChange }) => (
              <select
                className="w-full border rounded-md p-2"
                value={value}
                onChange={onChange}
              >
                <option value="">Select Faculty</option>
                {facultiesData?.data?.map((fac) => (
                  <option key={fac._id} value={fac._id}>
                    {fac.name}
                  </option>
                ))}
              </select>
            )}
          />
          <CustomFormField
            form={form}
            name="supervisor.academicDepartment"
            label="Academic Department"
            required
            disabled={!form.watch("supervisor.academicFaculty")}
            customRender={({ value, onChange }) => (
              <select
                className="w-full border rounded-md p-2"
                value={value}
                onChange={onChange}
              >
                <option value="">Select Department</option>
                {departmentsData?.data?.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? "Submitting..."
              : supervisor
              ? "Update Supervisor"
              : "Add Supervisor"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

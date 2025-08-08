export type TExam = {
  _id: string;
  userId: string;
  step: number;
  score: number;
  status: "passed" | "failed";
  createdAt: string;
  updatedAt: string;
  // Add more if needed
};

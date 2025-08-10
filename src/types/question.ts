export type TQuestion = {
  _id: string;
  question: any;
  options: string[];
  answer: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  competency: string;
  createdAt?: string;
  updatedAt?: string;
  durationInSeconds: number | string;
  correctAnswer: number | string | null;
  data: any;
};

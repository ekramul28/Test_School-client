export type TCertificate = {
  _id: string;
  userId: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  issuedAt: string;
  certificationLevel: number | string;
  examStep: number;
  downloadUrl?: string;
  createdAt: string;
  updatedAt: string;
};

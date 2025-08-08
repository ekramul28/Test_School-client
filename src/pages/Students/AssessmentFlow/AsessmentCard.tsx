import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { type ReactNode } from "react";

interface AssessmentCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  gradient?: string;
}

export const AssessmentCard = ({
  title,
  subtitle,
  children,
  footer,
  gradient = "from-blue-600 to-blue-800",
}: AssessmentCardProps) => {
  return (
    <Card className="border-none shadow-lg">
      <CardHeader
        className={`bg-gradient-to-r ${gradient} text-white rounded-t-lg`}
      >
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        {subtitle && <p className="text-blue-100 mt-1">{subtitle}</p>}
      </CardHeader>
      <CardContent className="p-8">{children}</CardContent>
      {footer && (
        <CardFooter className="bg-gray-50 rounded-b-lg p-6">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
};

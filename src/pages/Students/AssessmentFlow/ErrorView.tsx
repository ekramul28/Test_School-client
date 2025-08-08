import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorViewProps {
  title: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorView = ({ title, message, onRetry }: ErrorViewProps) => {
  return (
    <Alert variant="destructive" className="border-l-4 border-red-500">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
      {onRetry && (
        <Button className="mt-4" onClick={onRetry}>
          Retry
        </Button>
      )}
    </Alert>
  );
};

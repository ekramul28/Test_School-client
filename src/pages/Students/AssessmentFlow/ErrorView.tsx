import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const ErrorCard = ({ error, onRetry }: { error: any; onRetry: () => void }) => (
  <div className="max-w-4xl mx-auto p-6">
    <Card className="border-none shadow-lg">
      <CardHeader className="bg-red-600 text-white rounded-t-lg flex items-center justify-between">
        <CardTitle>Error Loading Assessment</CardTitle>
        <AlertCircle className="h-6 w-6" />
      </CardHeader>
      <CardContent className="p-8">
        <Alert variant="destructive">
          <AlertTitle>Failed to load questions</AlertTitle>
          <AlertDescription>
            {error?.data?.message || "Something went wrong"}
          </AlertDescription>
        </Alert>
        <Button className="mt-6" onClick={onRetry}>
          Retry
        </Button>
      </CardContent>
    </Card>
  </div>
);

export default ErrorCard;

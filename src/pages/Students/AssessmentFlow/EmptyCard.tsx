import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ban } from "lucide-react";

interface EmptyCardProps {
  onReturn: () => void;
}

const EmptyCard = ({ onReturn }: EmptyCardProps) => (
  <div className="max-w-2xl mx-auto p-6">
    <Card className="border-none shadow-lg">
      <CardHeader className="bg-yellow-500 text-white rounded-t-lg flex items-center justify-between">
        <CardTitle>No Questions Found</CardTitle>
        <Ban className="h-6 w-6" />
      </CardHeader>
      <CardContent className="p-6">
        <p className="text-gray-700">
          There are currently no questions available for this assessment.
        </p>
        <Button className="mt-6" onClick={onReturn}>
          Return to Dashboard
        </Button>
      </CardContent>
    </Card>
  </div>
);

export default EmptyCard;

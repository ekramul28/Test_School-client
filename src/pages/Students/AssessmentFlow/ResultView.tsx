import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@radix-ui/react-select";
import { Badge, Download, Mail } from "lucide-react";

const ResultCard = ({
  result,
  score,
  total,
  currentStep,
  onProceed,
  onReturn,
}: {
  result: { level: string; passed: boolean; canProceed: boolean };
  score: number;
  total: number;
  currentStep: number;
  onProceed: () => void;
  onReturn: () => void;
}) => {
  const percentage = (score / total) * 100;

  const handleDownloadCertificate = () => {
    alert("Download certificate PDF logic here.");
    // implement real download API call here
  };

  const handleEmailCertificate = () => {
    alert("Send certificate email logic here.");
    // implement email API call here
  };

  return (
    <Card className="max-w-4xl mx-auto p-6 shadow-lg border-none">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Assessment Results</h2>
            <p className="text-blue-100 mt-1">
              Step {currentStep} Level Certification
            </p>
          </div>
          <Badge className="bg-green-600 text-white px-4 py-2">
            LEVEL {result.level} CERTIFIED
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-8 space-y-6">
        <div className="text-center">
          <p className="text-4xl font-bold text-blue-700">
            {percentage.toFixed(0)}%
          </p>
          <p className="mt-2 text-gray-600">
            {score} correct out of {total} questions
          </p>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={handleDownloadCertificate}
          >
            <CardHeader className="pb-2">
              <h3 className="text-lg flex items-center gap-2">
                <Download className="h-5 w-5 text-blue-600" />
                Download Certificate
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Get your official digital certificate in PDF format.
              </p>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={handleEmailCertificate}
          >
            <CardHeader className="pb-2">
              <h3 className="text-lg flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-600" />
                Email Certificate
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Have your certificate sent directly to your email.
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>

      <CardFooter className="bg-gray-50 rounded-b-lg p-6 flex justify-between">
        <Button variant="ghost" onClick={onReturn}>
          Return to Dashboard
        </Button>
        {result.canProceed && (
          <Button className="gap-2" onClick={onProceed}>
            Proceed to Step {currentStep + 1}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ResultCard;

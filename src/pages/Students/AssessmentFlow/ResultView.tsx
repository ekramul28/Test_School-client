import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@radix-ui/react-select";
import { Badge, Download, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  useDownloadCertificateByPdfMutation,
  useGetUserCertificatesQuery,
  useSendCertificateByEmailMutation,
} from "@/redux/features/certificate/certificateApi";

const ResultCard = ({
  userId,
  result,
  score,
  total,
  currentStep,
  onProceed,
  onReturn,
}: {
  userId: string | undefined;
  result: { level: string; passed: boolean; canProceed: boolean };
  score: number;
  total: number;
  currentStep: number;
  onProceed: () => void;
  onReturn: () => void;
}) => {
  const percentage = (score / total) * 100;
  console.log(userId);

  // Fetch user's certificates
  const { data: certificates } = useGetUserCertificatesQuery(userId as string);
  console.log("certificates", certificates);
  // Mutation hooks
  const [downloadCertificateByPdf] = useDownloadCertificateByPdfMutation();
  const [sendCertificateByEmail, { isLoading: isEmailing }] =
    useSendCertificateByEmailMutation();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");

  const handleDownloadCertificate = async () => {
    if (!certificates || certificates.length === 0) {
      toast({
        title: "Error",
        description: "No certificate found to download.",
        variant: "destructive",
      });
      return;
    }

    try {
      const certId = certificates[0]._id;
      const blob = await downloadCertificateByPdf(certId).unwrap();

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "certificate.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Certificate downloaded successfully!",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to download certificate.",
        variant: "destructive",
      });
    }
  };

  const handleSendEmail = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (!certificates || certificates.length === 0) {
      toast({
        title: "Error",
        description: "No certificate found to send.",
        variant: "destructive",
      });
      return;
    }

    try {
      const certId = certificates[0]._id;
      await sendCertificateByEmail({ id: certId, email }).unwrap();

      toast({
        title: "Success",
        description: `Certificate sent to ${email} successfully!`,
      });
      setIsModalOpen(false);
      setEmail("");
    } catch {
      toast({
        title: "Error",
        description: "Failed to send certificate by email.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
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
              onClick={() => setIsModalOpen(true)}
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

      {/* Email Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Certificate to Email</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoFocus
          />

          <DialogFooter>
            <Button
              onClick={handleSendEmail}
              disabled={isEmailing}
              className="gap-2"
            >
              {isEmailing ? "Sending..." : "Send Email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ResultCard;

"use client";

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
import { Badge, Download, Mail, ArrowRight, ArrowLeft } from "lucide-react";
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
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  console.log(userId);
  // Fetch user's certificates
  const { data: certificates } = useGetUserCertificatesQuery(
    {
      userId: userId as string, // Make sure userId exists
      currentStep: currentStep, // Optional parameter
    },
    { skip: !userId } // Skip if userId is missing
  );

  console.log("Certificates:", certificates); // Will be TCertificate[] or undefined
  console.log("Certificates data:", certificates);
  // Mutation hooks
  const [downloadCertificateByPdf] = useDownloadCertificateByPdfMutation();
  const [sendCertificateByEmail, { isLoading: isEmailing }] =
    useSendCertificateByEmailMutation();

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

      const pdfBlob = await downloadCertificateByPdf(certId).unwrap();

      // Create download link
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificate-${certId}.pdf`;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
      toast({
        title: "Success",
        description: "Certificate downloaded successfully!",
      });
    } catch (error: any) {
      // Handle JSON error response
      if (error.data && typeof error.data === "object") {
        toast(error.data.message || "Download failed");
      } else {
        toast({
          title: "error",
          description: "Certificate downloaded fell!",
        });
      }
      console.error("Download error:", error);
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

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const badgeVariants = {
    passed: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 0.8,
        repeat: 1,
      },
    },
    failed: {
      x: [-5, 5, -5, 5, 0],
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      className="max-w-4xl mx-auto"
    >
      <Card className="shadow-xl border-none overflow-hidden">
        {/* Header with result status */}
        <CardHeader
          className={`p-8 text-white rounded-t-lg ${
            result.passed
              ? "bg-gradient-to-r from-green-600 to-green-800"
              : "bg-gradient-to-r from-red-600 to-red-800"
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold">Assessment Results</h2>
              <p className="opacity-90 mt-1">
                Step {currentStep} Level Certification
              </p>
            </div>
            <motion.div
              variants={badgeVariants}
              animate={result.passed ? "passed" : "failed"}
            >
              <Badge
                className={`px-6 py-3 text-lg ${
                  result.passed
                    ? "bg-green-700 hover:bg-green-800"
                    : "bg-red-700 hover:bg-red-800"
                }`}
              >
                {result.passed
                  ? `LEVEL ${result.level} CERTIFIED`
                  : `LEVEL ${result.level} NOT PASSED`}
              </Badge>
            </motion.div>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          {/* Score display */}
          <div className="text-center space-y-4">
            <div className="relative inline-block">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div
                  className={`text-6xl font-bold ${
                    result.passed ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {percentage.toFixed(0)}%
                </div>
              </motion.div>
              <Progress
                value={percentage}
                className="h-2 mt-4"
                children={
                  <div
                    className={`h-full transition-all duration-500 ${
                      result.passed ? "bg-green-500" : "bg-red-500"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                }
              />
            </div>
            <p className="text-lg text-gray-600">
              You answered {score} out of {total} questions correctly
            </p>
          </div>

          <Separator />

          {/* Certificate actions (only if passed) */}
          {result.passed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <motion.div whileHover={{ y: -5 }}>
                <Card
                  className="cursor-pointer h-full"
                  onClick={handleDownloadCertificate}
                >
                  <CardHeader className="pb-2">
                    <h3 className="text-lg flex items-center gap-3">
                      <Download className="h-6 w-6 text-blue-600" />
                      Download Certificate
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Get your official digital certificate in PDF format.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ y: -5 }}>
                <Card
                  className="cursor-pointer h-full"
                  onClick={() => setIsModalOpen(true)}
                >
                  <CardHeader className="pb-2">
                    <h3 className="text-lg flex items-center gap-3">
                      <Mail className="h-6 w-6 text-blue-600" />
                      Email Certificate
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Have your certificate sent directly to your email.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}

          {/* Feedback message */}
          <motion.div
            className={`p-4 rounded-lg ${
              result.passed
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {result.passed ? (
              <p className="text-center">
                Congratulations! You've successfully passed this level
                assessment.
                {result.canProceed &&
                  " You're now eligible to proceed to the next level."}
              </p>
            ) : (
              <p className="text-center">
                You didn't meet the passing criteria this time. Please review
                the material and try again.
              </p>
            )}
          </motion.div>
        </CardContent>

        {/* Footer with navigation */}
        <CardFooter className="bg-gray-50 p-6 flex flex-col sm:flex-row justify-between gap-4">
          <Button variant="outline" onClick={onReturn} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Return to Dashboard
          </Button>

          {result.canProceed && (
            <Button onClick={onProceed} className="gap-2">
              Proceed to Step {currentStep + 1}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Email Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Send Certificate to Email
            </DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Enter recipient email address"
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
              {isEmailing ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" />
                  Send Certificate
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ResultCard;

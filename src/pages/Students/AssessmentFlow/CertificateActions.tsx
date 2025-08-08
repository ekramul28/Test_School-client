import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Mail } from "lucide-react";
import { motion } from "framer-motion";

export const CertificateActions = () => {
  const handleDownload = () => {
    alert("Certificate download would be implemented here");
  };

  const handleEmail = () => {
    alert("Email certificate functionality would be implemented here");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div whileHover={{ y: -2 }}>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Download className="h-5 w-5 text-blue-600" />
              Download Certificate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Get your official digital certificate in PDF format.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleDownload}
            >
              Download PDF
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <motion.div whileHover={{ y: -2 }}>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              Email Certificate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Have your certificate sent directly to your email.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={handleEmail}>
              Send to Email
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

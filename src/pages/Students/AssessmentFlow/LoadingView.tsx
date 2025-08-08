import { Loader2 } from "lucide-react";

const LoadingScreen = () => (
  <div className="flex items-center justify-center h-screen">
    <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
  </div>
);

export default LoadingScreen;

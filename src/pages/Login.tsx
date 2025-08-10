import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useLoginMutation,
  useForgetPasswordMutation,
} from "@/redux/features/auth/authApi";
import { setUser, type TUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { verifyToken } from "@/utils/verifyToken";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";
import { Lock, User, Eye, EyeOff, Mail } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const loginSchema = z.object({
  id: z.string().nonempty("ID is required"),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [activeTab, setActiveTab] = useState<"login" | "forgot">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Auth API hooks
  const [login] = useLoginMutation();
  const [forgetPassword] = useForgetPasswordMutation();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const res = await login(data).unwrap();
      if (res?.data?.accessToken) {
        const user = verifyToken(res.data.accessToken) as TUser;
        dispatch(setUser({ user, token: res.data.accessToken }));
        toast.success("Login successful");

        if (res.data.needsPasswordChange) {
          navigate(`/change-password`);
        } else {
          navigate(`/${user.role}/dashboard`);
        }
      }
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      await forgetPassword({ email }).unwrap();
      toast.success("Password reset link sent to your email");
      setActiveTab("login");
      reset();
    } catch (error) {
      toast.error("Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async (credentials: { id: string; password: string }) => {
    setIsLoading(true);
    await handleLogin(credentials);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-lg rounded-xl overflow-hidden dark:border dark:border-gray-700">
          <div className="bg-blue-600 dark:bg-blue-800 p-6 text-center">
            <Lock className="w-12 h-12 mx-auto text-white" />
            <CardTitle className="text-2xl font-bold text-white mt-4">
              Test_School Assessment
            </CardTitle>
            <p className="text-blue-100 dark:text-blue-200 mt-2">
              Digital Competency Certification Platform
            </p>

            <div className="flex justify-center mt-4 space-x-4">
              <Button
                variant={activeTab === "login" ? "secondary" : "ghost"}
                onClick={() => setActiveTab("login")}
                className=""
              >
                Login
              </Button>
              <Button
                variant={activeTab === "forgot" ? "secondary" : "ghost"}
                onClick={() => setActiveTab("forgot")}
                className="text-white"
              >
                Forgot Password
              </Button>
            </div>
          </div>

          <CardContent className="p-8">
            {activeTab === "login" && (
              <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="id"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    User ID
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="id"
                      placeholder="Enter your ID (e.g., A-0001)"
                      {...register("id")}
                      className="pl-10"
                    />
                  </div>
                  {errors.id && (
                    <p className="text-xs text-red-500">{errors.id.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="password"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...register("password")}
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full py-6 text-base font-medium bg-blue-600 hover:bg-blue-700 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                      Quick Login
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      demoLogin({ id: "A-0001", password: "Admin@123" })
                    }
                    className="text-xs h-10"
                    disabled={isLoading}
                  >
                    Admin
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      demoLogin({ id: "S-0001", password: "123456" })
                    }
                    className="text-xs h-10"
                    disabled={isLoading}
                  >
                    Student
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      demoLogin({ id: "F-0001", password: "Faculty@123" })
                    }
                    className="text-xs h-10"
                    disabled={isLoading}
                  >
                    Supervisor
                  </Button>
                </div>
              </form>
            )}

            {activeTab === "forgot" && (
              <form
                onSubmit={handleSubmit((data) =>
                  handleForgotPassword(data.email)
                )}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <Label
                    htmlFor="email"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your registered email"
                      {...register("email")}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full py-6 text-base font-medium bg-blue-600 hover:bg-blue-700 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>

                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    Remember your password?{" "}
                    <button
                      type="button"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                      onClick={() => setActiveTab("login")}
                    >
                      Login here
                    </button>
                  </p>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Need help?{" "}
            <a
              href="#"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Contact support
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { apiService } from "../services/api";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, Loader2, Copy, Check } from "lucide-react";

const schema = yup
  .object({
    usernameOrEmail: yup.string().required("Username or email is required"),
    password: yup.string().required("Password is required"),
  })
  .required();

type LoginFormData = yup.InferType<typeof schema>;

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success(`${field} copied to clipboard!`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await apiService.login(data);
      login(response);
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center flex flex-col items-center">
          <img
            src="/logo.png"
            alt="Resume Builder Logo"
            className="h-36 w-36"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="usernameOrEmail" className="sr-only">
                Username or Email
              </label>
              <input
                {...register("usernameOrEmail")}
                type="text"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username or Email"
              />
              {errors.usernameOrEmail && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.usernameOrEmail.message}
                </p>
              )}
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
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
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              🎉 Try the Demo Account
            </h3>
            <p className="text-xs text-blue-700 mb-3">
              Experience the full resume builder with pre-populated sample data:
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-medium text-blue-800">Username:</span>
                <div className="flex items-center space-x-2">
                  <code className="bg-blue-100 px-2 py-1 rounded text-blue-900">
                    testuser
                  </code>
                  <button
                    type="button"
                    onClick={() => copyToClipboard("testuser", "Username")}
                    className="p-1 hover:bg-blue-200 rounded transition-colors"
                    title="Copy username"
                  >
                    {copiedField === "Username" ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3 text-blue-600" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-blue-800">Password:</span>
                <div className="flex items-center space-x-2">
                  <code className="bg-blue-100 px-2 py-1 rounded text-blue-900">
                    test123
                  </code>
                  <button
                    type="button"
                    onClick={() => copyToClipboard("test123", "Password")}
                    className="p-1 hover:bg-blue-200 rounded transition-colors"
                    title="Copy password"
                  >
                    {copiedField === "Password" ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3 text-blue-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              Click the copy icons to copy credentials to clipboard!
            </p>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";
import {
  Shield,
  User,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setError(null);
      await login(data.username, data.password);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(message);
      setShake(true);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          onAnimationComplete={() => setShake(false)}
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6"
        >
          {/* Logo / Branding */}
          <div className="text-center mb-2">
            <Shield className="w-12 h-12 text-teal mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-navy">Lord CMS</h1>
            <p className="text-sm text-gray-500 mt-1">Admin Dashboard</p>
          </div>

          {/* General Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  {...register("username")}
                  className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-teal focus:border-teal outline-none transition"
                />
              </div>
              {errors.username && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password")}
                  className="w-full h-11 pl-10 pr-10 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-teal focus:border-teal outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-teal hover:bg-teal/90 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-gray-400 mt-6">
            Lord AC &copy; 2024. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

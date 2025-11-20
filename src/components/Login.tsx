import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Sparkles, Mail, Lock, Eye, EyeOff } from "lucide-react";

interface LoginProps {
  onLogin: (email: string, password: string) => void;
  onSwitchToSignup: () => void;
}

export function Login({ onLogin, onSwitchToSignup }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      onLogin(email, password);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F6F8FB] via-[#E8E4F3] to-[#F0E8F5] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background ambient orbs */}
      <motion.div
        className="absolute top-20 left-20 w-96 h-96 rounded-full blur-3xl opacity-30"
        style={{ background: "radial-gradient(circle, #A9C7FF, transparent)" }}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl opacity-30"
        style={{ background: "radial-gradient(circle, #C5A9FF, transparent)" }}
        animate={{
          x: [0, -50, 0],
          y: [0, -30, 0],
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
            style={{
              background: "linear-gradient(135deg, #C5A9FF, #A9C7FF)",
              boxShadow: "0 0 40px #C5A9FF50",
            }}
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-[#4A4A6A] mb-1 text-4xl font-bold">
            Welcome back
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-[#8A8AA8]">
            Your sanctuary awaits
          </motion.p>
        </div>

        {/* Login Form */}
        <Card className="p-8 bg-white/70 backdrop-blur-xl border-2 border-white/50 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[#6A6A88]">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8B8CC]" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="pl-11 bg-white/80 border-2 border-white/60 focus:border-[#C5A9FF] transition-all duration-300"
                  style={{
                    boxShadow: "0 0 0 0 #C5A9FF00",
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = "0 0 20px #C5A9FF30";
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = "0 0 0 0 #C5A9FF00";
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[#6A6A88]">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8B8CC]" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pl-11 pr-11 bg-white/80 border-2 border-white/60 focus:border-[#C5A9FF] transition-all duration-300"
                  style={{
                    boxShadow: "0 0 0 0 #C5A9FF00",
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = "0 0 20px #C5A9FF30";
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = "0 0 0 0 #C5A9FF00";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B8B8CC] hover:text-[#C5A9FF] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button type="button" className="cursor-pointer text-[#C5A9FF] hover:text-[#B098EE] transition-colors">
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-6 text-white transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #C5A9FF, #A9C7FF)",
                boxShadow: "0 0 20px #C5A9FF50",
              }}
            >
              {isLoading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                  <Sparkles className="w-5 h-5" />
                </motion.div>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E0E8F5]" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white/70 text-[#B8B8CC]">or</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-[#8A8AA8]">
              New to VibeLoop?{" "}
              <button type="button" onClick={onSwitchToSignup} className="cursor-pointer text-[#C5A9FF] hover:text-[#B098EE] transition-colors">
                Create an account
              </button>
            </p>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-[#B8B8CC] text-sm">Your digital sanctuary</p>
        </div>
      </motion.div>
    </div>
  );
}

import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Sparkles, Mail, Lock, Eye, EyeOff } from "lucide-react";

interface LoginProps {
  onLogin: (email: string, password: string) => void;
  onSwitchToSignup: () => void;
  onGuestLogin: () => void;
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11" />
    </svg>
  );
}

export function Login({ onLogin, onSwitchToSignup, onGuestLogin }: LoginProps) {
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

        {/* Login Card */}
        <Card className="p-8 bg-white/70 backdrop-blur-xl border-2 border-white/50 shadow-2xl">
          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <motion.button
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={onSwitchToSignup}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border-2 border-[#E0E8F5] bg-white/80 hover:bg-white hover:border-[#C5A9FF40] transition-all duration-300 cursor-pointer"
            >
              <GoogleIcon />
              <span className="text-[#4A4A6A]">Continue with Google</span>
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={onSwitchToSignup}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border-2 border-[#1A1A2E] bg-[#1A1A2E] hover:bg-[#2A2A3E] transition-all duration-300 cursor-pointer text-white"
            >
              <AppleIcon />
              <span className="text-white">Continue with Apple</span>
            </motion.button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E0E8F5]" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white/70 text-[#B8B8CC] text-sm">or sign in with email</span>
            </div>
          </div>

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
                  style={{ boxShadow: "0 0 0 0 #C5A9FF00" }}
                  onFocus={(e) => { e.target.style.boxShadow = "0 0 20px #C5A9FF30"; }}
                  onBlur={(e) => { e.target.style.boxShadow = "0 0 0 0 #C5A9FF00"; }}
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
                  style={{ boxShadow: "0 0 0 0 #C5A9FF00" }}
                  onFocus={(e) => { e.target.style.boxShadow = "0 0 20px #C5A9FF30"; }}
                  onBlur={(e) => { e.target.style.boxShadow = "0 0 0 0 #C5A9FF00"; }}
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
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E0E8F5]" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white/70 text-[#B8B8CC] text-sm">or</span>
            </div>
          </div>

          {/* Sign Up + Guest Links */}
          <div className="space-y-3 text-center">
            <p className="text-[#8A8AA8]">
              New to VibeLoop?{" "}
              <button type="button" onClick={onSwitchToSignup} className="cursor-pointer text-[#C5A9FF] hover:text-[#B098EE] transition-colors">
                Create an account
              </button>
            </p>
            <button
              type="button"
              onClick={onGuestLogin}
              className="cursor-pointer text-[#B8B8CC] hover:text-[#8A8AA8] transition-colors text-sm underline underline-offset-2 w-full"
            >
              Continue as Guest
            </button>
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

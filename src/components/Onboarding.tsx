import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { moods } from "./moods";
import { Sparkles, Heart, Compass, Moon } from "lucide-react";

interface OnboardingProps {
  onComplete: (userData: { name: string; ageRange: string; seekingFor: string[]; expressionStyle: string; initialMood: string }) => void;
}

type Step = "welcome" | "personal" | "intentions" | "mood";

const ageRanges = [
  { id: "13-17", label: "13-17", emoji: "🌱" },
  { id: "18-24", label: "18-24", emoji: "🌸" },
  { id: "25-34", label: "25-34", emoji: "🌿" },
  { id: "35+", label: "35+", emoji: "🌳" },
];

const seekingOptions = [
  { id: "expression", label: "Honest expression", emoji: "💭", color: "#A9C7FF" },
  { id: "connection", label: "Gentle connection", emoji: "🤝", color: "#C5A9FF" },
  { id: "understanding", label: "Being understood", emoji: "🫂", color: "#E0C9D9" },
  { id: "escape", label: "A quiet escape", emoji: "🌙", color: "#FFD4A9" },
  { id: "healing", label: "Space to heal", emoji: "🕊️", color: "#A9FFD4" },
  { id: "creativity", label: "Creative outlet", emoji: "🎨", color: "#D4A9FF" },
];

const expressionStyles = [
  { id: "words", label: "Mostly words", icon: "✍️", description: "I express through writing" },
  { id: "visual", label: "Visual + words", icon: "📸", description: "I love sharing moments" },
  { id: "minimal", label: "Minimal sharing", icon: "🌊", description: "I prefer to listen" },
  { id: "spontaneous", label: "Whatever feels right", icon: "✨", description: "It depends on my mood" },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState<Step>("welcome");
  const [name, setName] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [seekingFor, setSeekingFor] = useState<string[]>([]);
  const [expressionStyle, setExpressionStyle] = useState("");
  const [selectedMood, setSelectedMood] = useState("");

  const toggleSeeking = (id: string) => {
    setSeekingFor((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const handleComplete = () => {
    const moodData = moods.find((m) => m.id === selectedMood);
    const moodName = moodData ? moodData.label : "Peaceful";

    onComplete({
      name: name || "Traveler",
      ageRange: ageRange || "18-24",
      seekingFor: seekingFor.length > 0 ? seekingFor : ["expression"],
      expressionStyle: expressionStyle || "spontaneous",
      initialMood: moodName,
    });
  };

  const getStepIcon = () => {
    switch (step) {
      case "personal":
        return Heart;
      case "intentions":
        return Compass;
      case "mood":
        return Sparkles;
      default:
        return Sparkles;
    }
  };

  const StepIcon = getStepIcon();

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#F6F8FB] via-[#E8E4F8] to-[#F0E8F4] overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: "radial-gradient(circle, #A9C7FF 0%, transparent 70%)",
          }}
          animate={{
            x: ["-10%", "10%", "-10%"],
            y: ["-10%", "15%", "-10%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute right-0 bottom-0 w-80 h-80 rounded-full opacity-20 blur-3xl"
          style={{
            background: "radial-gradient(circle, #C5A9FF 0%, transparent 70%)",
          }}
          animate={{
            x: ["10%", "-10%", "10%"],
            y: ["10%", "-15%", "10%"],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Progress indicator */}
      {step !== "welcome" && (
        <div className="absolute top-8 left-0 right-0 px-12 z-20">
          <div className="flex gap-2">
            {["personal", "intentions", "mood"].map((s, i) => (
              <div
                key={s}
                className="h-1 flex-1 rounded-full transition-all duration-500"
                style={{
                  backgroundColor: ["personal", "intentions", "mood"].indexOf(step) >= i ? "#C5A9FF" : "#E0E8F5",
                }}
              />
            ))}
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* Welcome Step */}
        {step === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="h-full flex flex-col items-center justify-center px-8 text-center relative z-10"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="mb-8"
            >
              <div className="relative w-32 h-32 mx-auto">
                {/* Outer soft glow */}
                <div
                  className="absolute inset-0 rounded-full blur-3xl opacity-70"
                  style={{
                    background: "radial-gradient(circle, #A9C7FF 0%, #C5A9FF 100%)",
                  }}
                />
                {/* Main orb with radial gradient */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "radial-gradient(circle at 45% 40%, rgba(255,255,255,0.9) 0%, #A9C7FF 30%, #C5A9FF 100%)",
                  }}
                />
              </div>
            </motion.div>

            <h1 className="mb-1 text-[#4A4A6A] text-4xl font-bold">Welcome to VibeLoop</h1>
            <p className="text-[#6A6A88] mb-12 max-w-md leading-relaxed italic">
              A digital sanctuary for your emotions, moods, and dreams.
              <br />
              <br />
              No likes. No pressure. No performance.
              <br />
              Just honest expressions and shared feelings.
            </p>

            <Button
              onClick={() => setStep("personal")}
              className="px-12 py-6 rounded-full border-0 transition-all duration-500 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #C5A9FFEE, #A9C7FFAA)",
                color: "#FFFFFF",
                boxShadow: "0 8px 32px rgba(197, 169, 255, 0.3)",
              }}
            >
              Enter the sanctuary
            </Button>
          </motion.div>
        )}

        {/* Personal Info Step (Name + Age) */}
        {step === "personal" && (
          <motion.div
            key="personal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="h-full flex flex-col items-center justify-center px-8 relative z-10 overflow-y-auto py-20"
          >
            <div className="max-w-md w-full">
              <motion.div
                className="w-20 h-20 rounded-full mb-8 flex items-center justify-center mx-auto"
                style={{
                  background: "linear-gradient(135deg, #C5A9FF40, #A9C7FF40)",
                  boxShadow: "0 0 40px rgba(197, 169, 255, 0.3)",
                }}
                animate={{
                  boxShadow: ["0 0 40px rgba(197, 169, 255, 0.3)", "0 0 60px rgba(197, 169, 255, 0.5)", "0 0 40px rgba(197, 169, 255, 0.3)"],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Heart className="w-10 h-10 text-[#C5A9FF]" />
              </motion.div>

              <div className="text-center mb-8">
                <h2 className="mb-1 text-[#4A4A6A] text-4xl font-bold text-3xl font-bold">Let's get to know you</h2>
                <p className="text-[#8A8AA8] italic">Share what feels comfortable&mdash; you can always change this later</p>
              </div>

              {/* Name Input */}
              <div className="mb-8">
                <label className="block text-sm text-[#6A6A88] mb-3 text-left">What should we call you?</label>
                <Input
                  type="text"
                  placeholder="Your name or nickname..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="cursor-text px-6 py-6 rounded-3xl bg-white/80 border-2 border-[#C5A9FF]/30 focus:border-[#C5A9FF]/60 text-[#4A4A6A] placeholder:text-[#B8B8CC] text-center"
                  autoFocus
                />
              </div>

              {/* Age Range */}
              <div className="mb-8">
                <label className="block text-sm text-[#6A6A88] mb-3 text-left">Which season of life are you in?</label>
                <div className="grid grid-cols-2 gap-3">
                  {ageRanges.map((range) => {
                    const isSelected = ageRange === range.id;
                    return (
                      <motion.button
                        key={range.id}
                        onClick={() => setAgeRange(range.id)}
                        className="cursor-pointer text-left px-6 py-6 rounded-3xl border-2 transition-all duration-300"
                        style={{
                          borderColor: isSelected ? "#C5A9FFAA" : "#E0E8F5",
                          backgroundColor: isSelected ? "#C5A9FF20" : "rgba(255,255,255,0.8)",
                          boxShadow: isSelected ? "0 8px 24px rgba(197, 169, 255, 0.3)" : "none",
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="text-2xl mb-1">{range.emoji}</div>
                        <div className="text-sm text-[#4A4A6A]">{range.label}</div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => setStep("welcome")}
                  className="cursor-pointer px-8 py-5 rounded-full border-2 transition-all duration-300"
                  style={{
                    borderColor: "#C5A9FF60",
                    backgroundColor: "transparent",
                    color: "#6A6A88",
                  }}
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep("intentions")}
                  className="cursor-pointer px-12 py-5 rounded-full border-0 transition-all duration-500 hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, #C5A9FFEE, #A9C7FFAA)",
                    color: "#FFFFFF",
                    boxShadow: "0 8px 32px rgba(197, 169, 255, 0.3)",
                  }}
                >
                  Continue
                </Button>
              </div>

              <button
                onClick={() => setStep("intentions")}
                className="cursor-pointer mt-6 text-sm text-[#B8B8CC] hover:text-[#8A8AA8] transition-colors underline w-full text-center"
              >
                Skip for now
              </button>
            </div>
          </motion.div>
        )}

        {/* Intentions Step (Seeking + Expression) */}
        {step === "intentions" && (
          <motion.div
            key="intentions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="h-full flex flex-col items-center justify-center px-8 relative z-10 overflow-y-auto py-20"
          >
            <div className="max-w-md w-full">
              <motion.div
                className="w-20 h-20 rounded-full mb-8 flex items-center justify-center mx-auto"
                style={{
                  background: "linear-gradient(135deg, #A9C7FF40, #C5A9FF40)",
                  boxShadow: "0 0 40px rgba(169, 199, 255, 0.3)",
                }}
                animate={{
                  boxShadow: ["0 0 40px rgba(169, 199, 255, 0.3)", "0 0 60px rgba(197, 169, 255, 0.5)", "0 0 40px rgba(169, 199, 255, 0.3)"],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Compass className="w-10 h-10 text-[#A9C7FF]" />
              </motion.div>

              <div className="spacing h-48"></div>

              <div className="text-center mb-8">
                <h2 className="mb-1 text-[#4A4A6A] text-4xl font-bold">What brings you here?</h2>
                <p className="text-[#8A8AA8] italic">Help us understand your intentions and how you like to express yourself</p>
              </div>

              {/* Seeking Options */}
              <div className="mb-8">
                <label className="block text-sm text-[#6A6A88] mb-3 text-left">What are you seeking? (choose all that resonate)</label>
                <div className="grid grid-cols-2 gap-3">
                  {seekingOptions.map((option) => {
                    const isSelected = seekingFor.includes(option.id);
                    return (
                      <motion.button
                        key={option.id}
                        onClick={() => toggleSeeking(option.id)}
                        className="cursor-pointer px-6 py-6 rounded-3xl border-2 transition-all duration-300 text-left"
                        style={{
                          borderColor: isSelected ? option.color + "AA" : option.color + "30",
                          backgroundColor: isSelected ? option.color + "20" : "rgba(255,255,255,0.8)",
                          boxShadow: isSelected ? `0 8px 24px ${option.color}40` : "none",
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="text-xl mb-1">{option.emoji}</div>
                        <div className="text-xs text-[#4A4A6A]">{option.label}</div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Expression Style */}
              <div className="mb-8">
                <label className="block text-sm text-[#6A6A88] mb-3 text-left">How do you like to express yourself?</label>
                <div className="space-y-2">
                  {expressionStyles.map((style) => {
                    const isSelected = expressionStyle === style.id;
                    return (
                      <motion.button
                        key={style.id}
                        onClick={() => setExpressionStyle(style.id)}
                        className="cursor-pointer w-full p-4 rounded-3xl border-2 transition-all duration-300 text-left"
                        style={{
                          borderColor: isSelected ? "#C5A9FFAA" : "#E0E8F5",
                          backgroundColor: isSelected ? "#C5A9FF20" : "rgba(255,255,255,0.8)",
                          boxShadow: isSelected ? "0 8px 24px rgba(197, 169, 255, 0.3)" : "none",
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{style.icon}</span>
                          <div className="flex-1">
                            <div className="text-sm text-[#4A4A6A]">{style.label}</div>
                            <div className="text-xs text-[#8A8AA8]">{style.description}</div>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => setStep("personal")}
                  className="cursor-pointer px-8 py-5 rounded-full border-2 transition-all duration-300"
                  style={{
                    borderColor: "#C5A9FF60",
                    backgroundColor: "transparent",
                    color: "#6A6A88",
                  }}
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep("mood")}
                  className="cursor-pointer px-12 py-5 rounded-full border-0 transition-all duration-500 hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, #C5A9FFEE, #A9C7FFAA)",
                    color: "#FFFFFF",
                    boxShadow: "0 8px 32px rgba(197, 169, 255, 0.3)",
                  }}
                >
                  Continue
                </Button>
              </div>

              <button
                onClick={() => setStep("mood")}
                className="cursor-pointer mt-6 text-sm text-[#B8B8CC] hover:text-[#8A8AA8] transition-colors underline w-full text-center"
              >
                Skip for now
              </button>
            </div>
          </motion.div>
        )}

        {/* Mood Step */}
        {step === "mood" && (
          <motion.div
            key="mood"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="h-full flex flex-col items-center justify-center px-8 relative z-10 overflow-y-auto py-20"
          >
            <div className="max-w-lg w-full">
              <motion.div
                className="cursor-pointer w-20 h-20 rounded-full mb-8 flex items-center justify-center mx-auto"
                style={{
                  background: "linear-gradient(135deg, #C5A9FF40, #FFD4A940)",
                  boxShadow: "0 0 40px rgba(197, 169, 255, 0.3)",
                }}
                animate={{
                  boxShadow: ["0 0 40px rgba(197, 169, 255, 0.3)", "0 0 60px rgba(255, 212, 169, 0.5)", "0 0 40px rgba(197, 169, 255, 0.3)"],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles className="w-10 h-10 text-[#C5A9FF]" />
              </motion.div>

              <div className="spacing h-40"></div>

              <div className="text-center mb-8">
                <h2 className="mb-1 text-[#4A4A6A] text-4xl font-bold text-3xl font-bold">How are you feeling right now?</h2>
                <p className="text-[#8A8AA8] italic">Your mood helps us show you the right vibes</p>
              </div>

              {/* Mood Grid */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {moods.map((mood) => {
                  const isSelected = selectedMood === mood.id;
                  return (
                    <motion.button
                      key={mood.id}
                      onClick={() => setSelectedMood(mood.id)}
                      className="cursor-pointer p-5 rounded-3xl border-2 transition-all duration-300 text-left"
                      style={{
                        borderColor: isSelected ? mood.color + "AA" : mood.color + "30",
                        backgroundColor: isSelected ? mood.color + "20" : "rgba(255,255,255,0.8)",
                        boxShadow: isSelected ? `0 8px 24px ${mood.color}40` : "none",
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{mood.emoji}</span>
                        <span className="text-[#4A4A6A] capitalize">{mood.label}</span>
                      </div>
                      <p className="text-xs text-[#8A8AA8] leading-relaxed">{mood.description}</p>
                    </motion.button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => setStep("intentions")}
                  className="cursor-pointer px-8 py-5 rounded-full border-2 transition-all duration-300"
                  style={{
                    borderColor: "#C5A9FF60",
                    backgroundColor: "transparent",
                    color: "#6A6A88",
                  }}
                >
                  Back
                </Button>
                <Button
                  onClick={handleComplete}
                  disabled={!selectedMood}
                  className="cursor-pointer px-12 py-5 rounded-full border-0 transition-all duration-500 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: selectedMood ? "linear-gradient(135deg, #C5A9FFEE, #A9C7FFAA)" : "linear-gradient(135deg, #D0D0E0, #C0C0D0)",
                    color: "#FFFFFF",
                    boxShadow: selectedMood ? "0 8px 32px rgba(197, 169, 255, 0.3)" : "none",
                  }}
                >
                  Begin your journey
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

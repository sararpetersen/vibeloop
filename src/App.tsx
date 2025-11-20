import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { VibeFeed } from "./components/VibeFeed";
import { DreamCatcher } from "./components/DreamCatcher";
import { LocalLoops } from "./components/LocalLoops";
import { Profile } from "./components/Profile";
import { Settings } from "./components/Settings";
import { Onboarding } from "./components/Onboarding";
import { Login } from "./components/Login";
import { Constellation } from "./components/Constellation";
import { VibeWaves } from "./components/VibeWaves";
import { Home, Cloud, Users, User, Stars, TrendingUp, ChevronRight } from "lucide-react";

type Screen = "feed" | "dreamcatcher" | "loops" | "profile" | "constellation" | "waves";
type AuthState = "login" | "signup" | "authenticated";

export interface UserDream {
  id: number;
  mood: string;
  moodColor: string;
  text: string;
  timestamp: string;
  dreamOrb: boolean;
  author: string;
  authorUsername: string;
  authorColor: string;
  isFollowing: boolean;
  image?: string;
}

export default function App() {
  const [authState, setAuthState] = useState<AuthState>("login");
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [userName, setUserName] = useState("");
  const [currentScreen, setCurrentScreen] = useState<Screen>("feed");
  const [selectedMood, setSelectedMood] = useState("All");
  const [showSettings, setShowSettings] = useState(false);
  const [savedDreamOrbs, setSavedDreamOrbs] = useState<number[]>([]);
  const [userDreams, setUserDreams] = useState<UserDream[]>([]);

  // Check if user has already onboarded
  useEffect(() => {
    const onboardingData = localStorage.getItem("vibeloop_onboarded");
    if (onboardingData) {
      const { hasOnboarded, userName, initialMood } = JSON.parse(onboardingData);
      setHasOnboarded(hasOnboarded);
      setUserName(userName);
      setSelectedMood(initialMood);
      setAuthState("authenticated");
    }
  }, []);

  const handleLogin = (email: string, password: string) => {
    // In a real app, this would validate credentials
    // For now, we'll check if user has onboarding data
    const onboardingData = localStorage.getItem("vibeloop_onboarded");
    if (onboardingData) {
      const { userName, initialMood } = JSON.parse(onboardingData);
      setUserName(userName);
      setSelectedMood(initialMood);
      setHasOnboarded(true);
      setAuthState("authenticated");
    } else {
      // No account found, redirect to signup
      setAuthState("signup");
    }
  };

  const handleOnboardingComplete = (userData: {
    name: string;
    ageRange: string;
    seekingFor: string[];
    expressionStyle: string;
    initialMood: string;
  }) => {
    setUserName(userData.name);
    setHasOnboarded(true);
    setAuthState("authenticated");

    // Save to localStorage
    localStorage.setItem(
      "vibeloop_onboarded",
      JSON.stringify({
        hasOnboarded: true,
        userName: userData.name,
        ageRange: userData.ageRange,
        seekingFor: userData.seekingFor,
        expressionStyle: userData.expressionStyle,
        initialMood: userData.initialMood,
      })
    );

    // Set mood after a brief delay for smooth transition
    setTimeout(() => {
      setSelectedMood(userData.initialMood);
    }, 300);
  };

  const handleSaveDream = (dream: { mood: string; moodColor: string; text: string; image?: string }) => {
    const newDream: UserDream = {
      id: Date.now(), // Use timestamp as unique ID
      mood: dream.mood,
      moodColor: dream.moodColor,
      text: dream.text,
      timestamp: "Just now",
      dreamOrb: true,
      author: userName,
      authorUsername: "you",
      authorColor: dream.moodColor,
      isFollowing: true,
      image: dream.image,
    };

    setUserDreams((prev) => [newDream, ...prev]);
    setCurrentScreen("feed"); // Navigate to feed to see the saved dream
  };

  // Show login screen for unauthenticated users
  if (authState === "login") {
    return <Login onLogin={handleLogin} onSwitchToSignup={() => setAuthState("signup")} />;
  }

  // Show onboarding for new users (signup)
  if (authState === "signup" || !hasOnboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const navItems = [
    { id: "feed" as Screen, icon: Home, label: "Home" },
    { id: "waves" as Screen, icon: TrendingUp, label: "Waves" },
    { id: "dreamcatcher" as Screen, icon: Cloud, label: "Dream" },
    { id: "constellation" as Screen, icon: Stars, label: "Stars" },
    { id: "loops" as Screen, icon: Users, label: "Loops" },
    { id: "profile" as Screen, icon: User, label: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F6F8FB] via-[#E8E4F3] to-[#F0E8F5] relative">
      {/* Desktop Sidebar Navigation */}
      {!showSettings && (
        <div className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-white/80 backdrop-blur-xl border-r-2 border-[#E0E8F5] z-50 flex-col">
          {/* Logo/Header */}
          <div className="p-6 border-b-2 border-[#E0E8F5]">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                {/* Outer soft glow */}
                <div
                  className="absolute inset-0 rounded-full blur-xl opacity-60"
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
              <div>
                <h1 className="text-[#4A4A6A]">VibeLoop</h1>
                <p className="text-[#B8B8CC] text-xs">Your sanctuary</p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 px-4 py-6 space-y-2">
            {navItems
              .filter((item) => item.id !== "profile")
              .map((item) => {
                const Icon = item.icon;
                const isActive = currentScreen === item.id;

                return (
                  <motion.button
                    key={item.id}
                    onClick={() => setCurrentScreen(item.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer"
                    whileTap={{ scale: 0.98 }}
                    whileHover={{
                      backgroundColor: isActive ? "#C5A9FF30" : "#C5A9FF15",
                      x: 4,
                    }}
                    style={{
                      backgroundColor: isActive ? "#C5A9FF20" : "transparent",
                    }}
                  >
                    <Icon
                      className="w-5 h-5 transition-all duration-300"
                      style={{
                        color: isActive ? "#C5A9FF" : "#B8B8CC",
                        filter: isActive ? `drop-shadow(0 0 8px #C5A9FF80)` : "none",
                      }}
                    />
                    <span
                      className="transition-all duration-300"
                      style={{
                        color: isActive ? "#6A6A88" : "#B8B8CC",
                      }}
                    >
                      {item.label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="desktopActiveIndicator"
                        className="ml-auto w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor: "#C5A9FF",
                          boxShadow: "0 0 8px #C5A9FF",
                        }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.button>
                );
              })}
          </div>

          {/* User Section */}
          <div className="p-4 border-t-2 border-[#E0E8F5]">
            <motion.button
              onClick={() => setCurrentScreen("profile")}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/50 cursor-pointer transition-all duration-300 group relative overflow-hidden"
              whileHover={{
                scale: 1.02,
                backgroundColor: "rgba(197, 169, 255, 0.15)",
                x: 2,
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Subtle shimmer on hover */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(197, 169, 255, 0.2), transparent)",
                }}
              />

              <div
                className="w-10 h-10 rounded-full flex items-center justify-center relative z-10 transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, #C5A9FF40, #A9C7FF40)",
                  boxShadow: currentScreen === "profile" ? "0 0 30px #C5A9FF60" : "0 0 20px #C5A9FF30",
                }}
              >
                <span className="text-[#6A6A88] text-sm">You</span>
              </div>
              <div className="flex-1 min-w-0 text-left relative z-10">
                <p className="text-[#4A4A6A] truncate">{userName}</p>
                <p className="text-[#B8B8CC] text-xs group-hover:text-[#A99FC5] transition-colors">View your profile</p>
              </div>
              <ChevronRight
                className="w-4 h-4 text-[#B8B8CC] opacity-0 group-hover:opacity-100 transition-all duration-300 relative z-10"
                style={{
                  transform: "translateX(-4px)",
                }}
              />
            </motion.button>
          </div>
        </div>
      )}

      {/* Screen Content */}
      <div className="h-full relative md:ml-64">
        <AnimatePresence mode="wait">
          {showSettings ? (
            <Settings key="settings" userName={userName} onClose={() => setShowSettings(false)} />
          ) : (
            <>
              {currentScreen === "feed" && (
                <VibeFeed key="feed" selectedMood={selectedMood} setSelectedMood={setSelectedMood} userDreams={userDreams} />
              )}
              {currentScreen === "waves" && <VibeWaves key="waves" />}
              {currentScreen === "dreamcatcher" && <DreamCatcher key="dreamcatcher" userName={userName} onSaveDream={handleSaveDream} />}
              {currentScreen === "constellation" && <Constellation key="constellation" />}
              {currentScreen === "loops" && <LocalLoops key="loops" />}
              {currentScreen === "profile" && <Profile key="profile" userName={userName} onSettingsClick={() => setShowSettings(true)} />}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Bottom Navigation */}
      {!showSettings && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t-2 border-[#E0E8F5] z-50">
          <div className="flex items-center justify-around px-2 py-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => setCurrentScreen(item.id)}
                  className="flex flex-col items-center gap-0.5 relative cursor-pointer"
                  whileTap={{ scale: 0.9 }}
                  whileHover={{
                    scale: 1.05,
                    y: -2,
                  }}
                >
                  <div
                    className={`p-2 rounded-xl transition-all duration-300 ${isActive ? "shadow-lg" : ""}`}
                    style={{
                      backgroundColor: isActive ? "#C5A9FF30" : "transparent",
                    }}
                  >
                    <Icon
                      className="w-5 h-5 transition-all duration-300"
                      style={{
                        color: isActive ? "#C5A9FF" : "#B8B8CC",
                        filter: isActive ? `drop-shadow(0 0 8px #C5A9FF80)` : "none",
                      }}
                    />
                  </div>
                  <span
                    className="text-[10px] transition-all duration-300"
                    style={{
                      color: isActive ? "#6A6A88" : "#B8B8CC",
                    }}
                  >
                    {item.label}
                  </span>

                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="mobileActiveIndicator"
                      className="absolute -top-1 w-1 h-1 rounded-full"
                      style={{
                        backgroundColor: "#C5A9FF",
                        boxShadow: "0 0 8px #C5A9FF",
                      }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Background ambient animation */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
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
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
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
      </div>
    </div>
  );
}

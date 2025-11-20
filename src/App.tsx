import React, { useState, useEffect, Component } from "react";
import { motion, AnimatePresence } from "motion/react";
import VibeFeed from "./components/VibeFeed";
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

// Simple Error Boundary to surface render errors visibly
class ErrorBoundary extends Component<any, { hasError: boolean; error?: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, info: any) {
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-red-50">
          <div className="max-w-lg w-full bg-white p-6 rounded-2xl shadow-lg border">
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            <pre className="text-xs text-red-700 overflow-auto max-h-40">{String(this.state.error)}</pre>
            <div className="mt-4">
              <button onClick={() => location.reload()} className="px-4 py-2 rounded-full bg-[#C5A9FF] text-white">
                Reload
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [authState, setAuthState] = useState<AuthState>("login");
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [userBio, setUserBio] = useState<string | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>("feed");
  const [selectedMood, setSelectedMood] = useState("All");
  const [showSettings, setShowSettings] = useState(false);
  const [joinedLoops, setJoinedLoops] = useState<{ id: number; name: string; color: string }[]>(() => {
    try {
      const raw = localStorage.getItem("vibeloop_joined_loops");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });
  const [followingList, setFollowingList] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem("vibeloop_following");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [savedDreamOrbs, setSavedDreamOrbs] = useState<number[]>([]);
  const [userDreams, setUserDreams] = useState<UserDream[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showDebug, setShowDebug] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem("vibeloop_debug");
      return raw === "true";
    } catch (e) {
      return false;
    }
  });

  // Check if user has already onboarded
  useEffect(() => {
    const onboardingData = localStorage.getItem("vibeloop_onboarded");
    if (onboardingData) {
      try {
        const parsed = JSON.parse(onboardingData) || {};
        const { hasOnboarded: ho, userName: un, initialMood: im } = parsed;
        if (ho) setHasOnboarded(ho);
        if (typeof un === "string") setUserName(un);
        if (typeof im === "string") setSelectedMood(im);
        if (ho) setAuthState("authenticated");
      } catch (e) {
        // malformed onboarding data — clear it to avoid repeated failures
        try {
          localStorage.removeItem("vibeloop_onboarded");
        } catch (_e) {
          // ignore
        }
        console.warn("Cleared invalid onboarding data", e);
      }
    }

    // Also try to load a saved profile (display name, bio) if present
    try {
      const profileRaw = localStorage.getItem("vibeloop_profile");
      if (profileRaw) {
        const profile = JSON.parse(profileRaw);
        if (profile.name) setUserName(profile.name);
        if (profile.bio) setUserBio(profile.bio);
      }
    } catch (e) {
      // ignore
    }
    // Load avatar if present
    try {
      const savedAvatar = localStorage.getItem("vibeloop_profile_avatar");
      if (savedAvatar) setUserAvatar(savedAvatar);
    } catch (e) {
      // ignore
    }
    // Load simple settings (dark mode)
    try {
      const rawSettings = localStorage.getItem("vibeloop_settings");
      if (rawSettings) {
        const settings = JSON.parse(rawSettings);
        if (typeof settings.darkMode === "boolean") setDarkMode(settings.darkMode);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    try {
      if (darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch (e) {
      // ignore (SSR or restricted env)
    }
  }, [darkMode]);

  const handleLogin = (email: string, password: string) => {
    // In a real app, this would validate credentials
    // For now, we'll check if user has onboarding data
    const onboardingData = localStorage.getItem("vibeloop_onboarded");
    if (onboardingData) {
      try {
        const parsed = JSON.parse(onboardingData) || {};
        if (parsed.userName) setUserName(parsed.userName);
        if (parsed.initialMood) setSelectedMood(parsed.initialMood);
        setHasOnboarded(true);
        setAuthState("authenticated");
      } catch (e) {
        // corrupted stored onboarding — remove and fallthrough to signup
        try {
          localStorage.removeItem("vibeloop_onboarded");
        } catch (_e) {
          // ignore
        }
        console.warn("Invalid onboarding data during login, cleared", e);
        setAuthState("signup");
      }
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
    // Persist saved dream id so saved-orb state is consistent across components
    try {
      const raw = localStorage.getItem("vibeloop_saved_dreams");
      const parsed = raw ? JSON.parse(raw) : [];
      const next = Array.isArray(parsed) ? [newDream.id, ...parsed.filter((id: any) => id !== newDream.id)] : [newDream.id];
      localStorage.setItem("vibeloop_saved_dreams", JSON.stringify(next));
      try {
        window.dispatchEvent(new CustomEvent("vibeloop:data_changed"));
      } catch (e) {
        // ignore
      }
    } catch (e) {
      // ignore
    }
  };

  // Following helpers centralized in App
  const toggleFollow = (author: string) => {
    setFollowingList((prev) => {
      const exists = prev.includes(author);
      const next = exists ? prev.filter((p) => p !== author) : [author, ...prev];
      try {
        localStorage.setItem("vibeloop_following", JSON.stringify(next));
        window.dispatchEvent(new CustomEvent("vibeloop:data_changed"));
      } catch (e) {}
      return next;
    });
  };

  // Joined loops helpers centralized in App
  const joinLoop = (loop: { id: number; name: string; color: string }) => {
    setJoinedLoops((prev) => {
      if (prev.find((p) => p.id === loop.id)) return prev;
      const next = [loop, ...prev];
      try {
        localStorage.setItem("vibeloop_joined_loops", JSON.stringify(next));
        window.dispatchEvent(new Event("vibeloop:joined_loops_changed"));
        window.dispatchEvent(new CustomEvent("vibeloop:data_changed"));
      } catch (e) {}
      return next;
    });
  };

  const leaveLoop = (id: number) => {
    setJoinedLoops((prev) => {
      const next = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem("vibeloop_joined_loops", JSON.stringify(next));
        window.dispatchEvent(new Event("vibeloop:joined_loops_changed"));
        window.dispatchEvent(new CustomEvent("vibeloop:data_changed"));
      } catch (e) {}
      return next;
    });
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
                className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center relative z-10 transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, #C5A9FF40, #A9C7FF40)",
                  boxShadow: currentScreen === "profile" ? "0 0 30px #C5A9FF60" : "0 0 20px #C5A9FF30",
                }}
              >
                {userAvatar ? (
                  // eslint-disable-next-line jsx-a11y/img-redundant-alt
                  <img src={userAvatar} alt={userName || "Avatar"} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[#6A6A88] text-sm">{userName ? userName.charAt(0).toUpperCase() : "You"}</span>
                )}
              </div>
              <div className="flex-1 min-w-0 text-left relative z-10">
                <p className="text-[#4A4A6A] truncate">{userName || "You"}</p>
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
            <Settings
              key="settings"
              userName={userName}
              onClose={() => setShowSettings(false)}
              onUpdateUser={(profile) => {
                if (profile?.name) setUserName(profile.name);
                if (typeof profile?.bio === "string") setUserBio(profile.bio);
                if (typeof profile?.avatarUrl === "string") setUserAvatar(profile.avatarUrl ?? null);
              }}
              onSettingsChange={(payload) => {
                if (typeof payload.darkMode === "boolean") setDarkMode(payload.darkMode);
              }}
            />
          ) : (
            <>
              {currentScreen === "feed" && (
                <VibeFeed
                  key="feed"
                  selectedMood={selectedMood}
                  setSelectedMood={setSelectedMood}
                  userDreams={userDreams}
                  setCurrentScreen={(s: string) => setCurrentScreen(s as Screen)}
                  toggleFollow={toggleFollow}
                  followingList={followingList}
                />
              )}
              {currentScreen === "waves" && (
                <VibeWaves key="waves" toggleFollow={toggleFollow} joinLoop={joinLoop} leaveLoop={leaveLoop} joinedLoopsProp={joinedLoops} />
              )}
              {currentScreen === "dreamcatcher" && <DreamCatcher key="dreamcatcher" userName={userName} onSaveDream={handleSaveDream} />}
              {currentScreen === "constellation" && <Constellation key="constellation" />}
              {currentScreen === "loops" && (
                <LocalLoops
                  key="loops"
                  setCurrentScreen={(s: string) => setCurrentScreen(s as Screen)}
                  joinLoop={joinLoop}
                  leaveLoop={leaveLoop}
                  joinedLoopsProp={joinedLoops}
                />
              )}
              {currentScreen === "profile" && (
                <Profile
                  key="profile"
                  userName={userName}
                  onSettingsClick={() => setShowSettings(true)}
                  setCurrentScreen={(s: string) => setCurrentScreen(s as Screen)}
                  followingListProp={followingList}
                  joinedLoopsProp={joinedLoops}
                  followersCountProp={followersCount}
                />
              )}
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
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

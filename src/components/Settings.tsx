import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { ChevronRight, Bell, Lock, Moon, Globe, Heart, HelpCircle, LogOut, User, Eye, Shield, Sparkles, Palette, X, Languages } from "lucide-react";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  EditProfile,
  PrivacySettings,
  BlockedUsers,
  MoodPreferences,
  GenericSettingsScreen,
  HelpFAQs,
  SendFeedback,
  SecuritySettings,
  DataPrivacySettings,
  LoopRadiusSettings,
} from "./SettingsScreens";
import { resetUserData } from "../utils/resetUser";

interface SettingsProps {
  userName: string;
  onClose?: () => void;
}
interface SettingsPropsExtended extends SettingsProps {
  onUpdateUser?: (profile: { name: string; username: string; bio?: string; avatarUrl?: string | null }) => void;
  onSettingsChange?: (payload: {
    notifications: boolean;
    vibeReminders: boolean;
    showMoodHistory: boolean;
    privateProfile: boolean;
    darkMode: boolean;
    language: string;
  }) => void;
}

type SettingsScreen =
  | "main"
  | "editProfile"
  | "privacy"
  | "security"
  | "blockedUsers"
  | "dataPrivacy"
  | "moodPreferences"
  | "loopRadius"
  | "help"
  | "feedback";

export function Settings({ userName, onClose, ...rest }: SettingsPropsExtended) {
  const onUpdateUser = rest.onUpdateUser;
  const onSettingsChange = rest.onSettingsChange;

  const [notifications, setNotifications] = useState(true);
  const [vibeReminders, setVibeReminders] = useState(true);
  const [showMoodHistory, setShowMoodHistory] = useState(true);
  const [privateProfile, setPrivateProfile] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [currentScreen, setCurrentScreen] = useState<SettingsScreen>("main");
  const [displayName, setDisplayName] = useState(userName);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const handleNavigate = (label: string) => {
    const screenMap: Record<string, SettingsScreen> = {
      "Edit Profile": "editProfile",
      Privacy: "privacy",
      Security: "security",
      "Blocked Users": "blockedUsers",
      "Data & Privacy": "dataPrivacy",
      "Mood Preferences": "moodPreferences",
      "Local Loop Radius": "loopRadius",
      "Help & FAQs": "help",
      "Send Feedback": "feedback",
    };

    const screen = screenMap[label];
    if (screen) {
      setCurrentScreen(screen);
    }
  };

  // Load persisted simple settings
  useEffect(() => {
    try {
      const raw = localStorage.getItem("vibeloop_settings");
      if (raw) {
        const data = JSON.parse(raw);
        if (typeof data.notifications === "boolean") setNotifications(data.notifications);
        if (typeof data.vibeReminders === "boolean") setVibeReminders(data.vibeReminders);
        if (typeof data.showMoodHistory === "boolean") setShowMoodHistory(data.showMoodHistory);
        if (typeof data.privateProfile === "boolean") setPrivateProfile(data.privateProfile);
        if (typeof data.darkMode === "boolean") setDarkMode(data.darkMode);
        if (typeof data.language === "string") setLanguage(data.language);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Load profile preview (name + avatar)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("vibeloop_profile");
      if (raw) {
        const p = JSON.parse(raw);
        if (p.name) setDisplayName(p.name);
      }
    } catch (e) {
      // ignore
    }
    try {
      const a = localStorage.getItem("vibeloop_profile_avatar");
      if (a) setAvatarUrl(a);
    } catch (e) {}
  }, []);

  // Listen for global open mood prefs event (from feed empty-state)
  useEffect(() => {
    const h = () => setCurrentScreen("moodPreferences");
    window.addEventListener("vibeloop:open_mood_prefs", h as EventListener);
    return () => window.removeEventListener("vibeloop:open_mood_prefs", h as EventListener);
  }, []);

  // Persist settings whenever they change
  useEffect(() => {
    try {
      const payload = { notifications, vibeReminders, showMoodHistory, privateProfile, darkMode, language };
      localStorage.setItem("vibeloop_settings", JSON.stringify(payload));
      try {
        onSettingsChange?.(payload);
      } catch (e) {
        // ignore
      }
    } catch (e) {
      // ignore
    }
  }, [notifications, vibeReminders, showMoodHistory, privateProfile, darkMode, language]);

  // Render sub-screens
  if (currentScreen === "editProfile") {
    return (
      <EditProfile
        onBack={() => setCurrentScreen("main")}
        userName={userName}
        onProfileSave={(profile) => {
          try {
            onUpdateUser?.(profile);
          } catch (e) {
            // ignore
          }
          setCurrentScreen("main");
        }}
      />
    );
  }
  if (currentScreen === "privacy") {
    return <PrivacySettings onBack={() => setCurrentScreen("main")} userName={userName} />;
  }
  if (currentScreen === "blockedUsers") {
    return <BlockedUsers onBack={() => setCurrentScreen("main")} userName={userName} />;
  }
  if (currentScreen === "moodPreferences") {
    return <MoodPreferences onBack={() => setCurrentScreen("main")} userName={userName} />;
  }
  if (currentScreen === "security") {
    return <SecuritySettings onBack={() => setCurrentScreen("main")} userName={userName} />;
  }
  if (currentScreen === "dataPrivacy") {
    return <DataPrivacySettings onBack={() => setCurrentScreen("main")} userName={userName} />;
  }
  if (currentScreen === "loopRadius") {
    return <LoopRadiusSettings onBack={() => setCurrentScreen("main")} userName={userName} />;
  }
  if (currentScreen === "help") {
    return <HelpFAQs onBack={() => setCurrentScreen("main")} userName={userName} />;
  }
  if (currentScreen === "feedback") {
    return <SendFeedback onBack={() => setCurrentScreen("main")} userName={userName} />;
  }

  const languages = [
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
    { value: "fr", label: "Français" },
    { value: "de", label: "Deutsch" },
    { value: "it", label: "Italiano" },
    { value: "pt", label: "Português" },
    { value: "ja", label: "日本語" },
    { value: "ko", label: "한국어" },
    { value: "zh", label: "中文" },
    { value: "ar", label: "العربية" },
  ];

  const settingSections = [
    {
      title: "Account",
      items: [
        { icon: User, label: "Edit Profile", action: true },
        { icon: Eye, label: "Privacy", action: true },
        { icon: Shield, label: "Security", action: true },
      ],
    },
    {
      title: "Preferences",
      items: [
        {
          icon: Bell,
          label: "Notifications",
          toggle: true,
          value: notifications,
          onChange: setNotifications,
        },
        {
          icon: Sparkles,
          label: "Daily Vibe Reminders",
          toggle: true,
          value: vibeReminders,
          onChange: setVibeReminders,
        },
        {
          icon: Heart,
          label: "Show Mood History",
          toggle: true,
          value: showMoodHistory,
          onChange: setShowMoodHistory,
        },
        {
          icon: Moon,
          label: "Dark Mode",
          toggle: true,
          value: darkMode,
          onChange: setDarkMode,
        },
        {
          icon: Languages,
          label: "Language",
          selector: true,
        },
      ],
    },
    {
      title: "Vibe Settings",
      items: [
        { icon: Palette, label: "Mood Preferences", action: true },
        { icon: Globe, label: "Local Loop Radius", action: true },
      ],
    },
    {
      title: "Privacy",
      items: [
        {
          icon: Lock,
          label: "Private Profile",
          toggle: true,
          value: privateProfile,
          onChange: setPrivateProfile,
        },
        { icon: Eye, label: "Blocked Users", action: true },
        { icon: Shield, label: "Data & Privacy", action: true },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: HelpCircle, label: "Help & FAQs", action: true },
        { icon: Heart, label: "Send Feedback", action: true },
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="h-full overflow-auto pb-24 md:pb-8 bg-gradient-to-b from-[#F6F8FB] via-[#F0E8F5] to-[#E8E4F3]"
    >
      <div className="px-6 pt-8 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-[#4A4A6A] text-xl md:text-3xl font-bold">Settings</h2>
            <p className="text-[#8A8AA8] mt-1 text-sm">Personalize your sanctuary</p>
          </div>
          {onClose && (
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg"
            >
              <X className="w-5 h-5 text-[#8A8AA8]" />
            </motion.button>
          )}
        </div>

        {/* User Info Card */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <Card className="mb-6 p-4 bg-white/60 backdrop-blur-xl border-2 border-white/40 shadow-xl overflow-hidden relative">
            {/* Ambient glow */}
            <div
              className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-30"
              style={{ background: "radial-gradient(circle, #C5A9FF, transparent)" }}
            />

            <button onClick={() => setCurrentScreen("editProfile")} className="w-full text-left flex items-center gap-4 relative">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #C5A9FF40, #A9C7FF40)",
                  boxShadow: "0 0 20px #C5A9FF30",
                }}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[#6A6A88]">You</span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-[#4A4A6A]">{displayName}</h3>
                <p className="text-[#8A8AA8]">@dreamweaver</p>
              </div>
            </button>
          </Card>
        </motion.div>

        {/* Settings Sections */}
        {settingSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 + sectionIndex * 0.05 }}
            className="mb-6"
          >
            <h3 className="text-[#6A6A88] mb-3 px-2">{section.title}</h3>
            <Card className="bg-white/60 backdrop-blur-xl border-2 border-white/40 shadow-xl overflow-hidden">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <div key={item.label}>
                    {item.toggle ? (
                      <motion.div
                        whileTap={{ scale: 0.98 }}
                        className="w-full p-4 flex items-center justify-between group transition-all duration-300 hover:bg-white/30"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="p-2 rounded-xl transition-all duration-300"
                            style={{
                              backgroundColor: "#C5A9FF15",
                            }}
                          >
                            <Icon
                              className="w-5 h-5 transition-all duration-300"
                              style={{
                                color: "#C5A9FF",
                              }}
                            />
                          </div>
                          <span className="text-[#4A4A6A]">{item.label}</span>
                        </div>

                        {item.onChange && (
                          <Switch checked={item.value || false} onCheckedChange={item.onChange} className="data-[state=checked]:bg-[#C5A9FF]" />
                        )}
                      </motion.div>
                    ) : item.selector ? (
                      <motion.div
                        whileTap={{ scale: 0.98 }}
                        className="w-full p-4 flex items-center justify-between group transition-all duration-300 hover:bg-white/30"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="p-2 rounded-xl transition-all duration-300"
                            style={{
                              backgroundColor: "#C5A9FF15",
                            }}
                          >
                            <Icon
                              className="w-5 h-5 transition-all duration-300"
                              style={{
                                color: "#C5A9FF",
                              }}
                            />
                          </div>
                          <span className="text-[#4A4A6A]">{item.label}</span>
                        </div>

                        <Select value={language} onValueChange={setLanguage}>
                          <SelectTrigger className="w-[140px] border-[#E0E8F5] bg-white/50 backdrop-blur-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {languages.map((lang) => (
                              <SelectItem key={lang.value} value={lang.value}>
                                {lang.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </motion.div>
                    ) : (
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        className="w-full p-4 flex items-center justify-between group transition-all duration-300 hover:bg-white/30"
                        onClick={() => handleNavigate(item.label)}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="p-2 rounded-xl transition-all duration-300"
                            style={{
                              backgroundColor: "#C5A9FF15",
                            }}
                          >
                            <Icon
                              className="w-5 h-5 transition-all duration-300"
                              style={{
                                color: "#C5A9FF",
                              }}
                            />
                          </div>
                          <span className="text-[#4A4A6A]">{item.label}</span>
                        </div>

                        {item.action && (
                          <ChevronRight className="w-5 h-5 text-[#B8B8CC] group-hover:translate-x-1 transition-transform duration-300" />
                        )}
                      </motion.button>
                    )}
                    {itemIndex < section.items.length - 1 && <Separator className="bg-white/40" />}
                  </div>
                );
              })}
            </Card>
          </motion.div>
        ))}

        {/* Logout / Reset Buttons */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="mb-8">
          <div className="grid grid-cols-1 gap-3">
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="w-full p-4 rounded-2xl flex items-center justify-center gap-3 bg-white/60 backdrop-blur-xl border-2 border-white/40 shadow-xl group transition-all duration-300 hover:bg-red-50/60 hover:border-red-100"
              onClick={() => {
                try {
                  localStorage.removeItem("vibeloop_profile");
                  localStorage.removeItem("vibeloop_profile_avatar");
                  localStorage.removeItem("vibeloop_user");
                  window.dispatchEvent(new CustomEvent("vibeloop:data_changed"));
                } catch (e) {}
                window.location.reload();
              }}
            >
              <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-500 transition-colors" />
              <span className="text-red-400 group-hover:text-red-500 transition-colors">Log Out</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              className="w-full p-4 rounded-2xl flex items-center justify-center gap-3 bg-white/60 backdrop-blur-xl border-2 border-white/40 shadow-xl group transition-all duration-300 hover:bg-indigo-50/60 hover:border-indigo-100"
              onClick={() => {
                try {
                  resetUserData();
                } catch (e) {}
                window.location.reload();
              }}
            >
              <Sparkles className="w-5 h-5 text-indigo-500 group-hover:text-indigo-600 transition-colors" />
              <span className="text-indigo-500 group-hover:text-indigo-600 transition-colors">Reset App / New User</span>
            </motion.button>
          </div>
        </motion.div>

        {/* App Version */}
        <div className="text-center mb-6">
          <p className="text-[#B8B8CC] text-sm">VibeLoop v1.0.0</p>
          <p className="text-[#D0D0D8] text-xs mt-1">Your digital sanctuary</p>
        </div>
      </div>

      {/* Ambient background orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <motion.div
          className="absolute top-20 right-10 w-40 h-40 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, #A9C7FF, transparent)" }}
          animate={{
            y: [0, 30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-40 left-10 w-40 h-40 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, #C5A9FF, transparent)" }}
          animate={{
            y: [0, -30, 0],
            x: [0, -20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </motion.div>
  );
}

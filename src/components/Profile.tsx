import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Settings, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useState, useEffect } from "react";
import { vibesData } from "./vibes-data";

// User-specific dream orbs are stored under `vibeloop_saved_dreams` and default to empty

// joined loops are persisted to localStorage so they can be managed across the app

const moodStats = [
  { mood: "Calm", percentage: 45, color: "#A9C7FF" },
  { mood: "Dreamy", percentage: 30, color: "#C5A9FF" },
  { mood: "Reflective", percentage: 25, color: "#E0C9D9" },
];

interface ProfileProps {
  userName: string;
  onSettingsClick?: () => void;
}

interface ProfilePropsExtended extends ProfileProps {
  userDreams?: import("../App").UserDream[];
  setCurrentScreen?: (s: string) => void;
  followingListProp?: string[];
  joinedLoopsProp?: { id: number; name: string; color: string }[];
  followersCountProp?: number;
}

export function Profile({
  userName,
  onSettingsClick,
  userDreams,
  setCurrentScreen,
  followingListProp,
  joinedLoopsProp,
  followersCountProp,
}: ProfilePropsExtended) {
  // Calculate dominant mood color
  const dominantMood = moodStats[0];

  const [activeTab, setActiveTab] = useState("aura");
  const [hoveredOrb, setHoveredOrb] = useState<number | null>(null);

  const [joinedLoopsState, setJoinedLoopsState] = useState<{ id: number; name: string; color: string }[]>(() => {
    try {
      if (joinedLoopsProp) return joinedLoopsProp;
      const raw = localStorage.getItem("vibeloop_joined_loops");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  // savedDreams stores ids of saved UserDreams; map to actual dreams via `userDreams` prop when available
  const [savedDreamIds, setSavedDreamIds] = useState<number[]>(() => {
    try {
      const raw = localStorage.getItem("vibeloop_saved_dreams");
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "object") {
        return parsed.map((p: any) => p.id).filter(Boolean) as number[];
      }
      return parsed as number[];
    } catch (e) {
      return [];
    }
  });

  // derive saved dream objects for display
  const savedDreamObjects = (userDreams || []).filter((d) => savedDreamIds.includes(d.id));

  useEffect(() => {
    const handler = () => {
      try {
        const raw = localStorage.getItem("vibeloop_saved_dreams");
        if (!raw) return setSavedDreamIds([]);
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "object") {
          setSavedDreamIds(parsed.map((p: any) => p.id).filter(Boolean));
        } else {
          setSavedDreamIds(parsed as number[]);
        }
      } catch (e) {
        // ignore
      }
    };
    window.addEventListener("vibeloop:data_changed", handler as EventListener);
    return () => window.removeEventListener("vibeloop:data_changed", handler as EventListener);
  }, []);

  const [followingList, setFollowingList] = useState<string[]>(() => {
    try {
      if (followingListProp) return followingListProp;
      const raw = localStorage.getItem("vibeloop_following");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  // keep followingList in sync with external changes
  useEffect(() => {
    const h = () => {
      try {
        const raw = localStorage.getItem("vibeloop_following");
        setFollowingList(raw ? JSON.parse(raw) : []);
      } catch (e) {
        // ignore
      }
    };
    window.addEventListener("vibeloop:data_changed", h as EventListener);
    return () => window.removeEventListener("vibeloop:data_changed", h as EventListener);
  }, []);

  // Profile data loaded from localStorage (falls back to props/static)
  const [displayName, setDisplayName] = useState(userName);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [bio, setBio] = useState("Exploring emotions through mist and gradients");

  useEffect(() => {
    setDisplayName(userName);
  }, [userName]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("vibeloop_profile");
      if (raw) {
        const profile = JSON.parse(raw);
        if (profile.name) setDisplayName(profile.name);
        if (profile.bio) setBio(profile.bio);
      }
    } catch (e) {
      // ignore
    }

    try {
      const savedAvatar = localStorage.getItem("vibeloop_profile_avatar");
      if (savedAvatar) setAvatarUrl(savedAvatar);
    } catch (e) {
      // ignore
    }
  }, []);

  // Listen for joined loops changes from other parts of the app
  useEffect(() => {
    const handler = () => {
      try {
        const raw = localStorage.getItem("vibeloop_joined_loops");
        setJoinedLoopsState(raw ? JSON.parse(raw) : []);
      } catch (e) {
        // ignore
      }
    };

    window.addEventListener("vibeloop:joined_loops_changed", handler as EventListener);
    return () => window.removeEventListener("vibeloop:joined_loops_changed", handler as EventListener);
  }, []);

  // Save joined loops whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("vibeloop_joined_loops", JSON.stringify(joinedLoopsState));
    } catch (e) {
      // ignore
    }
  }, [joinedLoopsState]);

  const leaveLoop = (id: number) => {
    setJoinedLoopsState((prev) => prev.filter((l) => l.id !== id));
  };

  const joinLoop = (loop: { id: number; name: string; color: string }) => {
    setJoinedLoopsState((prev) => {
      if (prev.find((p) => p.id === loop.id)) return prev;
      return [loop, ...prev];
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="h-full overflow-auto pb-24 md:pb-8"
    >
      <div className="px-6 pt-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-2" style={{ borderColor: dominantMood.color + "60" }}>
              <AvatarFallback
                className="text-sm"
                style={{
                  backgroundColor: dominantMood.color + "30",
                  color: "#4A4A6A",
                }}
              >
                {displayName ? displayName.charAt(0).toUpperCase() : userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-[#4A4A6A] text-xl md:text-3xl font-bold">{displayName}'s Aura</h2>
              <p className="text-[#8A8AA8] mt-1 text-sm">{bio}</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
            onClick={onSettingsClick}
            className="p-3 rounded-full bg-white/80 backdrop-blur-sm cursor-pointer"
            style={{
              boxShadow: `0 0 20px ${dominantMood.color}20`,
            }}
          >
            <Settings className="w-5 h-5 text-[#8A8AA8]" />
          </motion.button>
        </div>

        {/* Aura Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            {/* Animated gradient background */}
            <motion.div
              className="absolute inset-0 rounded-full blur-3xl"
              style={{
                background: `radial-gradient(circle, ${moodStats[0].color}80, ${moodStats[1].color}60, ${moodStats[2].color}40)`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            {/* Dream Orbs */}
            <div className="mb-6">
              <h4 className="mb-4 text-[#4A4A6A]">My Dream Orbs</h4>
              {savedDreamObjects.length === 0 ? (
                <div className="text-sm text-[#8A8AA8] italic">You haven't saved any dreams yet.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedDreamObjects.map((dream, index) => (
                    <motion.div
                      key={dream.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.06 }}
                      className="p-4 rounded-2xl border-2 flex items-center gap-3"
                      style={{ borderColor: dream.moodColor + "30", backgroundColor: dream.moodColor + "10" }}
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ background: `radial-gradient(circle, ${dream.moodColor}FF, ${dream.moodColor}60)` }}
                      >
                        <span className="text-white font-semibold">{dream.mood.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-[#4A4A6A] line-clamp-2">{dream.text}</div>
                        <div className="text-xs text-[#8A8AA8] mt-1">{dream.timestamp}</div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => {
                            try {
                              // remove saved id
                              const raw = localStorage.getItem("vibeloop_saved_dreams");
                              if (!raw) return;
                              const parsed = JSON.parse(raw) as number[];
                              const next = parsed.filter((id) => id !== dream.id);
                              localStorage.setItem("vibeloop_saved_dreams", JSON.stringify(next));
                              window.dispatchEvent(new CustomEvent("vibeloop:data_changed"));
                            } catch (e) {}
                          }}
                          className="text-xs text-[#C5A9FF]"
                        >
                          Remove
                        </button>
                        <button
                          onClick={() => {
                            // open in feed or navigate - simple behaviour: go to feed (not handled here)
                            window.dispatchEvent(new CustomEvent("vibeloop:open_feed"));
                          }}
                          className="text-xs text-[#6A6A88]"
                        >
                          View
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-6 mt-4">
            <div className="text-center">
              <div className="text-lg text-[#4A4A6A]">{(followingListProp ?? followingList).length}</div>
              <div className="text-xs text-[#8A8AA8]">following</div>
            </div>
            <div className="w-px bg-[#E0E8F5]" />
            <div className="text-center">
              <div className="text-lg text-[#4A4A6A]">{followersCountProp ?? 0}</div>
              <div className="text-xs text-[#8A8AA8]">followers</div>
            </div>
          </div>
        </div>

        {/* Mood Distribution */}
        <Card className="p-6 rounded-3xl border-2 border-[#E0E8F5] bg-white/80 backdrop-blur-sm mb-6">
          <h4 className="mb-4 text-[#4A4A6A]">Your Emotional Palette</h4>

          <div className="space-y-4">
            {moodStats.map((stat) => (
              <div key={stat.mood}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#6A6A88]">{stat.mood}</span>
                  <span className="text-[#8A8AA8]">{stat.percentage}%</span>
                </div>
                <div className="h-2 bg-[#F0F0F8] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: stat.color,
                      boxShadow: `0 0 10px ${stat.color}40`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.percentage}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* (removed duplicate Dream Orbs block - primary saved-orb UI shown above) */}

        {/* Joined Loops */}
        <div className="mb-6">
          <h4 className="mb-4 text-[#4A4A6A]">Joined Loops</h4>
          <div className="space-y-3">
            {joinedLoopsState.map((loop, index) => (
              <motion.div
                key={loop.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card
                  className="p-4 rounded-2xl border-2 flex items-center gap-3 cursor-pointer hover:scale-[1.02] transition-transform backdrop-blur-sm"
                  style={{
                    borderColor: loop.color + "40",
                    backgroundColor: "rgba(255,255,255,0.8)",
                  }}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: loop.color,
                      boxShadow: `0 0 12px ${loop.color}80`,
                    }}
                  />
                  <span className="text-[#6A6A88]">{loop.name}</span>
                  <div className="ml-auto">
                    <button onClick={() => leaveLoop(loop.id)} className="text-xs text-red-400 hover:text-red-500">
                      Leave
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4 rounded-2xl border-2 border-[#E0E8F5] bg-white/80 backdrop-blur-sm text-center">
            <div className="text-2xl mb-1 text-[#4A4A6A]">{savedDreamIds.length}</div>
            <div className="text-sm text-[#8A8AA8]">Vibes</div>
          </Card>
          <Card className="p-4 rounded-2xl border-2 border-[#E0E8F5] bg-white/80 backdrop-blur-sm text-center">
            <div className="text-2xl mb-1 text-[#4A4A6A]">{joinedLoopsState.length}</div>
            <div className="text-sm text-[#8A8AA8]">Loops</div>
          </Card>
          <Card className="p-4 rounded-2xl border-2 border-[#E0E8F5] bg-white/80 backdrop-blur-sm text-center">
            <div className="text-2xl mb-1 text-[#4A4A6A]">{savedDreamIds.length}</div>
            <div className="text-sm text-[#8A8AA8]">Orbs</div>
          </Card>
        </div>

        {/* Saved Dreams Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[#C5A9FF]" />
            <h4 className="text-[#4A4A6A]">Saved Dreams</h4>
          </div>

          <Card className="p-6 rounded-3xl border-2 border-[#C5A9FF]/30 bg-white/80 backdrop-blur-sm">
            <p className="text-[#8A8AA8] text-sm text-center italic mb-4">Collect dream orbs from the feed to save them here</p>

            <div className="space-y-3">
              {savedDreamObjects.length === 0 ? (
                <div className="text-sm text-[#8A8AA8] italic text-center">No saved dreams yet — save a dream from the feed.</div>
              ) : (
                savedDreamObjects.slice(0, 2).map((dream, index) => (
                  <motion.div
                    key={dream.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="p-4 rounded-2xl border-2 cursor-pointer hover:scale-[1.02] transition-transform"
                    style={{
                      borderColor: dream.moodColor + "40",
                      backgroundColor: dream.moodColor + "10",
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <motion.div
                        className="w-8 h-8 rounded-full flex-shrink-0"
                        style={{
                          background: `radial-gradient(circle, ${dream.moodColor}FF, ${dream.moodColor}40)`,
                          boxShadow: `0 0 16px ${dream.moodColor}60`,
                        }}
                        animate={{
                          boxShadow: [`0 0 16px ${dream.moodColor}60`, `0 0 24px ${dream.moodColor}80`, `0 0 16px ${dream.moodColor}60`],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm text-[#6A6A88]">{dream.author}</span>
                          <span className="text-xs text-[#B8B8CC]">•</span>
                          <span className="text-xs text-[#B8B8CC]">{dream.timestamp}</span>
                        </div>
                        <p className="text-sm text-[#4A4A6A] line-clamp-2">{dream.text}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            <div className="mt-4 text-center">
              <button className="text-sm text-[#C5A9FF] hover:text-[#A9C7FF] transition-colors cursor-pointer">View all saved dreams →</button>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

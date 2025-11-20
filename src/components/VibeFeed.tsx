import { motion } from "motion/react";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { MOODS, getMoodColor, getMoodEmoji } from "./moods";
import { useState, useEffect } from "react";
import { UserDream } from "../App";

const moods = [{ name: "All", color: "#A9C7FF" }, ...MOODS];

interface VibeFeedProps {
  selectedMood: string;
  setSelectedMood: (mood: string) => void;
  userDreams: UserDream[];
  setCurrentScreen?: (s: string) => void;
  toggleFollow?: (author: string) => void;
  followingList?: string[];
}

export default function VibeFeed({ selectedMood, setSelectedMood, userDreams, setCurrentScreen, toggleFollow, followingList }: VibeFeedProps) {
  const [clickedOrbs, setClickedOrbs] = useState<Set<number>>(new Set());
  const [savedDreams, setSavedDreams] = useState<number[]>(() => {
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

  const [localFollowing, setLocalFollowing] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem("vibeloop_following");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  const following = followingList ?? localFollowing;

  // Sync savedDreams to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("vibeloop_saved_dreams", JSON.stringify(savedDreams));
    } catch (e) {}
  }, [savedDreams]);

  // Listen for external changes (App or other components)
  useEffect(() => {
    const handler = () => {
      try {
        const raw = localStorage.getItem("vibeloop_saved_dreams");
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "object") {
          setSavedDreams(parsed.map((p: any) => p.id).filter(Boolean));
        } else {
          setSavedDreams(parsed as number[]);
        }
      } catch (e) {
        // ignore
      }
    };
    window.addEventListener("vibeloop:data_changed", handler as EventListener);
    return () => window.removeEventListener("vibeloop:data_changed", handler as EventListener);
  }, []);

  // also update following when external components change it
  useEffect(() => {
    const h2 = () => {
      try {
        const raw = localStorage.getItem("vibeloop_following");
        setLocalFollowing(raw ? JSON.parse(raw) : []);
      } catch (e) {}
    };
    window.addEventListener("vibeloop:data_changed", h2 as EventListener);
    return () => window.removeEventListener("vibeloop:data_changed", h2 as EventListener);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("vibeloop_following", JSON.stringify(localFollowing));
    } catch (e) {}
  }, [localFollowing]);

  // initialize clicked orbs from savedDreams
  useEffect(() => {
    try {
      setClickedOrbs(new Set(savedDreams));
    } catch (e) {}
  }, [savedDreams]);

  // Combine user dreams with existing vibes data
  const allVibes = userDreams;
  const filteredVibes = selectedMood === "All" ? allVibes : allVibes.filter((v) => v.mood === selectedMood);

  const handleOrbClick = (vibeId: number) => {
    setClickedOrbs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(vibeId)) {
        newSet.delete(vibeId);
        setSavedDreams((s) => s.filter((id) => id !== vibeId));
      } else {
        newSet.add(vibeId);
        setSavedDreams((s) => (s.includes(vibeId) ? s : [...s, vibeId]));
      }
      try {
        window.dispatchEvent(new CustomEvent("vibeloop:data_changed"));
      } catch (e) {}
      return newSet;
    });
  };

  function localToggleFollow(author: string) {
    if (toggleFollow) return toggleFollow(author);
    if (localFollowing.includes(author)) {
      setLocalFollowing((f) => f.filter((a) => a !== author));
    } else {
      setLocalFollowing((f) => [author, ...f]);
    }
    try {
      window.dispatchEvent(new CustomEvent("vibeloop:data_changed"));
    } catch (e) {}
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="h-full overflow-auto pb-24 md:pb-8"
    >
      {/* Header */}
      <div className="sticky top-0 bg-[#F6F8FB]/80 backdrop-blur-md z-10 px-6 pt-8 pb-4">
        <h2 className="mb-1 text-[#4A4A6A] text-xl md:text-3xl font-bold">How do you feel today?</h2>
        <p className="text-sm text-[#8A8AA8] mb-4">Vibes from people you follow</p>

        {/* Mood Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {moods.map((mood) => (
            <motion.div
              key={mood.name}
              whileHover={{
                scale: 1.02,
                filter: `drop-shadow(0 0 12px ${mood.color}60)`,
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Badge
                onClick={() => setSelectedMood(mood.name)}
                className={`cursor-pointer px-4 py-2 rounded-full transition-all duration-300 border-2 whitespace-nowrap ${
                  selectedMood === mood.name ? "border-opacity-100 shadow-lg" : "border-opacity-0 bg-white/60"
                }`}
                style={{
                  backgroundColor: selectedMood === mood.name ? mood.color + "40" : "rgba(255,255,255,0.6)",
                  borderColor: mood.color,
                  color: "#4A4A6A",
                }}
              >
                {mood.name}
              </Badge>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="px-6 space-y-4 mt-4 max-w-3xl mx-auto">
        {filteredVibes.length === 0 && (
          <div className="px-6 pt-8 text-center text-sm text-[#8A8AA8]">
            <div className="max-w-xl mx-auto p-6 rounded-2xl bg-white/60 border-2 border-white/30">
              <h3 className="text-[#4A4A6A] text-xl font-bold">Welcome — it looks like you're new here</h3>
              <p className="mt-2">Your feed will show vibes from people you follow and dreams you save.</p>
              <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => {
                    if (setCurrentScreen) {
                      setCurrentScreen("dreamcatcher");
                    } else {
                      window.dispatchEvent(new CustomEvent("vibeloop:open_dreamcatcher"));
                    }
                  }}
                >
                  Share your first dream
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (setCurrentScreen) {
                      setCurrentScreen("loops");
                    } else {
                      window.dispatchEvent(new CustomEvent("vibeloop:open_loops"));
                    }
                  }}
                >
                  Explore local loops
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    try {
                      window.dispatchEvent(new CustomEvent("vibeloop:open_mood_prefs"));
                    } catch (e) {}
                  }}
                >
                  Set your mood palette
                </Button>
              </div>
              <p className="mt-3 text-xs text-[#B8B8CC]">Tip: you can follow people, RSVP to events, and save dream orbs to build your feed.</p>
            </div>
          </div>
        )}
        {filteredVibes.length > 0 &&
          filteredVibes.map((vibe, index) => (
            <motion.div
              key={vibe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card
                className="p-5 rounded-3xl border-2 relative backdrop-blur-sm"
                style={{
                  borderColor: vibe.moodColor + "60",
                  backgroundColor: "rgba(255,255,255,0.8)",
                  overflow: "visible",
                }}
              >
                {/* Gradient overlay */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 opacity-60"
                  style={{
                    background: `linear-gradient(90deg, ${vibe.moodColor}00, ${vibe.moodColor}, ${vibe.moodColor}00)`,
                  }}
                />

                {/* Content */}
                <div className="relative">
                  {/* Author info */}
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-8 h-8 border-2" style={{ borderColor: vibe.authorColor + "60" }}>
                      <AvatarFallback
                        className="text-xs"
                        style={{
                          backgroundColor: vibe.authorColor + "30",
                          color: "#4A4A6A",
                        }}
                      >
                        {vibe.author.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex items-center gap-2">
                      <span className="text-sm text-[#6A6A88]">{vibe.author}</span>
                      {vibe.isFollowing || following.includes(vibe.author) ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#A9C7FF]/20 text-[#6A6A88]">following</span>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            localToggleFollow(vibe.author);
                          }}
                        >
                          Follow
                        </Button>
                      )}
                    </div>
                    <span className="text-sm text-[#B8B8CC]">{vibe.timestamp}</span>
                  </div>

                  {/* Mood indicator */}
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-3 h-3 rounded-full shadow-lg"
                      style={{
                        backgroundColor: vibe.moodColor,
                        boxShadow: `0 0 12px ${vibe.moodColor}80`,
                      }}
                    />
                    <span className="text-sm">{getMoodEmoji(vibe.mood)}</span>
                    <span className="text-sm text-[#8A8AA8]">{vibe.mood}</span>
                  </div>

                  {vibe.image && (
                    <div className="mb-3 -mx-1 rounded-2xl overflow-hidden">
                      <img src={vibe.image} alt="vibe" className="w-full h-48 object-cover" />
                    </div>
                  )}

                  <p className="text-[#4A4A6A] leading-relaxed">{vibe.text}</p>

                  {vibe.dreamOrb && (
                    <motion.div className="mt-4 flex items-center gap-3" whileHover={{ scale: 1.02 }}>
                      <motion.button
                        onClick={() => handleOrbClick(vibe.id)}
                        className="relative cursor-pointer group"
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        <motion.div
                          className="w-10 h-10 rounded-full flex items-center justify-center relative"
                          style={{
                            background: `radial-gradient(circle, ${vibe.moodColor}FF, ${vibe.moodColor}40)`,
                            boxShadow: `0 0 ${clickedOrbs.has(vibe.id) ? "30px" : "16px"} ${vibe.moodColor}${clickedOrbs.has(vibe.id) ? "90" : "60"}`,
                          }}
                          animate={{
                            boxShadow: clickedOrbs.has(vibe.id) ? `0 0 30px ${vibe.moodColor}90` : `0 0 16px ${vibe.moodColor}60`,
                            scale: clickedOrbs.has(vibe.id) ? 1.1 : 1,
                          }}
                          transition={{
                            duration: 0.3,
                            ease: "easeOut",
                          }}
                        >
                          {/* Inner glow effect */}
                          <motion.div
                            className="absolute inset-0 rounded-full"
                            style={{
                              background: `radial-gradient(circle, ${vibe.moodColor}40, transparent)`,
                            }}
                            animate={{
                              scale: clickedOrbs.has(vibe.id) ? [1, 1.3, 1] : 1,
                              opacity: clickedOrbs.has(vibe.id) ? [0.8, 0.3, 0.8] : 0.5,
                            }}
                            transition={{
                              duration: 2,
                              repeat: clickedOrbs.has(vibe.id) ? Infinity : 0,
                              ease: "easeInOut",
                            }}
                          />

                          {/* Sparkle effect when clicked */}
                          {clickedOrbs.has(vibe.id) && (
                            <>
                              {[...Array(3)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  className="absolute w-1 h-1 rounded-full"
                                  style={{
                                    background: vibe.moodColor,
                                    top: "50%",
                                    left: "50%",
                                  }}
                                  initial={{ scale: 0, x: 0, y: 0 }}
                                  animate={{
                                    scale: [0, 1, 0],
                                    x: [0, Math.cos((i * 120 * Math.PI) / 180) * 20],
                                    y: [0, Math.sin((i * 120 * Math.PI) / 180) * 20],
                                    opacity: [1, 0],
                                  }}
                                  transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                  }}
                                />
                              ))}
                            </>
                          )}
                        </motion.div>

                        {/* Hover tooltip */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                          <div
                            className="px-3 py-1 rounded-full text-xs text-white"
                            style={{
                              background: `linear-gradient(135deg, ${vibe.moodColor}EE, ${vibe.moodColor}AA)`,
                              boxShadow: `0 0 12px ${vibe.moodColor}40`,
                            }}
                          >
                            {clickedOrbs.has(vibe.id) ? "Saved to dreams" : "Tap to save"}
                          </div>
                        </div>
                      </motion.button>

                      <div>
                        <p className="text-sm text-[#6A6A88]">Dream Orb</p>
                        <p className="text-xs text-[#B8B8CC] italic">{clickedOrbs.has(vibe.id) ? "Saved ✨" : "Tap to collect"}</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
      </div>
    </motion.div>
  );
}

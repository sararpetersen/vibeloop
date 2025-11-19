import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { TrendingUp, Flame, Users, Heart, MapPin, Calendar } from "lucide-react";

interface MoodStat {
  mood: string;
  emoji: string;
  percentage: number;
  color: string;
  trend: "up" | "down" | "stable";
}

interface TrendingPost {
  id: number;
  author: string;
  content: string;
  mood: string;
  color: string;
  resonance: number; // how many people felt this
  timeAgo: string;
}

interface TrendingLoop {
  id: number;
  name: string;
  vibe: string;
  color: string;
  newMembers: number;
  activity: string;
  location: string;
}

interface MoodTwin {
  id: number;
  name: string;
  sharedMoods: string[];
  color: string;
  compatibility: number;
}

const moodStats: MoodStat[] = [
  { mood: "Calm", emoji: "🌙", percentage: 28, color: "#A9C7FF", trend: "up" },
  { mood: "Dreamy", emoji: "☁️", percentage: 22, color: "#C5A9FF", trend: "stable" },
  { mood: "Creative", emoji: "✨", percentage: 18, color: "#D4A9FF", trend: "up" },
  { mood: "Reflective", emoji: "🌸", percentage: 15, color: "#E0C9D9", trend: "down" },
  { mood: "Hopeful", emoji: "🌅", percentage: 12, color: "#FFD4A9", trend: "up" },
  { mood: "Peaceful", emoji: "🍃", percentage: 5, color: "#B8E8E0", trend: "stable" },
];

const trendingPosts: TrendingPost[] = [
  {
    id: 1,
    author: "Ravi Kumar",
    content: "sometimes the best therapy is just... existing. no fixing, no forcing. just being.",
    mood: "Calm",
    color: "#A9C7FF",
    resonance: 847,
    timeAgo: "3h ago",
  },
  {
    id: 2,
    author: "Sofia Lund",
    content: "made art out of my anxiety today. turned the chaos into something beautiful 🎨",
    mood: "Creative",
    color: "#D4A9FF",
    resonance: 623,
    timeAgo: "5h ago",
  },
  {
    id: 3,
    author: "Jamal Hassan",
    content: "anyone else feel like they're healing in slow motion? like watching a plant grow",
    mood: "Reflective",
    color: "#E0C9D9",
    resonance: 592,
    timeAgo: "7h ago",
  },
  {
    id: 4,
    author: "Mei Chen",
    content: "today i chose myself. small decision, big shift.",
    mood: "Hopeful",
    color: "#FFD4A9",
    resonance: 521,
    timeAgo: "9h ago",
  },
];

const risingLoops: TrendingLoop[] = [
  {
    id: 1,
    name: "Midnight Writers",
    vibe: "Creative",
    color: "#D4A9FF",
    newMembers: 47,
    activity: "Very active",
    location: "Downtown",
  },
  {
    id: 2,
    name: "Morning Dreamers",
    vibe: "Peaceful",
    color: "#B8E8E0",
    newMembers: 38,
    activity: "Growing",
    location: "East Side",
  },
  {
    id: 3,
    name: "Soft Hearts Collective",
    vibe: "Calm",
    color: "#A9C7FF",
    newMembers: 29,
    activity: "Active",
    location: "West End",
  },
];

const moodTwins: MoodTwin[] = [
  {
    id: 1,
    name: "Amara Okafor",
    sharedMoods: ["Dreamy", "Creative", "Calm"],
    color: "#C5A9FF",
    compatibility: 89,
  },
  {
    id: 2,
    name: "Luca Rossi",
    sharedMoods: ["Reflective", "Peaceful", "Calm"],
    color: "#E0C9D9",
    compatibility: 84,
  },
  {
    id: 3,
    name: "Yuki Tanaka",
    sharedMoods: ["Creative", "Hopeful", "Excited"],
    color: "#D4A9FF",
    compatibility: 78,
  },
];

export function VibeWaves() {
  const [activeTab, setActiveTab] = useState("weather");

  return (
    <div className="h-screen pb-24 md:pb-8 overflow-y-auto" style={{ backgroundColor: "#F6F8FB" }}>
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-[#4A4A6A] mb-1 text-3xl font-boldtext-xl md:text-3xl font-bold">Vibe Waves</h1>
          <p className="text-sm text-[#8A8AA8]">feel the pulse of the collective mood</p>
        </motion.div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="px-6">
        <TabsList className="w-full mb-6 p-1 rounded-full" style={{ backgroundColor: "#FFFFFF" }}>
          <TabsTrigger
            value="weather"
            className="flex-1 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#C5A9FF] data-[state=active]:to-[#A9C7FF] data-[state=active]:text-white"
          >
            Mood Weather
          </TabsTrigger>
          <TabsTrigger
            value="trending"
            className="flex-1 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#C5A9FF] data-[state=active]:to-[#A9C7FF] data-[state=active]:text-white"
          >
            Trending
          </TabsTrigger>
          <TabsTrigger
            value="twins"
            className="flex-1 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#C5A9FF] data-[state=active]:to-[#A9C7FF] data-[state=active]:text-white"
          >
            Mood Twins
          </TabsTrigger>
        </TabsList>

        {/* Mood Weather Tab */}
        <TabsContent value="weather" className="space-y-6 mt-0">
          {/* Emotional Weather Map */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="p-6 rounded-3xl border-0" style={{ backgroundColor: "#FFFFFF" }}>
              <h3 className="text-[#4A4A6A] mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" style={{ color: "#C5A9FF" }} />
                Live Mood Forecast
              </h3>
              <p className="text-xs text-[#8A8AA8] mb-4 italic">Real-time emotional weather across VibeLoop right now</p>

              <div className="space-y-3">
                {moodStats.map((stat, index) => (
                  <motion.div key={stat.mood} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{stat.emoji}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-[#6A6A88]">{stat.mood}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[#B8B8CC]">{stat.percentage}%</span>
                            {stat.trend === "up" && <TrendingUp className="w-3 h-3 text-green-500" />}
                          </div>
                        </div>
                        <div className="h-2 bg-[#F6F8FB] rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              backgroundColor: stat.color,
                              boxShadow: `0 0 8px ${stat.color}40`,
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${stat.percentage}%` }}
                            transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Insight Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <Card
              className="p-5 rounded-3xl border-2"
              style={{
                borderColor: "#C5A9FF40",
                background: "linear-gradient(135deg, rgba(197, 169, 255, 0.1), rgba(169, 199, 255, 0.1))",
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: "#C5A9FF30",
                  }}
                >
                  <Flame className="w-5 h-5" style={{ color: "#C5A9FF" }} />
                </div>
                <div className="flex-1">
                  <h4 className="text-[#4A4A6A] mb-1">Weekly Insight</h4>
                  <p className="text-sm text-[#6A6A88] leading-relaxed">
                    Calm vibes are up 12% this week. The collective is finding its center. Creative energy is rising - perfect time for new beginnings
                    ✨
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Trending Tab */}
        <TabsContent value="trending" className="space-y-6 mt-0">
          {/* Trending Posts */}
          <div>
            <h3 className="text-[#6A6A88] mb-4 flex items-center gap-2">
              <Flame className="w-4 h-4" style={{ color: "#FFA9D4" }} />
              Resonating Right Now
            </h3>
            <div className="space-y-4">
              {trendingPosts.map((post, index) => (
                <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                  <Card
                    className="p-5 rounded-3xl border-2 hover:scale-[1.01] transition-transform cursor-pointer"
                    style={{
                      borderColor: post.color + "40",
                      backgroundColor: "#FFFFFF",
                    }}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: post.color + "40",
                          boxShadow: `0 0 15px ${post.color}30`,
                        }}
                      >
                        <span className="text-white text-sm" style={{ fontWeight: 600 }}>
                          {post.author.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm text-[#6A6A88]">{post.author}</span>
                          <Badge
                            className="px-2 py-0.5 text-xs rounded-full border-0"
                            style={{
                              backgroundColor: post.color + "30",
                              color: "#6A6A88",
                            }}
                          >
                            {post.mood}
                          </Badge>
                        </div>
                        <p className="text-sm text-[#4A4A6A] leading-relaxed mb-3">{post.content}</p>
                        <div className="flex items-center gap-4 text-xs text-[#B8B8CC]">
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            <span>{post.resonance} resonating</span>
                          </div>
                          <span>{post.timeAgo}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Rising Loops */}
          <div>
            <h3 className="text-[#6A6A88] mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" style={{ color: "#A9C7FF" }} />
              Rising Communities
            </h3>
            <div className="space-y-3">
              {risingLoops.map((loop, index) => (
                <motion.div key={loop.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                  <Card
                    className="p-4 rounded-3xl border-2 hover:scale-[1.01] transition-transform cursor-pointer"
                    style={{
                      borderColor: loop.color + "40",
                      backgroundColor: "#FFFFFF",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-[#4A4A6A] mb-1">{loop.name}</h4>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            className="px-2 py-0.5 text-xs rounded-full border-0"
                            style={{
                              backgroundColor: loop.color + "30",
                              color: "#6A6A88",
                            }}
                          >
                            {loop.vibe}
                          </Badge>
                          <span className="text-xs text-[#B8B8CC]">{loop.activity}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#B8B8CC]">
                          <MapPin className="w-3 h-3" />
                          <span>{loop.location}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className="px-3 py-1 rounded-full text-xs"
                          style={{
                            backgroundColor: loop.color + "20",
                            color: "#6A6A88",
                          }}
                        >
                          +{loop.newMembers} new
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Mood Twins Tab */}
        <TabsContent value="twins" className="space-y-6 mt-0">
          <div>
            <div className="mb-4">
              <h3 className="text-[#6A6A88] mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" style={{ color: "#C5A9FF" }} />
                Your Emotional Resonance
              </h3>
              <p className="text-xs text-[#8A8AA8] italic">souls who feel the same frequencies as you</p>
            </div>

            <div className="space-y-4">
              {moodTwins.map((twin, index) => (
                <motion.div key={twin.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                  <Card
                    className="p-5 rounded-3xl border-2 hover:scale-[1.01] transition-transform cursor-pointer relative overflow-hidden"
                    style={{
                      borderColor: twin.color + "40",
                      backgroundColor: "#FFFFFF",
                    }}
                  >
                    {/* Gradient overlay */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1 opacity-60"
                      style={{
                        background: `linear-gradient(90deg, ${twin.color}00, ${twin.color}, ${twin.color}00)`,
                      }}
                    />

                    <div className="flex items-center gap-4">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: twin.color + "40",
                          boxShadow: `0 0 20px ${twin.color}30`,
                        }}
                      >
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: twin.color,
                          }}
                        >
                          <span className="text-white" style={{ fontWeight: 600 }}>
                            {twin.name.charAt(0)}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1">
                        <h4 className="text-[#4A4A6A] mb-2">{twin.name}</h4>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {twin.sharedMoods.map((mood, idx) => (
                            <Badge
                              key={idx}
                              className="px-2 py-0.5 text-xs rounded-full border-0"
                              style={{
                                backgroundColor: twin.color + "20",
                                color: "#6A6A88",
                              }}
                            >
                              {mood}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-[#F6F8FB] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${twin.compatibility}%`,
                                backgroundColor: twin.color,
                                boxShadow: `0 0 8px ${twin.color}40`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-[#B8B8CC]">{twin.compatibility}%</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      className="w-full mt-4 py-2 rounded-full border-0"
                      style={{
                        background: `linear-gradient(135deg, ${twin.color}40, ${twin.color}20)`,
                        color: "#6A6A88",
                      }}
                    >
                      Connect
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

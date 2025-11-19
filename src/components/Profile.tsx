import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Settings, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useState } from 'react';
import { vibesData } from './vibes-data';

const userOrbs = [
  { id: 1, color: '#A9C7FF', mood: 'Calm' },
  { id: 2, color: '#C5A9FF', mood: 'Dreamy' },
  { id: 3, color: '#E0C9D9', mood: 'Reflective' },
  { id: 4, color: '#A9C7FF', mood: 'Calm' },
  { id: 5, color: '#FFD4A9', mood: 'Hopeful' },
  { id: 6, color: '#C5A9FF', mood: 'Dreamy' },
];

const joinedLoops = [
  { id: 1, name: 'Midnight Thoughts', color: '#A9C7FF' },
  { id: 2, name: 'Lucid Dreamers', color: '#C5A9FF' },
  { id: 3, name: 'Cloud Gazers', color: '#E0C9D9' },
];

const moodStats = [
  { mood: 'Calm', percentage: 45, color: '#A9C7FF' },
  { mood: 'Dreamy', percentage: 30, color: '#C5A9FF' },
  { mood: 'Reflective', percentage: 25, color: '#E0C9D9' },
];

interface ProfileProps {
  userName: string;
  onSettingsClick?: () => void;
}

export function Profile({ userName, onSettingsClick }: ProfileProps) {
  // Calculate dominant mood color
  const dominantMood = moodStats[0];

  const [activeTab, setActiveTab] = useState('aura');
  const [hoveredOrb, setHoveredOrb] = useState<number | null>(null);

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
          <div>
            <h2 className="text-[#4A4A6A] text-xl md:text-3xl font-bold">{userName}'s Aura</h2>
            <p className="text-[#8A8AA8] mt-1 text-sm">Emotional essence</p>
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
                ease: 'linear',
              }}
            />
            
            {/* Avatar */}
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-white/80 shadow-xl">
                <AvatarFallback
                  className="text-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${dominantMood.color}40, ${dominantMood.color}20)`,
                    color: '#6A6A88',
                  }}
                >
                  You
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          <h3 className="text-[#4A4A6A] mb-1">@dreamweaver</h3>
          <p className="text-[#8A8AA8] text-center max-w-xs mb-4">
            Exploring emotions through mist and gradients
          </p>

          {/* Follower Stats */}
          <div className="flex gap-6 mt-4">
            <div className="text-center">
              <div className="text-lg text-[#4A4A6A]">234</div>
              <div className="text-xs text-[#8A8AA8]">following</div>
            </div>
            <div className="w-px bg-[#E0E8F5]" />
            <div className="text-center">
              <div className="text-lg text-[#4A4A6A]">567</div>
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

        {/* Dream Orbs */}
        <div className="mb-6">
          <h4 className="mb-4 text-[#4A4A6A]">My Dream Orbs</h4>
          <div className="grid grid-cols-3 gap-4">
            {userOrbs.map((orb, index) => (
              <motion.div
                key={orb.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ 
                  scale: 1.05,
                }}
                onHoverStart={() => setHoveredOrb(orb.id)}
                onHoverEnd={() => setHoveredOrb(null)}
                className="aspect-square rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${orb.color}FF, ${orb.color}88, ${orb.color}44)`,
                  boxShadow: hoveredOrb === orb.id 
                    ? `0 12px 32px ${orb.color}60` 
                    : `0 8px 24px ${orb.color}40`,
                  filter: hoveredOrb === orb.id ? 'brightness(1.1)' : 'brightness(1)',
                }}
              >
                <span className="text-sm md:text-base lg:text-lg text-white font-medium">
                  {orb.mood}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Joined Loops */}
        <div className="mb-6">
          <h4 className="mb-4 text-[#4A4A6A]">Joined Loops</h4>
          <div className="space-y-3">
            {joinedLoops.map((loop, index) => (
              <motion.div
                key={loop.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card
                  className="p-4 rounded-2xl border-2 flex items-center gap-3 cursor-pointer hover:scale-[1.02] transition-transform backdrop-blur-sm"
                  style={{
                    borderColor: loop.color + '40',
                    backgroundColor: 'rgba(255,255,255,0.8)',
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
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4 rounded-2xl border-2 border-[#E0E8F5] bg-white/80 backdrop-blur-sm text-center">
            <div className="text-2xl mb-1 text-[#4A4A6A]">127</div>
            <div className="text-sm text-[#8A8AA8]">Vibes</div>
          </Card>
          <Card className="p-4 rounded-2xl border-2 border-[#E0E8F5] bg-white/80 backdrop-blur-sm text-center">
            <div className="text-2xl mb-1 text-[#4A4A6A]">3</div>
            <div className="text-sm text-[#8A8AA8]">Loops</div>
          </Card>
          <Card className="p-4 rounded-2xl border-2 border-[#E0E8F5] bg-white/80 backdrop-blur-sm text-center">
            <div className="text-2xl mb-1 text-[#4A4A6A]">18</div>
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
            <p className="text-[#8A8AA8] text-sm text-center italic mb-4">
              Collect dream orbs from the feed to save them here
            </p>
            
            {/* Example Saved Dream Orbs - Would be populated from saved state in real app */}
            <div className="space-y-3">
              {vibesData.filter(v => v.dreamOrb).slice(0, 2).map((dream, index) => (
                <motion.div
                  key={dream.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="p-4 rounded-2xl border-2 cursor-pointer hover:scale-[1.02] transition-transform"
                  style={{
                    borderColor: dream.moodColor + '40',
                    backgroundColor: dream.moodColor + '10',
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
                        boxShadow: [
                          `0 0 16px ${dream.moodColor}60`,
                          `0 0 24px ${dream.moodColor}80`,
                          `0 0 16px ${dream.moodColor}60`,
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
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
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <button className="text-sm text-[#C5A9FF] hover:text-[#A9C7FF] transition-colors cursor-pointer">
                View all saved dreams →
              </button>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
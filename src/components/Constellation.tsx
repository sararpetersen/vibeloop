import { useState } from 'react';
import { motion } from 'motion/react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Heart, MessageCircle, Sparkles } from 'lucide-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface Friend {
  id: number;
  name: string;
  currentMood: string;
  moodColor: string;
  x: number; // position percentage
  y: number; // position percentage
  size: number; // star size
  recentVibes: string[];
  connectedTo: number[]; // IDs of friends they're connected to
  lastActive: string;
}

const friends: Friend[] = [
  {
    id: 1,
    name: 'Aria Chen',
    currentMood: 'Dreamy',
    moodColor: '#C5A9FF',
    x: 30,
    y: 25,
    size: 24,
    recentVibes: ['listening to lofi and floating', 'had the strangest dream last night', 'feeling soft today'],
    connectedTo: [2, 4],
    lastActive: '2h ago',
  },
  {
    id: 2,
    name: 'Kai Schmidt',
    currentMood: 'Peaceful',
    moodColor: '#B8E8E0',
    x: 70,
    y: 20,
    size: 28,
    recentVibes: ['morning meditation hit different today', 'grateful for the quiet moments', 'just breathing'],
    connectedTo: [1, 3, 5],
    lastActive: '30m ago',
  },
  {
    id: 3,
    name: 'Sofia Morales',
    currentMood: 'Creative',
    moodColor: '#D4A9FF',
    x: 50,
    y: 45,
    size: 26,
    recentVibes: ['made something beautiful today', 'colors everywhere', 'inspiration is flowing'],
    connectedTo: [2, 6],
    lastActive: '1h ago',
  },
  {
    id: 4,
    name: 'Finn O\'Brien',
    currentMood: 'Hopeful',
    moodColor: '#FFD4A9',
    x: 20,
    y: 55,
    size: 22,
    recentVibes: ['maybe things are getting better', 'saw a rainbow today', 'feeling optimistic'],
    connectedTo: [1, 5],
    lastActive: '45m ago',
  },
  {
    id: 5,
    name: 'Priya Patel',
    currentMood: 'Calm',
    moodColor: '#A9C7FF',
    x: 65,
    y: 60,
    size: 25,
    recentVibes: ['everything feels still', 'found my center again', 'peaceful evening vibes'],
    connectedTo: [2, 4, 6],
    lastActive: '20m ago',
  },
  {
    id: 6,
    name: 'Zara Ahmed',
    currentMood: 'Reflective',
    moodColor: '#E0C9D9',
    x: 80,
    y: 75,
    size: 23,
    recentVibes: ['thinking about everything and nothing', 'journaling my way through it', 'introspection hours'],
    connectedTo: [3, 5],
    lastActive: '1h ago',
  },
  {
    id: 7,
    name: 'You',
    currentMood: 'Curious',
    moodColor: '#FFA9D4',
    x: 45,
    y: 80,
    size: 30,
    recentVibes: ['exploring new feelings', 'wondering about connection', 'open to whatever comes'],
    connectedTo: [1, 2, 3, 4, 5, 6],
    lastActive: 'now',
  },
];

export function Constellation() {
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleStarClick = (friend: Friend) => {
    setSelectedFriend(friend);
    setDetailOpen(true);
  };

  return (
    <div className="h-screen pb-24 md:pb-8 relative overflow-y-auto" style={{
      background: 'radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%)',
    }}>
      {/* Subtle stars background */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative px-6 pt-8 pb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-white mb-2 text-xl md:text-3xl font-bold">Your Constellation</h1>
          <p className="text-sm" style={{ color: '#B8B8CC' }}>
            souls connected across the cosmos
          </p>
        </motion.div>
      </div>

      {/* Constellation visualization */}
      <div className="relative px-6 h-[60vh]">
        <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
          {/* Connection lines */}
          {friends.map((friend) =>
            friend.connectedTo.map((targetId) => {
              const target = friends.find((f) => f.id === targetId);
              if (!target || targetId < friend.id) return null; // Avoid duplicate lines

              return (
                <motion.line
                  key={`${friend.id}-${targetId}`}
                  x1={`${friend.x}%`}
                  y1={`${friend.y}%`}
                  x2={`${target.x}%`}
                  y2={`${target.y}%`}
                  stroke="url(#lineGradient)"
                  strokeWidth="1"
                  opacity="0.4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.4 }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                />
              );
            })
          )}
          {/* Gradient for lines */}
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C5A9FF" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#A9C7FF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#C5A9FF" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>

        {/* Friend stars */}
        {friends.map((friend, index) => (
          <motion.div
            key={friend.id}
            className="absolute"
            style={{
              left: `${friend.x}%`,
              top: `${friend.y}%`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5, type: 'spring' }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleStarClick(friend)}
          >
            {/* Glow effect */}
            <div
              className="absolute inset-0 w-8 h-8 -left-4 -top-4 rounded-full blur-xl cursor-pointer"
              style={{
                background: `radial-gradient(circle, ${friend.moodColor}, transparent)`,
                opacity: 0.6,
              }}
            />
            
            {/* Star orb */}
            <motion.div
              className="relative rounded-full flex items-center justify-center"
              style={{
                width: friend.size,
                height: friend.size,
                backgroundColor: friend.moodColor,
                boxShadow: `0 0 20px ${friend.moodColor}80, inset 0 0 10px rgba(255,255,255,0.3)`,
              }}
              animate={{
                y: [0, -5, 0],
                boxShadow: [
                  `0 0 20px ${friend.moodColor}80, inset 0 0 10px rgba(255,255,255,0.3)`,
                  `0 0 30px ${friend.moodColor}CC, inset 0 0 15px rgba(255,255,255,0.5)`,
                  `0 0 20px ${friend.moodColor}80, inset 0 0 10px rgba(255,255,255,0.3)`,
                ],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {/* Initial */}
              <span className="text-white text-xs" style={{ fontWeight: 600 }}>
                {friend.name.charAt(0)}
              </span>
            </motion.div>

            {/* Name label */}
            <motion.div
              className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs px-2 py-1 rounded-lg"
              style={{
                backgroundColor: 'rgba(0,0,0,0.6)',
                color: '#FFFFFF',
                backdropFilter: 'blur(10px)',
              }}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              {friend.name}
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Soul Resonance hint */}
      <motion.div
        className="px-6 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div
          className="p-4 rounded-3xl backdrop-blur-sm border border-white/10"
          style={{
            backgroundColor: 'rgba(197, 169, 255, 0.1)',
          }}
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5" style={{ color: '#C5A9FF' }} />
            <div>
              <p className="text-sm" style={{ color: '#E0E0EA' }}>
                Soul Resonance Active
              </p>
              <p className="text-xs mt-1" style={{ color: '#B8B8CC' }}>
                3 people nearby are feeling similar to you
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Friend Detail Sheet */}
      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent
          side="bottom"
          className="h-[85vh] rounded-t-3xl border-0 p-0"
          style={{
            backgroundColor: '#F6F8FB',
          }}
        >
          <SheetHeader className="p-6 pb-4">
            <VisuallyHidden>
              <SheetTitle>Friend Details</SheetTitle>
              <SheetDescription>View your friend's recent vibes and activity</SheetDescription>
            </VisuallyHidden>
          </SheetHeader>

          {selectedFriend && (
            <div className="px-6 pb-6 overflow-y-auto h-full">
              {/* Friend header */}
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center relative"
                  style={{
                    backgroundColor: selectedFriend.moodColor + '40',
                    boxShadow: `0 0 30px ${selectedFriend.moodColor}40`,
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: selectedFriend.moodColor,
                      boxShadow: `0 0 20px ${selectedFriend.moodColor}80, inset 0 0 10px rgba(255,255,255,0.3)`,
                    }}
                  >
                    <span className="text-white text-xl" style={{ fontWeight: 600 }}>
                      {selectedFriend.name.charAt(0)}
                    </span>
                  </div>
                </div>

                <div className="flex-1">
                  <h2 className="text-[#4A4A6A] mb-1">{selectedFriend.name}</h2>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      className="px-3 py-1 rounded-full border-0"
                      style={{
                        backgroundColor: selectedFriend.moodColor + '30',
                        color: '#6A6A88',
                      }}
                    >
                      {selectedFriend.currentMood}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#B8B8CC]">
                    Active {selectedFriend.lastActive}
                  </p>
                </div>
              </div>

              {/* Recent vibes */}
              <div className="mb-6">
                <h3 className="text-[#6A6A88] mb-3 text-sm">Recent Vibes</h3>
                <div className="space-y-3">
                  {selectedFriend.recentVibes.map((vibe, index) => (
                    <motion.div
                      key={index}
                      className="p-4 rounded-2xl backdrop-blur-sm"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        border: `1px solid ${selectedFriend.moodColor}20`,
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <p className="text-sm text-[#6A6A88] italic">"{vibe}"</p>
                      <p className="text-xs text-[#B8B8CC] mt-1">
                        {index === 0 ? '2h ago' : index === 1 ? '1d ago' : '2d ago'}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  className="flex-1 py-6 rounded-full border-0"
                  style={{
                    background: `linear-gradient(135deg, ${selectedFriend.moodColor}40, ${selectedFriend.moodColor}20)`,
                    color: '#6A6A88',
                  }}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Send Gentle Nudge
                </Button>
                <Button
                  className="flex-1 py-6 rounded-full border-0"
                  style={{
                    background: `linear-gradient(135deg, ${selectedFriend.moodColor}EE, ${selectedFriend.moodColor}AA)`,
                    color: '#FFFFFF',
                  }}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
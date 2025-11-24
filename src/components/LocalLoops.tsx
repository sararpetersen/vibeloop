import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Search, Moon, Sparkles, Coffee, Palette, Heart, Star, Plus, MapPin, Calendar, Users as UsersIcon, MessageCircle } from "lucide-react";
import { getMoodColor, MOODS } from "./moods";
import { LoopChat } from "./LoopChat";
import { LoopDetail } from "./LoopDetail";
import { EventDetail } from "./EventDetail";

// Helper function to get poetic community size description
const getCommunitySize = (members: number): string => {
  if (members < 100) return "intimate circle";
  if (members < 500) return "warm community";
  return "vibrant space";
};

// Use all 15 moods for filters
const vibeFilters = ["All", ...MOODS.map((m) => m.name)];

type Loop = {
  id: number;
  name: string;
  description: string;
  location: string;
  members: number;
  activeMembersToday: number;
  vibe: string;
  icon: any;
  color: string;
  founded: string;
  activities: string[];
};

const initialLoops: Loop[] = [
  {
    id: 1,
    name: "The Creative Collective",
    description: "For people who make stuff - art, writing, music, whatever",
    location: "Copenhagen, Denmark",
    members: 847,
    activeMembersToday: 124,
    vibe: "Creative",
    icon: Palette,
    color: "#D4A9FF",
    founded: "Founded Nov 2024",
    activities: ["Art Sessions", "Open Mic", "Creative Workshops"],
  },
  {
    id: 2,
    name: "Late Night Walks",
    description: "Late night walks and actual conversations",
    location: "Ballerup, Denmark",
    members: 234,
    activeMembersToday: 18,
    vibe: "Calm",
    icon: Moon,
    color: "#A9C7FF",
    founded: "Founded Sep 2024",
    activities: ["Night Walks", "Star Gazing", "Deep Talks"],
  },
  {
    id: 3,
    name: "Dream Journal Club",
    description: "Talk about your weird dreams and what they might mean",
    location: "Copenhagen, Denmark",
    members: 612,
    activeMembersToday: 89,
    vibe: "Dreamy",
    icon: Sparkles,
    color: "#C5A9FF",
    founded: "Founded Aug 2024",
    activities: ["Dream Journaling", "Meditation", "Creative Writing"],
  },
  {
    id: 4,
    name: "Book & Coffee Meetups",
    description: "Chill at cafes, read, think, talk if you feel like it",
    location: "Nørrebro, Copenhagen",
    members: 523,
    activeMembersToday: 67,
    vibe: "Reflective",
    icon: Coffee,
    color: "#E0C9D9",
    founded: "Founded Jul 2024",
    activities: ["Cafe Meetups", "Book Clubs", "Silent Reading"],
  },
  {
    id: 5,
    name: "Astronomy Club",
    description: "Space nerds and people who think about the big stuff",
    location: "Amager, Copenhagen",
    members: 356,
    activeMembersToday: 42,
    vibe: "Dreamy",
    icon: Star,
    color: "#C5A9FF",
    founded: "Founded Oct 2024",
    activities: ["Astronomy Nights", "Philosophy Talks", "Music Sharing"],
  },
  {
    id: 6,
    name: "The Support Circle",
    description: "Safe space to talk about feelings without judgment",
    location: "Vesterbro, Copenhagen",
    members: 478,
    activeMembersToday: 53,
    vibe: "Reflective",
    icon: Heart,
    color: "#E0C9D9",
    founded: "Founded Jun 2024",
    activities: ["Support Circles", "Gentle Movement", "Art Therapy"],
  },
];

type EventItem = {
  id: number;
  name: string;
  description: string;
  location: string;
  date: string;
  attendees: number;
  maxAttendees: number;
  vibe: string;
  distance: string;
  duration: string;
  host: string;
  whatToBring: string[];
};

const initialEvents: EventItem[] = [
  {
    id: 1,
    name: "Quiet Tea Night",
    description: "Come sit in peaceful silence, sip tea, and just exist",
    location: "Fælledparken",
    date: "Tonight, 8:00 PM",
    attendees: 12,
    maxAttendees: 20,
    vibe: "Calm",
    distance: "1.2 km away",
    duration: "2 hours",
    host: "Sana Bakri",
    whatToBring: ["Blanket", "Warm clothes", "Open heart"],
  },
  {
    id: 2,
    name: "Art & Coffee Session",
    description: "Slow art session with ambient music and warm drinks",
    location: "Kulturhuset Ballerup",
    date: "Tomorrow, 6:00 PM",
    attendees: 8,
    maxAttendees: 15,
    vibe: "Creative",
    distance: "2.5 km away",
    duration: "3 hours",
    host: "Omar Hassan",
    whatToBring: ["Canvas provided", "Just bring yourself"],
  },
  {
    id: 3,
    name: "Midnight Walk",
    description: "Wander through quiet streets and share your dreams",
    location: "Starting at Ballerup Station",
    date: "Friday, 11:30 PM",
    attendees: 15,
    maxAttendees: 25,
    vibe: "Dreamy",
    distance: "3.8 km away",
    duration: "90 minutes",
    host: "Mei Wong",
    whatToBring: ["Comfortable shoes", "Dream journal", "Flashlight"],
  },
  {
    id: 4,
    name: "Sunrise Movement",
    description: "Sunrise movement, dance, and good energy",
    location: "Amager Strandpark",
    date: "Saturday, 6:00 AM",
    attendees: 20,
    maxAttendees: 30,
    vibe: "Creative",
    distance: "5.1 km away",
    duration: "2 hours",
    host: "Jamal Johnson",
    whatToBring: ["Yoga mat", "Water bottle", "Positive vibes"],
  },
  {
    id: 5,
    name: "Journaling Session",
    description: "Journal together in cozy silence, share if you want",
    location: "Assistens Kirkegård",
    date: "Sunday, 3:00 PM",
    attendees: 6,
    maxAttendees: 12,
    vibe: "Reflective",
    distance: "1.8 km away",
    duration: "2 hours",
    host: "Anja Novak",
    whatToBring: ["Journal & pen", "Hot beverage", "Open mind"],
  },
  {
    id: 6,
    name: "Stargazing Night",
    description: "Look up at the cosmos and share what you feel",
    location: "Dyrehaven",
    date: "Next Wed, 9:00 PM",
    attendees: 11,
    maxAttendees: 20,
    vibe: "Dreamy",
    distance: "6.4 km away",
    duration: "3 hours",
    host: "Kenji Sato",
    whatToBring: ["Blanket", "Warm drinks", "Curiosity"],
  },
];

// note: state hooks must be inside components — we'll initialize them in the component

export function LocalLoops({
  setCurrentScreen,
  joinLoop,
  leaveLoop,
  joinedLoopsProp,
}: {
  setCurrentScreen?: (s: string) => void;
  joinLoop?: (loop: { id: number; name: string; color: string }) => void;
  leaveLoop?: (id: number) => void;
  joinedLoopsProp?: { id: number; name: string; color: string }[];
}) {
  const [loopsData, setLoopsData] = useState<Loop[]>(initialLoops);
  const [selectedVibe, setSelectedVibe] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("communities");
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<{
    name: string;
    color: string;
    type: "community" | "event";
  } | null>(null);
  const [loopDetailOpen, setLoopDetailOpen] = useState(false);
  const [selectedLoop, setSelectedLoop] = useState<Loop | null>(null);
  const [eventDetailOpen, setEventDetailOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  // events state
  const [eventsData, setEventsData] = useState<EventItem[]>(initialEvents);

  const filteredLoops = loopsData.filter((loop) => {
    const matchesVibe = selectedVibe === "All" || loop.vibe === selectedVibe;
    const matchesSearch =
      loop.name.toLowerCase().includes(searchQuery.toLowerCase()) || loop.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesVibe && matchesSearch;
  });

  const filteredEvents = eventsData.filter((event) => {
    const matchesVibe = selectedVibe === "All" || event.vibe === selectedVibe;
    const matchesSearch =
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) || event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesVibe && matchesSearch;
  });

  // Joined loops persistence helpers
  const getJoinedFromStorage = (): number[] => {
    try {
      const raw = localStorage.getItem("vibeloop_joined_loops");
      const parsed = raw ? JSON.parse(raw) : [];
      // parsed may be array of objects or ids
      if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "object") {
        return parsed.map((p: any) => p.id);
      }
      return parsed as number[];
    } catch (e) {
      return [];
    }
  };

  const joinLoopLocal = (loop: Partial<Loop> & { id: number; name: string; color: string }) => {
    try {
      const raw = localStorage.getItem("vibeloop_joined_loops");
      const parsed = raw ? JSON.parse(raw) : [];
      const exists = (parsed || []).find((p: any) => p.id === loop.id);
      if (!exists) {
        const next = [{ id: loop.id, name: loop.name, color: loop.color }, ...(parsed || [])];
        localStorage.setItem("vibeloop_joined_loops", JSON.stringify(next));
        window.dispatchEvent(new Event("vibeloop:joined_loops_changed"));
      }
    } catch (e) {
      // ignore
    }
  };

  const leaveLoopLocal = (id: number) => {
    try {
      const raw = localStorage.getItem("vibeloop_joined_loops");
      const parsed = raw ? JSON.parse(raw) : [];
      const next = (parsed || []).filter((p: any) => p.id !== id);
      localStorage.setItem("vibeloop_joined_loops", JSON.stringify(next));
      window.dispatchEvent(new Event("vibeloop:joined_loops_changed"));
    } catch (e) {
      // ignore
    }
  };

  const isJoined = (id: number) => {
    try {
      if (joinedLoopsProp) return joinedLoopsProp.some((l) => l.id === id);
      return getJoinedFromStorage().includes(id);
    } catch (e) {
      return false;
    }
  };

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
        <h2 className="mb-2 text-[#4A4A6A] text-xl md:text-3xl font-bold">Local Loops</h2>
        <p className="text-sm text-[#8A8AA8] mb-4">Nearby communities and vibe-based gatherings</p>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8B8CC]" />
          <Input
            type="text"
            placeholder="Search loops & events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 py-6 rounded-full bg-white/80 border-2 border-[#A9C7FF]/30 focus:border-[#A9C7FF]/60 text-[#4A4A6A] placeholder:text-[#B8B8CC]"
          />
        </div>

        {/* Vibe Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar mb-4">
          {vibeFilters.map((vibe) => {
            const moodColor = vibe === "All" ? "#C5A9FF" : getMoodColor(vibe);
            return (
              <motion.div
                key={vibe}
                whileHover={{
                  scale: 1.02,
                  filter: `drop-shadow(0 0 12px ${moodColor}60)`,
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Badge
                  onClick={() => setSelectedVibe(vibe)}
                  className={`cursor-pointer px-4 py-2 rounded-full transition-all duration-300 border-2 whitespace-nowrap ${
                    selectedVibe === vibe ? "border-opacity-100 shadow-lg" : "border-opacity-0 bg-white/60"
                  }`}
                  style={{
                    backgroundColor: selectedVibe === vibe ? moodColor + "40" : "rgba(255,255,255,0.6)",
                    borderColor: moodColor,
                    color: "#4A4A6A",
                  }}
                >
                  {vibe}
                </Badge>
              </motion.div>
            );
          })}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-white/80 rounded-full p-1">
            <TabsTrigger
              value="communities"
              className="flex-1 rounded-full data-[state=active]:bg-[#C5A9FF40] data-[state=active]:text-[#4A4A6A] text-[#8A8AA8]"
            >
              Communities
            </TabsTrigger>
            <TabsTrigger
              value="events"
              className="flex-1 rounded-full data-[state=active]:bg-[#C5A9FF40] data-[state=active]:text-[#4A4A6A] text-[#8A8AA8]"
            >
              Events
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="px-6 mt-4">
        <Tabs value={activeTab} className="w-full">
          {/* Communities Tab */}
          <TabsContent value="communities" className="mt-0 space-y-4">
            {filteredLoops.map((loop, index) => {
              const IconComponent = loop.icon;
              return (
                <motion.div
                  key={loop.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.5,
                  }}
                >
                  <Card
                    onClick={() => {
                      setSelectedLoop(loop);
                      setLoopDetailOpen(true);
                    }}
                    className="p-5 rounded-3xl border-2 relative overflow-hidden backdrop-blur-sm cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                    style={{
                      borderColor: loop.color + "40",
                      backgroundColor: "rgba(255,255,255,0.8)",
                    }}
                  >
                    {/* Gradient overlay */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1 opacity-60 pointer-events-none"
                      style={{
                        background: `linear-gradient(90deg, ${loop.color}00, ${loop.color}, ${loop.color}00)`,
                      }}
                    />

                    <div className="flex gap-4">
                      {/* Icon */}
                      <div
                        className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{
                          backgroundColor: loop.color + "30",
                          boxShadow: `0 0 20px ${loop.color}20`,
                        }}
                      >
                        <IconComponent className="w-7 h-7" style={{ color: loop.color }} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="mb-1 text-[#4A4A6A]">{loop.name}</h3>
                        <p className="text-sm text-[#8A8AA8] mb-2 line-clamp-2">{loop.description}</p>
                        <div className="flex items-center gap-2 text-sm text-[#8A8AA8] mb-2">
                          <MapPin className="w-3.5 h-3.5 text-[#B8B8CC]" />
                          <span>{loop.location}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm mb-2">
                          <span className="text-[#B8B8CC] italic">{getCommunitySize(loop.members)}</span>
                          <span className="text-[#E0E0EA]">•</span>
                          <span className="text-[#B8B8CC] text-xs">{loop.activeMembersToday} active today</span>
                        </div>

                        {/* Activities */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {loop.activities.map((activity, idx) => (
                            <Badge
                              key={idx}
                              className="px-2 py-0.5 text-xs rounded-full border-0"
                              style={{
                                backgroundColor: loop.color + "20",
                                color: "#6A6A88",
                              }}
                            >
                              {activity}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-[#B8B8CC] italic">
                          <span>{loop.founded}</span>
                          <span className="text-[#E0E0EA]">•</span>
                          <Badge
                            className="px-2 py-0.5 text-xs rounded-full border-0"
                            style={{
                              backgroundColor: loop.color + "30",
                              color: "#6A6A88",
                            }}
                          >
                            {loop.vibe}
                          </Badge>
                        </div>

                        <div className="mt-3">
                          <button
                            type="button"
                            aria-pressed={isJoined(loop.id)}
                            aria-label={isJoined(loop.id) ? `Leave ${loop.name}` : `Join ${loop.name}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isJoined(loop.id)) {
                                if (leaveLoop) leaveLoop(loop.id);
                                else leaveLoopLocal(loop.id);
                              } else {
                                if (joinLoop) joinLoop({ id: loop.id, name: loop.name, color: loop.color });
                                else joinLoopLocal(loop);
                              }
                            }}
                            className={`relative z-20 px-3 py-2 rounded-full text-sm cursor-pointer ${
                              isJoined(loop.id) ? "text-[#111827] font-semibold border" : "bg-[#C5A9FF20] text-[#6A6A88]"
                            }`}
                            style={isJoined(loop.id) ? { backgroundColor: "#9AA4C6", borderColor: "#7F8BAF", boxShadow: "none" } : undefined}
                          >
                            {isJoined(loop.id) ? "Leave" : "Join"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}

            {/* Create New Loop Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: filteredLoops.length * 0.1,
                duration: 0.5,
              }}
            >
              <Button
                className="w-full py-8 rounded-3xl border-2 border-dashed transition-all duration-300 hover:scale-[1.02]"
                style={{
                  borderColor: "#C5A9FF60",
                  backgroundColor: "rgba(197, 169, 255, 0.1)",
                  color: "#6A6A88",
                }}
                onClick={() => {
                  const name = window.prompt("New loop name");
                  if (name) {
                    const newLoop: Loop = {
                      id: Date.now(),
                      name,
                      description: "A new loop created locally",
                      location: "Nearby",
                      members: 1,
                      activeMembersToday: 0,
                      vibe: "Creative",
                      icon: Palette,
                      color: "#A9C7FF",
                      founded: "Now",
                      activities: [],
                    };
                    setLoopsData((prev) => [newLoop, ...prev]);
                  }
                }}
              >
                <Plus className="w-5 h-5 mr-2" />
                Create new loop
              </Button>
            </motion.div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="mt-0 space-y-4">
            {filteredEvents.map((event, index) => {
              const eventColor = getMoodColor(event.vibe);
              const spotsLeft = event.maxAttendees - event.attendees;
              const isAlmostFull = spotsLeft <= 5 && spotsLeft > 0;
              const isFull = spotsLeft <= 0;

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.5,
                  }}
                >
                  <Card
                    onClick={() => {
                      setSelectedEvent(event);
                      setEventDetailOpen(true);
                    }}
                    className="p-5 rounded-3xl border-2 relative overflow-hidden backdrop-blur-sm cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                    style={{
                      borderColor: eventColor + "40",
                      backgroundColor: "rgba(255,255,255,0.8)",
                    }}
                  >
                    {/* Gradient overlay */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1 opacity-60 pointer-events-none"
                      style={{
                        background: `linear-gradient(90deg, ${eventColor}00, ${eventColor}, ${eventColor}00)`,
                      }}
                    />

                    <div className="relative">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="mb-1 text-[#4A4A6A]">{event.name}</h3>
                          <p className="text-sm text-[#8A8AA8] mb-3">{event.description}</p>
                        </div>
                        <Badge
                          className="ml-2 px-3 py-1 rounded-full border-0 whitespace-nowrap"
                          style={{
                            backgroundColor: eventColor + "30",
                            color: "#6A6A88",
                          }}
                        >
                          {event.vibe}
                        </Badge>
                      </div>

                      {/* Event Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-[#6A6A88]">
                          <Calendar className="w-4 h-4 text-[#B8B8CC]" />
                          <span>{event.date}</span>
                          <span className="text-[#D0D0E0]">•</span>
                          <span className="text-[#B8B8CC]">{event.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#6A6A88]">
                          <MapPin className="w-4 h-4 text-[#B8B8CC]" />
                          <span>{event.location}</span>
                          <span className="text-[#D0D0E0]">•</span>
                          <span className="text-[#B8B8CC]">{event.distance}</span>
                        </div>
                        <div className="text-xs text-[#B8B8CC] italic">Hosted by {event.host}</div>
                      </div>

                      {/* What to Bring */}
                      <div className="mb-4">
                        <p className="text-xs text-[#8A8AA8] mb-2">What to bring:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {event.whatToBring.map((item, idx) => (
                            <Badge
                              key={idx}
                              className="px-2 py-0.5 text-xs rounded-full border-0"
                              style={{
                                backgroundColor: eventColor + "20",
                                color: "#6A6A88",
                              }}
                            >
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Attendance - Subtle and Poetic */}
                      <div className="mb-3">
                        <div className="flex items-center gap-1.5 text-sm text-[#8A8AA8] mb-3">
                          <UsersIcon className="w-4 h-4 text-[#B8B8CC]" />
                          <span className="italic">
                            {event.attendees} {event.attendees === 1 ? "soul" : "souls"} gathering
                          </span>
                          {isAlmostFull && (
                            <>
                              <span className="text-[#D0D0E0] mx-1">•</span>
                              <span className="text-[#B8B8CC] text-xs">
                                {spotsLeft} {spotsLeft === 1 ? "spot" : "spots"} left
                              </span>
                            </>
                          )}
                          {isFull && (
                            <>
                              <span className="text-[#D0D0E0] mx-1">•</span>
                              <span className="text-[#B8B8CC] text-xs">gathering full</span>
                            </>
                          )}
                        </div>

                        {/* Subtle visual indicator - only show when getting full */}
                        {(isAlmostFull || isFull) && (
                          <div className="h-1 bg-[#F6F8FB] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${(event.attendees / event.maxAttendees) * 100}%`,
                                backgroundColor: eventColor + "60",
                                boxShadow: `0 0 6px ${eventColor}20`,
                              }}
                            />
                          </div>
                        )}
                      </div>

                      {/* Tap to see details hint */}
                      <div className="text-center pt-2">
                        <div className="flex items-center justify-center gap-3">
                          <span className="text-xs text-[#B8B8CC] italic">Tap to see details</span>
                          <button
                            type="button"
                            aria-pressed={isJoined(event.id)}
                            aria-label={isJoined(event.id) ? `Leave ${event.name}` : `Join ${event.name}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isJoined(event.id)) leaveLoopLocal(event.id);
                              else joinLoopLocal({ id: event.id, name: event.name, color: eventColor });
                            }}
                            className={`relative z-20 px-3 py-1 rounded-full text-xs cursor-pointer ${
                              isJoined(event.id) ? "text-[#111827] font-semibold border" : "bg-[#C5A9FF20] text-[#6A6A88]"
                            }`}
                            style={isJoined(event.id) ? { backgroundColor: "#9AA4C6", borderColor: "#7F8BAF", boxShadow: "none" } : undefined}
                          >
                            {isJoined(event.id) ? "Leave" : "Join"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}

            {/* Create Event Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: filteredEvents.length * 0.1,
                duration: 0.5,
              }}
            >
              <Button
                className="w-full py-8 rounded-3xl border-2 border-dashed transition-all duration-300 hover:scale-[1.02]"
                style={{
                  borderColor: "#C5A9FF60",
                  backgroundColor: "rgba(197, 169, 255, 0.1)",
                  color: "#6A6A88",
                }}
                onClick={() => {
                  const name = window.prompt("New event name");
                  if (name) {
                    const newEvent: EventItem = {
                      id: Date.now(),
                      name,
                      description: "A locally created event",
                      location: "Nearby",
                      date: "TBA",
                      attendees: 0,
                      maxAttendees: 20,
                      vibe: "Creative",
                      distance: "0.0 km away",
                      duration: "1 hour",
                      host: "You",
                      whatToBring: [],
                    };
                    setEventsData((prev) => [newEvent, ...prev]);
                  }
                }}
              >
                <Plus className="w-5 h-5 mr-2" />
                Create vibe event
              </Button>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Chat Sheet */}
      {selectedChat && (
        <LoopChat
          isOpen={chatOpen}
          onClose={() => {
            setChatOpen(false);
            setTimeout(() => setSelectedChat(null), 300);
          }}
          loopName={selectedChat.name}
          loopColor={selectedChat.color}
          type={selectedChat.type}
        />
      )}

      {/* Loop Detail Sheet */}
      {selectedLoop && (
        <LoopDetail
          isOpen={loopDetailOpen}
          onClose={() => {
            setLoopDetailOpen(false);
            setTimeout(() => setSelectedLoop(null), 300);
          }}
          loop={selectedLoop}
          onOpenChat={() => {
            setLoopDetailOpen(false);
            setSelectedChat({
              name: selectedLoop.name,
              color: selectedLoop.color,
              type: "community",
            });
            setChatOpen(true);
          }}
        />
      )}

      {/* Event Detail Sheet */}
      {selectedEvent && (
        <EventDetail
          isOpen={eventDetailOpen}
          onClose={() => {
            setEventDetailOpen(false);
            setTimeout(() => setSelectedEvent(null), 300);
          }}
          event={selectedEvent}
          eventColor={getMoodColor(selectedEvent.vibe)}
          onOpenChat={() => {
            setEventDetailOpen(false);
            setSelectedChat({
              name: selectedEvent.name,
              color: getMoodColor(selectedEvent.vibe),
              type: "event",
            });
            setChatOpen(true);
          }}
        />
      )}
    </motion.div>
  );
}

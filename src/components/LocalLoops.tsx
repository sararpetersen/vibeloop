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

  // Local joined state: start empty to represent a new-user empty state
  const [joinedLoopsIds, setJoinedLoopsIds] = useState<number[]>([]);

  const isJoined = (id: number) => joinedLoopsIds.includes(id);

  const handleToggleJoin = (loopItem: { id: number; name: string; color: string }) => {
    setJoinedLoopsIds((prev) => {
      const exists = prev.includes(loopItem.id);
      const nextIds = exists ? prev.filter((i) => i !== loopItem.id) : [loopItem.id, ...prev];

      // Persist a friendly joined loops array for other parts of the app
      try {
        const raw = localStorage.getItem("vibeloop_joined_loops");
        const parsed = raw ? JSON.parse(raw) : [];
        // Build object list from nextIds mapping to available loop data (try to preserve names/colors)
        const nextObjs = nextIds.map((id) => {
          if (id === loopItem.id) return { id: loopItem.id, name: loopItem.name, color: loopItem.color };
          const existing = (parsed || []).find((p: any) => p.id === id);
          return existing || { id, name: `Loop ${id}`, color: "#C5A9FF" };
        });
        localStorage.setItem("vibeloop_joined_loops", JSON.stringify(nextObjs));
        window.dispatchEvent(new Event("vibeloop:joined_loops_changed"));
        window.dispatchEvent(new CustomEvent("vibeloop:data_changed"));
      } catch (e) {
        // ignore
      }

      // Notify App-level handlers when present
      try {
        if (exists) {
          if (leaveLoop) leaveLoop(loopItem.id);
        } else {
          if (joinLoop) joinLoop(loopItem);
        }
      } catch (e) {}

      return nextIds;
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
                    className="p-4 md:p-5 rounded-3xl border-2 bg-white/70 backdrop-blur-xl shadow-md relative overflow-hidden"
                    style={{ borderColor: "rgba(255,255,255,0.4)" }}
                  >
                    <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-4 space-y-3 md:space-y-0">
                      <div className="flex items-start gap-3">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center"
                          style={{ backgroundColor: loop.color, color: "white", boxShadow: `0 10px 30px ${loop.color}20` }}
                        >
                          <span className="font-semibold text-sm">{loop.name.charAt(0)}</span>
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-[#4A4A6A] font-semibold truncate">{loop.name}</h3>
                          <p className="text-xs text-[#8A8AA8] truncate">{loop.location}</p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {loop.activities.slice(0, 3).map((activity, idx) => (
                              <Badge
                                key={idx}
                                className="px-2 py-0.5 text-xs rounded-full border-0"
                                style={{ backgroundColor: loop.color + "20", color: "#6A6A88" }}
                              >
                                {activity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div className="hidden md:block" />

                        <div className="flex items-center justify-between mt-2 md:mt-0">
                          <div className="text-xs text-[#6A6A88]">
                            <div>{loop.members} members</div>
                            <div className="text-[#B8B8CC] text-xs">{loop.activeMembersToday} active today</div>
                          </div>

                          <div>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleJoin({ id: loop.id, name: loop.name, color: loop.color });
                              }}
                              className={`px-4 py-2 rounded-full ${
                                isJoined(loop.id)
                                  ? "bg-white/0 border border-[#E0E8F5] text-[#6A6A88]"
                                  : "bg-gradient-to-r from-[rgba(197,169,255,0.4)] to-[rgba(169,199,255,0.4)] text-white"
                              }`}
                            >
                              {isJoined(loop.id) ? "Joined ✓" : "Join loop"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedLoop(loop);
                        setLoopDetailOpen(true);
                      }}
                      className="absolute inset-0 opacity-0"
                      aria-hidden
                    />
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
                    className="p-4 rounded-2xl border-2 relative overflow-hidden backdrop-blur-sm cursor-pointer hover:scale-[1.01] transition-transform duration-200"
                    style={{
                      borderColor: eventColor + "30",
                      backgroundColor: "rgba(255,255,255,0.9)",
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center"
                          style={{
                            backgroundColor: eventColor + "30",
                            boxShadow: `0 6px 18px ${eventColor}16`,
                          }}
                        >
                          <Calendar className="w-6 h-6" style={{ color: eventColor }} />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="min-w-0">
                            <h3 className="text-[#4A4A6A] truncate">{event.name}</h3>
                            <p className="text-sm text-[#8A8AA8] line-clamp-2">{event.description}</p>
                          </div>

                          <Badge
                            className="ml-2 px-3 py-1 rounded-full border-0 whitespace-nowrap"
                            style={{ backgroundColor: eventColor + "30", color: "#6A6A88" }}
                          >
                            {event.vibe}
                          </Badge>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-4">
                          <div className="text-xs text-[#6A6A88]">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5 text-[#B8B8CC]" />
                              <span>{event.date}</span>
                              <span className="text-[#D0D0E0]">•</span>
                              <span className="text-[#B8B8CC]">{event.duration}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <MapPin className="w-3.5 h-3.5 text-[#B8B8CC]" />
                              <span>{event.location}</span>
                            </div>
                            <div className="text-xs text-[#B8B8CC] italic mt-1">Hosted by {event.host}</div>
                          </div>

                          <div className="text-right">
                            <div className="text-sm text-[#4A4A6A]">{event.attendees}</div>
                            <div className="text-xs text-[#8A8AA8]">going</div>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex gap-2 items-center text-xs text-[#B8B8CC]">
                            {isAlmostFull && <span className="text-[#D97706]">{spotsLeft} spots left</span>}
                            {isFull && <span className="text-red-500">Full</span>}
                          </div>

                          <div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isJoined(event.id)) {
                                  if (leaveLoop) leaveLoop(event.id);
                                  else leaveLoopLocal(event.id);
                                } else {
                                  if (joinLoop) joinLoop({ id: event.id, name: event.name, color: eventColor });
                                  else joinLoopLocal({ id: event.id, name: event.name, color: eventColor });
                                }
                              }}
                              disabled={isFull}
                              className={`px-3 py-2 rounded-full text-sm ${
                                isJoined(event.id) ? "bg-red-50 text-red-500" : "bg-[#C5A9FF20] text-[#6A6A88]"
                              } ${isFull ? "opacity-50 pointer-events-none" : ""}`}
                            >
                              {isJoined(event.id) ? "Leave" : "Join"}
                            </button>
                          </div>
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

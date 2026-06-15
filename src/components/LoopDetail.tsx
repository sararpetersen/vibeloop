import { motion } from "motion/react";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "./ui/sheet";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { X, MapPin, Users as UsersIcon, MessageCircle, Calendar, Sparkles, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface LoopDetailProps {
  isOpen: boolean;
  onClose: () => void;
  loop: {
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
  onOpenChat: () => void;
}

// Default community-level data per loop (not user-specific)
const defaultMembers: Record<number, { id: string; name: string; initial: string; color: string; mood: string }[]> = {
  1: [
    { id: "m1", name: "Ines Varga", initial: "I", color: "#D4A9FF", mood: "Creative" },
    { id: "m2", name: "Malik Osei", initial: "M", color: "#C5A9FF", mood: "Inspired" },
    { id: "m3", name: "Yara Khalil", initial: "Y", color: "#A9C7FF", mood: "Dreamy" },
    { id: "m4", name: "Jun Nakamura", initial: "J", color: "#FFD4A9", mood: "Energetic" },
  ],
  2: [
    { id: "m5", name: "Theo Braun", initial: "T", color: "#A9C7FF", mood: "Calm" },
    { id: "m6", name: "Aisha Diallo", initial: "A", color: "#C5A9FF", mood: "Reflective" },
    { id: "m7", name: "Nora Eriksen", initial: "N", color: "#B8E8E0", mood: "Peaceful" },
  ],
  3: [
    { id: "m8", name: "Hana Sato", initial: "H", color: "#C5A9FF", mood: "Dreamy" },
    { id: "m9", name: "Liam Walsh", initial: "L", color: "#A9C7FF", mood: "Curious" },
    { id: "m10", name: "Safiya Mensah", initial: "S", color: "#D4A9FF", mood: "Reflective" },
    { id: "m11", name: "Chiara Romano", initial: "C", color: "#E0C9D9", mood: "Calm" },
  ],
  4: [
    { id: "m12", name: "Jade Laurent", initial: "J", color: "#E0C9D9", mood: "Reflective" },
    { id: "m13", name: "Dmitri Volkov", initial: "D", color: "#C5A9FF", mood: "Calm" },
    { id: "m14", name: "Suki Watanabe", initial: "S", color: "#FFD4A9", mood: "Peaceful" },
  ],
  5: [
    { id: "m15", name: "Tariq Hassan", initial: "T", color: "#C5A9FF", mood: "Curious" },
    { id: "m16", name: "Mira Petrov", initial: "M", color: "#A9C7FF", mood: "Dreamy" },
    { id: "m17", name: "Kenji Sato", initial: "K", color: "#FFD4A9", mood: "Inspired" },
  ],
  6: [
    { id: "m18", name: "Kiera Murphy", initial: "K", color: "#E0C9D9", mood: "Reflective" },
    { id: "m19", name: "Hassan Ali", initial: "H", color: "#C5A9FF", mood: "Calm" },
    { id: "m20", name: "Luna Reyes", initial: "L", color: "#D4A9FF", mood: "Peaceful" },
    { id: "m21", name: "Zainab Nour", initial: "Z", color: "#FFD4A9", mood: "Hopeful" },
  ],
};

const defaultEvents: Record<number, { id: string; name: string; date: string; attendees: number; description: string; location: string }[]> = {
  1: [
    { id: "e1", name: "Open Mic Night", date: "This Friday, 7:00 PM", attendees: 18, description: "Bring something to share — a poem, a sketch, a song, or just yourself", location: "Ungdomshuset, København" },
    { id: "e2", name: "Collaborative Zine Session", date: "Next Tuesday, 6:30 PM", attendees: 9, description: "We make a zine together. Materials provided, no experience needed.", location: "Fabrikken for Kunst og Design" },
  ],
  2: [
    { id: "e3", name: "Forest Route Walk", date: "Tomorrow, 10:00 PM", attendees: 11, description: "A slow walk through the trees. Bring a torch and good company.", location: "Møns Klint trailhead" },
    { id: "e4", name: "Rooftop Starwatch", date: "Saturday, 11:00 PM", attendees: 7, description: "Clear skies forecast. Bring something warm and look up.", location: "Ballerup rooftop (shared in chat)" },
  ],
  3: [
    { id: "e5", name: "Dream Sharing Circle", date: "Sunday, 4:00 PM", attendees: 14, description: "Bring your strangest dreams. We discuss, interpret, wonder together.", location: "Absalon, Vesterbro" },
    { id: "e6", name: "Lucid Dreaming Workshop", date: "Next Thursday, 7:00 PM", attendees: 20, description: "Techniques, experiences, and a lot of 'wait, is this real?' energy.", location: "Online — link in chat" },
  ],
  4: [
    { id: "e7", name: "Silent Reading Afternoon", date: "Saturday, 2:00 PM", attendees: 12, description: "Come read. No talking required. Coffee available.", location: "Paludan Bog & Café, Fiolstræde" },
    { id: "e8", name: "Slow Book Club", date: "Next Sunday, 3:00 PM", attendees: 8, description: "We're taking our time with this one. No pressure to have finished it.", location: "Coffee Collective, Nørrebro" },
  ],
  5: [
    { id: "e9", name: "Stargazing Night", date: "Next Wed, 9:00 PM", attendees: 11, description: "Telescopes out, blankets ready. Saturn is visible this week.", location: "Dyrehaven, north clearing" },
    { id: "e10", name: "Cosmos & Coffee Talk", date: "Next Friday, 6:00 PM", attendees: 15, description: "Casual conversation about the big stuff. No expertise required.", location: "Riccos Kaffebar, Istedgade" },
  ],
  6: [
    { id: "e11", name: "Art Therapy Session", date: "Tomorrow, 5:00 PM", attendees: 9, description: "Process through making. Paints, clay, collage — whatever feels right.", location: "Vesterbro Kulturhus" },
    { id: "e12", name: "Gentle Sharing Circle", date: "Thursday, 6:30 PM", attendees: 13, description: "A quiet space to say the things that are hard to say. Safe, held, honest.", location: "Frederiksberg Have pavilion" },
  ],
};

export function LoopDetail({ isOpen, onClose, loop, onOpenChat }: LoopDetailProps) {
  const [hasJoined, setHasJoined] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem("vibeloop_joined_loops");
      if (!raw) return false;
      const arr = JSON.parse(raw) as Array<{ id: number }>;
      return arr.some((s) => s.id === loop.id);
    } catch (e) {
      return false;
    }
  });

  function joinLoopLocal(l: { id: number; name: string; color?: string }) {
    try {
      const raw = localStorage.getItem("vibeloop_joined_loops");
      let arr: Array<{ id: number; name: string; color?: string }> = [];
      if (raw) arr = JSON.parse(raw);
      if (!arr.find((x) => x.id === l.id)) {
        arr.push(l);
        localStorage.setItem("vibeloop_joined_loops", JSON.stringify(arr));
        window.dispatchEvent(new CustomEvent("vibeloop:joined_loops_changed"));
        window.dispatchEvent(new CustomEvent("vibeloop:data_changed"));
      }
    } catch (e) {
      // ignore
    }
  }

  function leaveLoopLocal(id: number) {
    try {
      const raw = localStorage.getItem("vibeloop_joined_loops");
      if (!raw) return;
      let arr: Array<any> = JSON.parse(raw);
      arr = arr.filter((x) => x.id !== id);
      localStorage.setItem("vibeloop_joined_loops", JSON.stringify(arr));
      window.dispatchEvent(new CustomEvent("vibeloop:joined_loops_changed"));
      window.dispatchEvent(new CustomEvent("vibeloop:data_changed"));
    } catch (e) {
      // ignore
    }
  }

  // recent members — use community defaults, supplemented by any user-persisted data
  const [recentMembersState] = useState(() => {
    try {
      const raw = localStorage.getItem("vibeloop_recent_members");
      const persisted = raw ? JSON.parse(raw) : [];
      const defaults = defaultMembers[loop.id] ?? [];
      return persisted.length > 0 ? persisted : defaults;
    } catch (e) {
      return defaultMembers[loop.id] ?? [];
    }
  });

  // following list (ids)
  const [following, setFollowing] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem("vibeloop_following");
      if (!raw) return [];
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("vibeloop_following", JSON.stringify(following));
    } catch (e) {
      // ignore
    }
  }, [following]);

  function followMember(id: string) {
    if (following.includes(id)) return;
    const next = [...following, id];
    setFollowing(next);
    window.dispatchEvent(new CustomEvent("vibeloop:data_changed"));
  }

  function unfollowMember(id: string) {
    const next = following.filter((x) => x !== id);
    setFollowing(next);
    window.dispatchEvent(new CustomEvent("vibeloop:data_changed"));
  }

  // upcoming events — use community defaults, supplemented by any user-persisted data
  const [upcomingEventsState, setUpcomingEventsState] = useState(() => {
    try {
      const raw = localStorage.getItem("vibeloop_upcoming_events");
      const persisted = raw ? JSON.parse(raw) : [];
      const defaults = defaultEvents[loop.id] ?? [];
      return persisted.length > 0 ? persisted : defaults;
    } catch (e) {
      return defaultEvents[loop.id] ?? [];
    }
  });

  function rsvpEvent(eventId: string) {
    setUpcomingEventsState((prev) => {
      const next = prev.map((ev: any) => {
        if (ev.id === eventId) return { ...ev, attendees: (ev.attendees || 0) + 1 };
        return ev;
      });
      // do not write demo/upcoming events into user-local storage by default
      window.dispatchEvent(new CustomEvent("vibeloop:data_changed"));
      return next;
    });
  }

  // RSVPed events for current user
  const [rsvpedEvents, setRsvpedEvents] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem("vibeloop_rsvped_events");
      if (!raw) return [];
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("vibeloop_rsvped_events", JSON.stringify(rsvpedEvents));
    } catch (e) {}
  }, [rsvpedEvents]);

  function toggleRsvp(eventId: string) {
    if (rsvpedEvents.includes(eventId)) {
      // undo RSVP -> decrement attendee count if possible
      setUpcomingEventsState((prev) => {
        const next = prev.map((ev: any) => {
          if (ev.id === eventId) return { ...ev, attendees: Math.max(0, (ev.attendees || 1) - 1) };
          return ev;
        });
        window.dispatchEvent(new CustomEvent("vibeloop:data_changed"));
        return next;
      });
      setRsvpedEvents((p) => p.filter((id) => id !== eventId));
    } else {
      // RSVP
      rsvpEvent(eventId);
      setRsvpedEvents((p) => [...p, eventId]);
    }
  }
  const IconComponent = loop.icon;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="h-[90vh] rounded-t-[2rem] border-0 p-0 bg-gradient-to-br from-[#F6F8FB] via-[#E8E4F3] to-[#F0E8F5] [&>button]:!top-6 [&>button]:!right-6 [&>button]:!rounded-full [&>button]:!p-0 [&>button]:!opacity-100 [&>button]:!bg-white/70 [&>button]:hover:!bg-white [&>button]:hover:!scale-110 [&>button]:!w-10 [&>button]:!h-10 [&>button]:!flex [&>button]:!items-center [&>button]:!justify-center [&>button]:!shadow-sm [&>button]:!transition-all [&>button]:!duration-200 [&>button]:!cursor-pointer"
      >
        <VisuallyHidden>
          <SheetTitle>{loop.name}</SheetTitle>
          <SheetDescription>{loop.description}</SheetDescription>
        </VisuallyHidden>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="h-full overflow-auto"
        >
          {/* Header — scrolls with content, no floating box */}
          <div className="px-6 pt-6 pb-4 pr-14">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: loop.color + "30",
                  boxShadow: `0 0 20px ${loop.color}20`,
                }}
              >
                <IconComponent className="w-6 h-6" style={{ color: loop.color }} />
              </div>
              <div>
                <h2 className="text-[#4A4A6A]">{loop.name}</h2>
                <p className="text-sm text-[#8A8AA8]">{loop.location}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-6 space-y-6">
            {/* Description */}
            <div>
              <p className="text-[#6A6A88] leading-relaxed mb-4">{loop.description}</p>
              <div className="flex flex-wrap gap-2">
                <Badge
                  className="px-3 py-1 rounded-full border-0"
                  style={{
                    backgroundColor: loop.color + "30",
                    color: "#6A6A88",
                  }}
                >
                  {loop.vibe}
                </Badge>
                <Badge className="px-3 py-1 rounded-full bg-white/80 text-[#8A8AA8] border-2 border-[#E0E8F5]">{loop.founded}</Badge>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4 rounded-2xl border-2 border-[#E0E8F5] bg-white/80 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-1">
                  <UsersIcon className="w-4 h-4 text-[#B8B8CC]" />
                  <span className="text-sm text-[#8A8AA8]">Members</span>
                </div>
                <div className="text-2xl text-[#4A4A6A]">{loop.members}</div>
              </Card>
              <Card className="p-4 rounded-2xl border-2 border-[#E0E8F5] bg-white/80 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-[#B8B8CC]" />
                  <span className="text-sm text-[#8A8AA8]">Active today</span>
                </div>
                <div className="text-2xl text-[#4A4A6A]">{loop.activeMembersToday}</div>
              </Card>
            </div>

            {/* Activities */}
            <div>
              <h3 className="text-[#4A4A6A] mb-3">What we do</h3>
              <div className="flex flex-wrap gap-2">
                {loop.activities.map((activity, idx) => (
                  <Badge
                    key={idx}
                    className="px-3 py-2 rounded-full border-0"
                    style={{
                      backgroundColor: loop.color + "20",
                      color: "#6A6A88",
                    }}
                  >
                    {activity}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Recent Members */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[#4A4A6A]">Recent members</h3>
                {recentMembersState.length > 0 && (
                  <span className="text-sm text-[#8A8AA8]">{recentMembersState.length}</span>
                )}
              </div>
              <div className={recentMembersState.length >= 2 ? "grid grid-cols-2 gap-2" : "space-y-2"}>
                {recentMembersState.length === 0 && <div className="text-sm text-[#8A8AA8] italic">No recent members yet.</div>}

                {recentMembersState.length > 0 &&
                  recentMembersState.map((member, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                      <Card className="p-3 rounded-2xl border-2 border-[#E0E8F5] bg-white/80 backdrop-blur-sm">
                        <div className="flex flex-col gap-2 text-center">
                          <div className="flex justify-center">
                            <Avatar className="w-10 h-10 border-2" style={{ borderColor: member.color + "60" }}>
                              <AvatarFallback
                                className="text-xs"
                                style={{ backgroundColor: member.color + "30", color: "#4A4A6A" }}
                              >
                                {member.initial}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div>
                            <div className="text-xs font-medium text-[#6A6A88] truncate">{member.name}</div>
                            <div className="text-[10px] text-[#B8B8CC]">Feeling {member.mood}</div>
                          </div>
                          <div style={{ textAlign: "center" }}>
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation();
                                following.includes(member.id) ? unfollowMember(member.id) : followMember(member.id);
                              }}
                              whileHover={{ scale: 1.07 }}
                              whileTap={{ scale: 0.94 }}
                              className="rounded-full text-[11px] font-medium cursor-pointer"
                              style={{
                                display: "inline-block",
                                padding: "4px 20px",
                                ...(following.includes(member.id)
                                  ? { backgroundColor: loop.color + "20", color: loop.color, border: `1.5px solid ${loop.color}50` }
                                  : { backgroundColor: loop.color, color: "#fff", boxShadow: `0 2px 6px ${loop.color}30` }),
                              }}
                            >
                              {following.includes(member.id) ? "Following ✓" : "Follow"}
                            </motion.button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[#4A4A6A]">Upcoming gatherings</h3>
                {upcomingEventsState.length > 0 && (
                  <span className="text-sm text-[#8A8AA8]">{upcomingEventsState.length}</span>
                )}
              </div>
              <div className="space-y-3">
                {upcomingEventsState.length === 0 && <div className="text-sm text-[#8A8AA8] italic">No upcoming gatherings.</div>}

                {upcomingEventsState.length > 0 &&
                  upcomingEventsState.map((event, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                      <Card
                        className="p-4 rounded-2xl border-2 bg-white/80 backdrop-blur-sm"
                        style={{
                          borderColor: loop.color + "30",
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="text-sm font-medium text-[#4A4A6A] flex-1 pr-2">{event.name}</div>
                          <Badge
                            className="px-2 py-0.5 text-xs rounded-full border-0 flex-shrink-0"
                            style={{ backgroundColor: loop.color + "20", color: "#6A6A88" }}
                          >
                            {event.attendees} going
                          </Badge>
                        </div>
                        {event.description && (
                          <p className="text-xs text-[#8A8AA8] mb-3 leading-relaxed">{event.description}</p>
                        )}
                        {event.location && (
                          <div className="flex items-center gap-1.5 text-xs text-[#B8B8CC] mb-3">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        {/* Date + RSVP always in the same row */}
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center gap-1.5 text-xs text-[#B8B8CC]">
                            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{event.date}</span>
                          </div>
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRsvp(event.id);
                            }}
                            whileHover={{ scale: 1.07 }}
                            whileTap={{ scale: 0.94 }}
                            className="px-4 py-1.5 rounded-full text-xs font-medium cursor-pointer"
                            style={
                              rsvpedEvents.includes(event.id)
                                ? { backgroundColor: loop.color + "20", color: loop.color, border: `1.5px solid ${loop.color}50` }
                                : { backgroundColor: loop.color, color: "#fff", boxShadow: `0 2px 8px ${loop.color}40` }
                            }
                          >
                            {rsvpedEvents.includes(event.id) ? "Going ✓" : "RSVP"}
                          </motion.button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-white/90 backdrop-blur-xl border-t-2 border-[#E0E8F5] px-6 py-4">
            <div className="flex gap-3">
              <motion.button
                onClick={onOpenChat}
                whileHover={{ scale: 1.08, boxShadow: `0 4px 18px ${loop.color}50` }}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-300"
                style={{
                  background: `linear-gradient(135deg, ${loop.color}50, ${loop.color}25)`,
                  color: loop.color,
                }}
              >
                <MessageCircle className="w-5 h-5" />
              </motion.button>
              <button
                onClick={() => {
                  if (hasJoined) {
                    leaveLoopLocal(loop.id);
                    setHasJoined(false);
                  } else {
                    joinLoopLocal({ id: loop.id, name: loop.name, color: loop.color });
                    setHasJoined(true);
                  }
                }}
                className="flex-1 rounded-full py-3.5 font-medium text-sm cursor-pointer transition-all duration-300 hover:opacity-90 hover:scale-[1.01]"
                style={
                  hasJoined
                    ? { backgroundColor: loop.color + "20", color: loop.color, border: `1.5px solid ${loop.color}60` }
                    : { backgroundColor: loop.color, color: "#fff", boxShadow: `0 4px 16px ${loop.color}50` }
                }
              >
                {hasJoined ? "Joined ✓" : "Join Loop"}
              </button>
            </div>
          </div>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}

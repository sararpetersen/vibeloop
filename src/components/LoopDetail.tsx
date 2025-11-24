import { motion } from "motion/react";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "./ui/sheet";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { X, MapPin, Users as UsersIcon, MessageCircle, Calendar, Clock, Sparkles, TrendingUp } from "lucide-react";
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

// No hardcoded user-specific demo members or upcoming events — start empty for new users

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
    } catch (e) {
      // ignore
    }
  }

  // recent members state (user-specific) — default to empty for new users
  const [recentMembersState, setRecentMembersState] = useState(() => {
    try {
      const raw = localStorage.getItem("vibeloop_recent_members");
      if (!raw) return [];
      return JSON.parse(raw);
    } catch (e) {
      return [];
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

  // upcoming events state (user-specific) — default to empty for new users
  const [upcomingEventsState, setUpcomingEventsState] = useState(() => {
    try {
      const raw = localStorage.getItem("vibeloop_upcoming_events");
      if (!raw) return [];
      return JSON.parse(raw);
    } catch (e) {
      return [];
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
      <SheetContent side="bottom" className="h-[90vh] rounded-t-[2rem] border-0 p-0 bg-gradient-to-br from-[#F6F8FB] via-[#E8E4F3] to-[#F0E8F5]">
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
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b-2 border-[#E0E8F5] px-6 py-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
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
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-full bg-[#F6F8FB] hover:bg-[#E8E4F3] transition-colors"
              >
                <X className="w-5 h-5 text-[#8A8AA8]" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-6">
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
              <div className="flex items-center justify-between">
                <h3 className="text-[#4A4A6A] mb-3">Recent members</h3>
                <div className="text-sm text-[#8A8AA8]">{recentMembersState.length}</div>
              </div>
              <div className="space-y-2">
                {recentMembersState.length === 0 && <div className="text-sm text-[#8A8AA8] italic">No recent members yet.</div>}

                {recentMembersState.length > 0 &&
                  recentMembersState.map((member, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}>
                      <Card className="p-3 rounded-2xl border-2 border-[#E0E8F5] bg-white/80 backdrop-blur-sm flex items-center gap-3">
                        <Avatar className="w-10 h-10 border-2" style={{ borderColor: member.color + "60" }}>
                          <AvatarFallback
                            className="text-sm"
                            style={{
                              backgroundColor: member.color + "30",
                              color: "#4A4A6A",
                            }}
                          >
                            {member.initial}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="text-sm text-[#6A6A88]">{member.name}</div>
                          <div className="text-xs text-[#B8B8CC]">Feeling {member.mood}</div>
                        </div>
                        <div className="flex-shrink-0">
                          {following.includes(member.id) ? (
                            <Button
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                unfollowMember(member.id);
                              }}
                            >
                              Following
                            </Button>
                          ) : (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                followMember(member.id);
                              }}
                            >
                              Follow
                            </Button>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-[#4A4A6A] mb-3">Upcoming gatherings</h3>
                <div className="text-sm text-[#8A8AA8]">{upcomingEventsState.length}</div>
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
                          <div className="text-[#6A6A88]">{event.name}</div>
                          <Badge
                            className="px-2 py-0.5 text-xs rounded-full border-0"
                            style={{
                              backgroundColor: loop.color + "20",
                              color: "#6A6A88",
                            }}
                          >
                            {event.attendees} going
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#B8B8CC]">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{event.date}</span>
                        </div>
                        <div className="mt-3 flex justify-end">
                          {rsvpedEvents.includes(event.id) ? (
                            <Button
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleRsvp(event.id);
                              }}
                            >
                              Joined
                            </Button>
                          ) : (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleRsvp(event.id);
                              }}
                            >
                              RSVP
                            </Button>
                          )}
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
              <Button
                onClick={onOpenChat}
                className="rounded-full py-6 border-0 transition-all duration-300 hover:shadow-lg flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${loop.color}40, ${loop.color}20)`,
                  color: "#6A6A88",
                  width: "56px",
                  padding: "0",
                }}
              >
                <MessageCircle className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => {
                  if (hasJoined) {
                    leaveLoopLocal(loop.id);
                    setHasJoined(false);
                  } else {
                    joinLoopLocal({ id: loop.id, name: loop.name, color: loop.color });
                    setHasJoined(true);
                  }
                }}
                className="flex-1 rounded-full py-6 border-0 transition-all duration-300 hover:shadow-lg"
                style={{
                  background: hasJoined ? "linear-gradient(135deg, #E0E0EA, #D0D0E0)" : `linear-gradient(135deg, ${loop.color}EE, ${loop.color}AA)`,
                  color: hasJoined ? "#6A6A88" : "#FFFFFF",
                }}
              >
                {hasJoined ? "Joined ✓" : "Join Loop"}
              </Button>
            </div>
          </div>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}

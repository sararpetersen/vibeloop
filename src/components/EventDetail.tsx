import { motion } from "motion/react";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "./ui/sheet";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { X, MapPin, Calendar, Clock, Users as UsersIcon, MessageCircle, Navigation } from "lucide-react";
import { useState, useEffect } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface EventDetailProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
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
  eventColor: string;
  onOpenChat: () => void;
}

// No hardcoded user-specific event attendees — start empty for new users

export function EventDetail({ isOpen, onClose, event, eventColor, onOpenChat }: EventDetailProps) {
  const [isAttending, setIsAttending] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem("vibeloop_joined_loops");
      if (!raw) return false;
      const arr = JSON.parse(raw) as Array<{ id: number }>;
      return arr.some((s) => s.id === event.id);
    } catch (e) {
      return false;
    }
  });
  const spotsLeft = event.maxAttendees - event.attendees;
  const isAlmostFull = spotsLeft <= 5 && spotsLeft > 0;
  const isFull = spotsLeft <= 0;

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

  // attendees state (user-specific) — default to empty for new users
  const [eventAttendeesState, setEventAttendeesState] = useState(() => {
    try {
      const raw = localStorage.getItem("vibeloop_event_attendees");
      if (!raw) return [];
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  });

  // following list (shared key)
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
    } catch (e) {}
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

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-[2rem] border-0 p-0 bg-gradient-to-br from-[#F6F8FB] via-[#E8E4F3] to-[#F0E8F5]">
        <VisuallyHidden>
          <SheetTitle>{event.name}</SheetTitle>
          <SheetDescription>{event.description}</SheetDescription>
        </VisuallyHidden>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="h-full overflow-auto"
        >
          {/* Header */}
          <div
            className="sticky top-0 z-10 backdrop-blur-xl border-b-2 px-6 py-4"
            style={{
              backgroundColor: eventColor + "15",
              borderColor: eventColor + "30",
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Badge
                  className="mb-2 px-3 py-1 rounded-full border-0"
                  style={{
                    backgroundColor: eventColor + "30",
                    color: "#6A6A88",
                  }}
                >
                  {event.vibe} Vibe
                </Badge>
                <h2 className="text-[#4A4A6A] mb-1">{event.name}</h2>
                <p className="text-sm text-[#8A8AA8]">Hosted by {event.host}</p>
              </div>
              <motion.button whileTap={{ scale: 0.9 }} onClick={onClose} className="p-2 rounded-full bg-white/60 hover:bg-white/80 transition-colors">
                <X className="w-5 h-5 text-[#8A8AA8]" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-6">
            {/* Description */}
            <div>
              <p className="text-[#6A6A88] leading-relaxed">{event.description}</p>
            </div>

            {/* Key Details */}
            <Card className="p-5 rounded-3xl border-2 border-[#E0E8F5] bg-white/80 backdrop-blur-sm space-y-4">
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: eventColor + "20",
                  }}
                >
                  <Calendar className="w-5 h-5" style={{ color: eventColor }} />
                </div>
                <div>
                  <div className="text-sm text-[#B8B8CC] mb-0.5">When</div>
                  <div className="text-[#6A6A88]">{event.date}</div>
                  <div className="text-sm text-[#B8B8CC]">{event.duration}</div>
                </div>
              </div>

              <div className="h-px bg-[#E0E8F5]" />

              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: eventColor + "20",
                  }}
                >
                  <MapPin className="w-5 h-5" style={{ color: eventColor }} />
                </div>
                <div>
                  <div className="text-sm text-[#B8B8CC] mb-0.5">Where</div>
                  <div className="text-[#6A6A88]">{event.location}</div>
                  <div className="text-sm text-[#B8B8CC]">{event.distance}</div>
                </div>
              </div>

              <div className="h-px bg-[#E0E8F5]" />

              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: eventColor + "20",
                  }}
                >
                  <UsersIcon className="w-5 h-5" style={{ color: eventColor }} />
                </div>
                <div>
                  <div className="text-sm text-[#B8B8CC] mb-0.5">Gathering size</div>
                  <div className="text-[#6A6A88]">
                    {event.attendees} {event.attendees === 1 ? "soul" : "souls"} attending
                  </div>
                  {isAlmostFull && (
                    <div className="text-sm text-[#B8B8CC]">
                      Only {spotsLeft} {spotsLeft === 1 ? "spot" : "spots"} left
                    </div>
                  )}
                  {isFull && <div className="text-sm text-[#B8B8CC]">Gathering is full</div>}
                </div>
              </div>

              {/* Attendance bar */}
              {(isAlmostFull || isFull) && (
                <div className="pt-2">
                  <div className="h-2 bg-[#F6F8FB] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: eventColor,
                        boxShadow: `0 0 8px ${eventColor}40`,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              )}
            </Card>

            {/* What to Bring */}
            <div>
              <h3 className="text-[#4A4A6A] mb-3">What to bring</h3>
              <div className="flex flex-wrap gap-2">
                {event.whatToBring.map((item, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }}>
                    <Badge
                      className="px-4 py-2 rounded-full border-0"
                      style={{
                        backgroundColor: eventColor + "20",
                        color: "#6A6A88",
                      }}
                    >
                      {item}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Attendees */}
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-[#4A4A6A] mb-3">Who's coming</h3>
                <div className="text-sm text-[#8A8AA8]">{eventAttendeesState.length}</div>
              </div>
              <div className="space-y-2">
                {eventAttendeesState.length === 0 && <div className="text-sm text-[#8A8AA8] italic">No attendees yet.</div>}

                {eventAttendeesState.length > 0 &&
                  eventAttendeesState.slice(0, event.attendees > 6 ? 6 : event.attendees).map((attendee, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}>
                      <Card className="p-3 rounded-2xl border-2 border-[#E0E8F5] bg-white/80 backdrop-blur-sm flex items-center gap-3">
                        <Avatar className="w-10 h-10 border-2" style={{ borderColor: attendee.color + "60" }}>
                          <AvatarFallback
                            className="text-sm"
                            style={{
                              backgroundColor: attendee.color + "30",
                              color: "#4A4A6A",
                            }}
                          >
                            {attendee.initial}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="text-sm text-[#6A6A88]">{attendee.name}</div>
                          <div className="text-xs text-[#B8B8CC]">Feeling {attendee.mood}</div>
                        </div>
                        <div className="flex-shrink-0">
                          {following.includes(attendee.id) ? (
                            <Button
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                unfollowMember(attendee.id);
                              }}
                            >
                              Following
                            </Button>
                          ) : (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                followMember(attendee.id);
                              }}
                            >
                              Follow
                            </Button>
                          )}
                        </div>
                        {idx === 0 && <Badge className="px-2 py-0.5 text-xs rounded-full bg-[#A9C7FF]/20 text-[#6A6A88] border-0">Host</Badge>}
                      </Card>
                    </motion.div>
                  ))}
              </div>
            </div>

            {/* Additional Info */}
            <Card className="p-5 rounded-3xl border-2 bg-white/80 backdrop-blur-sm" style={{ borderColor: eventColor + "20" }}>
              <h4 className="text-[#6A6A88] mb-2">A gentle reminder</h4>
              <p className="text-sm text-[#8A8AA8] leading-relaxed italic">
                This is a judgment-free space. Come as you are, share what feels right, and respect everyone's emotional journey.
              </p>
            </Card>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-white/90 backdrop-blur-xl border-t-2 border-[#E0E8F5] px-6 py-4">
            <div className="flex gap-3">
              <Button
                onClick={onOpenChat}
                className="rounded-full py-6 border-0 transition-all duration-300 hover:shadow-lg flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${eventColor}40, ${eventColor}20)`,
                  color: "#6A6A88",
                  width: "56px",
                  padding: "0",
                }}
              >
                <MessageCircle className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => {
                  if (isFull) return;
                  if (isAttending) {
                    leaveLoopLocal(event.id);
                    setIsAttending(false);
                  } else {
                    joinLoopLocal({ id: event.id, name: event.name, color: eventColor });
                    setIsAttending(true);
                  }
                }}
                disabled={isFull}
                className="flex-1 rounded-full py-6 border-0 transition-all duration-300 hover:shadow-lg"
                style={{
                  background: isFull
                    ? "linear-gradient(135deg, #E0E0EA, #D0D0E0)"
                    : isAttending
                    ? "linear-gradient(135deg, #E0E0EA, #D0D0E0)"
                    : `linear-gradient(135deg, ${eventColor}EE, ${eventColor}AA)`,
                  color: isFull || isAttending ? "#6A6A88" : "#FFFFFF",
                  opacity: isFull ? 0.7 : 1,
                }}
              >
                {isFull ? "Gathering Full" : isAttending ? "Attending ✓" : "Join Gathering"}
              </Button>
            </div>
          </div>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}

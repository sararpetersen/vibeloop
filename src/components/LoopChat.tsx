import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Send, Smile } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface Message {
  id: number;
  author: string;
  text: string;
  timestamp: string;
  color: string;
  isOwn?: boolean;
}

interface LoopChatProps {
  isOpen: boolean;
  onClose: () => void;
  loopName: string;
  loopColor: string;
  type: "community" | "event";
}

// Chat message variations for different loops/events
const chatMessageSets = {
  "The Creative Collective": [
    { author: "Ines", text: "Finished something. Staring at it. No idea if it works or if I just need sleep 🎨", timestamp: "4h ago", color: "#D4A9FF" },
    { author: "Malik", text: "what were you going for?", timestamp: "3h ago", color: "#C5A9FF" },
    { author: "Ines", text: "Honestly no clue. Started as anger and somehow became a landscape.", timestamp: "3h ago", color: "#D4A9FF" },
    {
      author: "Yara",
      text: "That's the most interesting kind of work — the kind that surprises you mid-process. I've been chasing that feeling with this poem for three weeks.",
      timestamp: "2h ago",
      color: "#A9C7FF",
    },
    { author: "Jun", text: "yo Yara open mic next time?? please??", timestamp: "1h ago", color: "#FFD4A9" },
    { author: "Leila", text: "seconded. also just want to say this group keeps me from spiraling. that's all 💜", timestamp: "45m ago", color: "#E0C9D9" },
  ],
  "Late Night Walks": [
    { author: "Theo", text: "sky tonight", timestamp: "3h ago", color: "#A9C7FF" },
    { author: "Theo", text: "just: sky tonight", timestamp: "3h ago", color: "#A9C7FF" },
    {
      author: "Aisha",
      text: "I saw it too. Something about a very clear night makes the world feel both enormous and oddly safe.",
      timestamp: "2h ago",
      color: "#C5A9FF",
    },
    { author: "Viktor", text: "Daytime is loud. Night just... resets things.", timestamp: "1h ago", color: "#D4A9FF" },
    { author: "Nora", text: "Forest route tomorrow?? Who's brave 🌲", timestamp: "45m ago", color: "#B8E8E0" },
    { author: "Raj", text: "in. obviously.", timestamp: "30m ago", color: "#E0C9D9" },
  ],
  "Dream Journal Club": [
    { author: "Hana", text: "Swimming. Through clouds. Physically swimming. That was my whole night.", timestamp: "5h ago", color: "#C5A9FF" },
    { author: "Liam", text: "DUUUDE ok so mine: reading a book but every time i looked away the words changed into different words. not bad words just. different", timestamp: "4h ago", color: "#A9C7FF" },
    {
      author: "Safiya",
      text: "Hana — swimming typically maps to emotional navigation in most frameworks. Moving through something that should be intangible. What were you feeling before sleep?",
      timestamp: "3h ago",
      color: "#D4A9FF",
    },
    { author: "Anders", text: "I appreciate that we can say 'swimming through clouds' and nobody here laughs.", timestamp: "1h ago", color: "#FFD4A9" },
    { author: "Chiara", text: "cheaper than therapy. more interesting than therapy. fight me", timestamp: "40m ago", color: "#E0C9D9" },
  ],
  "Book & Coffee Meetups": [
    { author: "Jade", text: "Quiet cafe recs? My usual has started playing music and I genuinely cannot.", timestamp: "4h ago", color: "#E0C9D9" },
    { author: "Dmitri", text: "Jægersborggade — the one with the green sign. Silent hours 1–5, non-negotiable rule. It's perfect.", timestamp: "3h ago", color: "#C5A9FF" },
    {
      author: "Amina",
      text: "currently reading something about slow living and having a full moment about how fast I normally move. we don't talk about that enough",
      timestamp: "2h ago",
      color: "#D4A9FF",
    },
    { author: "Felix", text: "title?", timestamp: "1h ago", color: "#A9C7FF" },
    { author: "Amina", text: "Will send after I finish. Don't want to oversell it before I know how it ends.", timestamp: "55m ago", color: "#D4A9FF" },
    { author: "Suki", text: "next silent session i'm bringing the chamomile situation ☕ see you all there", timestamp: "45m ago", color: "#FFD4A9" },
  ],
  "Astronomy Club": [
    { author: "Tariq", text: "black hole documentary. couldn't sleep. infinity is genuinely too much", timestamp: "4h ago", color: "#C5A9FF" },
    {
      author: "Mira",
      text: "Infinity is the only concept that actually frightens me — not in a bad way, more like standing at the edge of something. We are stardust, we will return to stardust. That's not nothing.",
      timestamp: "3h ago",
      color: "#A9C7FF",
    },
    { author: "Oskar", text: "existentialism but make it 10pm and cozy. that's this group", timestamp: "2h ago", color: "#D4A9FF" },
    { author: "Nia", text: "We manage to be genuinely into the science and not annoying about it, and I think that's actually rare.", timestamp: "1h ago", color: "#E0C9D9" },
    { author: "Kenji", text: "friday. telescope. saturn. be there 🪐", timestamp: "30m ago", color: "#FFD4A9" },
  ],
  "The Support Circle": [
    { author: "Kiera", text: "Rough day. Not looking for solutions. Just needed somewhere to put it.", timestamp: "3h ago", color: "#E0C9D9" },
    { author: "Hassan", text: "It's here. You're allowed 💛", timestamp: "2h ago", color: "#C5A9FF" },
    {
      author: "Luna",
      text: "Healing isn't a straight line and I think we all know that intellectually but it still catches me off guard when I have a bad day after several good ones.",
      timestamp: "1h ago",
      color: "#D4A9FF",
    },
    { author: "Elias", text: "Yes. That. Exactly that.", timestamp: "50m ago", color: "#A9C7FF" },
    { author: "Zainab", text: "Art therapy tomorrow if anyone wants to process through making things rather than words — both are valid.", timestamp: "25m ago", color: "#FFD4A9" },
  ],
  "Quiet Tea Night": [
    { author: "Rowan", text: "First time tonight. What do I actually... do?", timestamp: "2h ago", color: "#A9C7FF" },
    { author: "Davi", text: "nothing! genuinely nothing. sit, have tea, exist. that's it", timestamp: "1h ago", color: "#C5A9FF" },
    {
      author: "Iris",
      text: "There's no performance element, which is the whole point. You don't have to be interesting or talkative. You can just be there.",
      timestamp: "45m ago",
      color: "#E0C9D9",
    },
    { author: "Rowan", text: "Ok, I think I need this more than I realised.", timestamp: "35m ago", color: "#A9C7FF" },
    { author: "Mateo", text: "8pm ☕ see u there", timestamp: "30m ago", color: "#D4A9FF" },
  ],
  "Art & Coffee Session": [
    { author: "Tala", text: "NEVER painted before. Terrified. Coming anyway 🫠", timestamp: "3h ago", color: "#D4A9FF" },
    { author: "Noah", text: "Zero experience required, open mind sufficient ✨ You'll be fine.", timestamp: "2h ago", color: "#C5A9FF" },
    { author: "Kaia", text: "last time i painted what i thought was a sunset. it looked like a fire in a parking lot. 10/10 would do again", timestamp: "1h ago", color: "#FFD4A9" },
    { author: "Silas", text: "Bringing speaker + ambient playlist. Open to requests as long as the request is 'yes that's fine'.", timestamp: "45m ago", color: "#A9C7FF" },
  ],
  "Midnight Walk": [
    { author: "Aria", text: "Friday midnight walk. Already counting down.", timestamp: "4h ago", color: "#C5A9FF" },
    { author: "Javier", text: "Routing through the quiet side streets, probably stopping at the 24h place for something warm. Thoughts?", timestamp: "3h ago", color: "#A9C7FF" },
    {
      author: "Mei",
      text: "Bring your journals. Last time the conversations under the streetlights were genuinely the best part of my week and I still think about it.",
      timestamp: "2h ago",
      color: "#D4A9FF",
    },
    { author: "Finn", text: "Night walks do something to the brain. Everything gets quieter and somehow more true.", timestamp: "1h ago", color: "#E0C9D9" },
  ],
  "Sunrise Movement": [
    { author: "Zara", text: "6am saturday. voluntarily. who are we 🌅", timestamp: "3h ago", color: "#FFD4A9" },
    { author: "Akira", text: "WORTHWHILE EVERY TIME. The energy afterwards carries me literally all day. I've tried to explain it to non-morning people and cannot.", timestamp: "2h ago", color: "#D4A9FF" },
    { author: "Layla", text: "Bringing spare mats — just say if you need one.", timestamp: "1h ago", color: "#A9C7FF" },
    { author: "Omar", text: "Sets the tone for the whole week, honestly. See you all out there.", timestamp: "45m ago", color: "#C5A9FF" },
  ],
  "Journaling Session": [
    { author: "Yasmin", text: "Been writing every day this week. Have a lot. Maybe too much. See you tomorrow.", timestamp: "4h ago", color: "#E0C9D9" },
    { author: "Luca", text: "No pressure to share any of it — just write what comes, that's enough.", timestamp: "3h ago", color: "#C5A9FF" },
    {
      author: "Priya",
      text: "Writing has genuinely taught me things about myself that years of thinking hadn't. There's something about having to form a complete sentence.",
      timestamp: "2h ago",
      color: "#D4A9FF",
    },
    { author: "Anton", text: "tea situation handled. cozy levels: maximum. see you all there", timestamp: "1h ago", color: "#A9C7FF" },
  ],
  "Stargazing Night": [
    { author: "Nisha", text: "Checked. Wednesday is clear. We're on 🌌", timestamp: "5h ago", color: "#C5A9FF" },
    { author: "Diego", text: "Bringing the star map app so we can actually name what we're looking at instead of just pointing.", timestamp: "4h ago", color: "#A9C7FF" },
    {
      author: "Aaliyah",
      text: "Last time a shooting star went right across our field of view and everyone just went quiet. Hoping for that again ✨",
      timestamp: "2h ago",
      color: "#D4A9FF",
    },
    { author: "Ren", text: "The way this group makes science feel like a feeling. That's the thing.", timestamp: "1h ago", color: "#E0C9D9" },
  ],
};

// Generate messages based on loop/event name
const generateMockMessages = (loopName: string, type: "community" | "event"): Message[] => {
  // Try to get specific messages for this loop/event
  if (chatMessageSets[loopName as keyof typeof chatMessageSets]) {
    return chatMessageSets[loopName as keyof typeof chatMessageSets].map((msg, index) => ({
      id: index + 1,
      ...msg,
    }));
  }

  // Fallback for any unmatched loops/events
  const fallbackMessages =
    type === "event"
      ? [
          { author: "Nora", text: "first time here 🦋 a little nervous but mostly excited", timestamp: "2h ago", color: "#A9C7FF" },
          { author: "Felix", text: "you'll be fine — just come as you are", timestamp: "1h ago", color: "#C5A9FF" },
          { author: "Sofia", text: "see everyone there!", timestamp: "30m ago", color: "#E0C9D9" },
        ]
      : [
          { author: "Hana", text: "needed this today", timestamp: "3h ago", color: "#C5A9FF" },
          { author: "Liam", text: "same. something about knowing other people feel things too", timestamp: "2h ago", color: "#A9C7FF" },
          { author: "Amara", text: "that's exactly it 💫", timestamp: "1h ago", color: "#E0C9D9" },
        ];

  return fallbackMessages.map((msg, index) => ({ id: index + 1, ...msg }));
};

export function LoopChat({ isOpen, onClose, loopName, loopColor, type }: LoopChatProps) {
  const [messages, setMessages] = useState<Message[]>(generateMockMessages(loopName, type));
  const [newMessage, setNewMessage] = useState("");
  const messagesRef = useRef<HTMLDivElement | null>(null);

  const handleSend = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: messages.length + 1,
        author: "You",
        text: newMessage,
        timestamp: "Just now",
        color: loopColor,
        isOwn: true,
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  // auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="h-[85vh] rounded-t-3xl border-0 p-0 overflow-hidden flex flex-col gap-0"
        style={{
          background: "linear-gradient(to bottom, #F6F8FB, #FAFBFD)",
        }}
      >
        {/* Header */}
        <SheetHeader
          className="px-6 pt-6 pb-4 border-b border-[#E0E8F5] sticky top-0 z-10"
          style={{
            background: "linear-gradient(to bottom, #F6F8FBEE, #FAFBFDEE)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${loopColor}40, ${loopColor}20)`,
                boxShadow: `0 0 20px ${loopColor}30`,
              }}
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: loopColor }} />
            </div>
            <div className="flex-1">
              <SheetTitle className="text-[#4A4A6A] text-left">{loopName}</SheetTitle>
              <SheetDescription className="text-sm text-[#8A8AA8] mt-0.5">{type === "community" ? "Community chat" : "Event chat"}</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 min-h-0 px-6 py-4">
          <div ref={messagesRef} className="space-y-4 pb-4">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] ${message.isOwn ? "items-end" : "items-start"} flex flex-col gap-1`}>
                  {!message.isOwn && <span className="text-xs text-[#B8B8CC] px-3">{message.author}</span>}
                  <div
                    className="px-4 py-3 rounded-3xl backdrop-blur-sm"
                    style={{
                      backgroundColor: message.isOwn ? `${loopColor}30` : "rgba(255,255,255,0.8)",
                      border: message.isOwn ? `1px solid ${loopColor}40` : "1px solid #E0E8F5",
                      boxShadow: message.isOwn ? `0 4px 16px ${loopColor}20` : "0 2px 8px rgba(0,0,0,0.04)",
                    }}
                  >
                    <p className="text-[#4A4A6A] leading-relaxed">{message.text}</p>
                  </div>
                  <span className="text-xs text-[#D0D0E0] px-3">{message.timestamp}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div
          className="flex-shrink-0 p-4 border-t border-[#E0E8F5]"
          style={{
            background: "linear-gradient(to top, #F6F8FBEE, #FAFBFDEE)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share what's on your mind..."
                className="pr-12 py-6 rounded-full bg-white/80 border-2 text-[#4A4A6A] placeholder:text-[#B8B8CC] resize-none"
                style={{
                  borderColor: `${loopColor}30`,
                }}
              />
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity"
                onClick={() => setNewMessage((prev) => `${prev} 😊`)}
                aria-label="Add emoji"
              >
                <Smile className="w-5 h-5 text-[#B8B8CC]" />
              </button>
            </div>
            <Button
              onClick={handleSend}
              disabled={!newMessage.trim()}
              className="h-12 w-12 rounded-full p-0 border-0 transition-all duration-300 disabled:opacity-40"
              style={{
                background: newMessage.trim()
                  ? `linear-gradient(135deg, ${loopColor}EE, ${loopColor}AA)`
                  : "linear-gradient(135deg, #E0E0EA, #D0D0E0)",
                boxShadow: newMessage.trim() ? `0 4px 16px ${loopColor}40` : "none",
              }}
            >
              <Send className="w-5 h-5 text-white" />
            </Button>
          </div>

          {/* Gentle reminder */}
          <p className="text-xs text-[#B8B8CC] mt-3 text-center italic">This is a safe space. Be gentle with yourself and others.</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}

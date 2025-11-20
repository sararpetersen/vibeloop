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
    { author: "Ines", text: "just finished this painting and idk... does it even make sense? 🎨", timestamp: "4h ago", color: "#D4A9FF" },
    {
      author: "Malik",
      text: "art doesn't have to make sense, it just has to feel right. what were you vibing with?",
      timestamp: "3h ago",
      color: "#C5A9FF",
    },
    {
      author: "Yara",
      text: "been working on this poem for weeks and it's finally clicking. this space gives me so much energy",
      timestamp: "2h ago",
      color: "#A9C7FF",
    },
    { author: "Jun", text: "yo Yara, would love to hear it at the next open mic if you're down", timestamp: "1h ago", color: "#FFD4A9" },
    { author: "Leila", text: "just here to say this community keeps me sane. you all inspire me daily 💜", timestamp: "45m ago", color: "#E0C9D9" },
  ],
  "Late Night Walks": [
    { author: "Theo", text: "tonight's sky is unreal. anyone else seeing those stars?", timestamp: "3h ago", color: "#A9C7FF" },
    { author: "Aisha", text: "yeah, it's so clear. makes you think about how small we are", timestamp: "2h ago", color: "#C5A9FF" },
    {
      author: "Viktor",
      text: "that's why i love these walks. everything feels big during the day, but at night... perspective shifts",
      timestamp: "1h ago",
      color: "#D4A9FF",
    },
    { author: "Nora", text: "who's coming tomorrow night? thinking we could try the forest route", timestamp: "45m ago", color: "#B8E8E0" },
    { author: "Raj", text: "i'm in! that route is peaceful as hell", timestamp: "30m ago", color: "#E0C9D9" },
  ],
  "Dream Journal Club": [
    {
      author: "Hana",
      text: "had the weirdest dream last night... i was swimming through clouds?? like physically swimming",
      timestamp: "5h ago",
      color: "#C5A9FF",
    },
    {
      author: "Liam",
      text: "duuude that sounds amazing. i had one where i was reading a book but the words kept changing",
      timestamp: "4h ago",
      color: "#A9C7FF",
    },
    {
      author: "Safiya",
      text: "your subconscious is trying to tell you something Hana. swimming = moving through emotions maybe?",
      timestamp: "3h ago",
      color: "#D4A9FF",
    },
    {
      author: "Anders",
      text: "i love how we can talk about this stuff here without people thinking we're weird lol",
      timestamp: "1h ago",
      color: "#FFD4A9",
    },
    { author: "Chiara", text: "dream journaling has changed my life fr. like therapy but free", timestamp: "40m ago", color: "#E0C9D9" },
  ],
  "Book & Coffee Meetups": [
    { author: "Jade", text: "anyone know a good cafe for reading? somewhere quiet with good coffee", timestamp: "4h ago", color: "#E0C9D9" },
    { author: "Dmitri", text: "try that place on jægersborggade! they have silent hours in the afternoon", timestamp: "3h ago", color: "#C5A9FF" },
    {
      author: "Amina",
      text: "been reading this book about slow living and it's hitting different. we need more spaces like this",
      timestamp: "2h ago",
      color: "#D4A9FF",
    },
    { author: "Felix", text: "Amina what's it called? always looking for book recs", timestamp: "1h ago", color: "#A9C7FF" },
    {
      author: "Suki",
      text: "silent reading session next week is gonna be cozy. bringing my favorite herbal tea",
      timestamp: "45m ago",
      color: "#FFD4A9",
    },
  ],
  "Astronomy Club": [
    {
      author: "Tariq",
      text: "watched a documentary about black holes last night and now i can't stop thinking about infinity",
      timestamp: "4h ago",
      color: "#C5A9FF",
    },
    {
      author: "Mira",
      text: "infinity freaks me out in the best way. like we're made of stardust and we'll return to it",
      timestamp: "3h ago",
      color: "#A9C7FF",
    },
    { author: "Oskar", text: "philosophy talk got deep last time. existentialism but make it chill", timestamp: "2h ago", color: "#D4A9FF" },
    {
      author: "Nia",
      text: "that's what i love about this group. we can talk about the cosmos without being pretentious",
      timestamp: "1h ago",
      color: "#E0C9D9",
    },
    {
      author: "Kenji",
      text: "next astronomy night is friday! bringing my telescope if anyone wants to look at saturn",
      timestamp: "30m ago",
      color: "#FFD4A9",
    },
  ],
  "The Support Circle": [
    { author: "Kiera", text: "had a rough day today. just needed to say that somewhere safe", timestamp: "3h ago", color: "#E0C9D9" },
    { author: "Hassan", text: "i see you Kiera. you're allowed to have rough days. we're here for you 💛", timestamp: "2h ago", color: "#C5A9FF" },
    {
      author: "Luna",
      text: "gentle reminder that healing isn't linear. some days are just hard and that's okay",
      timestamp: "1h ago",
      color: "#D4A9FF",
    },
    { author: "Elias", text: "this space has taught me it's okay to feel everything. grateful for you all", timestamp: "45m ago", color: "#A9C7FF" },
    {
      author: "Zainab",
      text: "anyone coming to art therapy tomorrow? been working through some stuff and creating helps",
      timestamp: "25m ago",
      color: "#FFD4A9",
    },
  ],
  "Quiet Tea Night": [
    { author: "Rowan", text: "first time coming tonight! what should i expect?", timestamp: "2h ago", color: "#A9C7FF" },
    {
      author: "Davi",
      text: "it's super chill Rowan! literally just vibing in silence. bring something warm to sit on",
      timestamp: "1h ago",
      color: "#C5A9FF",
    },
    { author: "Iris", text: "these nights are so healing. no pressure to talk or perform. just... exist", timestamp: "45m ago", color: "#E0C9D9" },
    { author: "Mateo", text: "see you all at 8! ☕", timestamp: "30m ago", color: "#D4A9FF" },
  ],
  "Art & Coffee Session": [
    { author: "Tala", text: "so hyped for tomorrow! never painted before but ready to try", timestamp: "3h ago", color: "#D4A9FF" },
    { author: "Noah", text: "Tala that's the spirit! no experience needed, just come with an open mind ✨", timestamp: "2h ago", color: "#C5A9FF" },
    {
      author: "Kaia",
      text: "last session was so fun. painted the worst sunset ever but felt amazing doing it lol",
      timestamp: "1h ago",
      color: "#FFD4A9",
    },
    { author: "Silas", text: "bringing my portable speaker if anyone wants ambient music while we paint", timestamp: "45m ago", color: "#A9C7FF" },
  ],
  "Midnight Walk": [
    { author: "Aria", text: "these midnight walks hit different. ready for friday!", timestamp: "4h ago", color: "#C5A9FF" },
    {
      author: "Javier",
      text: "planning a route through the quiet neighborhoods. maybe stop at that 24h cafe?",
      timestamp: "3h ago",
      color: "#A9C7FF",
    },
    {
      author: "Mei",
      text: "bring your dream journals! last time we had such good convos under the streetlights",
      timestamp: "2h ago",
      color: "#D4A9FF",
    },
    {
      author: "Finn",
      text: "this is my favorite event. something about walking at night makes everything feel magical",
      timestamp: "1h ago",
      color: "#E0C9D9",
    },
  ],
  "Sunrise Movement": [
    { author: "Zara", text: "who else is crazy enough to be up at 6am on a saturday? 🌅", timestamp: "3h ago", color: "#FFD4A9" },
    {
      author: "Akira",
      text: "me!! sunrise movement sessions are worth it every time. the energy is unmatched",
      timestamp: "2h ago",
      color: "#D4A9FF",
    },
    { author: "Layla", text: "bringing extra mats if anyone needs! let's get that morning flow", timestamp: "1h ago", color: "#A9C7FF" },
    { author: "Omar", text: "can't wait! these sessions literally set the tone for my whole week", timestamp: "45m ago", color: "#C5A9FF" },
  ],
  "Journaling Session": [
    {
      author: "Yasmin",
      text: "excited for tomorrow's session. been journaling all week and have so much to process",
      timestamp: "4h ago",
      color: "#E0C9D9",
    },
    { author: "Luca", text: "remember there's no pressure to share! just write what feels right", timestamp: "3h ago", color: "#C5A9FF" },
    {
      author: "Priya",
      text: "these circles have helped me understand myself better. writing is underrated therapy",
      timestamp: "2h ago",
      color: "#D4A9FF",
    },
    { author: "Anton", text: "bringing tea for everyone! let's make it extra cozy", timestamp: "1h ago", color: "#A9C7FF" },
  ],
  "Stargazing Night": [
    { author: "Nisha", text: "checked the weather - clear skies wednesday! perfect for stargazing", timestamp: "5h ago", color: "#C5A9FF" },
    { author: "Diego", text: "bringing my star map app! we can identify constellations together", timestamp: "4h ago", color: "#A9C7FF" },
    { author: "Aaliyah", text: "last time we saw a shooting star and it felt like magic. hoping for more ✨", timestamp: "2h ago", color: "#D4A9FF" },
    { author: "Ren", text: "love how we mix astronomy with storytelling. it's science meets poetry", timestamp: "1h ago", color: "#E0C9D9" },
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
          { author: "Nora", text: "so excited for this! first time joining 🦋", timestamp: "2h ago", color: "#A9C7FF" },
          { author: "Felix", text: "welcome! it's always a good time. bring whatever makes you comfortable", timestamp: "1h ago", color: "#C5A9FF" },
          { author: "Sofia", text: "see you all there! can't wait", timestamp: "30m ago", color: "#E0C9D9" },
        ]
      : [
          { author: "Hana", text: "grateful for this space today", timestamp: "3h ago", color: "#C5A9FF" },
          { author: "Liam", text: "same! you all get me in ways others don't", timestamp: "2h ago", color: "#A9C7FF" },
          { author: "Amara", text: "that's what makes this community special 💫", timestamp: "1h ago", color: "#E0C9D9" },
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
        className="h-[85vh] rounded-t-3xl border-0 p-0 overflow-hidden"
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
        <ScrollArea className="flex-1 h-[calc(85vh-180px)] px-6 py-4">
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
          className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#E0E8F5]"
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

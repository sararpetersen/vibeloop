import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { ChevronLeft, Camera, Trash2, ChevronDown, ChevronUp, Send, Star, Check } from "lucide-react";
import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { MOODS } from "./moods";
import { Badge } from "./ui/badge";

interface ScreenProps {
  onBack: () => void;
  userName: string;
  onProfileSave?: (profile: { name: string; username: string; bio: string; avatarUrl?: string | null }) => void;
}

// Edit Profile Screen
// Edit Profile Screen
export function EditProfile({ onBack, userName, onProfileSave }: ScreenProps) {
  const [name, setName] = useState(userName);
  const [username, setUsername] = useState("@dreamweaver");
  const [bio, setBio] = useState("Living in dreams, expressing in vibes 🌙✨");

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Load saved profile (if any) on open
  useEffect(() => {
    const savedProfile = localStorage.getItem("vibeloop_profile");
    if (savedProfile) {
      try {
        const data = JSON.parse(savedProfile);
        if (data.name) setName(data.name);
        if (data.username) setUsername(data.username);
        if (data.bio) setBio(data.bio);
      } catch {
        // ignore parsing errors
      }
    }

    const savedAvatar = localStorage.getItem("vibeloop_profile_avatar");
    if (savedAvatar) {
      setAvatarUrl(savedAvatar);
    }
  }, [userName]);

  const handleAddPhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatarUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setIsSaving(true);

    // Save profile data
    localStorage.setItem(
      "vibeloop_profile",
      JSON.stringify({
        name,
        username,
        bio,
      })
    );

    // Save avatar if set
    if (avatarUrl) {
      localStorage.setItem("vibeloop_profile_avatar", avatarUrl);
    }

    // Optional: also update onboarding data so the name matches on reload
    const onboarding = localStorage.getItem("vibeloop_onboarded");
    if (onboarding) {
      try {
        const data = JSON.parse(onboarding);
        data.userName = name;
        localStorage.setItem("vibeloop_onboarded", JSON.stringify(data));
      } catch {
        // ignore
      }
    }

    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage("Changes saved ✨");
      setTimeout(() => setSaveMessage(null), 2000);
    }, 400);

    // Notify parent that profile changed
    try {
      onProfileSave?.({ name, username, bio, avatarUrl });
    } catch (e) {
      // ignore
    }
  };

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="h-full overflow-auto pb-24 md:pb-8 bg-gradient-to-b from-[#F6F8FB] via-[#F0E8F5] to-[#E8E4F3]"
    >
      <div className="px-6 pt-8 max-w-3xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-[#8A8AA8] mb-6 hover:text-[#C5A9FF] transition-colors">
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <h2 className="text-[#4A4A6A] mb-1 text-3xl font-boldtext-2xl font-bold">Edit Profile</h2>
        <p className="text-[#8A8AA8] mb-6 text-sm">Update your information</p>

        {/* Profile Picture */}
        <Card className="p-6 mb-6 bg-white/60 backdrop-blur-xl border-2 border-white/40 shadow-xl">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleAddPhotoClick}
              className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg relative group cursor-pointer overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #C5A9FF40, #A9C7FF40)",
                boxShadow: "0 0 20px #C5A9FF30",
              }}
            >
              {avatarUrl ? <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" /> : <span className="text-[#6A6A88]">You</span>}

              <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </button>

            <div className="flex-1">
              <h3 className="text-[#4A4A6A]">Profile Photo</h3>
              <p className="text-[#8A8AA8] text-sm">Click to change</p>
            </div>
          </div>

          {/* Hidden file input */}
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePhotoChange} className="hidden" />
        </Card>

        {/* Form Fields */}
        <Card className="p-6 mb-6 bg-white/60 backdrop-blur-xl border-2 border-white/40 shadow-xl space-y-4">
          <div>
            <label className="text-[#6A6A88] mb-2 block">Display Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-white/80 border-2 border-white/60 focus:border-[#C5A9FF]" />
          </div>

          <div>
            <label className="text-[#6A6A88] mb-2 block">Username</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-white/80 border-2 border-white/60 focus:border-[#C5A9FF]"
            />
          </div>

          <div>
            <label className="text-[#6A6A88] mb-2 block">Bio</label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="bg-white/80 border-2 border-white/60 focus:border-[#C5A9FF] min-h-24"
            />
          </div>
        </Card>

        <Button
          className="w-full py-6 text-white mb-2"
          style={{
            background: "linear-gradient(135deg, #C5A9FF, #A9C7FF)",
            boxShadow: "0 0 20px #C5A9FF50",
          }}
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>

        {saveMessage && <p className="text-center text-xs text-[#8A8AA8] mb-6">{saveMessage}</p>}
      </div>
    </motion.div>
  );
}

// Privacy Settings Screen
export function PrivacySettings({ onBack }: ScreenProps) {
  const [profileVisibility, setProfileVisibility] = useState("public");
  const [showActivity, setShowActivity] = useState(true);
  const [allowMessages, setAllowMessages] = useState(true);

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="h-full overflow-auto pb-24 md:pb-8 bg-gradient-to-b from-[#F6F8FB] via-[#F0E8F5] to-[#E8E4F3]"
    >
      <div className="px-6 pt-8 max-w-3xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-[#8A8AA8] mb-6 hover:text-[#C5A9FF] transition-colors">
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <h2 className="text-[#4A4A6A] mb-1 text-3xl font-boldtext-2xl font-bold">Privacy</h2>
        <p className="text-[#8A8AA8] mb-6 text-sm">Control who sees your vibes</p>

        <Card className="p-6 mb-6 bg-white/60 backdrop-blur-xl border-2 border-white/40 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[#4A4A6A]">Show Activity Status</h3>
              <p className="text-[#8A8AA8] text-sm">Let others see when you're online</p>
            </div>
            <Switch checked={showActivity} onCheckedChange={setShowActivity} className="data-[state=checked]:bg-[#C5A9FF]" />
          </div>

          <Separator className="bg-white/40" />

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[#4A4A6A]">Allow Messages</h3>
              <p className="text-[#8A8AA8] text-sm">Let others send you direct messages</p>
            </div>
            <Switch checked={allowMessages} onCheckedChange={setAllowMessages} className="data-[state=checked]:bg-[#C5A9FF]" />
          </div>
        </Card>

        <h3 className="text-[#6A6A88] mb-3">Profile Visibility</h3>
        <Card className="p-4 mb-6 bg-white/60 backdrop-blur-xl border-2 border-white/40 shadow-xl">
          {["public", "followers", "private"].map((option) => (
            <div key={option}>
              <button
                onClick={() => setProfileVisibility(option)}
                className="w-full p-4 flex items-center justify-between hover:bg-white/30 transition-colors rounded-lg"
              >
                <div className="text-left">
                  <h3 className="text-[#4A4A6A] capitalize">{option}</h3>
                  <p className="text-[#8A8AA8] text-sm">
                    {option === "public" && "Everyone can see your profile"}
                    {option === "followers" && "Only followers can see your profile"}
                    {option === "private" && "Only you can see your profile"}
                  </p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    profileVisibility === option ? "border-[#C5A9FF]" : "border-[#D0D0D8]"
                  }`}
                >
                  {profileVisibility === option && <div className="w-3 h-3 rounded-full bg-[#C5A9FF]" />}
                </div>
              </button>
              {option !== "private" && <Separator className="bg-white/40" />}
            </div>
          ))}
        </Card>
      </div>
    </motion.div>
  );
}

// Blocked Users Screen
export function BlockedUsers({ onBack }: ScreenProps) {
  const [blockedUsers] = useState([
    { id: 1, name: "User One", username: "@userone" },
    { id: 2, name: "User Two", username: "@usertwo" },
  ]);

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="h-full overflow-auto pb-24 md:pb-8 bg-gradient-to-b from-[#F6F8FB] via-[#F0E8F5] to-[#E8E4F3]"
    >
      <div className="px-6 pt-8 max-w-3xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-[#8A8AA8] mb-6 hover:text-[#C5A9FF] transition-colors">
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <h2 className="text-[#4A4A6A] mb-1 text-3xl font-boldtext-2xl font-bold">Blocked Users</h2>
        <p className="text-[#8A8AA8] mb-6 text-sm">
          {blockedUsers.length} user{blockedUsers.length !== 1 && "s"} blocked
        </p>

        {blockedUsers.length === 0 ? (
          <Card className="p-8 bg-white/60 backdrop-blur-xl border-2 border-white/40 shadow-xl text-center">
            <p className="text-[#8A8AA8]">No blocked users</p>
          </Card>
        ) : (
          <Card className="bg-white/60 backdrop-blur-xl border-2 border-white/40 shadow-xl overflow-hidden">
            {blockedUsers.map((user, index) => (
              <div key={user.id}>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-[#4A4A6A]">{user.name}</h3>
                    <p className="text-[#8A8AA8] text-sm">{user.username}</p>
                  </div>
                  <Button variant="outline" className="border-2 border-red-200 text-red-400 hover:bg-red-50">
                    Unblock
                  </Button>
                </div>
                {index < blockedUsers.length - 1 && <Separator className="bg-white/40" />}
              </div>
            ))}
          </Card>
        )}
      </div>
    </motion.div>
  );
}

// Mood Preferences Screen
export function MoodPreferences({ onBack }: ScreenProps) {
  const [favoriteMoods, setFavoriteMoods] = useState(["Dreamy", "Chill", "Creative"]);

  const toggleMood = (moodName: string) => {
    if (favoriteMoods.includes(moodName)) {
      setFavoriteMoods(favoriteMoods.filter((m) => m !== moodName));
    } else {
      setFavoriteMoods([...favoriteMoods, moodName]);
    }
  };

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="h-full overflow-auto pb-24 md:pb-8 bg-gradient-to-b from-[#F6F8FB] via-[#F0E8F5] to-[#E8E4F3]"
    >
      <div className="px-6 pt-8 max-w-3xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-[#8A8AA8] mb-6 hover:text-[#C5A9FF] transition-colors">
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <h2 className="text-[#4A4A6A] mb-1 text-3xl font-boldtext-2xl font-bold">Mood Preferences</h2>
        <p className="text-[#8A8AA8] mb-6 text-sm">Select your favorite moods</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {MOODS.map((mood) => {
            const isSelected = favoriteMoods.includes(mood.name);
            return (
              <motion.button
                key={mood.name}
                onClick={() => toggleMood(mood.name)}
                whileTap={{ scale: 0.95 }}
                className={`p-6 rounded-2xl backdrop-blur-xl border-2 transition-all duration-300 ${
                  isSelected ? "bg-white/80 border-white/60 shadow-xl" : "bg-white/40 border-white/30 shadow-md"
                }`}
                style={{
                  boxShadow: isSelected ? `0 0 30px ${mood.color}30` : undefined,
                }}
              >
                <div className="text-4xl mb-2">{mood.emoji}</div>
                <h3 className="text-[#4A4A6A]">{mood.name}</h3>
              </motion.button>
            );
          })}
        </div>

        <Button
          className="w-full py-6 text-white"
          style={{
            background: "linear-gradient(135deg, #C5A9FF, #A9C7FF)",
            boxShadow: "0 0 20px #C5A9FF50",
          }}
        >
          Save Preferences
        </Button>
      </div>
    </motion.div>
  );
}

// Generic Settings Screen (for other items)
export function GenericSettingsScreen({ onBack, title, description }: { onBack: () => void; title: string; description: string; userName?: string }) {
  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="h-full overflow-auto pb-24 md:pb-8 bg-gradient-to-b from-[#F6F8FB] via-[#F0E8F5] to-[#E8E4F3]"
    >
      <div className="px-6 pt-8 max-w-3xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-[#8A8AA8] mb-6 hover:text-[#C5A9FF] transition-colors">
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <h2 className="text-[#4A4A6A] mb-1 text-3xl font-boldtext-2xl font-bold">{title}</h2>
        <p className="text-[#8A8AA8] mb-6 text-sm">{description}</p>

        <Card className="p-8 bg-white/60 backdrop-blur-xl border-2 border-white/40 shadow-xl text-center">
          <p className="text-[#8A8AA8]">Settings screen coming soon...</p>
        </Card>
      </div>
    </motion.div>
  );
}

// Security Settings Screen
export function SecuritySettings({ onBack }: ScreenProps) {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="h-full overflow-auto pb-24 md:pb-8 bg-gradient-to-b from-[#F6F8FB] via-[#F0E8F5] to-[#E8E4F3]"
    >
      <div className="px-6 pt-8 max-w-3xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-[#8A8AA8] mb-6 hover:text-[#C5A9FF] transition-colors">
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <h2 className="text-[#4A4A6A] mb-1 text-3xl font-boldtext-2xl font-bold">Security</h2>
        <p className="text-[#8A8AA8] mb-6 text-sm">Keep your account safe</p>

        {/* Authentication Settings */}
        <h3 className="text-[#6A6A88] mb-3">Authentication</h3>
        <Card className="p-6 mb-6 bg-white/60 backdrop-blur-xl border-2 border-white/40 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[#4A4A6A]">Two-Factor Authentication</h3>
              <p className="text-[#8A8AA8] text-sm">Extra security for your account</p>
            </div>
            <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} className="data-[state=checked]:bg-[#C5A9FF]" />
          </div>

          <Separator className="bg-white/40" />

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[#4A4A6A]">Biometric Login</h3>
              <p className="text-[#8A8AA8] text-sm">Use fingerprint or face ID</p>
            </div>
            <Switch checked={biometricEnabled} onCheckedChange={setBiometricEnabled} className="data-[state=checked]:bg-[#C5A9FF]" />
          </div>

          <Separator className="bg-white/40" />

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[#4A4A6A]">Login Alerts</h3>
              <p className="text-[#8A8AA8] text-sm">Get notified of new logins</p>
            </div>
            <Switch checked={loginAlerts} onCheckedChange={setLoginAlerts} className="data-[state=checked]:bg-[#C5A9FF]" />
          </div>
        </Card>

        {/* Change Password */}
        <h3 className="text-[#6A6A88] mb-3">Change Password</h3>
        <Card className="p-6 mb-6 bg-white/60 backdrop-blur-xl border-2 border-white/40 shadow-xl space-y-4">
          <div>
            <label className="text-[#6A6A88] mb-2 block">Current Password</label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-white/80 border-2 border-white/60 focus:border-[#C5A9FF]"
            />
          </div>

          <div>
            <label className="text-[#6A6A88] mb-2 block">New Password</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-white/80 border-2 border-white/60 focus:border-[#C5A9FF]"
            />
          </div>

          <div>
            <label className="text-[#6A6A88] mb-2 block">Confirm New Password</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-white/80 border-2 border-white/60 focus:border-[#C5A9FF]"
            />
          </div>

          <Button
            className="w-full py-4 text-white"
            style={{
              background: "linear-gradient(135deg, #C5A9FF, #A9C7FF)",
              boxShadow: "0 0 20px #C5A9FF50",
            }}
          >
            Update Password
          </Button>
        </Card>

        {/* Active Sessions */}
        <h3 className="text-[#6A6A88] mb-3">Active Sessions</h3>
        <Card className="p-6 bg-white/60 backdrop-blur-xl border-2 border-white/40 shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[#4A4A6A]">iPhone 13 (Current)</h3>
                <p className="text-[#8A8AA8] text-sm">Copenhagen, Denmark • Now</p>
              </div>
              <Badge className="bg-[#B4E7CE]/30 text-[#4A4A6A] border-0">Active</Badge>
            </div>
            <Separator className="bg-white/40" />
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[#4A4A6A]">MacBook Pro</h3>
                <p className="text-[#8A8AA8] text-sm">Copenhagen, Denmark • 2 days ago</p>
              </div>
              <Button variant="outline" size="sm" className="border-red-200 text-red-400">
                End
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

// Data & Privacy Screen
export function DataPrivacySettings({ onBack }: ScreenProps) {
  const [dataCollection, setDataCollection] = useState(true);
  const [personalization, setPersonalization] = useState(true);
  const [analytics, setAnalytics] = useState(false);

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="h-full overflow-auto pb-24 md:pb-8 bg-gradient-to-b from-[#F6F8FB] via-[#F0E8F5] to-[#E8E4F3]"
    >
      <div className="px-6 pt-8 max-w-3xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-[#8A8AA8] mb-6 hover:text-[#C5A9FF] transition-colors">
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <h2 className="text-[#4A4A6A] mb-1 text-3xl font-boldtext-2xl font-bold">Data & Privacy</h2>
        <p className="text-[#8A8AA8] mb-6 text-sm">Control how we use your data</p>

        {/* Data Collection */}
        <Card className="p-6 mb-6 bg-white/60 backdrop-blur-xl border-2 border-white/40 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[#4A4A6A]">Data Collection</h3>
              <p className="text-[#8A8AA8] text-sm">Allow us to improve your experience</p>
            </div>
            <Switch checked={dataCollection} onCheckedChange={setDataCollection} className="data-[state=checked]:bg-[#C5A9FF]" />
          </div>

          <Separator className="bg-white/40" />

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[#4A4A6A]">Personalization</h3>
              <p className="text-[#8A8AA8] text-sm">Customize content based on your vibes</p>
            </div>
            <Switch checked={personalization} onCheckedChange={setPersonalization} className="data-[state=checked]:bg-[#C5A9FF]" />
          </div>

          <Separator className="bg-white/40" />

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[#4A4A6A]">Analytics</h3>
              <p className="text-[#8A8AA8] text-sm">Help us understand usage patterns</p>
            </div>
            <Switch checked={analytics} onCheckedChange={setAnalytics} className="data-[state=checked]:bg-[#C5A9FF]" />
          </div>
        </Card>

        {/* Download Your Data */}
        <h3 className="text-[#6A6A88] mb-3">Your Data</h3>
        <Card className="p-6 mb-6 bg-white/60 backdrop-blur-xl border-2 border-white/40 shadow-xl space-y-3">
          <Button variant="outline" className="w-full py-4 border-2 border-[#C5A9FF]/30 text-[#6A6A88] hover:bg-white/60">
            Download Your Data
          </Button>
          <p className="text-[#8A8AA8] text-sm text-center">Get a copy of all your posts, dreams, and activity</p>
        </Card>

        {/* Delete Account */}
        <h3 className="text-[#6A6A88] mb-3">Danger Zone</h3>
        <Card className="p-6 bg-white/60 backdrop-blur-xl border-2 border-red-200 shadow-xl">
          <div className="text-center">
            <h3 className="text-[#4A4A6A] mb-2">Delete Account</h3>
            <p className="text-[#8A8AA8] text-sm mb-4">Permanently remove your account and all data. This action cannot be undone.</p>
            <Button variant="outline" className="border-2 border-red-300 text-red-500 hover:bg-red-50">
              Delete My Account
            </Button>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

// Local Loop Radius Screen
export function LoopRadiusSettings({ onBack }: ScreenProps) {
  const [radius, setRadius] = useState(10);
  const [autoExpand, setAutoExpand] = useState(true);
  const [showDistance, setShowDistance] = useState(true);

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="h-full overflow-auto pb-24 md:pb-8 bg-gradient-to-b from-[#F6F8FB] via-[#F0E8F5] to-[#E8E4F3]"
    >
      <div className="px-6 pt-8 max-w-3xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-[#8A8AA8] mb-6 hover:text-[#C5A9FF] transition-colors">
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <h2 className="text-[#4A4A6A] mb-1 text-3xl font-boldtext-2xl font-bold">Local Loop Radius</h2>
        <p className="text-[#8A8AA8] mb-6 text-sm">Set your discovery range</p>

        {/* Current Radius Display */}
        <Card className="p-8 mb-6 bg-white/60 backdrop-blur-xl border-2 border-white/40 shadow-xl text-center">
          <div
            className="w-32 h-32 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #C5A9FF40, #A9C7FF40)",
              boxShadow: "0 0 40px #C5A9FF30",
            }}
          >
            <div className="text-center">
              <div className="text-[#4A4A6A]">{radius}</div>
              <div className="text-sm text-[#8A8AA8]">km</div>
            </div>
          </div>
          <p className="text-[#8A8AA8]">Your current discovery radius</p>
        </Card>

        {/* Radius Slider */}
        <Card className="p-6 mb-6 bg-white/60 backdrop-blur-xl border-2 border-white/40 shadow-xl">
          <label className="text-[#6A6A88] mb-4 block">Discovery Distance</label>
          <input
            type="range"
            min="1"
            max="50"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-full h-2 bg-white/60 rounded-full appearance-none cursor-pointer"
            style={{
              accentColor: "#C5A9FF",
            }}
          />
          <div className="flex justify-between mt-2 text-sm text-[#8A8AA8]">
            <span>1 km</span>
            <span>50 km</span>
          </div>
        </Card>

        {/* Additional Settings */}
        <Card className="p-6 mb-6 bg-white/60 backdrop-blur-xl border-2 border-white/40 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[#4A4A6A]">Auto-Expand Range</h3>
              <p className="text-[#8A8AA8] text-sm">Expand when few loops are found</p>
            </div>
            <Switch checked={autoExpand} onCheckedChange={setAutoExpand} className="data-[state=checked]:bg-[#C5A9FF]" />
          </div>

          <Separator className="bg-white/40" />

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[#4A4A6A]">Show Distances</h3>
              <p className="text-[#8A8AA8] text-sm">Display how far loops are</p>
            </div>
            <Switch checked={showDistance} onCheckedChange={setShowDistance} className="data-[state=checked]:bg-[#C5A9FF]" />
          </div>
        </Card>

        <Button
          className="w-full py-6 text-white"
          style={{
            background: "linear-gradient(135deg, #C5A9FF, #A9C7FF)",
            boxShadow: "0 0 20px #C5A9FF50",
          }}
        >
          Save Settings
        </Button>
      </div>
    </motion.div>
  );
}

// Help & FAQs Screen
export function HelpFAQs({ onBack }: ScreenProps) {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is VibeLoop?",
      answer:
        "VibeLoop is your digital sanctuary for expressing emotions, moods, and dreams without the pressure of likes or social validation. It's a safe space to be authentic and connect with others through shared feelings.",
    },
    {
      question: "How do moods work?",
      answer:
        "Moods are the heart of VibeLoop. You can tag your posts with how you're feeling, filter your feed by specific moods, and discover communities (Loops) based on emotional vibes. We have 15 different moods to choose from!",
    },
    {
      question: "What is DreamCatcher?",
      answer:
        "DreamCatcher is our unique feature that transforms your thoughts and dreams into glowing orbs. You can write down your feelings, aspirations, or random thoughts, and they become beautiful visual representations in your personal collection.",
    },
    {
      question: "What are Local Loops?",
      answer:
        "Local Loops are mood-based communities and events near you. You can join groups of people who share similar vibes, attend vibe-based events, and connect with others in your area who understand how you're feeling.",
    },
    {
      question: "Is my data private?",
      answer:
        "Yes! Your privacy is our priority. You control who sees your posts through privacy settings, and we never sell your data. You can set your profile to public, followers-only, or completely private.",
    },
    {
      question: "Can I delete my account?",
      answer:
        "Yes, you can delete your account at any time from Settings > Account > Delete Account. This will permanently remove all your data, posts, and dreams from VibeLoop.",
    },
    {
      question: "How do I report inappropriate content?",
      answer:
        'Tap the three dots on any post and select "Report". We take community safety seriously and review all reports within 24 hours. You can also block users who make you uncomfortable.',
    },
    {
      question: "Why can't I see likes on posts?",
      answer:
        "VibeLoop is designed to be a like-free zone. We believe authentic expression shouldn't be measured by popularity metrics. Instead, you can save posts that resonate with you and send private messages to connect.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="h-full overflow-auto pb-24 md:pb-8 bg-gradient-to-b from-[#F6F8FB] via-[#F0E8F5] to-[#E8E4F3]"
    >
      <div className="px-6 pt-8 max-w-3xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-[#8A8AA8] mb-6 hover:text-[#C5A9FF] transition-colors">
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <h2 className="text-[#4A4A6A] mb-1 text-3xl font-boldtext-2xl font-bold">Help & FAQs</h2>
        <p className="text-[#8A8AA8] mb-6 text-sm">Find answers to common questions</p>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <Card key={index} className="bg-white/60 backdrop-blur-xl border-2 border-white/40 shadow-xl overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-white/30 transition-colors"
              >
                <h3 className="text-[#4A4A6A] pr-4">{faq.question}</h3>
                {expandedFAQ === index ? (
                  <ChevronUp className="w-5 h-5 text-[#C5A9FF] flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#8A8AA8] flex-shrink-0" />
                )}
              </button>

              <motion.div
                initial={false}
                animate={{
                  height: expandedFAQ === index ? "auto" : 0,
                  opacity: expandedFAQ === index ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4">
                  <Separator className="bg-white/40 mb-4" />
                  <p className="text-[#6A6A88] leading-relaxed">{faq.answer}</p>
                </div>
              </motion.div>
            </Card>
          ))}
        </div>

        {/* Contact Support */}
        <Card className="mt-6 p-6 bg-white/60 backdrop-blur-xl border-2 border-white/40 shadow-xl text-center">
          <p className="text-[#6A6A88] mb-4">Still need help?</p>
          <Button
            className="w-full py-4 text-white"
            style={{
              background: "linear-gradient(135deg, #C5A9FF, #A9C7FF)",
              boxShadow: "0 0 20px #C5A9FF50",
            }}
          >
            Contact Support
          </Button>
        </Card>
      </div>
    </motion.div>
  );
}

// Send Feedback Screen
export function SendFeedback({ onBack, userName }: ScreenProps) {
  const [feedbackType, setFeedbackType] = useState<"bug" | "feature" | "general">("general");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setTitle("");
      setMessage("");
      setRating(0);
      setFeedbackType("general");
    }, 3000);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 300, opacity: 0 }}
        className="h-full overflow-auto pb-24 md:pb-8 bg-gradient-to-b from-[#F6F8FB] via-[#F0E8F5] to-[#E8E4F3]"
      >
        <div className="px-6 pt-8 h-full flex items-center justify-center max-w-3xl mx-auto">
          <Card className="p-8 bg-white/60 backdrop-blur-xl border-2 border-white/40 shadow-xl text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #C5A9FF, #A9C7FF)",
                boxShadow: "0 0 30px #C5A9FF50",
              }}
            >
              <Check className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-[#4A4A6A] mb-2">Thank you!</h2>
            <p className="text-[#8A8AA8]">Your feedback helps us make VibeLoop better</p>
          </Card>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="h-full overflow-auto pb-24 md:pb-8 bg-gradient-to-b from-[#F6F8FB] via-[#F0E8F5] to-[#E8E4F3]"
    >
      <div className="px-6 pt-8 max-w-3xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-[#8A8AA8] mb-6 hover:text-[#C5A9FF] transition-colors">
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <h2 className="text-[#4A4A6A] mb-1 text-3xl font-boldtext-2xl font-bold">Send Feedback</h2>
        <p className="text-[#8A8AA8] mb-6 text-sm">Help us improve your experience</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <Card className="p-6 bg-white/60 backdrop-blur-xl border-2 border-white/40 shadow-xl">
            <label className="text-[#6A6A88] mb-3 block">How would you rate your experience?</label>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button key={star} type="button" onClick={() => setRating(star)} whileTap={{ scale: 0.9 }} className="transition-all">
                  <Star className="w-10 h-10" fill={star <= rating ? "#FFD4A9" : "transparent"} stroke={star <= rating ? "#FFD4A9" : "#D0D0D8"} />
                </motion.button>
              ))}
            </div>
          </Card>

          {/* Feedback Type */}
          <Card className="p-4 bg-white/60 backdrop-blur-xl border-2 border-white/40 shadow-xl">
            <label className="text-[#6A6A88] mb-3 block">What type of feedback?</label>
            <div className="space-y-2">
              {[
                { value: "bug", label: "Bug Report", emoji: "🐛" },
                { value: "feature", label: "Feature Request", emoji: "💡" },
                { value: "general", label: "General Feedback", emoji: "💬" },
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFeedbackType(type.value as typeof feedbackType)}
                  className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${
                    feedbackType === type.value ? "bg-white/80 shadow-lg" : "bg-white/40 hover:bg-white/60"
                  }`}
                  style={{
                    boxShadow: feedbackType === type.value ? "0 0 20px #C5A9FF30" : undefined,
                  }}
                >
                  <span className="text-2xl">{type.emoji}</span>
                  <span className="text-[#4A4A6A]">{type.label}</span>
                  <div
                    className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      feedbackType === type.value ? "border-[#C5A9FF]" : "border-[#D0D0D8]"
                    }`}
                  >
                    {feedbackType === type.value && <div className="w-3 h-3 rounded-full bg-[#C5A9FF]" />}
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Title */}
          <Card className="p-6 bg-white/60 backdrop-blur-xl border-2 border-white/40 shadow-xl">
            <label className="text-[#6A6A88] mb-3 block">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief summary of your feedback"
              required
              className="bg-white/80 border-2 border-white/60 focus:border-[#C5A9FF]"
            />
          </Card>

          {/* Message */}
          <Card className="p-6 bg-white/60 backdrop-blur-xl border-2 border-white/40 shadow-xl">
            <label className="text-[#6A6A88] mb-3 block">Details</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us more about your experience..."
              required
              className="bg-white/80 border-2 border-white/60 focus:border-[#C5A9FF] min-h-32"
            />
          </Card>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full py-6 text-white flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg, #C5A9FF, #A9C7FF)",
              boxShadow: "0 0 20px #C5A9FF50",
            }}
          >
            <Send className="w-5 h-5" />
            Send Feedback
          </Button>
        </form>
      </div>
    </motion.div>
  );
}

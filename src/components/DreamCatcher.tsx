import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sparkles, Image as ImageIcon, X, Heart, Plus } from 'lucide-react';
import { MOODS, getMoodColor, getMoodEmoji } from './moods';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Card } from './ui/card';

interface DreamCatcherProps {
  userName: string;
  onSaveDream?: (dream: {
    mood: string;
    moodColor: string;
    text: string;
    image?: string;
  }) => void;
}

export function DreamCatcher({ userName, onSaveDream }: DreamCatcherProps) {
  const [thought, setThought] = useState('');
  const [selectedMood, setSelectedMood] = useState('Calm');
  const [showOrb, setShowOrb] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = () => {
    if (thought.trim()) {
      setShowOrb(true);
      setIsSaved(false);
    }
  };

  const handleSaveDream = () => {
    if (onSaveDream && thought.trim()) {
      onSaveDream({
        mood: selectedMood,
        moodColor: getMoodColor(selectedMood),
        text: thought,
        image: uploadedImage || undefined,
      });
      setIsSaved(true);
      
      // Reset after showing success
      setTimeout(() => {
        setShowOrb(false);
        setThought('');
        setUploadedImage(null);
        setIsSaved(false);
      }, 2000);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const currentMoodColor = getMoodColor(selectedMood);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="h-full overflow-auto pb-24 md:pb-8 px-6"
    >
      <div className="pt-8 max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="mb-2 text-[#4A4A6A] text-xl md:text-3xl font-bold">DreamCatcher</h2>
          <p className="text-sm text-[#8A8AA8]">Transform your thoughts into glowing moments</p>
        </div>

        {/* Prominent "Create New Dream" Card */}
        {!showOrb && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Card
              className="p-6 rounded-3xl border-2 cursor-pointer hover:scale-[1.02] transition-all duration-300"
              style={{
                borderColor: '#C5A9FF60',
                background: 'linear-gradient(135deg, rgba(197, 169, 255, 0.15), rgba(169, 199, 255, 0.15))',
              }}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #C5A9FF, #A9C7FF)',
                    boxShadow: '0 0 20px rgba(197, 169, 255, 0.4)',
                  }}
                >
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-[#4A4A6A] mb-1">Create New Dream</h3>
                  <p className="text-xs text-[#8A8AA8]">Capture a thought, feeling, or moment</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Mood Selection */}
        <div className="mb-6">
          <label className="block mb-3 text-[#6A6A88]">Choose your vibe</label>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((mood) => (
              <Badge
                key={mood.name}
                onClick={() => setSelectedMood(mood.name)}
                className={`cursor-pointer px-4 py-2 rounded-full transition-all duration-300 border-2 ${
                  selectedMood === mood.name
                    ? 'border-opacity-100 shadow-lg scale-105'
                    : 'border-opacity-0 bg-white/60'
                }`}
                style={{
                  backgroundColor: selectedMood === mood.name ? mood.color + '40' : 'rgba(255,255,255,0.6)',
                  borderColor: mood.color,
                  color: '#4A4A6A',
                }}
              >
                <span className="mr-1">{mood.emoji}</span>
                {mood.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Text Input */}
        <div className="mb-6">
          <Textarea
            placeholder="Let your thoughts drift..."
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            className="min-h-[200px] rounded-3xl border-2 resize-none bg-white/80 backdrop-blur-sm text-[#4A4A6A] placeholder:text-[#B8B8CC] focus:border-opacity-100 transition-all duration-300"
            style={{
              borderColor: currentMoodColor + '40',
            }}
          />
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          
          {!uploadedImage ? (
            <label htmlFor="image-upload">
              <div
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-full border-2 border-dashed cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                style={{
                  borderColor: currentMoodColor + '40',
                  backgroundColor: currentMoodColor + '10',
                  color: '#6A6A88',
                }}
              >
                <ImageIcon className="w-5 h-5" />
                <span>Add an image to your thought</span>
              </div>
            </label>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-3xl overflow-hidden border-2"
              style={{
                borderColor: currentMoodColor + '40',
              }}
            >
              <ImageWithFallback
                src={uploadedImage}
                alt="Uploaded thought"
                className="w-full h-48 object-cover"
              />
              <button
                onClick={removeImage}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#4A4A6A]/80 backdrop-blur-sm flex items-center justify-center hover:bg-[#4A4A6A] transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </motion.div>
          )}
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={!thought.trim() || showOrb}
          className="w-full rounded-full py-6 relative overflow-hidden transition-all duration-300 border-0"
          style={{
            background: `linear-gradient(135deg, ${currentMoodColor}DD, ${currentMoodColor}99)`,
            boxShadow: `0 8px 24px ${currentMoodColor}40`,
            color: '#FFFFFF',
          }}
        >
          <motion.div
            className="flex items-center justify-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-5 h-5" />
            <span>Generate Dream Orb</span>
          </motion.div>
        </Button>

        {/* Dream Orb Result */}
        <AnimatePresence>
          {showOrb && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="mt-12 text-center"
            >
              <p className="text-[#8A8AA8] mb-6">Your dream orb has been created</p>
              
              <div className="relative inline-flex items-center justify-center">
                {/* Outer glow */}
                <motion.div
                  className="absolute w-48 h-48 rounded-full opacity-30 blur-2xl"
                  style={{ backgroundColor: currentMoodColor }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                
                {/* Main orb */}
                <motion.div
                  className="relative w-32 h-32 rounded-full"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${currentMoodColor}FF, ${currentMoodColor}88, ${currentMoodColor}44)`,
                    boxShadow: `0 0 60px ${currentMoodColor}80, inset 0 0 30px ${currentMoodColor}40`,
                  }}
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  {/* Inner highlights */}
                  <div
                    className="absolute top-4 left-4 w-8 h-8 rounded-full opacity-60 blur-md"
                    style={{ backgroundColor: '#FFFFFF' }}
                  />
                  <div
                    className="absolute bottom-6 right-6 w-6 h-6 rounded-full opacity-40 blur-sm"
                    style={{ backgroundColor: '#FFFFFF' }}
                  />
                </motion.div>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-[#6A6A88] px-6 leading-relaxed"
              >
                {thought}
              </motion.p>

              {/* Display uploaded image if present */}
              {uploadedImage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="mt-6 px-6"
                >
                  <div 
                    className="rounded-3xl overflow-hidden border-2"
                    style={{
                      borderColor: currentMoodColor + '40',
                      boxShadow: `0 8px 24px ${currentMoodColor}30`,
                    }}
                  >
                    <ImageWithFallback
                      src={uploadedImage}
                      alt="Dream image"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                </motion.div>
              )}

              {/* Save Button */}
              <Button
                onClick={handleSaveDream}
                disabled={isSaved}
                className="w-full rounded-full py-6 relative overflow-hidden transition-all duration-300 border-0 mt-6"
                style={{
                  background: `linear-gradient(135deg, ${currentMoodColor}DD, ${currentMoodColor}99)`,
                  boxShadow: `0 8px 24px ${currentMoodColor}40`,
                  color: '#FFFFFF',
                }}
              >
                <motion.div
                  className="flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart className="w-5 h-5" />
                  <span>{isSaved ? 'Saved!' : 'Save Dream'}</span>
                </motion.div>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
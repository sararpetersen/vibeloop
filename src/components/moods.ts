// Centralized mood configuration
export const MOODS = [
  { name: 'Calm', color: '#A9C7FF', emoji: '🌊', description: 'Soft and centered' },
  { name: 'Dreamy', color: '#C5A9FF', emoji: '✨', description: 'Lost in thought and wonder' },
  { name: 'Reflective', color: '#E0C9D9', emoji: '🌙', description: 'Looking inward quietly' },
  { name: 'Hopeful', color: '#FFD4A9', emoji: '🌅', description: 'Bright and optimistic' },
  { name: 'Melancholy', color: '#B8C5D9', emoji: '🌧️', description: 'Gentle sadness' },
  { name: 'Joyful', color: '#FFE5A9', emoji: '☀️', description: 'Light and happy' },
  { name: 'Creative', color: '#D4A9FF', emoji: '🎨', description: 'Inspired and flowing' },
  { name: 'Energetic', color: '#FFB8A9', emoji: '⚡', description: 'Alive and buzzing' },
  { name: 'Peaceful', color: '#A9FFD4', emoji: '🍃', description: 'Serene and still' },
  { name: 'Anxious', color: '#D9C5B8', emoji: '🌪️', description: 'Restless and uneasy' },
  { name: 'Sad', color: '#A9B8D9', emoji: '💧', description: 'Heavy and quiet' },
  { name: 'Angry', color: '#FFA9A9', emoji: '🔥', description: 'Burning and frustrated' },
  { name: 'Social', color: '#FFC5FF', emoji: '💫', description: 'Connected and open' },
  { name: 'Introspective', color: '#C9D9E0', emoji: '🔮', description: 'Deep in self-reflection' },
  { name: 'Excited', color: '#FFCCA9', emoji: '🎆', description: 'Bursting with anticipation' },
];

// Export moods with more accessible structure
export const moods = MOODS.map(m => ({
  id: m.name.toLowerCase(),
  label: m.name,
  color: m.color,
  emoji: m.emoji,
  description: m.description,
}));

export const getMoodColor = (moodName: string): string => {
  return MOODS.find(m => m.name === moodName)?.color || '#A9C7FF';
};

export const getMoodEmoji = (moodName: string): string => {
  return MOODS.find(m => m.name === moodName)?.emoji || '✨';
};

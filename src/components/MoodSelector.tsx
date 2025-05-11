
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Smile, Meh, Frown, Sun, AlertTriangle, HelpCircle } from "lucide-react";

type Mood = "extremely-happy" | "happy" | "calm" | "neutral" | "sad" | "very-sad" | "confused" | "overwhelmed";

interface MoodSelectorProps {
  selectedMood: Mood | null;
  onMoodSelect: (mood: Mood) => void;
}

interface MoodOption {
  value: Mood;
  label: string;
  icon: React.ReactNode;
  emoji: string;
  className: string;
}

export default function MoodSelector({ selectedMood, onMoodSelect }: MoodSelectorProps) {
  const moods: MoodOption[] = [
    { value: "extremely-happy", label: "Extremely Happy", icon: <Smile className="h-5 w-5" />, emoji: "😄", className: "mood-extremely-happy" },
    { value: "happy", label: "Happy", icon: <Smile className="h-5 w-5" />, emoji: "😊", className: "mood-happy" },
    { value: "calm", label: "Calm", icon: <Sun className="h-5 w-5" />, emoji: "😌", className: "mood-calm" },
    { value: "neutral", label: "Neutral", icon: <Meh className="h-5 w-5" />, emoji: "😐", className: "mood-neutral" },
    { value: "sad", label: "Sad", icon: <Frown className="h-5 w-5" />, emoji: "😔", className: "mood-sad" },
    { value: "very-sad", label: "Very Sad", icon: <Frown className="h-5 w-5" />, emoji: "😢", className: "mood-very-sad" },
    { value: "confused", label: "Confused", icon: <HelpCircle className="h-5 w-5" />, emoji: "😕", className: "mood-confused" },
    { value: "overwhelmed", label: "Overwhelmed", icon: <AlertTriangle className="h-5 w-5" />, emoji: "😰", className: "mood-overwhelmed" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      <div className="text-sm font-medium mb-1 w-full">How are you feeling?</div>
      <div className="flex gap-2 flex-wrap">
        {moods.map((mood) => (
          <Button
            key={mood.value}
            type="button"
            variant={selectedMood === mood.value ? "default" : "outline"}
            className={`flex items-center gap-2 transition-all ${
              selectedMood === mood.value ? mood.className : ""
            }`}
            onClick={() => onMoodSelect(mood.value)}
          >
            <span>{mood.emoji}</span>
            <span>{mood.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}

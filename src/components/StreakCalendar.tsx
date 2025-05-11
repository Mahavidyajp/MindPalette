
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useState, useMemo } from "react";
import { differenceInDays, isSameDay, format } from "date-fns";
import { Badge } from "./ui/badge";
import { Flame, Trophy } from "lucide-react";

interface StreakCalendarProps {
  entryDates: Date[];
}

export default function StreakCalendar({ entryDates }: StreakCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Create a copy of the entry dates to use for highlighting
  const highlightedDays = entryDates.map(date => new Date(date));
  
  // Calculate current and longest streaks
  const { currentStreak, longestStreak, lastEntryDate } = useMemo(() => {
    if (!entryDates.length) return { currentStreak: 0, longestStreak: 0, lastEntryDate: null };
    
    // Sort dates in descending order (newest first)
    const sortedDates = [...entryDates].sort((a, b) => b.getTime() - a.getTime());
    
    // Check if the user journaled today
    const today = new Date();
    const journaledToday = sortedDates.some(date => 
      isSameDay(date, today)
    );
    
    // Calculate current streak
    let streak = journaledToday ? 1 : 0;
    let maxStreak = streak;
    let prevDate = journaledToday ? today : sortedDates[0];
    
    for (let i = journaledToday ? 0 : 1; i < sortedDates.length; i++) {
      const currentDate = sortedDates[i];
      const dayDiff = Math.abs(differenceInDays(prevDate, currentDate));
      
      // If consecutive day (1 day difference)
      if (dayDiff === 1) {
        streak++;
        maxStreak = Math.max(maxStreak, streak);
      } 
      // If same day (multiple entries in a day)
      else if (dayDiff === 0) {
        // Skip duplicate dates
        continue;
      } 
      // If streak is broken
      else {
        // If we're checking current streak, break the loop
        if ((journaledToday && i === 0) || (!journaledToday && i === 1)) {
          break;
        }
        streak = 1;
      }
      
      prevDate = currentDate;
    }
    
    return { 
      currentStreak: streak, 
      longestStreak: maxStreak,
      lastEntryDate: sortedDates[0]
    };
  }, [entryDates]);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Journal Streak</span>
          <span className="text-2xl">📝</span>
        </CardTitle>
        <CardDescription className="flex items-center justify-between">
          <span>Your journaling consistency</span>
          <div className="flex gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Flame className="h-4 w-4 text-orange-500" />
              <span>Current: {currentStreak}</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span>Longest: {longestStreak}</span>
            </Badge>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="border rounded-md p-3"
          modifiers={{
            highlighted: highlightedDays,
          }}
          modifiersStyles={{
            highlighted: {
              backgroundColor: "#9b87f5", // Modern purple color
              color: "white",
              fontWeight: "bold",
              borderRadius: "100%",
            },
          }}
        />
        {lastEntryDate && (
          <div className="mt-3 text-sm text-muted-foreground text-center">
            Last entry: {format(lastEntryDate, "MMMM d, yyyy")}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

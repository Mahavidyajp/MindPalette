
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

interface StreakCalendarProps {
  entryDates: Date[];
  currentStreak: number;
  longestStreak: number;
}

export default function StreakCalendar({ 
  entryDates, 
  currentStreak, 
  longestStreak 
}: StreakCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Create a copy of the entry dates to use for highlighting
  const highlightedDays = entryDates.map(date => new Date(date));

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Journal Streak</CardTitle>
        <CardDescription>Your journaling consistency</CardDescription>
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
      </CardContent>
    </Card>
  );
}

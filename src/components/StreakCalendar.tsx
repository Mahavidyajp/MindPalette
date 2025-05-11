
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col justify-center space-y-4">
            <div className="text-center p-4 border rounded-lg bg-muted/30">
              <div className="text-muted-foreground text-sm mb-1">Current Streak</div>
              <div className="text-3xl font-bold text-primary">{currentStreak} days</div>
            </div>
            <div className="text-center p-4 border rounded-lg bg-muted/30">
              <div className="text-muted-foreground text-sm mb-1">Longest Streak</div>
              <div className="text-3xl font-bold text-primary">{longestStreak} days</div>
            </div>
          </div>
          <div>
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
                  backgroundColor: "hsl(var(--primary) / 0.2)",
                  color: "hsl(var(--primary))",
                  fontWeight: "bold",
                },
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

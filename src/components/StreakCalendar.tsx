
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
}

export default function StreakCalendar({ entryDates }: StreakCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Create a copy of the entry dates to use for highlighting
  const highlightedDays = entryDates.map(date => new Date(date));

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Journal Streak</span>
          <span className="text-2xl">📝</span>
        </CardTitle>
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

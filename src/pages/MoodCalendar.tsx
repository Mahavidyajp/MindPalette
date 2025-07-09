import React, { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const journalEntries = {
  "2025-05-01": { mood: "😊" },
  "2025-05-02": { mood: "😀" },
  "2025-05-04": { mood: "😐" },
  "2025-05-05": { mood: "😢" },
  "2025-05-07": { mood: "😊" },
  "2025-05-08": { mood: "😀" },
  "2025-05-09": { mood: "😀" },
  "2025-05-10": { mood: "😐" },
  "2025-05-11": { mood: "😊" },
  "2025-05-15": { mood: "😵" },
  "2025-05-17": { mood: "😀" },
  "2025-05-18": { mood: "😩" },
  "2025-05-20": { mood: "😐" },
  "2025-05-22": { mood: "😕" },
  "2025-05-24": { mood: "😀" },
  "2025-05-26": { mood: "😊" },
  "2025-05-28": { mood: "😐" },
  "2025-05-30": { mood: "😀" },
};

const MoodCalendar = ({ collections = [], handleLogout }: any) => {
  const navigate = useNavigate();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
    } else {
      setIsLoggedIn(true);
    }
  }, [navigate]);

  const prevMonth = () => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() - 1);
      return newMonth;
    });
  };

  const nextMonth = () => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + 1);
      return newMonth;
    });
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = monthStart.getDay();
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getBackgroundColor = (mood: string) => {
    switch (mood) {
      case "😊":
        return "bg-journal-soft-green/60";
      case "😀":
        return "bg-journal-light-purple/60";
      case "😐":
        return "bg-journal-soft-yellow/60";
      case "😢":
        return "bg-journal-soft-blue/60";
      case "😩":
        return "bg-journal-soft-pink/60";
      case "😕":
        return "bg-gray-200/60";
      case "😵":
        return "bg-journal-soft-orange/60";
      default:
        return "";
    }
  };

  const filteredCollections = collections.filter((collection) =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isLoggedIn) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar 
          onLogout={handleLogout} 
          collections={collections} 
          onNewEntry={() => {/* Handle new entry */}}
        />
      <div className="space-y-6 px-2 sm:px-4 md:px-6 w-full mt-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Mood Calendar</h1>
          <p className="text-muted-foreground">Visualize your mood patterns throughout the month.</p>
        </div>

        <Card className="journal-shadow">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
            <div>
              <CardTitle>{format(currentMonth, "MMMM yyyy")}</CardTitle>
              <CardDescription>Your monthly mood tracking</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={prevMonth} className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setCurrentMonth(today)} className="h-8 w-35">
                <span className="text-xs">Today</span>
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth} className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 sm:gap-1 gap-[2px]">
              {weekdays.map((day) => (
                <div key={day} className="text-center text-[10px] sm:text-xs font-medium p-1 sm:p-2 text-muted-foreground">
                  {day}
                </div>
              ))}
              {Array.from({ length: startDay }, (_, i) => (
                <div key={`empty-${i}`} className="p-1 sm:p-2 h-16 sm:h-24"></div>
              ))}
              {days.map((day) => {
                const dateStr = format(day, "yyyy-MM-dd");
                const entry = journalEntries[dateStr];
                const isToday = isSameDay(day, today);

                return (
                  <div
                    key={dateStr}
                    className={cn(
                      "border rounded-md p-1 sm:p-2 min-h-[64px] sm:min-h-[96px] transition-all",
                      isToday ? "border-accent" : "border-border",
                      entry ? getBackgroundColor(entry.mood) : "",
                      !isSameMonth(day, currentMonth) && "opacity-50"
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <span
                        className={cn(
                          "text-sm font-medium h-6 w-6 flex items-center justify-center",
                          isToday && "bg-accent text-accent-foreground rounded-full"
                        )}
                      >
                        {format(day, "d")}
                      </span>
                      {entry && <span className="text-xl">{entry.mood}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="journal-shadow">
          <CardHeader>
            <CardTitle className="text-base">Mood Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-4">
              {["😊 Extremely Happy", "😀 Happy", "😐 Neutral", "😢 Sad", "😩 Very Sad", "😕 Confused", "😵 Overwhelmed"].map((label, i) => {
                const mood = label.split(" ")[0];
                return (
                  <div className="flex items-center gap-2" key={i}>
                    <div className={`w-4 h-4 rounded-full ${getBackgroundColor(mood)}`} />
                    <span className="text-sm">{label}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </SidebarProvider>
  );
};

export default MoodCalendar;

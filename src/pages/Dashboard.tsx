
import { useState, useEffect } from "react";
import JournalEntry, { JournalEntryProps } from "@/components/JournalEntry";
import MoodChart from "@/components/MoodChart";
import StreakCalendar from "@/components/StreakCalendar";
import { Button } from "@/components/ui/button";
import JournalEditor from "@/components/JournalEditor";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { useNavigate } from "react-router-dom";

// Sample mock data for our collections
const sampleCollections = [
  { id: "1", name: "Personal" },
  { id: "2", name: "Work" },
  { id: "3", name: "Health" },
  { id: "4", name: "Goals" },
];

// Sample mock data for mood chart
const sampleMoodData = [
  { date: "2023-05-01", value: 3, mood: "happy" },
  { date: "2023-05-02", value: 3, mood: "happy" },
  { date: "2023-05-03", value: 2, mood: "calm" },
  { date: "2023-05-04", value: 1, mood: "neutral" },
  { date: "2023-05-05", value: 0, mood: "sad" },
  { date: "2023-05-06", value: 1, mood: "neutral" },
  { date: "2023-05-07", value: 2, mood: "calm" },
  { date: "2023-05-08", value: 3, mood: "happy" },
  { date: "2023-05-09", value: 2, mood: "calm" },
  { date: "2023-05-10", value: 3, mood: "happy" },
  { date: "2023-05-11", value: 2, mood: "calm" },
  { date: "2023-05-12", value: 2, mood: "calm" },
  { date: "2023-05-13", value: 1, mood: "neutral" },
  { date: "2023-05-14", value: 0, mood: "sad" },
];

// Sample entry dates for streak calendar
const sampleEntryDates = [
  new Date(2023, 4, 1),
  new Date(2023, 4, 2),
  new Date(2023, 4, 3),
  new Date(2023, 4, 4),
  new Date(2023, 4, 5),
  new Date(2023, 4, 7),
  new Date(2023, 4, 8),
  new Date(2023, 4, 9),
  new Date(2023, 4, 10),
  new Date(2023, 4, 11),
  new Date(2023, 4, 14),
];

// Sample recent entries
const sampleRecentEntries: JournalEntryProps[] = [
  {
    id: "1",
    title: "Morning Reflections",
    content:
      "Today I woke up feeling energized and ready to tackle the day. I spent some time meditating and planning my priorities.",
    mood: "happy",
    collections: ["1", "4"],
    createdAt: new Date(2023, 4, 14),
  },
  {
    id: "2",
    title: "Work Challenges",
    content:
      "Had a difficult meeting today. Feeling a bit overwhelmed with the new project deadlines, but I'm trying to stay positive.",
    mood: "neutral",
    collections: ["2"],
    createdAt: new Date(2023, 4, 13),
  },
  {
    id: "3",
    title: "Evening Walk",
    content:
      "Took a long walk by the river this evening. The fresh air and exercise helped clear my mind and improve my mood.",
    mood: "calm",
    collections: ["3"],
    createdAt: new Date(2023, 4, 11),
    isDraft: true,
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [entries, setEntries] = useState<JournalEntryProps[]>(sampleRecentEntries);

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
    } else {
      setIsLoggedIn(true);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleNewEntry = () => {
    setIsEditorOpen(true);
  };

  const handleSaveEntry = (entry: Omit<JournalEntryProps, "id">) => {
    const newEntry: JournalEntryProps = {
      id: Math.random().toString(36).substring(2, 9), // Generate a random ID
      ...entry,
    };
    setEntries([newEntry, ...entries]);
    setIsEditorOpen(false);
  };

  const getCollectionById = (id: string) => {
    return sampleCollections.find(col => col.id === id)?.name || "Unknown";
  };

  // Convert collection IDs to names for display
  const entriesToDisplay = entries.map(entry => ({
    ...entry,
    collections: entry.collections.map(id => getCollectionById(id)),
  }));

  if (!isLoggedIn) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar 
          onLogout={handleLogout} 
          collections={sampleCollections} 
          onNewEntry={handleNewEntry}
        />
        
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          <header className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome to your personal reflection space
              </p>
            </div>
            <div className="flex items-center gap-2">
              <SidebarTrigger className="md:hidden" />
              <Button onClick={handleNewEntry}>New Entry</Button>
            </div>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <MoodChart data={sampleMoodData} />
            <StreakCalendar
              entryDates={sampleEntryDates}
              currentStreak={5}
              longestStreak={7}
            />
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Recent Entries</h2>
              <Button variant="outline" size="sm" onClick={() => navigate("/entries")}>
                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {entriesToDisplay.map((entry) => (
                <JournalEntry key={entry.id} {...entry} />
              ))}
            </div>
          </section>

          <JournalEditor
            isOpen={isEditorOpen}
            onClose={() => setIsEditorOpen(false)}
            onSave={handleSaveEntry}
            collections={sampleCollections}
          />
        </div>
      </div>
    </SidebarProvider>
  );
}

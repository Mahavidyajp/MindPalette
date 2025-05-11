import { useState, useEffect } from "react";
import JournalEntry, { JournalEntryProps } from "@/components/JournalEntry";
import MoodChart from "@/components/MoodChart";
import StreakCalendar from "@/components/StreakCalendar";
import { Button } from "@/components/ui/button";
import JournalEditor from "@/components/JournalEditor";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { useNavigate } from "react-router-dom";
import ThemeSelector from "@/components/ThemeSelector";
import { FadeIn } from "@/components/animations/FadeIn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Sample mock data for our collections
const sampleCollections = [
  { id: "1", name: "Personal" },
  { id: "2", name: "Work" },
  { id: "3", name: "Health" },
  { id: "4", name: "Goals" },
];

// Sample mock data for mood chart
const sampleMoodData = [
  { date: "2023-05-01", value: 5, mood: "happy" },
  { date: "2023-05-02", value: 5, mood: "happy" },
  { date: "2023-05-03", value: 4, mood: "neutral" },
  { date: "2023-05-04", value: 4, mood: "neutral" },
  { date: "2023-05-05", value: 3, mood: "sad" },
  { date: "2023-05-06", value: 4, mood: "neutral" },
  { date: "2023-05-07", value: 6, mood: "extremely-happy" },
  { date: "2023-05-08", value: 5, mood: "happy" },
  { date: "2023-05-09", value: 2, mood: "very-sad" },
  { date: "2023-05-10", value: 5, mood: "happy" },
  { date: "2023-05-11", value: 1, mood: "confused" },
  { date: "2023-05-12", value: 0, mood: "overwhelmed" },
  { date: "2023-05-13", value: 4, mood: "neutral" },
  { date: "2023-05-14", value: 3, mood: "sad" },
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
    mood: "neutral",
    collections: ["3"],
    createdAt: new Date(2023, 4, 11),
    isDraft: true,
  },
];

// Calculate mood distribution data
const calculateMoodDistribution = (entries: JournalEntryProps[]) => {
  const distribution = {
    "extremely-happy": 0,
    "happy": 0,
    "neutral": 0,
    "sad": 0,
    "very-sad": 0,
    "confused": 0,
    "overwhelmed": 0
  };
  
  entries.forEach(entry => {
    if (distribution[entry.mood]) {
      distribution[entry.mood]++;
    }
  });
  
  return Object.entries(distribution).map(([mood, count]) => ({
    name: mood,
    value: count
  }));
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [entries, setEntries] = useState<JournalEntryProps[]>(sampleRecentEntries);
  const [moodDistribution] = useState(calculateMoodDistribution([...sampleRecentEntries, ...sampleRecentEntries]));

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
              <ThemeSelector />
              <SidebarTrigger className="md:hidden" />
              <Button onClick={handleNewEntry}>New Entry</Button>
            </div>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <MoodChart data={sampleMoodData} />
            <StreakCalendar
              entryDates={sampleEntryDates}
            />
          </section>
          
          <FadeIn delay={0.2}>
            <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Mood Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {moodDistribution.map((item) => (
                      <div key={item.name} className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mood-${item.name} mr-2`}></div>
                        <span className="capitalize text-sm">{item.name}</span>
                        <div className="ml-auto font-medium">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Collections</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {sampleCollections.map((collection) => (
                      <div key={collection.id} className="flex items-center">
                        <span className="text-sm">{collection.name}</span>
                        <div className="ml-auto">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigate("/collections")}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold">{entries.length}</span>
                          <span className="text-2xl">📝</span>
                        </div>
                        <div className="text-xs text-muted-foreground">Total Entries</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold">5</span>
                          <span className="text-2xl">🔥</span>
                        </div>
                        <div className="text-xs text-muted-foreground">Current Streak</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold">7</span>
                          <span className="text-2xl">🏆</span>
                        </div>
                        <div className="text-xs text-muted-foreground">Longest Streak</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold">3</span>
                          <span className="text-2xl">📅</span>
                        </div>
                        <div className="text-xs text-muted-foreground">This Week</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </FadeIn>

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

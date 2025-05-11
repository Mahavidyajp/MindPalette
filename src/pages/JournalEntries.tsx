import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import JournalEntry, { JournalEntryProps } from "@/components/JournalEntry";
import JournalEditor from "@/components/JournalEditor";
import CollectionsFilter from "@/components/CollectionsFilter";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

// Sample mock data for our collections
const sampleCollections = [
  { id: "1", name: "Personal", entryCount: 5 },
  { id: "2", name: "Work", entryCount: 3 },
  { id: "3", name: "Health", entryCount: 2 },
  { id: "4", name: "Goals", entryCount: 4 },
];

// Sample journal entries
const sampleEntries: JournalEntryProps[] = [
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
  {
    id: "4",
    title: "Feeling Down Today",
    content:
      "Not feeling my best today. Slept poorly and have been in a funk all day. Hope tomorrow is better.",
    mood: "sad",
    collections: ["3"],
    createdAt: new Date(2023, 4, 10),
  },
  {
    id: "5",
    title: "Weekend Plans",
    content:
      "Excited about the weekend! Making plans to go hiking and catch up with friends.",
    mood: "happy",
    collections: ["1"],
    createdAt: new Date(2023, 4, 9),
  },
  {
    id: "6",
    title: "Project Milestone Reached",
    content:
      "Finally completed the major milestone for our project. The team worked really well together.",
    mood: "happy",
    collections: ["2", "4"],
    createdAt: new Date(2023, 4, 8),
  },
];

export default function JournalEntries() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [entries, setEntries] = useState<JournalEntryProps[]>(sampleEntries);
  const [filteredEntries, setFilteredEntries] = useState<JournalEntryProps[]>(sampleEntries);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
    } else {
      setIsLoggedIn(true);
    }
  }, [navigate]);

  // Filter entries when filters change
  useEffect(() => {
    let filtered = entries;
    
    // Filter by collection
    if (selectedCollections.length > 0) {
      filtered = filtered.filter(entry => 
        entry.collections.some(collection => selectedCollections.includes(collection))
      );
    }
    
    // Filter by mood
    if (selectedMood) {
      filtered = filtered.filter(entry => entry.mood === selectedMood);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        entry =>
          entry.title.toLowerCase().includes(query) ||
          entry.content.toLowerCase().includes(query)
      );
    }
    
    setFilteredEntries(filtered);
  }, [entries, selectedCollections, selectedMood, searchQuery]);

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
  };

  const handleCollectionSelect = (collectionId: string) => {
    setSelectedCollections(prev => {
      if (prev.includes(collectionId)) {
        return prev.filter(id => id !== collectionId);
      } else {
        return [...prev, collectionId];
      }
    });
  };

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(prev => prev === mood ? null : mood);
  };

  // Group entries by date for display
  const getGroupedEntries = () => {
    const groups: Record<string, JournalEntryProps[]> = {};
    
    filteredEntries.forEach(entry => {
      const dateKey = format(new Date(entry.createdAt), "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(entry);
    });
    
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  };

  const getCollectionById = (id: string) => {
    return sampleCollections.find(col => col.id === id)?.name || "Unknown";
  };

  // Convert collection IDs to names for display
  const transformEntry = (entry: JournalEntryProps) => ({
    ...entry,
    collections: entry.collections.map(id => getCollectionById(id)),
  });

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
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Journal Entries</h1>
              <p className="text-muted-foreground">
                Browse and search your previous entries
              </p>
            </div>
            <div className="flex items-center gap-2">
              <SidebarTrigger className="md:hidden" />
              <Button onClick={handleNewEntry}>New Entry</Button>
            </div>
          </header>

          <div className="mb-8 space-y-4">
            <Input
              placeholder="Search entries..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Collections</h3>
              <CollectionsFilter
                collections={sampleCollections}
                selectedCollections={selectedCollections}
                onSelect={handleCollectionSelect}
              />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Filter by mood</h3>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={selectedMood === "extremely-happy" ? "default" : "outline"}
                  className="mood-extremely-happy cursor-pointer"
                  onClick={() => handleMoodSelect("extremely-happy")}
                >
                  😄 Extremely Happy
                </Badge>
                <Badge
                  variant={selectedMood === "happy" ? "default" : "outline"}
                  className="mood-happy cursor-pointer"
                  onClick={() => handleMoodSelect("happy")}
                >
                  😊 Happy
                </Badge>
                <Badge
                  variant={selectedMood === "neutral" ? "default" : "outline"}
                  className="mood-neutral cursor-pointer"
                  onClick={() => handleMoodSelect("neutral")}
                >
                  😐 Neutral
                </Badge>
                <Badge
                  variant={selectedMood === "sad" ? "default" : "outline"}
                  className="mood-sad cursor-pointer"
                  onClick={() => handleMoodSelect("sad")}
                >
                  😔 Sad
                </Badge>
                <Badge
                  variant={selectedMood === "very-sad" ? "default" : "outline"}
                  className="mood-very-sad cursor-pointer"
                  onClick={() => handleMoodSelect("very-sad")}
                >
                  😢 Very Sad
                </Badge>
                <Badge
                  variant={selectedMood === "confused" ? "default" : "outline"}
                  className="mood-confused cursor-pointer"
                  onClick={() => handleMoodSelect("confused")}
                >
                  😕 Confused
                </Badge>
                <Badge
                  variant={selectedMood === "overwhelmed" ? "default" : "outline"}
                  className="mood-overwhelmed cursor-pointer"
                  onClick={() => handleMoodSelect("overwhelmed")}
                >
                  😰 Overwhelmed
                </Badge>
                {selectedMood && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => setSelectedMood(null)}
                  >
                    Clear Filter
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <section>
            {filteredEntries.length > 0 ? (
              getGroupedEntries().map(([date, dateEntries]) => (
                <div key={date} className="mb-8">
                  <h2 className="text-lg font-semibold mb-4">
                    {format(new Date(date), "MMMM d, yyyy")}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dateEntries.map(entry => (
                      <JournalEntry key={entry.id} {...transformEntry(entry)} />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No entries match your filters</p>
                <Button 
                  variant="link" 
                  onClick={() => {
                    setSelectedCollections([]);
                    setSelectedMood(null);
                    setSearchQuery("");
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            )}
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

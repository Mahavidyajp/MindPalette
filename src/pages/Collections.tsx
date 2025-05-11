
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import JournalEntry, { JournalEntryProps } from "@/components/JournalEntry";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FadeIn } from "@/components/animations/FadeIn";
import { FileText } from "lucide-react";

interface Collection {
  id: string;
  name: string;
  entryCount: number;
  entries: JournalEntryProps[];
}

// Sample collections data
const sampleCollections: Collection[] = [
  {
    id: "1",
    name: "Personal",
    entryCount: 5,
    entries: [
      {
        id: "1",
        title: "Morning Reflections",
        content: "Today I woke up feeling energized and ready to tackle the day. I spent some time meditating and planning my priorities.",
        mood: "happy",
        collections: ["1", "4"],
        createdAt: new Date(2023, 4, 14),
      },
      {
        id: "5",
        title: "Weekend Plans",
        content: "Excited about the weekend! Making plans to go hiking and catch up with friends.",
        mood: "happy",
        collections: ["1"],
        createdAt: new Date(2023, 4, 9),
      }
    ]
  },
  {
    id: "2",
    name: "Work",
    entryCount: 3,
    entries: [
      {
        id: "2",
        title: "Work Challenges",
        content: "Had a difficult meeting today. Feeling a bit overwhelmed with the new project deadlines, but I'm trying to stay positive.",
        mood: "neutral",
        collections: ["2"],
        createdAt: new Date(2023, 4, 13),
      },
      {
        id: "6",
        title: "Project Milestone Reached",
        content: "Finally completed the major milestone for our project. The team worked really well together.",
        mood: "happy",
        collections: ["2", "4"],
        createdAt: new Date(2023, 4, 8),
      }
    ]
  },
  {
    id: "3",
    name: "Health",
    entryCount: 2,
    entries: [
      {
        id: "3",
        title: "Evening Walk",
        content: "Took a long walk by the river this evening. The fresh air and exercise helped clear my mind and improve my mood.",
        mood: "neutral",
        collections: ["3"],
        createdAt: new Date(2023, 4, 11),
        isDraft: true,
      },
      {
        id: "4",
        title: "Feeling Down Today",
        content: "Not feeling my best today. Slept poorly and have been in a funk all day. Hope tomorrow is better.",
        mood: "sad",
        collections: ["3"],
        createdAt: new Date(2023, 4, 10),
      }
    ]
  },
  {
    id: "4",
    name: "Goals",
    entryCount: 4,
    entries: [
      {
        id: "1",
        title: "Morning Reflections",
        content: "Today I woke up feeling energized and ready to tackle the day. I spent some time meditating and planning my priorities.",
        mood: "happy",
        collections: ["1", "4"],
        createdAt: new Date(2023, 4, 14),
      },
      {
        id: "6",
        title: "Project Milestone Reached",
        content: "Finally completed the major milestone for our project. The team worked really well together.",
        mood: "happy",
        collections: ["2", "4"],
        createdAt: new Date(2023, 4, 8),
      }
    ]
  }
];

export default function Collections() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [collections, setCollections] = useState<Collection[]>(sampleCollections);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

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

  const filteredCollections = collections.filter(collection => 
    collection.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCollectionById = (id: string) => {
    return collections.find(col => col.id === id)?.name || "Unknown";
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
          collections={collections} 
          onNewEntry={() => {/* Handle new entry */}}
        />
        
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Collections</h1>
              <p className="text-muted-foreground">
                Organize and browse your journal entries by collection
              </p>
            </div>
            <div className="flex items-center gap-2">
              <SidebarTrigger className="md:hidden" />
              <Button onClick={() => setSelectedCollection(null)}>All Collections</Button>
            </div>
          </header>

          <div className="mb-8">
            <Input
              placeholder="Search collections..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          {selectedCollection ? (
            <FadeIn>
              <div className="mb-6 flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedCollection(null)}
                >
                  ← Back to Collections
                </Button>
                <h2 className="text-2xl font-semibold">{selectedCollection.name}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedCollection.entries.map(entry => (
                  <JournalEntry key={entry.id} {...transformEntry(entry)} />
                ))}
              </div>
            </FadeIn>
          ) : (
            <FadeIn>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCollections.map((collection) => (
                  <Card 
                    key={collection.id} 
                    className="hover:shadow-md transition-all cursor-pointer" 
                    onClick={() => setSelectedCollection(collection)}
                  >
                    <CardHeader className="flex flex-row items-center gap-4">
                      <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle>{collection.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {collection.entryCount} entries
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {collection.entries.length > 0 
                          ? `Latest: ${collection.entries[0].title}` 
                          : "No entries yet"}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </FadeIn>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
}


import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import MoodSelector from "./MoodSelector";
import CollectionSelector from "./CollectionSelector";
import { toast } from "sonner";
import { JournalEntryProps } from "./JournalEntry";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

type Mood = "extremely-happy" | "happy" | "neutral" | "sad" | "very-sad" | "confused" | "overwhelmed";

interface Collection {
  id: string;
  name: string;
}

interface JournalEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Omit<JournalEntryProps, "id">) => void;
  collections: Collection[];
  initialEntry?: Partial<JournalEntryProps>;
}

const modules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}],
    ['link'],
    ['clean']
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet',
  'link'
];

export default function JournalEditor({
  isOpen,
  onClose,
  onSave,
  collections,
  initialEntry,
}: JournalEditorProps) {
  const [title, setTitle] = useState(initialEntry?.title || "");
  const [content, setContent] = useState(initialEntry?.content || "");
  const [mood, setMood] = useState<Mood | null>(initialEntry?.mood as Mood || null);
  const [selectedCollections, setSelectedCollections] = useState<string[]>(
    initialEntry?.collections || []
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset form when dialog opens
      setTitle(initialEntry?.title || "");
      setContent(initialEntry?.content || "");
      setMood(initialEntry?.mood as Mood || null);
      setSelectedCollections(initialEntry?.collections || []);
    }
  }, [isOpen, initialEntry]);

  const handleSave = async (isDraft: boolean) => {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!content.trim()) {
      toast.error("Please enter some content");
      return;
    }

    if (!mood) {
      toast.error("Please select a mood");
      return;
    }

    setIsSaving(true);

    try {
      // Create the entry object
      const entry = {
        title: title.trim(),
        content: content.trim(),
        mood,
        collections: selectedCollections,
        createdAt: initialEntry?.createdAt || new Date(),
        isDraft,
      };

  const response = await fetch( initialEntry?.id 
    ? `/api/journals/${initialEntry.id}`
    :`/api/journals`,
    {
      method: initialEntry?.id ? "PUT" : "POST",
      headers:{
        "Content-Type" : "application/json",
      },
      body:JSON.stringify(entry),
    }
  );
   if (!response.ok) {
        throw new Error("Failed to save entry");
      }

      const savedEntry = await response.json();

      toast.success(isDraft ? "Draft saved" : "Journal entry saved");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save journal entry");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCollectionToggle = (collectionId: string) => {
    setSelectedCollections((prev) =>
      prev.includes(collectionId)
        ? prev.filter((id) => id !== collectionId)
        : [...prev, collectionId]
    );
  };

  // Fix for the type error by creating a handler function
  const handleMoodSelect = (selectedMood: Mood) => {
    setMood(selectedMood);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialEntry ? "Edit Journal Entry" : "New Journal Entry"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your entry a title..."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <div className="min-h-[200px]">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
                placeholder="What's on your mind today?"
                className="h-[200px] mb-12"
              />
            </div>
          </div>
          
          <MoodSelector selectedMood={mood} onMoodSelect={handleMoodSelect} />
          
          <div className="space-y-2">
            <Label>Collections</Label>
            <CollectionSelector
              collections={collections}
              selectedCollections={selectedCollections}
              onToggle={handleCollectionToggle}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-between flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="w-full sm:w-auto"
          >
            Save as Draft
          </Button>
          <div className="flex gap-2">
            <Button
              type="button" 
              variant="ghost"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleSave(false)}
              disabled={isSaving}
              className="w-full sm:w-auto"
            >
              {isSaving ? "Saving..." : "Save Entry"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

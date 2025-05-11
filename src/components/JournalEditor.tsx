
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import MoodSelector from "./MoodSelector";
import CollectionSelector from "./CollectionSelector";
import { toast } from "sonner";
import { JournalEntryProps } from "./JournalEntry";

type Mood = "happy" | "calm" | "neutral" | "sad";

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

export default function JournalEditor({
  isOpen,
  onClose,
  onSave,
  collections,
  initialEntry,
}: JournalEditorProps) {
  const [title, setTitle] = useState(initialEntry?.title || "");
  const [content, setContent] = useState(initialEntry?.content || "");
  const [mood, setMood] = useState<Mood | null>(initialEntry?.mood || null);
  const [selectedCollections, setSelectedCollections] = useState<string[]>(
    initialEntry?.collections || []
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset form when dialog opens
      setTitle(initialEntry?.title || "");
      setContent(initialEntry?.content || "");
      setMood(initialEntry?.mood || null);
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

      // Save the entry
      onSave(entry);
      toast.success(isDraft ? "Draft saved" : "Journal entry saved");
      onClose();
    } catch (error) {
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
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
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind today?"
              className="min-h-[180px]"
            />
          </div>
          
          <MoodSelector selectedMood={mood} onMoodSelect={setMood} />
          
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

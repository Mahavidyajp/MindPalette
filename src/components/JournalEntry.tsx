
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

export interface JournalEntryProps {
  id: string;
  title: string;
  content: string;
  mood: "happy" | "calm" | "neutral" | "sad";
  collections: string[];
  createdAt: Date;
  isDraft?: boolean;
}

export default function JournalEntry({
  title,
  content,
  mood,
  collections,
  createdAt,
  isDraft,
}: JournalEntryProps) {
  // Truncate content for preview
  const truncatedContent =
    content.length > 150 ? content.substring(0, 150) + "..." : content;

  const getMoodClass = () => {
    switch (mood) {
      case "happy":
        return "mood-happy";
      case "calm":
        return "mood-calm";
      case "neutral":
        return "mood-neutral";
      case "sad":
        return "mood-sad";
      default:
        return "";
    }
  };

  const getMoodEmoji = () => {
    switch (mood) {
      case "happy":
        return "😊";
      case "calm":
        return "😌";
      case "neutral":
        return "😐";
      case "sad":
        return "😔";
      default:
        return "";
    }
  };

  return (
    <Card className="journal-card hover:cursor-pointer transition-all">
      <CardHeader className="pb-2 pt-4">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-xl line-clamp-1">{title}</CardTitle>
          <Badge variant="outline" className={`${getMoodClass()} capitalize flex items-center gap-1`}>
            <span>{getMoodEmoji()}</span>
            <span>{mood}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="text-sm text-muted-foreground line-clamp-3">
          {truncatedContent}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0 text-xs text-muted-foreground">
        <div className="flex gap-2 flex-wrap">
          {collections.map((collection) => (
            <Badge key={collection} variant="secondary" className="text-xs">
              {collection}
            </Badge>
          ))}
          {isDraft && (
            <Badge variant="outline" className="text-xs">
              Draft
            </Badge>
          )}
        </div>
        <div className="whitespace-nowrap">
          {formatDistanceToNow(createdAt, { addSuffix: true })}
        </div>
      </CardFooter>
    </Card>
  );
}

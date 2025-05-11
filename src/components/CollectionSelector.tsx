
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Collection {
  id: string;
  name: string;
}

interface CollectionSelectorProps {
  collections: Collection[];
  selectedCollections: string[];
  onToggle: (collectionId: string) => void;
}

export default function CollectionSelector({
  collections,
  selectedCollections,
  onToggle,
}: CollectionSelectorProps) {
  return (
    <ScrollArea className="h-[100px] border rounded-md p-2">
      <div className="flex flex-wrap gap-2 p-1">
        {collections.map((collection) => (
          <Badge
            key={collection.id}
            variant={
              selectedCollections.includes(collection.id) ? "default" : "outline"
            }
            className="cursor-pointer hover:bg-secondary/80 transition-colors"
            onClick={() => onToggle(collection.id)}
          >
            {collection.name}
          </Badge>
        ))}
        {collections.length === 0 && (
          <div className="text-sm text-muted-foreground px-1">
            No collections available. Create some in settings.
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

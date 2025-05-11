
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useState } from "react";

interface Collection {
  id: string;
  name: string;
  entryCount: number;
}

interface CollectionsFilterProps {
  collections: Collection[];
  selectedCollections: string[];
  onSelect: (collectionId: string) => void;
}

export default function CollectionsFilter({
  collections,
  selectedCollections,
  onSelect,
}: CollectionsFilterProps) {
  return (
    <ScrollArea className="w-full pb-2">
      <div className="flex gap-2 p-1">
        <Badge
          variant={selectedCollections.length === 0 ? "default" : "outline"}
          className="cursor-pointer hover:bg-secondary/80 transition-colors"
          onClick={() => {
            // If already showing all (no filters), do nothing
            if (selectedCollections.length === 0) return;
            
            // Clear all filters
            collections.forEach(col => {
              if (selectedCollections.includes(col.id)) {
                onSelect(col.id);
              }
            });
          }}
        >
          All
        </Badge>
        
        {collections.map((collection) => (
          <Badge
            key={collection.id}
            variant={
              selectedCollections.includes(collection.id) ? "default" : "outline"
            }
            className="cursor-pointer hover:bg-secondary/80 transition-colors whitespace-nowrap"
            onClick={() => onSelect(collection.id)}
          >
            {collection.name} ({collection.entryCount})
          </Badge>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

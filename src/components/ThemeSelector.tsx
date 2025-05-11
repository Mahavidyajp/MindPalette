
import { Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme, BackgroundType } from "./ThemeProvider";

export default function ThemeSelector() {
  const { background, setBackground } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { id: "default", name: "Default" },
    { id: "gradient1", name: "Lavender Dream" },
    { id: "gradient2", name: "Sunset Glow" },
    { id: "gradient3", name: "Ocean Breeze" },
    { id: "gradient4", name: "Forest Mist" },
  ];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          Background
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Choose Background</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="grid grid-cols-1 gap-1 p-2">
          {themes.map((theme) => (
            <button
              key={theme.id}
              className={`flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted ${
                background === theme.id && "bg-muted"
              }`}
              onClick={() => {
                setBackground(theme.id as BackgroundType);
                setIsOpen(false);
              }}
            >
              <div className="flex items-center gap-2">
                <div className={`h-4 w-4 rounded bg-${theme.id}`} />
                <span>{theme.name}</span>
              </div>
              {background === theme.id && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

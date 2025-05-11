
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { FileText, Home, FolderOpen, PencilLine, LogOut } from "lucide-react";

interface Collection {
  id: string;
  name: string;
  entryCount?: number;
}

interface AppSidebarProps {
  onLogout: () => void;
  collections: Collection[];
  onNewEntry: () => void;
}

export default function AppSidebar({
  onLogout,
  collections,
  onNewEntry,
}: AppSidebarProps) {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar
      className="border-r"
    >
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold text-primary">Reflect</h1>
        </div>
        <Button onClick={onNewEntry} className="w-full mb-2" size="sm">
          <PencilLine className="h-4 w-4 mr-2" />
          New Entry
        </Button>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <nav className="space-y-1 mb-4">
          <Link to="/">
            <Button
              variant={isActive("/") ? "secondary" : "ghost"}
              className="w-full justify-start"
              size="sm"
            >
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <Link to="/entries">
            <Button
              variant={isActive("/entries") ? "secondary" : "ghost"}
              className="w-full justify-start"
              size="sm"
            >
              <FileText className="h-4 w-4 mr-2" />
              Entries
            </Button>
          </Link>
          <Link to="/collections">
            <Button
              variant={isActive("/collections") ? "secondary" : "ghost"}
              className="w-full justify-start"
              size="sm"
            >
              <FolderOpen className="h-4 w-4 mr-2" />
              Collections
            </Button>
          </Link>
        </nav>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center justify-between mb-4">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={onLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

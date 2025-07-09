
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import JournalEntries from "./pages/JournalEntries";
import Collections from "./pages/Collections";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ThemeProvider from "./components/ThemeProvider";
import MoodCalendar from "./pages/MoodCalendar"

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/entries" element={<JournalEntries />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/calender" element={<MoodCalendar/>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

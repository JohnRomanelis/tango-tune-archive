import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TopNav from "@/components/TopNav";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Songs from "./pages/Songs";
import AddSong from "./pages/AddSong";
import AddMultipleSongs from "./pages/AddMultipleSongs";
import EditSong from "./pages/EditSong";
import Tandas from "./pages/Tandas";
import CreateTanda from "./pages/CreateTanda";
import Playlists from "./pages/Playlists";
import CreatePlaylist from "./pages/CreatePlaylist";
import EditPlaylist from "./pages/EditPlaylist";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-tango-darkGray">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <>
                  <TopNav />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/songs" element={<Songs />} />
                    <Route path="/songs/add" element={<AddSong />} />
                    <Route path="/songs/add-multiple" element={<AddMultipleSongs />} />
                    <Route path="/songs/:id/edit" element={<EditSong />} />
                    <Route path="/tandas" element={<Tandas />} />
                    <Route path="/tandas/create" element={<CreateTanda />} />
                    <Route path="/playlists" element={<Playlists />} />
                    <Route path="/playlists/create" element={<CreatePlaylist />} />
                    <Route path="/playlists/edit/:id" element={<EditPlaylist />} />
                  </Routes>
                </>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
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
import SuggestSong from "./pages/SuggestSong";
import Tandas from "./pages/Tandas";
import CreateTanda from "./pages/CreateTanda";
import EditTanda from "./pages/EditTanda";
import Playlists from "./pages/Playlists";
import CreatePlaylist from "./pages/CreatePlaylist";
import EditPlaylist from "./pages/EditPlaylist";
import Maintenance from "./pages/Maintenance";
import Issues from "./pages/Issues";
import Orchestras from "./pages/Orchestras";
import Singers from "./pages/Singers";
import SongSuggestions from "./pages/SongSuggestions";
import EditSongSuggestion from "./pages/EditSongSuggestion";
import ReportIssue from "./pages/ReportIssue";
import Settings from "./pages/Settings";

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
                    <Route path="/songs/suggest" element={<SuggestSong />} />
                    <Route path="/songs/:id/edit" element={<EditSong />} />
                    <Route path="/tandas" element={<Tandas />} />
                    <Route path="/tandas/create" element={<CreateTanda />} />
                    <Route path="/tandas/:id/edit" element={<EditTanda />} />
                    <Route path="/playlists" element={<Playlists />} />
                    <Route path="/playlists/create" element={<CreatePlaylist />} />
                    <Route path="/playlists/edit/:id" element={<EditPlaylist />} />
                    <Route path="/maintenance" element={<Maintenance />} />
                    <Route path="/maintenance/issues" element={<Issues />} />
                    <Route path="/maintenance/orchestras" element={<Orchestras />} />
                    <Route path="/maintenance/singers" element={<Singers />} />
                    <Route path="/maintenance/song-suggestions" element={<SongSuggestions />} />
                    <Route path="/maintenance/song-suggestions/:id/edit" element={<EditSongSuggestion />} />
                    <Route path="/report-issue" element={<ReportIssue />} />
                    <Route path="/settings" element={<Settings />} />
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

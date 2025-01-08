import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import TopNav from "@/components/TopNav";
import Sidebar from "@/components/Sidebar";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Songs from "@/pages/Songs";
import AddSong from "@/pages/AddSong";
import EditSong from "@/pages/EditSong";
import SuggestSong from "@/pages/SuggestSong";
import EditSongSuggestion from "@/pages/EditSongSuggestion";
import SongSuggestions from "@/pages/SongSuggestions";
import Tandas from "@/pages/Tandas";
import CreateTanda from "@/pages/CreateTanda";
import EditTanda from "@/pages/EditTanda";
import Playlists from "@/pages/Playlists";
import CreatePlaylist from "@/pages/CreatePlaylist";
import EditPlaylist from "@/pages/EditPlaylist";
import Settings from "@/pages/Settings";
import ReportIssue from "@/pages/ReportIssue";
import Issues from "@/pages/Issues";
import Maintenance from "@/pages/Maintenance";
import AddMultipleSongs from "@/pages/AddMultipleSongs";
import Orchestras from "@/pages/Orchestras";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-tango-dark">
        <TopNav />
        <div className="flex">
          <Sidebar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/songs" element={<Songs />} />
              <Route path="/songs/add" element={<AddSong />} />
              <Route path="/songs/add-multiple" element={<AddMultipleSongs />} />
              <Route path="/songs/:id/edit" element={<EditSong />} />
              <Route path="/songs/suggest" element={<SuggestSong />} />
              <Route path="/songs/suggestions/:id/edit" element={<EditSongSuggestion />} />
              <Route path="/songs/suggestions" element={<SongSuggestions />} />
              <Route path="/tandas" element={<Tandas />} />
              <Route path="/tandas/create" element={<CreateTanda />} />
              <Route path="/tandas/:id/edit" element={<EditTanda />} />
              <Route path="/playlists" element={<Playlists />} />
              <Route path="/playlists/create" element={<CreatePlaylist />} />
              <Route path="/playlists/:id/edit" element={<EditPlaylist />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/report-issue" element={<ReportIssue />} />
              <Route path="/maintenance/issues" element={<Issues />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/maintenance/orchestras" element={<Orchestras />} />
            </Routes>
          </div>
        </div>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
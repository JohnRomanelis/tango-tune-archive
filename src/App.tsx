import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Songs from "./pages/Songs";
import AddSong from "./pages/AddSong";
import EditSong from "./pages/EditSong";
import SuggestSong from "./pages/SuggestSong";
import EditSongSuggestion from "./pages/EditSongSuggestion";
import SongSuggestions from "./pages/SongSuggestions";
import Tandas from "./pages/Tandas";
import CreateTanda from "./pages/CreateTanda";
import EditTanda from "./pages/EditTanda";
import Playlists from "./pages/Playlists";
import CreatePlaylist from "./pages/CreatePlaylist";
import EditPlaylist from "./pages/EditPlaylist";
import Issues from "./pages/Issues";
import ReportIssue from "./pages/ReportIssue";
import Settings from "./pages/Settings";
import useAuthRedirect from "./hooks/useAuthRedirect";
import { Toaster } from "./components/ui/toaster";
import "./App.css";

function App() {
  const { isLoading } = useAuthRedirect();

  if (isLoading) {
    return null;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/songs" element={<Songs />} />
        <Route path="/songs/add" element={<AddSong />} />
        <Route path="/songs/edit/:id" element={<EditSong />} />
        <Route path="/songs/suggest" element={<SuggestSong />} />
        <Route path="/songs/suggestions" element={<SongSuggestions />} />
        <Route path="/songs/suggestions/edit/:id" element={<EditSongSuggestion />} />
        <Route path="/tandas" element={<Tandas />} />
        <Route path="/tandas/create" element={<CreateTanda />} />
        <Route path="/tandas/edit/:id" element={<EditTanda />} />
        <Route path="/playlists" element={<Playlists />} />
        <Route path="/playlists/create" element={<CreatePlaylist />} />
        <Route path="/playlists/edit/:id" element={<EditPlaylist />} />
        <Route path="/issues" element={<Issues />} />
        <Route path="/issues/report" element={<ReportIssue />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
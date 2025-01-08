import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import TopNav from "@/components/TopNav";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "@/pages/Login";
import Songs from "@/pages/Songs";
import Tandas from "@/pages/Tandas";
import Playlists from "@/pages/Playlists";
import Settings from "@/pages/Settings";
import Index from "@/pages/Index";
import Maintenance from "@/pages/Maintenance";
import Issues from "@/pages/Issues";
import SongSuggestions from "@/pages/SongSuggestions";
import Orchestras from "@/pages/Orchestras";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-tango-darkGray">
          <TopNav />
          <div className="container mx-auto">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/songs" element={<Songs />} />
              <Route path="/tandas" element={<Tandas />} />
              <Route path="/playlists" element={<Playlists />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/maintenance/issues" element={<Issues />} />
              <Route path="/maintenance/song-suggestions" element={<SongSuggestions />} />
              <Route path="/maintenance/orchestras" element={<Orchestras />} />
            </Routes>
          </div>
          <Toaster />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
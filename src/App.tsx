import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import TopNav from "@/components/TopNav";
import Sidebar from "@/components/Sidebar";
import Index from "@/pages/Index";
import Songs from "@/pages/Songs";
import Tandas from "@/pages/Tandas";
import CreateTanda from "@/pages/CreateTanda";
import Playlists from "@/pages/Playlists";
import CreatePlaylist from "@/pages/CreatePlaylist";
import EditPlaylist from "@/pages/EditPlaylist";
import Login from "@/pages/Login";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-tango-dark">
          <TopNav />
          <div className="flex">
            <Sidebar />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/songs" element={<Songs />} />
                <Route path="/tandas" element={<Tandas />} />
                <Route path="/tandas/create" element={<CreateTanda />} />
                <Route path="/playlists" element={<Playlists />} />
                <Route path="/playlists/create" element={<CreatePlaylist />} />
                <Route path="/playlists/edit/:id" element={<EditPlaylist />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </div>
          </div>
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
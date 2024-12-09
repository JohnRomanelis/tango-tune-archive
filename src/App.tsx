import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TopNav from "@/components/TopNav";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Songs from "./pages/Songs";
import Tandas from "./pages/Tandas";

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
                    <Route path="/tandas" element={<Tandas />} />
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
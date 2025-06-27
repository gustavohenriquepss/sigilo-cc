
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import {Analytics} from "@vercel/analytics/react"
import Index from "./pages/Index";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";
import SupportBanner from "./components/SupportBanner";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isSuportPage = location.pathname === '/support';

  return (
    <>
      <SupportBanner />
      <div className={isSuportPage ? '' : 'pt-10'}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/support" element={<Support />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Analytics />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

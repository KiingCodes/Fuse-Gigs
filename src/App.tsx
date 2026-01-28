import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Explore from "./pages/Explore";
import HustleDetail from "./pages/HustleDetail";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryHustles from "./pages/CategoryHustles";
import ForHustlers from "./pages/ForHustlers";
import Dashboard from "./pages/Dashboard";
import ManageHustles from "./pages/ManageHustles";
import CreateHustle from "./pages/CreateHustle";
import EditHustle from "./pages/EditHustle";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import DashboardSettings from "./pages/DashboardSettings";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import HelpCenter from "./pages/HelpCenter";
import Contact from "./pages/Contact";
import Install from "./pages/Install";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/hustle/:id" element={<HustleDetail />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:slug" element={<CategoryHustles />} />
            <Route path="/for-hustlers" element={<ForHustlers />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/install" element={<Install />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/dashboard" element={<ProtectedRoute requireHustler><Dashboard /></ProtectedRoute>}>
              <Route path="hustles" element={<ManageHustles />} />
              <Route path="hustles/new" element={<CreateHustle />} />
              <Route path="hustles/:id/edit" element={<EditHustle />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<DashboardSettings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Program from "@/pages/Program";
import Projects from "@/pages/Projects";
import News from "@/pages/News";
import Events from "@/pages/Events";
import Faculty from "@/pages/Faculty";
import Contact from "@/pages/Contact";
import Dashboard from "@/pages/admin/Dashboard";
import Content from "@/pages/admin/Content";
import MediaLibrary from "@/pages/admin/MediaLibrary";
import Settings from "@/pages/admin/Settings";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/program" component={Program} />
          <Route path="/projects" component={Projects} />
          <Route path="/news" component={News} />
          <Route path="/events" component={Events} />
          <Route path="/faculty" component={Faculty} />
          <Route path="/contact" component={Contact} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/program" component={Program} />
          <Route path="/projects" component={Projects} />
          <Route path="/news" component={News} />
          <Route path="/events" component={Events} />
          <Route path="/faculty" component={Faculty} />
          <Route path="/contact" component={Contact} />
          
          {/* Admin routes - only for authenticated users with admin role */}
          {user?.role === 'admin' && (
            <>
              <Route path="/admin" component={Dashboard} />
              <Route path="/admin/content" component={Content} />
              <Route path="/admin/media" component={MediaLibrary} />
              <Route path="/admin/settings" component={Settings} />
            </>
          )}
        </>
      )}
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

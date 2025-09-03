import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { NavProvider } from "@/components/navigation/NavProvider";
import { useAuth } from "@/hooks/useAuth";
import { FeatureFlagGuard } from "@/components/FeatureFlagGuard";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Program from "@/pages/Program";
import Projects from "@/pages/Projects";
import ProjectDetail from "@/pages/ProjectDetail";
import Courses from "@/pages/Courses";
import CourseDetail from "@/pages/CourseDetail";
import News from "@/pages/News";
import NewsDetail from "@/pages/NewsDetail";
import Events from "@/pages/Events";
import EventDetail from "@/pages/EventDetail";
import Faculty from "@/pages/Faculty";
import Contact from "@/pages/Contact";
import Dashboard from "@/pages/admin/Dashboard";
import AdminLogin from "@/pages/admin/Login";
import Content from "@/pages/admin/Content";
import MediaLibrary from "@/pages/admin/MediaLibrary";
import Settings from "@/pages/admin/Settings";
import Admissions from "@/pages/Admissions";
import AdminAdmissions from "@/pages/admin/Admissions";
import Messages from "@/pages/admin/Messages";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          {/* Dedicated admin login page (always reachable) */}
          <Route path="/admin" component={AdminLogin} />
          <Route path="/program">
            <FeatureFlagGuard flagKey="program">
              <Program />
            </FeatureFlagGuard>
          </Route>
          <Route path="/projects">
            <FeatureFlagGuard flagKey="projects">
              <Projects />
            </FeatureFlagGuard>
          </Route>
          <Route path="/projects/:id">
            <FeatureFlagGuard flagKey="projects">
              <ProjectDetail />
            </FeatureFlagGuard>
          </Route>
          <Route path="/news">
            <FeatureFlagGuard flagKey="news">
              <News />
            </FeatureFlagGuard>
          </Route>
          <Route path="/news/:id">
            <FeatureFlagGuard flagKey="news">
              <NewsDetail />
            </FeatureFlagGuard>
          </Route>
          <Route path="/events">
            <FeatureFlagGuard flagKey="events">
              <Events />
            </FeatureFlagGuard>
          </Route>
          <Route path="/events/:id">
            <FeatureFlagGuard flagKey="events">
              <EventDetail />
            </FeatureFlagGuard>
          </Route>
          <Route path="/faculty">
            <FeatureFlagGuard flagKey="faculty">
              <Faculty />
            </FeatureFlagGuard>
          </Route>
          <Route path="/admissions">
            <FeatureFlagGuard flagKey="admissions">
              <Admissions />
            </FeatureFlagGuard>
          </Route>
          <Route path="/contact">
            <FeatureFlagGuard flagKey="contact">
              <Contact />
            </FeatureFlagGuard>
          </Route>
          <Route path="/courses">
            <FeatureFlagGuard flagKey="program">
              <Courses />
            </FeatureFlagGuard>
          </Route>
          <Route path="/courses/:id">
            <FeatureFlagGuard flagKey="program">
              <CourseDetail />
            </FeatureFlagGuard>
          </Route>
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/program">
            <FeatureFlagGuard flagKey="program">
              <Program />
            </FeatureFlagGuard>
          </Route>
          <Route path="/projects">
            <FeatureFlagGuard flagKey="projects">
              <Projects />
            </FeatureFlagGuard>
          </Route>
          <Route path="/projects/:id">
            <FeatureFlagGuard flagKey="projects">
              <ProjectDetail />
            </FeatureFlagGuard>
          </Route>
          <Route path="/news">
            <FeatureFlagGuard flagKey="news">
              <News />
            </FeatureFlagGuard>
          </Route>
          <Route path="/news/:id">
            <FeatureFlagGuard flagKey="news">
              <NewsDetail />
            </FeatureFlagGuard>
          </Route>
          <Route path="/events">
            <FeatureFlagGuard flagKey="events">
              <Events />
            </FeatureFlagGuard>
          </Route>
          <Route path="/events/:id">
            <FeatureFlagGuard flagKey="events">
              <EventDetail />
            </FeatureFlagGuard>
          </Route>
          <Route path="/faculty">
            <FeatureFlagGuard flagKey="faculty">
              <Faculty />
            </FeatureFlagGuard>
          </Route>
          <Route path="/admissions">
            <FeatureFlagGuard flagKey="admissions">
              <Admissions />
            </FeatureFlagGuard>
          </Route>
          <Route path="/contact">
            <FeatureFlagGuard flagKey="contact">
              <Contact />
            </FeatureFlagGuard>
          </Route>
          <Route path="/courses">
            <FeatureFlagGuard flagKey="program">
              <Courses />
            </FeatureFlagGuard>
          </Route>
          <Route path="/courses/:id">
            <FeatureFlagGuard flagKey="program">
              <CourseDetail />
            </FeatureFlagGuard>
          </Route>
          
          {/* Admin routes */}
          {(user as any)?.role === 'admin' ? (
            <>
              <Route path="/admin" component={Dashboard} />
              <Route path="/admin/content" component={Content} />
              <Route path="/admin/media" component={MediaLibrary} />
              <Route path="/admin/settings" component={Settings} />
              <Route path="/admin/admissions" component={AdminAdmissions} />
              <Route path="/admin/messages" component={Messages} />
            </>
          ) : (
            // If authenticated but not admin, still allow /admin to render login to avoid confusion
            <Route path="/admin" component={AdminLogin} />
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
          <NavProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </NavProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

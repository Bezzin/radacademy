import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";
import { Sidebar } from "@/components/sidebar";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Courses from "@/pages/courses";
import Modality from "@/pages/modality";
import Course from "@/pages/course";
import Lesson from "@/pages/lesson";
import Community from "@/pages/community";
import Certificates from "@/pages/certificates";
import NotFound from "@/pages/not-found";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/home" component={Home} />
      <Route path="/courses" component={Courses} />
      <Route path="/modality/:slug" component={Modality} />
      <Route path="/course/:slug" component={Course} />
      <Route path="/lessons/:id" component={Lesson} />
      <Route path="/community" component={Community} />
      <Route path="/certificates" component={Certificates} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Layout>
            <Router />
          </Layout>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

import { Navigation } from "./navigation/NavProvider";
import { Footer } from "./navigation/Footer";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { MaintenanceGuard } from "@/components/MaintenanceGuard";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <MaintenanceGuard>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 transition-colors duration-300">
        <Navigation />
        <main>{children}</main>
        <Footer />
        
        {/* Back to Top Button */}
        {showBackToTop && (
          <Button
            size="icon"
            className={`fixed bottom-8 right-8 bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 z-40 ${
              showBackToTop ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}
            onClick={scrollToTop}
            data-testid="button-back-to-top"
          >
            <ArrowUp size={20} />
          </Button>
        )}
      </div>
    </MaintenanceGuard>
  );
}

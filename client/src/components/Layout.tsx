import { Navigation } from "./Navigation";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 transition-colors duration-300">
      <Navigation />
      <main>{children}</main>
      
      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                  <i className="fas fa-graduation-cap text-white"></i>
                </div>
                <div>
                  <h3 className="text-white font-bold">Master BDSI</h3>
                  <p className="text-sm text-slate-400">FS Dhar El Mehraz</p>
                </div>
              </div>
              <p className="text-slate-400 mb-6">
                Formation d'excellence en Big Data et Systèmes Intelligents pour les futurs leaders technologiques.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="w-10 h-10 bg-slate-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors"
                  data-testid="social-linkedin"
                >
                  <i className="fab fa-linkedin"></i>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-slate-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors"
                  data-testid="social-twitter"
                >
                  <i className="fab fa-twitter"></i>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-slate-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors"
                  data-testid="social-youtube"
                >
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-6">Formation</h4>
              <ul className="space-y-3">
                <li><a href="/program" className="hover:text-white transition-colors" data-testid="footer-link-program">Programme</a></li>
                <li><a href="/courses" className="hover:text-white transition-colors" data-testid="footer-link-courses">Matières</a></li>
                <li><a href="/faculty" className="hover:text-white transition-colors" data-testid="footer-link-faculty">Équipe pédagogique</a></li>
                <li><a href="/admissions" className="hover:text-white transition-colors" data-testid="footer-link-admissions">Admissions</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-white font-semibold mb-6">Ressources</h4>
              <ul className="space-y-3">
                <li><a href="/projects" className="hover:text-white transition-colors" data-testid="footer-link-projects">Projets étudiants</a></li>
                <li><a href="/news" className="hover:text-white transition-colors" data-testid="footer-link-news">Actualités</a></li>
                <li><a href="/events" className="hover:text-white transition-colors" data-testid="footer-link-events">Événements</a></li>
                <li><a href="/partnerships" className="hover:text-white transition-colors" data-testid="footer-link-partnerships">Partenariats</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-white font-semibold mb-6">Contact</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <i className="fas fa-map-marker-alt text-primary-400 mt-1"></i>
                  <div>
                    <p>Faculté des Sciences</p>
                    <p>Dhar El Mehraz, Fès</p>
                    <p>Maroc</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="fas fa-phone text-primary-400"></i>
                  <span>+212 5 35 60 XX XX</span>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="fas fa-envelope text-primary-400"></i>
                  <span>master.bdsi@usmba.ac.ma</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 py-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-400 text-sm">
              <p>&copy; 2024 Master BDSI - FS Dhar El Mehraz. Tous droits réservés.</p>
            </div>
            <div className="flex items-center space-x-6 mt-4 md:mt-0 text-sm">
              <a href="#" className="hover:text-white transition-colors" data-testid="footer-legal">Mentions légales</a>
              <a href="#" className="hover:text-white transition-colors" data-testid="footer-privacy">Politique de confidentialité</a>
              <a href="#" className="hover:text-white transition-colors" data-testid="footer-sitemap">Plan du site</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-primary-600 hover:bg-primary-700 text-white w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40"
          data-testid="back-to-top"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}

import { GraduationCap, MapPin, Phone, Mail, ExternalLink } from 'lucide-react';
import { FaLinkedin, FaTwitter, FaYoutube, FaFacebook } from 'react-icons/fa';
import { Link } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSettings } from '@/hooks/useSettings';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { getFooterNavigationItems } from '@/lib/navigation.config';

export function Footer() {
  const { t } = useLanguage();
  const { settings } = useSettings();
  const { isEnabled } = useFeatureFlags();

  const socialLinks = [
    { icon: FaLinkedin, href: settings?.social_linkedin || '#', label: 'LinkedIn' },
    { icon: FaFacebook, href: settings?.social_facebook || '#', label: 'Facebook' },
    { icon: FaTwitter, href: settings?.social_twitter || '#', label: 'Twitter' },
    { icon: FaYoutube, href: settings?.social_youtube || '#', label: 'YouTube' },
  ];

  // Obtenir les liens de navigation pour le footer
  const footerLinks = getFooterNavigationItems(isEnabled);

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <GraduationCap className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold">
                  {settings?.site_title || 'Master BDSI'}
                </h3>
                <p className="text-sm text-slate-400">
                  {settings?.site_description || 'FS Dhar El Mehraz'}
                </p>
              </div>
            </div>
            <p className="text-slate-400 mb-6">
              {settings?.site_description || 'Formation d\'excellence en Big Data et Systèmes Intelligents pour les futurs leaders technologiques.'}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a 
                  key={social.label}
                  href={social.href} 
                  className="w-10 h-10 bg-slate-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors"
                  data-testid={`social-${social.label.toLowerCase()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6">Formation</h4>
            <ul className="space-y-3">
              {footerLinks
                .filter(link => ['program', 'courses', 'faculty', 'admissions'].includes(link.id))
                .map((link) => (
                  <li key={link.id}>
                    <Link href={link.href!}>
                      <span className="hover:text-white transition-colors" data-testid={`footer-link-${link.id}`}>
                        {t(link.label)}
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-6">Ressources</h4>
            <ul className="space-y-3">
              {footerLinks
                .filter(link => ['projects', 'news', 'events'].includes(link.id))
                .map((link) => (
                  <li key={link.id}>
                    <Link href={link.href!}>
                      <span className="hover:text-white transition-colors" data-testid={`footer-link-${link.id}`}>
                        {t(link.label)}
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-6">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="text-primary-400 mt-1 h-4 w-4" />
                <div>
                  <p>Faculté des Sciences</p>
                  <p>Dhar El Mehraz, Fès</p>
                  <p>Maroc</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-primary-400 h-4 w-4" />
                <span>{settings?.contact_phone || '+212 5 35 60 XX XX'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-primary-400 h-4 w-4" />
                <span>{settings?.contact_email || 'master.bdsi@usmba.ac.ma'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 py-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-slate-400 text-sm">
            <p>&copy; 2024 {settings?.site_title || 'Master BDSI'} - FS Dhar El Mehraz. Tous droits réservés.</p>
          </div>
          <div className="flex items-center space-x-6 mt-4 md:mt-0 text-sm">
            <a href="#" className="hover:text-white transition-colors" data-testid="footer-legal">Mentions légales</a>
            <a href="#" className="hover:text-white transition-colors" data-testid="footer-privacy">Politique de confidentialité</a>
            <a href="#" className="hover:text-white transition-colors" data-testid="footer-sitemap">Plan du site</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

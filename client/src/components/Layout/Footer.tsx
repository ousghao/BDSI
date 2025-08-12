import { GraduationCap, MapPin, Phone, Mail, ExternalLink } from 'lucide-react';
import { FaLinkedin, FaTwitter, FaYoutube } from 'react-icons/fa';
import { Link } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  const socialLinks = [
    { icon: FaLinkedin, href: '#', label: 'LinkedIn' },
    { icon: FaTwitter, href: '#', label: 'Twitter' },
    { icon: FaYoutube, href: '#', label: 'YouTube' },
  ];

  const quickLinks = [
    { name: t('nav.program'), href: '/program' },
    { name: t('nav.courses'), href: '/program#courses' },
    { name: t('nav.faculty'), href: '/faculty' },
    { name: 'Admissions', href: '/admissions' },
    { name: 'FAQ', href: '/faq' },
  ];

  const resourceLinks = [
    { name: t('nav.projects'), href: '/projects' },
    { name: 'Publications', href: '/publications' },
    { name: t('nav.events'), href: '/events' },
    { name: 'Alumni', href: '/alumni' },
    { name: 'Partenariats', href: '/partnerships' },
  ];

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <GraduationCap className="text-white" size={20} />
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
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-slate-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors"
                  aria-label={social.label}
                  data-testid={`link-social-${social.label.toLowerCase()}`}
                >
                  <social.icon className="text-slate-300" size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6">{t('footer.formation')}</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span 
                      className="hover:text-white transition-colors cursor-pointer"
                      data-testid={`link-footer-${link.href.slice(1)}`}
                    >
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-6">{t('footer.resources')}</h4>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span 
                      className="hover:text-white transition-colors cursor-pointer"
                      data-testid={`link-footer-resource-${link.href.slice(1)}`}
                    >
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-6">{t('footer.contact')}</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="text-primary-400 mt-1 flex-shrink-0" size={16} />
                <div>
                  <p>Faculté des Sciences</p>
                  <p>Dhar El Mehraz, Fès</p>
                  <p>Maroc</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-primary-400 flex-shrink-0" size={16} />
                <span>+212 5 35 60 XX XX</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-primary-400 flex-shrink-0" size={16} />
                <span>master.bdsi@usmba.ac.ma</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 py-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-slate-400 text-sm">
            <p>{t('footer.copyright')}</p>
          </div>
          <div className="flex items-center space-x-6 mt-4 md:mt-0 text-sm">
            <a href="#" className="hover:text-white transition-colors" data-testid="link-legal">
              Mentions légales
            </a>
            <a href="#" className="hover:text-white transition-colors" data-testid="link-privacy">
              Politique de confidentialité
            </a>
            <a href="#" className="hover:text-white transition-colors" data-testid="link-sitemap">
              Plan du site
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

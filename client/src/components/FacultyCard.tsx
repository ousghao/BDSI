import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Globe, Linkedin, ExternalLink } from "lucide-react";
import type { Faculty } from "@shared/schema";

interface FacultyCardProps {
  member: Faculty;
}

export function FacultyCard({ member }: FacultyCardProps) {
  const handleEmailClick = () => {
    if (member.email) {
      window.open(`mailto:${member.email}`, '_blank');
    }
  };

  const handlePhoneClick = () => {
    if (member.phone) {
      window.open(`tel:${member.phone}`, '_blank');
    }
  };

  const handleWebsiteClick = () => {
    if (member.websiteUrl) {
      window.open(member.websiteUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleLinkedinClick = () => {
    if (member.linkedinUrl) {
      window.open(member.linkedinUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card 
      className="text-center group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-slate-800"
      data-testid={`faculty-card-${member.id}`}
    >
      <CardContent className="p-6">
        {/* Profile Image */}
        <div className="relative mb-4">
          {member.profileImageUrl ? (
            <img 
              src={member.profileImageUrl} 
              alt={member.name}
              className="w-24 h-24 rounded-full mx-auto object-cover group-hover:scale-105 transition-transform duration-300 shadow-lg"
              data-testid={`faculty-image-${member.id}`}
            />
          ) : (
            <div 
              className="w-24 h-24 rounded-full mx-auto bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 flex items-center justify-center shadow-lg"
              data-testid={`faculty-avatar-${member.id}`}
            >
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Name and Title */}
        <h4 
          className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
          data-testid={`faculty-name-${member.id}`}
        >
          {member.name}
        </h4>
        
        <div 
          className="text-primary-600 dark:text-primary-400 font-medium mb-2"
          data-testid={`faculty-title-${member.id}`}
        >
          {member.title}
        </div>

        {/* Specialization */}
        {member.specialization && (
          <Badge 
            variant="secondary" 
            className="mb-4"
            data-testid={`faculty-specialization-${member.id}`}
          >
            {member.specialization}
          </Badge>
        )}

        {/* Bio */}
        {member.bio && (
          <p 
            className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3"
            data-testid={`faculty-bio-${member.id}`}
          >
            {member.bio}
          </p>
        )}

        {/* Research Interests */}
        {member.research && (
          <div className="mb-4">
            <h5 className="text-xs font-semibold text-slate-900 dark:text-white mb-2 uppercase tracking-wide">
              Recherche
            </h5>
            <p 
              className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2"
              data-testid={`faculty-research-${member.id}`}
            >
              {member.research}
            </p>
          </div>
        )}

        {/* Contact Information */}
        <div className="flex justify-center space-x-2 mt-4">
          {member.email && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEmailClick}
              className="text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 h-8 w-8 p-0"
              data-testid={`faculty-email-${member.id}`}
            >
              <Mail className="h-4 w-4" />
              <span className="sr-only">Email {member.name}</span>
            </Button>
          )}
          
          {member.phone && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePhoneClick}
              className="text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 h-8 w-8 p-0"
              data-testid={`faculty-phone-${member.id}`}
            >
              <Phone className="h-4 w-4" />
              <span className="sr-only">Téléphone {member.name}</span>
            </Button>
          )}
          
          {member.websiteUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleWebsiteClick}
              className="text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 h-8 w-8 p-0"
              data-testid={`faculty-website-${member.id}`}
            >
              <Globe className="h-4 w-4" />
              <span className="sr-only">Site web de {member.name}</span>
            </Button>
          )}
          
          {member.linkedinUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLinkedinClick}
              className="text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 h-8 w-8 p-0"
              data-testid={`faculty-linkedin-${member.id}`}
            >
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">LinkedIn de {member.name}</span>
            </Button>
          )}
        </div>

        {/* View Profile Link */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm group-hover:translate-x-1 transition-transform duration-300"
            data-testid={`faculty-profile-${member.id}`}
          >
            Voir le profil <ExternalLink className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

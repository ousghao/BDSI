import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users } from "lucide-react";
import type { Project } from "@shared/schema";

interface ProjectCardProps {
  project: Project;
}

const themeColors = {
  "IA/ML": "bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300",
  "Data Engineering": "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300",
  "NLP": "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300",
  "Computer Vision": "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
  "IoT": "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300",
};

export function ProjectCard({ project }: ProjectCardProps) {
  const students = project.students ? JSON.parse(project.students) : [];
  const awards = project.awards ? JSON.parse(project.awards) : [];

  return (
    <Card 
      className="bg-slate-50 dark:bg-slate-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
      data-testid={`project-card-${project.id}`}
    >
      {project.imageUrl && (
        <img 
          src={project.imageUrl} 
          alt={project.title} 
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          data-testid={`project-image-${project.id}`}
        />
      )}
      <CardContent className="p-6">
        <div className="flex items-center mb-3">
          <Badge 
            className={themeColors[project.theme as keyof typeof themeColors] || "bg-gray-100 text-gray-700"}
            data-testid={`project-theme-${project.id}`}
          >
            {project.theme}
          </Badge>
          {awards.length > 0 && (
            <Badge 
              className="bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300 ml-2"
              data-testid={`project-award-${project.id}`}
            >
              {awards[0]}
            </Badge>
          )}
        </div>
        
        <h3 
          className="text-xl font-bold text-slate-900 dark:text-white mb-3"
          data-testid={`project-title-${project.id}`}
        >
          {project.title}
        </h3>
        
        <p 
          className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-3"
          data-testid={`project-description-${project.id}`}
        >
          {project.description}
        </p>
        
        {students.length > 0 && (
          <div 
            className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-4"
            data-testid={`project-students-${project.id}`}
          >
            <Users className="mr-2 h-4 w-4" />
            <span>{students.join(", ")}</span>
          </div>
        )}
        
        <Button 
          variant="ghost" 
          className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 p-0 h-auto group-hover:translate-x-1 transition-transform duration-300"
          data-testid={`project-link-${project.id}`}
        >
          Voir le projet <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

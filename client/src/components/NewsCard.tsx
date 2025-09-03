import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { Link } from "wouter";
import type { News } from "@shared/schema";

interface NewsCardProps {
  article: News;
  variant?: "horizontal" | "vertical";
}

const categoryColors = {
  event: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
  research: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
  success_story: "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300",
  announcement: "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300",
};

const categoryLabels = {
  event: "Événement",
  research: "Recherche",
  success_story: "Success Story",
  announcement: "Annonce",
};

export function NewsCard({ article, variant = "horizontal" }: NewsCardProps) {
  const publishedDate = article.publishedAt ? new Date(article.publishedAt) : new Date(article.createdAt);
  
  if (variant === "vertical") {
    return (
      <Link href={`/news/${article.id}`}>
        <Card 
          className="bg-slate-50 dark:bg-slate-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
          data-testid={`news-card-${article.id}`}
        >
          {article.imageUrl && (
            <img 
              src={article.imageUrl} 
              alt={article.title} 
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              data-testid={`news-image-${article.id}`}
            />
          )}
          <CardContent className="p-6">
            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-2">
              <Badge 
                className={categoryColors[article.category as keyof typeof categoryColors] || "bg-gray-100 text-gray-700"}
                data-testid={`news-category-${article.id}`}
              >
                {categoryLabels[article.category as keyof typeof categoryLabels] || article.category}
              </Badge>
              <span className="mx-2">•</span>
              <Calendar className="mr-1 h-3 w-3" />
              <span data-testid={`news-date-${article.id}`}>
                {publishedDate.toLocaleDateString('fr-FR')}
              </span>
            </div>
            
            <h4 
              className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
              data-testid={`news-title-${article.id}`}
            >
              {article.title}
            </h4>
            
            <p 
              className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-3"
              data-testid={`news-summary-${article.id}`}
            >
              {article.summary}
            </p>
            
            <Button 
              variant="ghost" 
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 p-0 h-auto"
              data-testid={`news-link-${article.id}`}
            >
              Lire la suite <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/news/${article.id}`}>
      <article className="group cursor-pointer" data-testid={`news-article-${article.id}`}>
        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          {article.imageUrl && (
            <img 
              src={article.imageUrl} 
              alt={article.title} 
              className="w-full lg:w-auto h-48 lg:h-32 object-cover rounded-xl group-hover:shadow-lg transition-shadow duration-300"
              data-testid={`news-image-${article.id}`}
            />
          )}
          <div className="lg:col-span-2 mt-4 lg:mt-0">
            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-2">
              <Badge 
                className={categoryColors[article.category as keyof typeof categoryColors] || "bg-gray-100 text-gray-700"}
                data-testid={`news-category-${article.id}`}
              >
                {categoryLabels[article.category as keyof typeof categoryLabels] || article.category}
              </Badge>
              <span className="mx-2">•</span>
              <Calendar className="mr-1 h-3 w-3" />
              <span data-testid={`news-date-${article.id}`}>
                {publishedDate.toLocaleDateString('fr-FR')}
              </span>
            </div>
            
            <h4 
              className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
              data-testid={`news-title-${article.id}`}
            >
              {article.title}
            </h4>
            
            <p 
              className="text-slate-600 dark:text-slate-400"
              data-testid={`news-summary-${article.id}`}
            >
              {article.summary}
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}

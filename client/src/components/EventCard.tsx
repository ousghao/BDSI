import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin } from "lucide-react";
import type { Event } from "@shared/schema";

interface EventCardProps {
  event: Event;
}

const typeColors = {
  seminar: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
  defense: "bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300",
  workshop: "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300",
  meetup: "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300",
};

const typeLabels = {
  seminar: "Séminaire",
  defense: "Soutenance",
  workshop: "Workshop",
  meetup: "Meetup",
};

export function EventCard({ event }: EventCardProps) {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  
  const monthNames = [
    "JAN", "FÉV", "MAR", "AVR", "MAI", "JUN",
    "JUL", "AOÛ", "SEP", "OCT", "NOV", "DÉC"
  ];

  return (
    <Card 
      className="bg-slate-50 dark:bg-slate-700 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
      data-testid={`event-card-${event.id}`}
    >
      <CardContent className="p-0">
        <div className="flex items-start space-x-4">
          <div 
            className={`rounded-lg p-3 text-center min-w-[60px] ${
              typeColors[event.type as keyof typeof typeColors] || "bg-gray-100 text-gray-700"
            }`}
            data-testid={`event-date-${event.id}`}
          >
            <div className="text-sm font-medium">
              {monthNames[startDate.getMonth()]}
            </div>
            <div className="text-xl font-bold">
              {startDate.getDate()}
            </div>
          </div>
          
          <div className="flex-1">
            <div className="mb-2">
              <Badge 
                className={typeColors[event.type as keyof typeof typeColors] || "bg-gray-100 text-gray-700"}
                data-testid={`event-type-${event.id}`}
              >
                {typeLabels[event.type as keyof typeof typeLabels] || event.type}
              </Badge>
            </div>
            
            <h4 
              className="font-semibold text-slate-900 dark:text-white mb-1"
              data-testid={`event-title-${event.id}`}
            >
              {event.title}
            </h4>
            
            <p 
              className="text-sm text-slate-600 dark:text-slate-400 mb-2"
              data-testid={`event-description-${event.id}`}
            >
              {event.description}
            </p>
            
            <div className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center" data-testid={`event-time-${event.id}`}>
                <Clock className="mr-1 h-3 w-3" />
                <span>
                  {startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  {startDate.toDateString() !== endDate.toDateString() ? 
                    ` - ${endDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` :
                    ` - ${endDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
                  }
                </span>
              </div>
              
              {event.location && (
                <div className="flex items-center" data-testid={`event-location-${event.id}`}>
                  <MapPin className="mr-1 h-3 w-3" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

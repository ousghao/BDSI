import { useSettings } from '@/hooks/useSettings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wrench, AlertTriangle } from 'lucide-react';

export function MaintenancePage() {
  const { settings } = useSettings();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center">
            <Wrench className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
            Site en maintenance
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm font-medium">Maintenance en cours</span>
          </div>
          
          <p className="text-slate-600 dark:text-slate-400">
            {settings.maintenanceMessage || "Le site est temporairement en maintenance. Nous serons bientôt de retour."}
          </p>
          
          <div className="pt-4">
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              className="w-full"
            >
              Actualiser la page
            </Button>
          </div>
          
          <div className="text-xs text-slate-500 dark:text-slate-400">
            <p>Master BDSI - FS Dhar El Mehraz</p>
            <p>Contact: {settings.contactEmail}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

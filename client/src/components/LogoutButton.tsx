import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast({
          title: t('logout.success'),
          description: "Vous avez été déconnecté avec succès.",
        });
        // Refresh the page to update authentication state
        window.location.reload();
      } else {
        toast({
          title: t('logout.error'),
          description: t('logout.errorDescription'),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('logout.errorDescription'),
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleLogout}
      className="flex items-center gap-2"
    >
      <LogOut className="h-4 w-4" />
      {t('admin.logout')}
    </Button>
  );
} 
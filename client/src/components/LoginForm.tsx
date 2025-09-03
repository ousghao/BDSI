import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: t("admin.login.successTitle"),
          description: t("admin.login.successMessage"),
        });
        // Refresh the page to update authentication state
        window.location.reload();
      } else {
        toast({
          title: t("admin.login.errorTitle"),
          description: data.message || t("admin.login.invalidCredentials"),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("admin.login.connectionError"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: t("admin.login.adminSuccessTitle"),
          description: t("admin.login.adminSuccessMessage"),
        });
        // Refresh the page to update authentication state
        window.location.reload();
      } else {
        toast({
          title: t("admin.login.adminErrorTitle"),
          description: data.message || t("admin.login.invalidCredentials"),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("admin.login.adminConnectionError"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{t("admin.login.loginTitle")}</CardTitle>
        <CardDescription>
          {t("admin.login.loginDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t("form.email")}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("form.placeholders.email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("form.password")}</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t("common.loading") : t("admin.login.signIn")}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full" 
              disabled={isLoading}
              onClick={handleAdminLogin}
            >
              {isLoading ? t("common.loading") : t("admin.login.adminSignIn")}
            </Button>
          </div>
        </form>
        <div className="mt-4 text-sm text-gray-600">
          <p><strong>{t("admin.login.demo")}:</strong></p>
          <p>• {t("admin.login.userDemo")}</p>
          <p>• {t("admin.login.adminDemo")}</p>
        </div>
      </CardContent>
    </Card>
  );
} 
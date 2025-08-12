import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { Layout } from "@/components/Layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Settings as SettingsIcon,
  Globe,
  Palette,
  Mail,
  Shield,
  Database,
  Save,
  RefreshCw
} from "lucide-react";

interface SiteSettings {
  // General settings
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  
  // Social media
  linkedinUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  
  // Features
  darkModeEnabled: boolean;
  multiLanguageEnabled: boolean;
  registrationEnabled: boolean;
  
  // SEO
  metaKeywords: string;
  metaDescription: string;
  
  // Maintenance
  maintenanceMode: boolean;
  maintenanceMessage: string;
}

export default function Settings() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  const [settings, setSettings] = useState<SiteSettings>({
    // General settings
    siteName: "Master BDSI - FS Dhar El Mehraz",
    siteDescription: "Formation d'excellence en Big Data et Systèmes Intelligents pour les futurs leaders technologiques.",
    contactEmail: "master.bdsi@usmba.ac.ma",
    contactPhone: "+212 5 35 60 XX XX",
    address: "Faculté des Sciences Dhar El Mehraz, Route d'Imouzzer, BP 1796, 30000 Fès, Maroc",
    
    // Social media
    linkedinUrl: "",
    twitterUrl: "",
    youtubeUrl: "",
    
    // Features
    darkModeEnabled: true,
    multiLanguageEnabled: true,
    registrationEnabled: false,
    
    // SEO
    metaKeywords: "master, big data, systèmes intelligents, intelligence artificielle, fès, maroc",
    metaDescription: "Master Big Data & Systèmes Intelligents à la Faculté des Sciences Dhar El Mehraz, Fès. Formation d'excellence en IA et analyse de données massives.",
    
    // Maintenance
    maintenanceMode: false,
    maintenanceMessage: "Le site est temporairement en maintenance. Nous serons bientôt de retour.",
  });

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      toast({
        title: "Accès non autorisé",
        description: "Vous devez être connecté en tant qu'administrateur.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, user?.role, toast]);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Here you would save settings to the backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Paramètres sauvegardés",
        description: "Les paramètres ont été mis à jour avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la sauvegarde.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (key: keyof SiteSettings, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2" data-testid="settings-title">
                Paramètres du site
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Configurez les paramètres généraux, l'apparence et les fonctionnalités du site
              </p>
            </div>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-primary-600 hover:bg-primary-700"
              data-testid="save-settings"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder
                </>
              )}
            </Button>
          </div>

          <Tabs defaultValue="general" className="space-y-8" data-testid="settings-tabs">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general">
                <SettingsIcon className="mr-2 h-4 w-4" />
                Général
              </TabsTrigger>
              <TabsTrigger value="contact">
                <Mail className="mr-2 h-4 w-4" />
                Contact
              </TabsTrigger>
              <TabsTrigger value="features">
                <Shield className="mr-2 h-4 w-4" />
                Fonctionnalités
              </TabsTrigger>
              <TabsTrigger value="seo">
                <Globe className="mr-2 h-4 w-4" />
                SEO
              </TabsTrigger>
              <TabsTrigger value="maintenance">
                <Database className="mr-2 h-4 w-4" />
                Maintenance
              </TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general" data-testid="general-settings">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres généraux</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="siteName">Nom du site</Label>
                    <Input
                      id="siteName"
                      value={settings.siteName}
                      onChange={(e) => updateSetting('siteName', e.target.value)}
                      data-testid="input-site-name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="siteDescription">Description du site</Label>
                    <Textarea
                      id="siteDescription"
                      value={settings.siteDescription}
                      onChange={(e) => updateSetting('siteDescription', e.target.value)}
                      rows={3}
                      data-testid="textarea-site-description"
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Réseaux sociaux</h3>
                    
                    <div>
                      <Label htmlFor="linkedinUrl">URL LinkedIn</Label>
                      <Input
                        id="linkedinUrl"
                        placeholder="https://linkedin.com/company/..."
                        value={settings.linkedinUrl}
                        onChange={(e) => updateSetting('linkedinUrl', e.target.value)}
                        data-testid="input-linkedin"
                      />
                    </div>

                    <div>
                      <Label htmlFor="twitterUrl">URL Twitter</Label>
                      <Input
                        id="twitterUrl"
                        placeholder="https://twitter.com/..."
                        value={settings.twitterUrl}
                        onChange={(e) => updateSetting('twitterUrl', e.target.value)}
                        data-testid="input-twitter"
                      />
                    </div>

                    <div>
                      <Label htmlFor="youtubeUrl">URL YouTube</Label>
                      <Input
                        id="youtubeUrl"
                        placeholder="https://youtube.com/channel/..."
                        value={settings.youtubeUrl}
                        onChange={(e) => updateSetting('youtubeUrl', e.target.value)}
                        data-testid="input-youtube"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Settings */}
            <TabsContent value="contact" data-testid="contact-settings">
              <Card>
                <CardHeader>
                  <CardTitle>Informations de contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="contactEmail">Email de contact</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => updateSetting('contactEmail', e.target.value)}
                      data-testid="input-contact-email"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactPhone">Téléphone</Label>
                    <Input
                      id="contactPhone"
                      value={settings.contactPhone}
                      onChange={(e) => updateSetting('contactPhone', e.target.value)}
                      data-testid="input-contact-phone"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Adresse</Label>
                    <Textarea
                      id="address"
                      value={settings.address}
                      onChange={(e) => updateSetting('address', e.target.value)}
                      rows={3}
                      data-testid="textarea-address"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Features Settings */}
            <TabsContent value="features" data-testid="features-settings">
              <Card>
                <CardHeader>
                  <CardTitle>Fonctionnalités du site</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="darkMode">Mode sombre</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Permettre aux utilisateurs de basculer en mode sombre
                      </p>
                    </div>
                    <Switch
                      id="darkMode"
                      checked={settings.darkModeEnabled}
                      onCheckedChange={(checked) => updateSetting('darkModeEnabled', checked)}
                      data-testid="switch-dark-mode"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="multiLanguage">Support multilingue</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Activer la prise en charge de plusieurs langues
                      </p>
                    </div>
                    <Switch
                      id="multiLanguage"
                      checked={settings.multiLanguageEnabled}
                      onCheckedChange={(checked) => updateSetting('multiLanguageEnabled', checked)}
                      data-testid="switch-multilanguage"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="registration">Inscriptions ouvertes</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Permettre aux nouveaux utilisateurs de s'inscrire
                      </p>
                    </div>
                    <Switch
                      id="registration"
                      checked={settings.registrationEnabled}
                      onCheckedChange={(checked) => updateSetting('registrationEnabled', checked)}
                      data-testid="switch-registration"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* SEO Settings */}
            <TabsContent value="seo" data-testid="seo-settings">
              <Card>
                <CardHeader>
                  <CardTitle>Référencement (SEO)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="metaDescription">Meta description</Label>
                    <Textarea
                      id="metaDescription"
                      value={settings.metaDescription}
                      onChange={(e) => updateSetting('metaDescription', e.target.value)}
                      rows={3}
                      maxLength={160}
                      data-testid="textarea-meta-description"
                    />
                    <p className="text-sm text-slate-500 mt-1">
                      {settings.metaDescription.length}/160 caractères
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="metaKeywords">Mots-clés</Label>
                    <Input
                      id="metaKeywords"
                      value={settings.metaKeywords}
                      onChange={(e) => updateSetting('metaKeywords', e.target.value)}
                      placeholder="mot-clé1, mot-clé2, mot-clé3"
                      data-testid="input-meta-keywords"
                    />
                    <p className="text-sm text-slate-500 mt-1">
                      Séparez les mots-clés par des virgules
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Maintenance Settings */}
            <TabsContent value="maintenance" data-testid="maintenance-settings">
              <Card>
                <CardHeader>
                  <CardTitle>Mode maintenance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <div className="space-y-0.5">
                      <Label htmlFor="maintenance">Mode maintenance</Label>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        ⚠️ Activer le mode maintenance cachera le site aux visiteurs
                      </p>
                    </div>
                    <Switch
                      id="maintenance"
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked) => updateSetting('maintenanceMode', checked)}
                      data-testid="switch-maintenance"
                    />
                  </div>

                  {settings.maintenanceMode && (
                    <div>
                      <Label htmlFor="maintenanceMessage">Message de maintenance</Label>
                      <Textarea
                        id="maintenanceMessage"
                        value={settings.maintenanceMessage}
                        onChange={(e) => updateSetting('maintenanceMessage', e.target.value)}
                        rows={3}
                        data-testid="textarea-maintenance-message"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}

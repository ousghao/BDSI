import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useSettings } from "@/hooks/useSettings";
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

import type { SiteSettings } from "@/hooks/useSettings";

export default function Settings() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const { settings, isLoading: settingsLoading, updateMultipleSettings, isUpdating, error, refetch } = useSettings();
  
  // Local state for form values - only send to API when saving
  const [localSettings, setLocalSettings] = useState<SiteSettings>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize local settings when settings are loaded
  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      console.log('🔄 Settings loaded from API:', settings);
      // Deep copy to avoid reference issues
      const settingsCopy = JSON.parse(JSON.stringify(settings));
      setLocalSettings(settingsCopy);
      setHasChanges(false);
    }
  }, [settings]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast({
        title: t('settings.loadError'),
        description: t('settings.loadErrorDescription'),
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      toast({
        title: t('admin.unauthorized'),
        description: t('admin.unauthorizedDescription'),
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, user?.role, toast]);

  if (isLoading || settingsLoading) {
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

  const handleSettingUpdate = (key: keyof SiteSettings, value: string | boolean | number) => {
    // Update local state only - don't send to API yet
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!hasChanges) {
      toast({
        title: t('settings.noChanges'),
        description: t('settings.noChangesDescription'),
      });
      return;
    }

    try {
      console.log('💾 Saving settings to API:', localSettings);
      
      // Send all local changes to API
      await updateMultipleSettings(localSettings);
      
      console.log('✅ Settings saved');
      
      // Reset change tracking
      setHasChanges(false);
      
      // Show success message
      toast({
        title: t('settings.saved'),
        description: t('settings.savedDescription'),
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: t('settings.error'),
        description: t('settings.errorDescription'),
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    // Reset local settings to original values
    setLocalSettings(settings);
    setHasChanges(false);
    toast({
      title: t('settings.resetChanges'),
      description: t('settings.resetDescription'),
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2" data-testid="settings-title">
                {t('settings.title')}
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                {t('settings.description')}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {hasChanges && (
                <span className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                  {t('settings.unsavedChanges')}
                </span>
              )}
              <Button 
                onClick={handleReset}
                disabled={!hasChanges || isUpdating}
                variant="outline"
                data-testid="reset-settings"
              >
                {t('settings.cancel')}
              </Button>
              <Button 
                onClick={handleSave}
                disabled={!hasChanges || isUpdating}
                className="bg-primary-600 hover:bg-primary-700"
                data-testid="save-settings"
              >
                {isUpdating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    {t('settings.saving')}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {t('settings.save')}
                  </>
                )}
              </Button>
            </div>
          </div>

          <Tabs defaultValue="general" className="space-y-8" data-testid="settings-tabs">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general">
                <SettingsIcon className="mr-2 h-4 w-4" />
                {t('settings.tabs.general')}
              </TabsTrigger>
              <TabsTrigger value="contact">
                <Mail className="mr-2 h-4 w-4" />
                {t('settings.tabs.contact')}
              </TabsTrigger>
              <TabsTrigger value="features">
                <Shield className="mr-2 h-4 w-4" />
                {t('settings.tabs.features')}
              </TabsTrigger>
              <TabsTrigger value="seo">
                <Globe className="mr-2 h-4 w-4" />
                {t('settings.tabs.seo')}
              </TabsTrigger>
              <TabsTrigger value="maintenance">
                <Database className="mr-2 h-4 w-4" />
                {t('settings.tabs.maintenance')}
              </TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general" data-testid="general-settings">
              <Card>
                <CardHeader>
                  <CardTitle>{t('settings.general.title')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="site_title">{t('settings.general.siteName')}</Label>
                    <Input
                      id="site_title"
                      value={localSettings.site_title || ''}
                      onChange={(e) => handleSettingUpdate('site_title', e.target.value)}
                      data-testid="input-site-name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="site_description">{t('settings.general.siteDescription')}</Label>
                    <Textarea
                      id="site_description"
                      value={localSettings.site_description || ''}
                      onChange={(e) => handleSettingUpdate('site_description', e.target.value)}
                      rows={3}
                      data-testid="textarea-site-description"
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">{t('settings.social.title')}</h3>
                    
                    <div>
                      <Label htmlFor="social_linkedin">URL LinkedIn</Label>
                      <Input
                        id="social_linkedin"
                        placeholder="https://linkedin.com/company/..."
                        value={localSettings.social_linkedin}
                        onChange={(e) => handleSettingUpdate('social_linkedin', e.target.value)}
                        data-testid="input-linkedin"
                      />
                    </div>

                    <div>
                      <Label htmlFor="social_facebook">URL Facebook</Label>
                      <Input
                        id="social_facebook"
                        placeholder="https://facebook.com/..."
                        value={localSettings.social_facebook}
                        onChange={(e) => handleSettingUpdate('social_facebook', e.target.value)}
                        data-testid="input-facebook"
                      />
                    </div>

                    <div>
                      <Label htmlFor="social_twitter">URL Twitter</Label>
                      <Input
                        id="social_twitter"
                        placeholder="https://twitter.com/..."
                        value={localSettings.social_twitter}
                        onChange={(e) => handleSettingUpdate('social_twitter', e.target.value)}
                        data-testid="input-twitter"
                      />
                    </div>

                    <div>
                      <Label htmlFor="social_youtube">URL YouTube</Label>
                      <Input
                        id="social_youtube"
                        placeholder="https://youtube.com/channel/..."
                        value={localSettings.social_youtube}
                        onChange={(e) => handleSettingUpdate('social_youtube', e.target.value)}
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
                    <Label htmlFor="contact_email">Email de contact</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={localSettings.contact_email}
                      onChange={(e) => handleSettingUpdate('contact_email', e.target.value)}
                      data-testid="input-contact-email"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact_phone">Téléphone</Label>
                    <Input
                      id="contact_phone"
                      value={localSettings.contact_phone}
                      onChange={(e) => handleSettingUpdate('contact_phone', e.target.value)}
                      data-testid="input-contact-phone"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact_address">Adresse</Label>
                    <Textarea
                      id="contact_address"
                      value={localSettings.contact_address}
                      onChange={(e) => handleSettingUpdate('contact_address', e.target.value)}
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
                      <Label htmlFor="enable_dark_mode">Mode sombre</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Permettre aux utilisateurs de basculer en mode sombre
                      </p>
                    </div>
                    <Switch
                      id="enable_dark_mode"
                      checked={localSettings.enable_dark_mode || false}
                      onCheckedChange={(checked) => handleSettingUpdate('enable_dark_mode', checked)}
                      data-testid="switch-dark-mode"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enable_multilingual">Support multilingue</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Activer la prise en charge de plusieurs langues
                      </p>
                    </div>
                    <Switch
                      id="enable_multilingual"
                      checked={localSettings.enable_multilingual || false}
                      onCheckedChange={(checked) => handleSettingUpdate('enable_multilingual', checked)}
                      data-testid="switch-multilanguage"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enable_search">Recherche</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Activer la fonctionnalité de recherche sur le site
                      </p>
                    </div>
                    <Switch
                      id="enable_search"
                      checked={localSettings.enable_search || false}
                      onCheckedChange={(checked) => handleSettingUpdate('enable_search', checked)}
                      data-testid="switch-search"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Display Limits Settings */}
            <TabsContent value="seo" data-testid="display-limits-settings">
              <Card>
                <CardHeader>
                  <CardTitle>Limites d'affichage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="featured_projects_limit">Limite des projets en vedette</Label>
                    <Input
                      id="featured_projects_limit"
                      type="number"
                      min="1"
                      max="20"
                      value={localSettings.featured_projects_limit}
                      onChange={(e) => handleSettingUpdate('featured_projects_limit', parseInt(e.target.value))}
                      data-testid="input-projects-limit"
                    />
                    <p className="text-sm text-slate-500 mt-1">
                      Nombre de projets à afficher sur la page d'accueil
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="featured_news_limit">Limite des actualités en vedette</Label>
                    <Input
                      id="featured_news_limit"
                      type="number"
                      min="1"
                      max="20"
                      value={localSettings.featured_news_limit}
                      onChange={(e) => handleSettingUpdate('featured_news_limit', parseInt(e.target.value))}
                      data-testid="input-news-limit"
                    />
                    <p className="text-sm text-slate-500 mt-1">
                      Nombre d'actualités à afficher sur la page d'accueil
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="upcoming_events_limit">Limite des événements à venir</Label>
                    <Input
                      id="upcoming_events_limit"
                      type="number"
                      min="1"
                      max="20"
                      value={localSettings.upcoming_events_limit}
                      onChange={(e) => handleSettingUpdate('upcoming_events_limit', parseInt(e.target.value))}
                      data-testid="input-events-limit"
                    />
                    <p className="text-sm text-slate-500 mt-1">
                      Nombre d'événements à afficher sur la page d'accueil
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
                      checked={localSettings.maintenanceMode || false}
                      onCheckedChange={(checked) => handleSettingUpdate('maintenanceMode', checked)}
                      data-testid="switch-maintenance"
                    />
                  </div>

                  {localSettings.maintenanceMode && (
                    <div>
                      <Label htmlFor="maintenanceMessage">Message de maintenance</Label>
                      <Textarea
                        id="maintenanceMessage"
                        value={localSettings.maintenanceMessage}
                        onChange={(e) => handleSettingUpdate('maintenanceMessage', e.target.value)}
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

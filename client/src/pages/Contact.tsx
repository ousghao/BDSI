import { useState } from "react";
import { Layout } from "@/components/Layout";
import { GoogleMap } from "@/components/GoogleMap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send,
  MessageSquare,
  User,
  Building
} from "lucide-react";

export default function Contact() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    reason: "",
    subject: "",
    message: "",
  });

  const contactReasons = [
    { value: "admission", label: t('contact.reason.admission') },
    { value: "program", label: t('contact.reason.program') },
    { value: "partnership", label: t('contact.reason.partnership') },
    { value: "internship", label: t('contact.reason.internship') },
    { value: "research", label: t('contact.reason.research') },
    { value: "other", label: t('contact.reason.other') },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send form data to our API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de l\'envoi du message');
      }
      
      toast({
        title: "Message envoyé !",
        description: "Nous vous répondrons dans les plus brefs délais.",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        organization: "",
        reason: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : "Une erreur s'est produite lors de l'envoi. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-slate-800 dark:to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 font-playfair" data-testid="page-title">
              {t('contact.title')}
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              {t('contact.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 font-playfair">
                {t('contact.form.title')}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">{t('form.fullName')} *</Label>
                    <Input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder={t('form.placeholders.name')}
                      data-testid="input-name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">{t('form.email')} *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder={t('form.placeholders.email')}
                      data-testid="input-email"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">{t('form.phone')}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder={t('form.placeholders.phone')}
                      data-testid="input-phone"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="organization">{t('form.organization')}</Label>
                    <Input
                      id="organization"
                      type="text"
                      value={formData.organization}
                      onChange={(e) => handleInputChange("organization", e.target.value)}
                      placeholder={t('form.placeholders.organization')}
                      data-testid="input-organization"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="reason">{t('form.contactReason')} *</Label>
                  <Select value={formData.reason} onValueChange={(value) => handleInputChange("reason", value)}>
                    <SelectTrigger data-testid="select-reason">
                      <SelectValue placeholder={t('form.selectReason')} />
                    </SelectTrigger>
                    <SelectContent>
                      {contactReasons.map((reason) => (
                        <SelectItem key={reason.value} value={reason.value}>
                          {reason.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subject">{t('form.subject')} *</Label>
                  <Input
                    id="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => handleInputChange("subject", e.target.value)}
                    placeholder={t('form.placeholders.subject')}
                    data-testid="input-subject"
                  />
                </div>

                <div>
                  <Label htmlFor="message">{t('form.message')} *</Label>
                  <Textarea
                    id="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder={t('form.placeholders.message')}
                    data-testid="textarea-message"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                  data-testid="submit-button"
                >
                  {isSubmitting ? (
                    t('form.sending')
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      {t('form.sendMessage')}
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Details */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 font-playfair">
                  {t('contact.info.title')}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8">
                  {t('contact.subtitle')}
                </p>
              </div>

              <div className="space-y-6">
                <Card data-testid="contact-address">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <MapPin className="h-6 w-6 text-primary-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Adresse</h3>
                        <p className="text-slate-600 dark:text-slate-400">
                          Faculté des Sciences Dhar El Mehraz<br />
                          Université Sidi Mohamed Ben Abdellah<br />
                          Route d'Imouzzer, BP 1796<br />
                          30000 Fès, Maroc
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card data-testid="contact-phone">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Phone className="h-6 w-6 text-primary-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Téléphone</h3>
                        <p className="text-slate-600 dark:text-slate-400">
                          +212 5 35 60 XX XX<br />
                          +212 5 35 60 XX XX (Fax)
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card data-testid="contact-email">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Mail className="h-6 w-6 text-primary-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Email</h3>
                        <p className="text-slate-600 dark:text-slate-400">
                          master.bdsi@usmba.ac.ma<br />
                          info@fsdm.ac.ma
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card data-testid="contact-hours">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Clock className="h-6 w-6 text-primary-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Horaires</h3>
                        <p className="text-slate-600 dark:text-slate-400">
                          Lundi - Vendredi: 8h00 - 18h00<br />
                          Samedi: 8h00 - 12h00<br />
                          Dimanche: Fermé
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Contact Options */}
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Contacts rapides</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3" data-testid="quick-contact-admission">
                    <User className="h-4 w-4 text-primary-600" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Admissions: admission.bdsi@usmba.ac.ma
                    </span>
                  </div>
                  <div className="flex items-center space-x-3" data-testid="quick-contact-partnership">
                    <Building className="h-4 w-4 text-primary-600" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Partenariats: partenariats.bdsi@usmba.ac.ma
                    </span>
                  </div>
                  <div className="flex items-center space-x-3" data-testid="quick-contact-general">
                    <MessageSquare className="h-4 w-4 text-primary-600" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Contact général: master.bdsi@usmba.ac.ma
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 font-playfair">
              Nous trouver
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Faculté des Sciences Dhar El Mehraz, Fès
            </p>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg">
            <GoogleMap 
              lat={34.03518273576291}
              lng={-4.976621301708027}
              zoom={15}
              className="aspect-video w-full"
              title="Faculté des Sciences Dhar El Mehraz"
            />
          </div>

          {/* Informations de localisation supplémentaires */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                  <MapPin className="h-5 w-5 text-primary-600 mr-2" />
                  Accès en voiture
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Depuis le centre-ville de Fès, prenez la route d'Imouzzer (N8) en direction d'Ifrane. 
                  La faculté se trouve à environ 3 km sur votre droite. Parking disponible sur le campus.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                  <MapPin className="h-5 w-5 text-primary-600 mr-2" />
                  Transport en commun
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Lignes de bus urbain : 12, 16 et 19 avec arrêt "Faculté des Sciences". 
                  Taxi collectif depuis Bab Boujloud ou la gare routière.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}

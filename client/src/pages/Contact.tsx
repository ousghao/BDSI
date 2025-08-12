import { useState } from "react";
import { Layout } from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
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

const contactReasons = [
  { value: "admission", label: "Candidature et admission" },
  { value: "program", label: "Information sur le programme" },
  { value: "partnership", label: "Partenariat entreprise" },
  { value: "internship", label: "Stage ou projet" },
  { value: "research", label: "Collaboration recherche" },
  { value: "other", label: "Autre" },
];

export default function Contact() {
  const { toast } = useToast();
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would typically send the form data to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
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
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'envoi. Veuillez réessayer.",
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
              Nous Contacter
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Une question ? Un projet ? Nous sommes là pour vous accompagner dans votre démarche
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
                Envoyez-nous un message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nom complet *</Label>
                    <Input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Votre nom complet"
                      data-testid="input-name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="votre.email@exemple.com"
                      data-testid="input-email"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+212 6XX XX XX XX"
                      data-testid="input-phone"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="organization">Organisation</Label>
                    <Input
                      id="organization"
                      type="text"
                      value={formData.organization}
                      onChange={(e) => handleInputChange("organization", e.target.value)}
                      placeholder="Votre entreprise/université"
                      data-testid="input-organization"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="reason">Motif de contact *</Label>
                  <Select value={formData.reason} onValueChange={(value) => handleInputChange("reason", value)}>
                    <SelectTrigger data-testid="select-reason">
                      <SelectValue placeholder="Sélectionnez un motif" />
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
                  <Label htmlFor="subject">Sujet *</Label>
                  <Input
                    id="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => handleInputChange("subject", e.target.value)}
                    placeholder="Objet de votre message"
                    data-testid="input-subject"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Décrivez votre demande en détail..."
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
                    "Envoi en cours..."
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Envoyer le message
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Details */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 font-playfair">
                  Nos coordonnées
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8">
                  N'hésitez pas à nous contacter par les moyens suivants ou à nous rendre visite sur notre campus.
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
            <div className="aspect-video bg-slate-200 dark:bg-slate-700 flex items-center justify-center" data-testid="map-placeholder">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400">
                  Carte interactive disponible prochainement
                </p>
                <p className="text-sm text-slate-400 mt-2">
                  Coordonnées GPS: 34.0378° N, 5.0055° W
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

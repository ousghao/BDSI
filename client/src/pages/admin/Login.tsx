import { Layout } from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/LoginForm";

export default function AdminLogin() {
  const { t } = useLanguage();
  
  return (
    <Layout>
      <section className="bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 text-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">{t("admin.login.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}



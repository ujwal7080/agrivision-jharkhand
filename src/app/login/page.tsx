"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ClientLayout from "../ClientLayout";
import { Sprout, Lock, Mail, Loader2 } from "lucide-react";
import { authClient, useSession } from "@/lib/auth-client";
import { toast } from "sonner";

function LoginForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending: sessionLoading } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: true,
  });

  useEffect(() => {
    if (!sessionLoading && session?.user) {
      router.push("/dashboard");
    }
  }, [session, sessionLoading, router]);

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      toast.success(t("login.registeredSuccess"));
    }
  }, [searchParams, t]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
        callbackURL: "/dashboard"
      });

      if (error?.code) {
        toast.error(t("login.invalidCredentials"));
        setIsLoading(false);
        return;
      }

      toast.success(t("login.success"));
      router.push("/dashboard");
    } catch (err) {
      toast.error(t("common.error"));
      setIsLoading(false);
    }
  };

  if (sessionLoading) {
    return (
      <div className="min-h-screen w-full agri-gradient agri-pattern flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
      </div>
    );
  }

  if (session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen w-full agri-gradient agri-pattern flex items-center justify-center p-4">
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>

      <Card className="w-full max-w-md shadow-2xl border-2 border-green-200 bg-white/95 backdrop-blur">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center shadow-lg animate-bounce-slow">
            <Sprout className="w-12 h-12 text-white" />
          </div>
          <CardTitle className="text-4xl font-bold text-green-800">
            {t("app.name")}
          </CardTitle>
          <CardDescription className="text-xl text-green-700 font-medium">
            {t("app.tagline")}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <h2 className="text-2xl font-semibold text-center text-green-800 mb-6">
              {t("login.title")}
            </h2>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-lg flex items-center gap-2 text-gray-700">
                <Mail className="w-5 h-5 text-green-600" />
                {t("login.email")}
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-12 text-lg border-2 focus:border-green-500"
                placeholder="farmer@example.com"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-lg flex items-center gap-2 text-gray-700">
                <Lock className="w-5 h-5 text-green-600" />
                {t("login.password")}
              </Label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="h-12 text-lg border-2 focus:border-green-500"
                placeholder="••••••••"
                disabled={isLoading}
                autoComplete="off"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="rememberMe"
                checked={formData.rememberMe}
                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                disabled={isLoading}
              />
              <Label htmlFor="rememberMe" className="text-sm text-gray-700 cursor-pointer">
                {t("login.rememberMe")}
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 text-xl font-bold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {t("common.loading")}
                </>
              ) : (
                t("login.button")
              )}
            </Button>

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600 mb-3">
                {t("login.noAccount")}
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/register")}
                className="w-full h-12 text-lg border-2 border-green-600 text-green-700 hover:bg-green-50"
                disabled={isLoading}
              >
                {t("login.registerNow")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full agri-gradient agri-pattern flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

export default function Login() {
  return (
    <ClientLayout>
      <LoginPage />
    </ClientLayout>
  );
}
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ClientLayout from "../ClientLayout";
import { Sprout, Lock, Mail, User, Loader2, MapPin, Camera, X } from "lucide-react";
import { authClient, useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function RegisterPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    village: "",
    district: "",
    state: "Jharkhand",
  });

  useEffect(() => {
    if (!sessionLoading && session?.user) {
      router.push("/dashboard");
    }
  }, [session, sessionLoading, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error(t("register.passwordMismatch"));
      return;
    }

    if (formData.password.length < 6) {
      toast.error(t("register.passwordTooShort"));
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Sign up the user
      const { error: signupError } = await authClient.signUp.email({
        email: formData.email,
        name: formData.name,
        password: formData.password,
      });

      if (signupError?.code) {
        if (signupError.code === "USER_ALREADY_EXISTS") {
          toast.error(t("register.userExists"));
        } else {
          toast.error(t("register.failed"));
        }
        setIsLoading(false);
        return;
      }

      // Step 2: Automatically sign in the user after successful registration
      const { error: signinError } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (signinError?.code) {
        // Registration succeeded but auto-login failed, redirect to login
        toast.success(t("register.success"));
        router.push("/login?registered=true");
        return;
      }

      // Step 3: Update user profile with location data and profile image (now we have a valid token)
      if (formData.village || formData.district || profileImage) {
        try {
          // Wait a bit to ensure token is saved
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const token = localStorage.getItem("bearer_token");
          if (token) {
            const updatePayload: {
              village?: string;
              district?: string;
              state?: string;
              image?: string;
            } = {};

            if (formData.village) updatePayload.village = formData.village;
            if (formData.district) updatePayload.district = formData.district;
            if (formData.state) updatePayload.state = formData.state;
            if (profileImage) updatePayload.image = profileImage;

            await fetch("/api/user/profile", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(updatePayload),
            });
          }
        } catch (err) {
          console.error("Failed to update profile:", err);
          // Don't fail the whole process if profile update fails
        }
      }

      toast.success(t("register.success"));
      // Redirect to dashboard instead of login since user is now logged in
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
        <CardHeader className="text-center space-y-4 pb-6">
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
          <form onSubmit={handleRegister} className="space-y-5">
            <h2 className="text-2xl font-semibold text-center text-green-800 mb-4">
              {t("register.title")}
            </h2>

            {/* Profile Photo Upload */}
            <div className="space-y-2">
              <Label className="text-base flex items-center gap-2 text-gray-700">
                <Camera className="w-4 h-4 text-green-600" />
                Profile Photo (Optional)
              </Label>
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20 border-2 border-green-200">
                  <AvatarImage src={profileImage || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-green-600 to-green-700 text-white text-2xl">
                    {formData.name?.charAt(0).toUpperCase() || <Camera className="w-8 h-8" />}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="flex-1 border-2 border-green-500 text-green-700 hover:bg-green-50"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Choose Photo
                  </Button>
                  {profileImage && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleRemoveImage}
                      disabled={isLoading}
                      className="border-2 border-red-500 text-red-600 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <p className="text-sm text-gray-500">
                Upload a profile photo (Max 5MB)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-base flex items-center gap-2 text-gray-700">
                <User className="w-4 h-4 text-green-600" />
                {t("register.name")}
              </Label>
              <Input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-11 text-base border-2 focus:border-green-500"
                placeholder={t("register.namePlaceholder")}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-base flex items-center gap-2 text-gray-700">
                <Mail className="w-4 h-4 text-green-600" />
                {t("register.email")}
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-11 text-base border-2 focus:border-green-500"
                placeholder="farmer@example.com"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="village" className="text-base flex items-center gap-2 text-gray-700">
                <MapPin className="w-4 h-4 text-green-600" />
                {t("register.village")}
              </Label>
              <Input
                id="village"
                type="text"
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                className="h-11 text-base border-2 focus:border-green-500"
                placeholder={t("register.villagePlaceholder")}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="district" className="text-base flex items-center gap-2 text-gray-700">
                <MapPin className="w-4 h-4 text-green-600" />
                {t("register.district")}
              </Label>
              <Input
                id="district"
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="h-11 text-base border-2 focus:border-green-500"
                placeholder={t("register.districtPlaceholder")}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-base flex items-center gap-2 text-gray-700">
                <Lock className="w-4 h-4 text-green-600" />
                {t("register.password")}
              </Label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="h-11 text-base border-2 focus:border-green-500"
                placeholder="••••••••"
                disabled={isLoading}
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-base flex items-center gap-2 text-gray-700">
                <Lock className="w-4 h-4 text-green-600" />
                {t("register.confirmPassword")}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="h-11 text-base border-2 focus:border-green-500"
                placeholder="••••••••"
                disabled={isLoading}
                autoComplete="off"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-13 text-xl font-bold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {t("common.loading")}
                </>
              ) : (
                t("register.button")
              )}
            </Button>

            <div className="text-center pt-3 border-t border-gray-200">
              <p className="text-gray-600 mb-3">
                {t("register.haveAccount")}
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/login")}
                className="w-full h-11 text-base border-2 border-green-600 text-green-700 hover:bg-green-50"
                disabled={isLoading}
              >
                {t("register.loginNow")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Register() {
  return (
    <ClientLayout>
      <RegisterPage />
    </ClientLayout>
  );
}
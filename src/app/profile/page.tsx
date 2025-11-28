"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ClientLayout from "../ClientLayout";
import {
  User,
  Mail,
  MapPin,
  Loader2,
  Camera,
  Edit2,
  Save,
  X,
  ArrowLeft,
  Sprout,
} from "lucide-react";
import { authClient, useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  village?: string;
  district?: string;
  state?: string;
  location?: string;
}

function ProfilePage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { data: session, isPending, refetch } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    village: "",
    district: "",
    state: "Jharkhand",
    location: "",
  });

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user) return;

      try {
        const token = localStorage.getItem("bearer_token");
        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await fetch("/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
          setFormData({
            name: data.name || "",
            village: data.village || "",
            district: data.district || "",
            state: data.state || "Jharkhand",
            location: data.location || "",
          });
        } else {
          toast.error("Failed to load profile");
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        toast.error("Error loading profile");
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user && !isPending) {
      fetchProfile();
    }
  }, [session, isPending]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
      return;
    }

    setIsUploadingImage(true);

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;

        const token = localStorage.getItem("bearer_token");
        const response = await fetch("/api/user/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ image: base64String }),
        });

        if (response.ok) {
          const updatedProfile = await response.json();
          setProfile(updatedProfile);
          toast.success("Profile picture updated!");
          refetch();
        } else {
          toast.error("Failed to update profile picture");
        }
        setIsUploadingImage(false);
      };

      reader.onerror = () => {
        toast.error("Error reading file");
        setIsUploadingImage(false);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Error uploading image:", err);
      toast.error("Error uploading image");
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = async () => {
    setIsUploadingImage(true);

    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ image: null }),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        toast.success("Profile picture removed");
        refetch();
      } else {
        toast.error("Failed to remove profile picture");
      }
    } catch (err) {
      console.error("Error removing image:", err);
      toast.error("Error removing image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    setIsSaving(true);

    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          village: formData.village.trim(),
          district: formData.district.trim(),
          state: formData.state.trim(),
        }),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setIsEditing(false);
        toast.success("Profile updated successfully!");
        refetch();
      } else {
        toast.error("Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Error updating profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        village: profile.village || "",
        district: profile.district || "",
        state: profile.state || "Jharkhand",
        location: profile.location || "",
      });
    }
    setIsEditing(false);
  };

  if (isPending || isLoading) {
    return (
      <div className="min-h-screen w-full agri-gradient agri-pattern flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
      </div>
    );
  }

  if (!session?.user || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/dashboard")}
                className="text-white hover:bg-white/20 rounded-full"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <Sprout className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{t("app.name")}</h1>
                <p className="text-sm text-green-100">{t("profile.title") || "My Profile"}</p>
              </div>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="shadow-2xl border-2 border-green-200">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-green-200">
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl font-bold text-green-800 flex items-center gap-2">
                <User className="w-8 h-8" />
                {t("profile.title") || "My Profile"}
              </CardTitle>
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  {t("profile.edit") || "Edit Profile"}
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-8 space-y-8">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center gap-4 pb-6 border-b-2 border-gray-200">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-green-200 shadow-lg">
                  <AvatarImage src={profile.image || undefined} alt={profile.name} />
                  <AvatarFallback className="bg-gradient-to-br from-green-600 to-green-700 text-white text-4xl">
                    {profile.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isUploadingImage && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                  variant="outline"
                  className="border-2 border-green-600 text-green-700 hover:bg-green-50"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {profile.image ? t("profile.changePicture") || "Change Picture" : t("profile.uploadPicture") || "Upload Picture"}
                </Button>
                {profile.image && (
                  <Button
                    onClick={handleRemoveImage}
                    disabled={isUploadingImage}
                    variant="outline"
                    className="border-2 border-red-500 text-red-600 hover:bg-red-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    {t("profile.remove") || "Remove"}
                  </Button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <p className="text-sm text-gray-500 text-center">
                {t("profile.imageHint") || "JPG, PNG or GIF. Max size 2MB"}
              </p>
            </div>

            {/* Profile Information */}
            <div className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-5 h-5 text-green-600" />
                  {t("profile.name")}
                </Label>
                {isEditing ? (
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-12 text-base border-2 focus:border-green-500"
                    placeholder={t("register.namePlaceholder")}
                  />
                ) : (
                  <p className="text-xl text-gray-800 p-3 bg-gray-50 rounded-lg border-2 border-gray-200">
                    {profile.name}
                  </p>
                )}
              </div>

              {/* Email Field (Read-only) */}
              <div className="space-y-2">
                <Label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-green-600" />
                  {t("profile.email")}
                </Label>
                <p className="text-xl text-gray-800 p-3 bg-gray-50 rounded-lg border-2 border-gray-200">
                  {profile.email}
                </p>
                <p className="text-sm text-gray-500">
                  {t("profile.emailHint")}
                </p>
              </div>

              {/* Village Field */}
              <div className="space-y-2">
                <Label htmlFor="village" className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  {t("profile.village")}
                </Label>
                {isEditing ? (
                  <Input
                    id="village"
                    type="text"
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    className="h-12 text-base border-2 focus:border-green-500"
                    placeholder={t("register.villagePlaceholder")}
                  />
                ) : (
                  <p className="text-xl text-gray-800 p-3 bg-gray-50 rounded-lg border-2 border-gray-200">
                    {profile.village || t("profile.notSet")}
                  </p>
                )}
              </div>

              {/* District Field */}
              <div className="space-y-2">
                <Label htmlFor="district" className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  {t("profile.district")}
                </Label>
                {isEditing ? (
                  <Input
                    id="district"
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="h-12 text-base border-2 focus:border-green-500"
                    placeholder={t("register.districtPlaceholder")}
                  />
                ) : (
                  <p className="text-xl text-gray-800 p-3 bg-gray-50 rounded-lg border-2 border-gray-200">
                    {profile.district || t("profile.notSet")}
                  </p>
                )}
              </div>

              {/* State Field */}
              <div className="space-y-2">
                <Label htmlFor="state" className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  {t("profile.state")}
                </Label>
                {isEditing ? (
                  <Input
                    id="state"
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="h-12 text-base border-2 focus:border-green-500"
                    placeholder="Jharkhand"
                  />
                ) : (
                  <p className="text-xl text-gray-800 p-3 bg-gray-50 rounded-lg border-2 border-gray-200">
                    {profile.state || "Jharkhand"}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-4 pt-6 border-t-2 border-gray-200">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 h-12 text-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {t("common.saving") || "Saving..."}
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      {t("common.save") || "Save Changes"}
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleCancel}
                  disabled={isSaving}
                  variant="outline"
                  className="flex-1 h-12 text-lg border-2 border-gray-300 hover:bg-gray-50"
                >
                  <X className="w-5 h-5 mr-2" />
                  {t("common.cancel") || "Cancel"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <ClientLayout>
      <ProfilePage />
    </ClientLayout>
  );
}
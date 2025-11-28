"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ClientLayout from "../ClientLayout";
import WeatherWidget from "@/components/WeatherWidget";
import {
  Camera,
  Newspaper,
  Sprout,
  TrendingUp,
  ShoppingCart,
  FileText,
  Phone,
  User,
  LogOut,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient, useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const menuItems = [
  {
    key: "soilScanner",
    icon: Camera,
    gradient: "from-amber-500 to-orange-600",
    href: "/soil-scanner",
  },
  {
    key: "news",
    icon: Newspaper,
    gradient: "from-blue-500 to-indigo-600",
    href: "/news",
  },
  {
    key: "cropAnalysis",
    icon: Sprout,
    gradient: "from-green-500 to-emerald-600",
    href: "/crop-analysis",
  },
  {
    key: "market",
    icon: TrendingUp,
    gradient: "from-purple-500 to-pink-600",
    href: "/market",
  },
  {
    key: "shop",
    icon: ShoppingCart,
    gradient: "from-cyan-500 to-blue-600",
    href: "/shop",
  },
  {
    key: "services",
    icon: FileText,
    gradient: "from-yellow-500 to-amber-600",
    href: "/services",
  },
  {
    key: "kisanCall",
    icon: Phone,
    gradient: "from-red-500 to-rose-600",
    href: "/kisan-call",
  },
];

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  village?: string;
  district?: string;
  state?: string;
}

function DashboardPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { data: session, isPending, refetch } = useSession();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!session?.user) return;
      
      try {
        const token = localStorage.getItem("bearer_token");
        if (!token) {
          setProfileLoading(false);
          return;
        }

        const response = await fetch("/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const profile = await response.json();
          setUserProfile(profile);
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      } finally {
        setProfileLoading(false);
      }
    };

    if (session?.user && !isPending) {
      fetchUserProfile();
    }
  }, [session, isPending]);

  const handleLogout = async () => {
    const { error } = await authClient.signOut();
    if (error?.code) {
      toast.error(error.code);
    } else {
      localStorage.removeItem("bearer_token");
      refetch();
      router.push("/login");
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen w-full agri-gradient agri-pattern flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <Sprout className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{t("app.name")}</h1>
                <p className="text-sm text-green-100">{t("app.tagline")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <Button
                onClick={handleLogout}
                variant="outline"
                className="bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 h-10 px-4 backdrop-blur-sm"
              >
                <LogOut className="w-5 h-5 mr-2" />
                <span className="font-medium">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-2 border-green-200">
          <div className="flex items-center gap-4">
            <div 
              onClick={() => router.push("/profile")}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <Avatar className="w-16 h-16 border-2 border-green-200">
                <AvatarImage src={userProfile?.image || undefined} alt={session.user.name} />
                <AvatarFallback className="bg-gradient-to-br from-green-600 to-green-700 text-white text-2xl">
                  {session.user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-green-800">
                {t("dashboard.welcome")}, {session.user.name}!
              </h2>
              <p className="text-lg text-gray-600">{t("login.welcome")}</p>
              <Button
                onClick={() => router.push("/profile")}
                variant="link"
                className="h-auto p-0 text-green-600 hover:text-green-700 font-medium"
              >
                <User className="w-4 h-4 mr-1" />
                {t("profile.viewProfile") || "View Profile"}
              </Button>
            </div>
          </div>
        </div>

        {/* Weather Widget */}
        {!profileLoading && (
          <div className="mb-8">
            <WeatherWidget district={userProfile?.district} />
          </div>
        )}

        {/* Menu Grid */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-8">
            {t("dashboard.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.key}
                  onClick={() => router.push(item.href)}
                  className="cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-gray-200 hover:border-green-400 bg-white overflow-hidden group"
                >
                  <CardContent className="p-0">
                    <div className={`h-32 bg-gradient-to-br ${item.gradient} agri-pattern flex items-center justify-center relative`}>
                      <Icon className="w-20 h-20 text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-center text-gray-800 group-hover:text-green-700 transition-colors">
                        {t(`menu.${item.key}`)}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ClientLayout>
      <DashboardPage />
    </ClientLayout>
  );
}
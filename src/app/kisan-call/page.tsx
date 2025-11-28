"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ClientLayout from "../ClientLayout";
import { ArrowLeft, Phone, Clock, MessageCircle, Headphones, Info } from "lucide-react";

function KisanCallPage() {
  const { t } = useLanguage();
  const router = useRouter();

  const handleCall = () => {
    window.location.href = "tel:18001801551";
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-red-50 via-rose-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => router.push("/dashboard")}
                variant="ghost"
                className="text-white hover:bg-white/20"
                size="icon"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{t("kisan.title")}</h1>
                <p className="text-sm text-red-100">{t("kisan.helpline")}</p>
              </div>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Main Call Card */}
          <Card className="shadow-2xl border-4 border-red-300 bg-gradient-to-br from-white to-red-50">
            <CardHeader className="text-center">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-red-600 to-rose-700 rounded-full flex items-center justify-center shadow-lg animate-pulse mb-4">
                <Phone className="w-14 h-14 text-white" />
              </div>
              <CardTitle className="text-4xl text-red-800 mb-2">
                {t("kisan.title")}
              </CardTitle>
              <p className="text-xl text-gray-600">{t("kisan.helpline")}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-gray-700 text-lg mb-2">Call Toll-Free Number</p>
                <div className="bg-white rounded-2xl p-6 border-4 border-red-200 shadow-lg mb-6">
                  <p className="text-6xl font-bold text-red-700 tracking-wider">
                    {t("kisan.number")}
                  </p>
                </div>
              </div>

              <Button
                onClick={handleCall}
                className="w-full h-20 text-3xl font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <Phone className="w-10 h-10 mr-4" />
                {t("kisan.call")}
              </Button>

              <p className="text-center text-gray-600 text-lg">
                Get instant support for all your agricultural queries
              </p>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 border-red-200 hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center shrink-0">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-red-800 mb-2">24/7 Available</h3>
                    <p className="text-gray-600">
                      Call anytime, day or night. Expert support available round the clock for farmers.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-200 hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shrink-0">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-800 mb-2">Multi-Language</h3>
                    <p className="text-gray-600">
                      Support available in Hindi, English, and local languages including Nagpuri.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-200 hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shrink-0">
                    <Headphones className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-green-800 mb-2">Expert Advice</h3>
                    <p className="text-gray-600">
                      Get guidance from agricultural experts on crops, pests, weather, and schemes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-200 hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shrink-0">
                    <Info className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-purple-800 mb-2">Completely Free</h3>
                    <p className="text-gray-600">
                      Toll-free service with no charges. Call as many times as you need support.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Services Offered */}
          <Card className="border-2 border-red-200 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-red-800">Services Offered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2 shrink-0" />
                  <p className="text-gray-700">Crop cultivation techniques and best practices</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2 shrink-0" />
                  <p className="text-gray-700">Pest and disease management solutions</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2 shrink-0" />
                  <p className="text-gray-700">Weather forecasts and advisories</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2 shrink-0" />
                  <p className="text-gray-700">Soil health and fertilizer recommendations</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2 shrink-0" />
                  <p className="text-gray-700">Market prices and selling strategies</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2 shrink-0" />
                  <p className="text-gray-700">Government schemes and subsidies information</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2 shrink-0" />
                  <p className="text-gray-700">Loan and insurance guidance</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2 shrink-0" />
                  <p className="text-gray-700">Farm equipment and technology advice</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Note */}
          <Card className="border-2 border-yellow-400 bg-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Info className="w-8 h-8 text-yellow-700 shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-yellow-800 mb-2">Important Note</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-700 font-bold">•</span>
                      <span>This is a government toll-free helpline - completely free for all farmers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-700 font-bold">•</span>
                      <span>Keep your farmer ID or land details ready for faster assistance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-700 font-bold">•</span>
                      <span>Available in multiple languages including Hindi, English, and regional dialects</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call Again Button */}
          <Button
            onClick={handleCall}
            className="w-full h-16 text-2xl font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-lg"
          >
            <Phone className="w-8 h-8 mr-3" />
            Call {t("kisan.number")} Now
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function KisanCall() {
  return (
    <ClientLayout>
      <KisanCallPage />
    </ClientLayout>
  );
}

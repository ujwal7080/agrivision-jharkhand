"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ClientLayout from "../ClientLayout";
import { ArrowLeft, Sprout, TrendingUp, DollarSign, Calendar, Loader2, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const cropDatabase = [
  {
    crop: "Paddy (Rice)",
    cropHi: "धान",
    cropNp: "धान",
    suitability: 95,
    reason: "High nitrogen, adequate rainfall, suitable temperature",
    reasonHi: "उच्च नाइट्रोजन, पर्याप्त वर्षा, उपयुक्त तापमान",
    reasonNp: "ज्यादा नाइट्रोजन, बरसात अच्छा, तापमान सही",
    cost: 25000,
    profit: 45000,
    season: "Kharif (June-Oct)",
    seasonHi: "खरीफ (जून-अक्टूबर)",
    seasonNp: "खरीफ (जून-अक्टूबर)",
    fertilizers: ["Urea", "DAP", "Potash"],
    fertilizersHi: ["यूरिया", "डीएपी", "पोटाश"],
    fertilizersNp: ["यूरिया", "डीएपी", "पोटाश"],
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80",
  },
  {
    crop: "Wheat",
    cropHi: "गेहूं",
    cropNp: "गहुम",
    suitability: 88,
    reason: "Good phosphorus levels, optimal pH, suitable for loamy soil",
    reasonHi: "अच्छा फास्फोरस स्तर, इष्टतम pH, दोमट मिट्टी के लिए उपयुक्त",
    reasonNp: "फास्फोरस अच्छा, pH सही, दोमट माटी के लेल सही",
    cost: 20000,
    profit: 38000,
    season: "Rabi (Nov-Mar)",
    seasonHi: "रबी (नवंबर-मार्च)",
    seasonNp: "रबी (नवंबर-मार्च)",
    fertilizers: ["Urea", "SSP", "MOP"],
    fertilizersHi: ["यूरिया", "एसएसपी", "एमओपी"],
    fertilizersNp: ["यूरिया", "एसएसपी", "एमओपी"],
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80",
  },
  {
    crop: "Maize",
    cropHi: "मक्का",
    cropNp: "मकई",
    suitability: 85,
    reason: "Balanced NPK ratio, moderate rainfall requirement",
    reasonHi: "संतुलित एनपीके अनुपात, मध्यम वर्षा आवश्यकता",
    reasonNp: "संतुलित एनपीके, मध्यम बरसात चाही",
    cost: 18000,
    profit: 35000,
    season: "Kharif & Rabi",
    seasonHi: "खरीफ और रबी",
    seasonNp: "खरीफ अर रबी",
    fertilizers: ["Urea", "DAP", "Zinc"],
    fertilizersHi: ["यूरिया", "डीएपी", "जिंक"],
    fertilizersNp: ["यूरिया", "डीएपी", "जिंक"],
    image: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400&q=80",
  },
];

function CropAnalysisPage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    rainfall: "",
    temperature: "",
    moisture: "",
    ph: "",
    landArea: "",
  });

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzing(true);
    setProgress(0);
    
    // Simulate ML analysis with progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 8;
      });
    }, 150);

    // Simulate crop recommendation after 1.5 seconds
    setTimeout(() => {
      // Simple logic: recommend all crops with random suitability scores
      const recommendations = cropDatabase.map(crop => ({
        ...crop,
        suitability: Math.floor(Math.random() * 20) + 75, // 75-95 range
      })).sort((a, b) => b.suitability - a.suitability);
      
      setResults(recommendations);
      setAnalyzing(false);
    }, 1500);
  };

  const getLocalizedText = (item: any, field: string) => {
    const fieldMap: any = {
      crop: language === "hi" ? "cropHi" : language === "np" ? "cropNp" : "crop",
      reason: language === "hi" ? "reasonHi" : language === "np" ? "reasonNp" : "reason",
      season: language === "hi" ? "seasonHi" : language === "np" ? "seasonNp" : "season",
      fertilizers: language === "hi" ? "fertilizersHi" : language === "np" ? "fertilizersNp" : "fertilizers",
    };
    return item[fieldMap[field]] || item[field];
  };

  const resetForm = () => {
    setResults([]);
    setFormData({
      nitrogen: "",
      phosphorus: "",
      potassium: "",
      rainfall: "",
      temperature: "",
      moisture: "",
      ph: "",
      landArea: "",
    });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg sticky top-0 z-50">
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
                <h1 className="text-2xl font-bold">{t("crop.title")}</h1>
                <p className="text-sm text-green-100">AI-Powered Recommendations</p>
              </div>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {results.length === 0 ? (
          <Card className="shadow-xl border-2 border-green-200">
            <CardHeader>
              <CardTitle className="text-3xl text-center text-green-800 flex items-center justify-center gap-3">
                <Sprout className="w-10 h-10" />
                {t("crop.title")}
              </CardTitle>
              <p className="text-center text-gray-600 text-lg mt-2">
                Enter soil parameters for personalized crop recommendations
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAnalyze} className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nitrogen" className="text-lg font-semibold text-gray-700">
                      {t("crop.nitrogen")}
                    </Label>
                    <Input
                      id="nitrogen"
                      type="number"
                      required
                      value={formData.nitrogen}
                      onChange={(e) => setFormData({ ...formData, nitrogen: e.target.value })}
                      className="h-12 text-lg border-2 focus:border-green-500"
                      placeholder="40-60"
                      min="0"
                      max="200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phosphorus" className="text-lg font-semibold text-gray-700">
                      {t("crop.phosphorus")}
                    </Label>
                    <Input
                      id="phosphorus"
                      type="number"
                      required
                      value={formData.phosphorus}
                      onChange={(e) => setFormData({ ...formData, phosphorus: e.target.value })}
                      className="h-12 text-lg border-2 focus:border-green-500"
                      placeholder="20-40"
                      min="0"
                      max="200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="potassium" className="text-lg font-semibold text-gray-700">
                      {t("crop.potassium")}
                    </Label>
                    <Input
                      id="potassium"
                      type="number"
                      required
                      value={formData.potassium}
                      onChange={(e) => setFormData({ ...formData, potassium: e.target.value })}
                      className="h-12 text-lg border-2 focus:border-green-500"
                      placeholder="20-40"
                      min="0"
                      max="200"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="rainfall" className="text-lg font-semibold text-gray-700">
                      {t("crop.rainfall")}
                    </Label>
                    <Input
                      id="rainfall"
                      type="number"
                      required
                      value={formData.rainfall}
                      onChange={(e) => setFormData({ ...formData, rainfall: e.target.value })}
                      className="h-12 text-lg border-2 focus:border-green-500"
                      placeholder="200-300"
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="temperature" className="text-lg font-semibold text-gray-700">
                      {t("crop.temperature")}
                    </Label>
                    <Input
                      id="temperature"
                      type="number"
                      required
                      value={formData.temperature}
                      onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                      className="h-12 text-lg border-2 focus:border-green-500"
                      placeholder="25-35"
                      min="-10"
                      max="60"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="moisture" className="text-lg font-semibold text-gray-700">
                      {t("crop.moisture")}
                    </Label>
                    <Input
                      id="moisture"
                      type="number"
                      required
                      value={formData.moisture}
                      onChange={(e) => setFormData({ ...formData, moisture: e.target.value })}
                      className="h-12 text-lg border-2 focus:border-green-500"
                      placeholder="40-60"
                      min="0"
                      max="100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ph" className="text-lg font-semibold text-gray-700">
                      {t("crop.ph")}
                    </Label>
                    <Input
                      id="ph"
                      type="number"
                      step="0.1"
                      required
                      value={formData.ph}
                      onChange={(e) => setFormData({ ...formData, ph: e.target.value })}
                      className="h-12 text-lg border-2 focus:border-green-500"
                      placeholder="6.0-7.5"
                      min="0"
                      max="14"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="landArea" className="text-lg font-semibold text-gray-700">
                      {t("crop.landArea")}
                    </Label>
                    <Input
                      id="landArea"
                      type="number"
                      required
                      value={formData.landArea}
                      onChange={(e) => setFormData({ ...formData, landArea: e.target.value })}
                      className="h-12 text-lg border-2 focus:border-green-500"
                      placeholder="5-10"
                      min="0"
                    />
                  </div>
                </div>

                {analyzing && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-3">
                      <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                      <span className="text-xl font-semibold text-green-800">
                        Analyzing soil parameters...
                      </span>
                    </div>
                    <Progress value={progress} className="h-3" />
                    <p className="text-center text-gray-600">{progress}% Complete</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={analyzing}
                  className="w-full h-16 text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sprout className="w-6 h-6 mr-3" />
                      {t("crop.analyze")}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="shadow-xl border-2 border-green-400 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <CheckCircle2 className="w-12 h-12" />
                    <div>
                      <h2 className="text-3xl font-bold">Analysis Complete!</h2>
                      <p className="text-green-100 text-lg">
                        Found {results.length} suitable crops for your land
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={resetForm}
                    variant="secondary"
                    className="h-12 px-6"
                  >
                    New Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>

            <h3 className="text-2xl font-bold text-green-800">{t("crop.recommended")}</h3>

            <div className="grid gap-6">
              {results.map((crop, index) => (
                <Card
                  key={index}
                  className={`shadow-xl transition-all duration-300 hover:shadow-2xl border-2 ${
                    index === 0
                      ? "border-green-400 bg-gradient-to-br from-green-50 to-emerald-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="md:flex">
                    <div className="md:w-1/4">
                      <img
                        src={crop.image}
                        alt={getLocalizedText(crop, "crop")}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:w-3/4">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-3xl font-bold text-green-800 mb-2">
                              {getLocalizedText(crop, "crop")}
                            </h3>
                            {index === 0 && (
                              <Badge className="bg-green-600 text-white text-sm">
                                Top Recommendation
                              </Badge>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-4xl font-bold text-green-700">
                              {crop.suitability}%
                            </div>
                            <p className="text-sm text-gray-600">Suitability</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-1">Why This Crop?</h4>
                            <p className="text-gray-600">{getLocalizedText(crop, "reason")}</p>
                          </div>

                          <div className="grid md:grid-cols-3 gap-4 pt-2">
                            <div className="bg-white rounded-lg p-4 border-2 border-green-200">
                              <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="w-5 h-5 text-green-600" />
                                <h4 className="font-semibold text-gray-700">{t("crop.cost")}</h4>
                              </div>
                              <p className="text-2xl font-bold text-gray-800">
                                ₹{(crop.cost * parseFloat(formData.landArea)).toLocaleString()}
                              </p>
                            </div>

                            <div className="bg-white rounded-lg p-4 border-2 border-green-200">
                              <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                                <h4 className="font-semibold text-gray-700">{t("crop.profit")}</h4>
                              </div>
                              <p className="text-2xl font-bold text-green-700">
                                ₹{(crop.profit * parseFloat(formData.landArea)).toLocaleString()}
                              </p>
                            </div>

                            <div className="bg-white rounded-lg p-4 border-2 border-green-200">
                              <div className="flex items-center gap-2 mb-2">
                                <Calendar className="w-5 h-5 text-green-600" />
                                <h4 className="font-semibold text-gray-700">{t("crop.season")}</h4>
                              </div>
                              <p className="text-lg font-semibold text-gray-800">
                                {getLocalizedText(crop, "season")}
                              </p>
                            </div>
                          </div>

                          <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-700 mb-2">
                              Recommended Fertilizers:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {getLocalizedText(crop, "fertilizers").map((fertilizer: string, i: number) => (
                                <Badge
                                  key={i}
                                  className="bg-amber-600 text-white text-sm px-3 py-1"
                                >
                                  {fertilizer}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CropAnalysis() {
  return (
    <ClientLayout>
      <CropAnalysisPage />
    </ClientLayout>
  );
}
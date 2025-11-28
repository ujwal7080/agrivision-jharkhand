"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ClientLayout from "../ClientLayout";
import { ArrowLeft, TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const marketData = [
  {
    crop: "Paddy (Rice)",
    cropHi: "धान",
    cropNp: "धान",
    currentPrice: 2100,
    lastWeekPrice: 2000,
    trend: "up",
    change: 5,
    mandi: "Ranchi Mandi",
    bestSell: "Now - Good Time",
    bestSellHi: "अभी - अच्छा समय",
    bestSellNp: "अभी - अच्छा समय",
    bestBuy: "Wait 2 weeks",
    bestBuyHi: "2 सप्ताह प्रतीक्षा करें",
    bestBuyNp: "2 हफ्ता इंतजार करा",
    prediction: 2250,
    rating: "good",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80",
    priceHistory: [1900, 1950, 2000, 2050, 2100],
  },
  {
    crop: "Wheat",
    cropHi: "गेहूं",
    cropNp: "गहुम",
    currentPrice: 2350,
    lastWeekPrice: 2300,
    trend: "up",
    change: 2.2,
    mandi: "Jamshedpur Mandi",
    bestSell: "Next week",
    bestSellHi: "अगले सप्ताह",
    bestSellNp: "अगले हफ्ता",
    bestBuy: "Now",
    bestBuyHi: "अभी",
    bestBuyNp: "अभी",
    prediction: 2400,
    rating: "medium",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f10874ce-d36c-426b-ba98-ffafaff0b8d1/generated_images/professional-agricultural-photograph-of--31bbc8d8-20251128104514.jpg",
    priceHistory: [2200, 2250, 2300, 2320, 2350],
  },
  {
    crop: "Maize",
    cropHi: "मक्का",
    cropNp: "मकई",
    currentPrice: 1850,
    lastWeekPrice: 1900,
    trend: "down",
    change: -2.6,
    mandi: "Dhanbad Mandi",
    bestSell: "Wait",
    bestSellHi: "प्रतीक्षा करें",
    bestSellNp: "इंतजार करा",
    bestBuy: "Excellent time",
    bestBuyHi: "उत्कृष्ट समय",
    bestBuyNp: "बहुत अच्छा समय",
    prediction: 1950,
    rating: "poor",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f10874ce-d36c-426b-ba98-ffafaff0b8d1/generated_images/close-up-photograph-of-fresh-golden-yell-eb64fa58-20251128103443.jpg",
    priceHistory: [2000, 1950, 1900, 1875, 1850],
  },
  {
    crop: "Soybean",
    cropHi: "सोयाबीन",
    cropNp: "सोयाबीन",
    currentPrice: 4500,
    lastWeekPrice: 4500,
    trend: "stable",
    change: 0,
    mandi: "Bokaro Mandi",
    bestSell: "Neutral",
    bestSellHi: "तटस्थ",
    bestSellNp: "सामान्य",
    bestBuy: "Neutral",
    bestBuyHi: "तटस्थ",
    bestBuyNp: "सामान्य",
    prediction: 4550,
    rating: "medium",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f10874ce-d36c-426b-ba98-ffafaff0b8d1/generated_images/close-up-photograph-of-fresh-soybeans-in-82df4cd6-20251128104513.jpg",
    priceHistory: [4400, 4450, 4500, 4500, 4500],
  },
  {
    crop: "Onion",
    cropHi: "प्याज",
    cropNp: "पियाज",
    currentPrice: 3500,
    lastWeekPrice: 3200,
    trend: "up",
    change: 9.4,
    mandi: "Ranchi Mandi",
    bestSell: "Excellent - Sell Now",
    bestSellHi: "उत्कृष्ट - अभी बेचें",
    bestSellNp: "बहुत अच्छा - अभी बेचा",
    bestBuy: "Don't buy",
    bestBuyHi: "न खरीदें",
    bestBuyNp: "मत खरीदा",
    prediction: 3800,
    rating: "good",
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&q=80",
    priceHistory: [2800, 3000, 3200, 3350, 3500],
  },
  {
    crop: "Potato",
    cropHi: "आलू",
    cropNp: "आलू",
    currentPrice: 1200,
    lastWeekPrice: 1250,
    trend: "down",
    change: -4,
    mandi: "Hazaribagh Mandi",
    bestSell: "Hold",
    bestSellHi: "रुकें",
    bestSellNp: "रुका",
    bestBuy: "Good time",
    bestBuyHi: "अच्छा समय",
    bestBuyNp: "अच्छा समय",
    prediction: 1300,
    rating: "poor",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80",
    priceHistory: [1400, 1350, 1300, 1250, 1200],
  },
];

function MarketPage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [selectedCrop, setSelectedCrop] = useState<any>(null);

  const getLocalizedText = (item: any, field: string) => {
    const fieldMap: any = {
      crop: language === "hi" ? "cropHi" : language === "np" ? "cropNp" : "crop",
      bestSell: language === "hi" ? "bestSellHi" : language === "np" ? "bestSellNp" : "bestSell",
      bestBuy: language === "hi" ? "bestBuyHi" : language === "np" ? "bestBuyNp" : "bestBuy",
    };
    return item[fieldMap[field]] || item[field];
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case "good":
        return "bg-green-100 text-green-800 border-green-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "poor":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getRatingText = (rating: string) => {
    const texts: any = {
      good: { en: "Good Time", hi: "अच्छा समय", np: "अच्छा समय" },
      medium: { en: "Moderate", hi: "सामान्य", np: "सामान्य" },
      poor: { en: "Poor Time", hi: "खराब समय", np: "खराब समय" },
    };
    return texts[rating]?.[language] || texts[rating]?.en || rating;
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg sticky top-0 z-50">
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
                <h1 className="text-2xl font-bold">{t("market.title")}</h1>
                <p className="text-sm text-purple-100">Jharkhand Mandi Prices</p>
              </div>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {!selectedCrop ? (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6 border-2 border-purple-200">
              <h2 className="text-2xl font-bold text-purple-800 mb-2">Live Market Prices</h2>
              <p className="text-gray-600">Updated every hour from Jharkhand mandis</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketData.map((item, index) => (
                <Card
                  key={index}
                  className="cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 border-purple-200 overflow-hidden group"
                  onClick={() => setSelectedCrop(item)}
                >
                  <div className="h-40 overflow-hidden">
                    <img
                      src={item.image}
                      alt={getLocalizedText(item, "crop")}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-2xl font-bold text-purple-800">
                            {getLocalizedText(item, "crop")}
                          </h3>
                          <p className="text-sm text-gray-600">{item.mandi}</p>
                        </div>
                        <Badge className={`border-2 ${getRatingColor(item.rating)}`}>
                          {getRatingText(item.rating)}
                        </Badge>
                      </div>

                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-sm text-gray-600">{t("market.currentPrice")}</p>
                          <p className="text-3xl font-bold text-gray-800">
                            ₹{item.currentPrice}
                            <span className="text-sm font-normal text-gray-600">/quintal</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.trend === "up" ? (
                            <TrendingUp className="w-8 h-8 text-green-600" />
                          ) : item.trend === "down" ? (
                            <TrendingDown className="w-8 h-8 text-red-600" />
                          ) : (
                            <Minus className="w-8 h-8 text-gray-600" />
                          )}
                          <span
                            className={`text-xl font-bold ${
                              item.trend === "up"
                                ? "text-green-600"
                                : item.trend === "down"
                                ? "text-red-600"
                                : "text-gray-600"
                            }`}
                          >
                            {item.change > 0 ? "+" : ""}
                            {item.change}%
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 border-t-2 border-gray-200">
                        <Button
                          variant="outline"
                          className="w-full border-2 border-purple-400 text-purple-700 hover:bg-purple-50"
                        >
                          <ArrowUpRight className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Button
              onClick={() => setSelectedCrop(null)}
              variant="outline"
              className="border-2 border-purple-400"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Market
            </Button>

            <Card className="shadow-xl border-2 border-purple-300">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img
                    src={selectedCrop.image}
                    alt={getLocalizedText(selectedCrop, "crop")}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-4xl text-purple-800">
                          {getLocalizedText(selectedCrop, "crop")}
                        </CardTitle>
                        <p className="text-lg text-gray-600 mt-2">{selectedCrop.mandi}</p>
                      </div>
                      <Badge className={`text-lg px-4 py-2 border-2 ${getRatingColor(selectedCrop.rating)}`}>
                        {getRatingText(selectedCrop.rating)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-6 border-2 border-purple-200">
                        <p className="text-sm text-gray-600 mb-2">{t("market.currentPrice")}</p>
                        <p className="text-4xl font-bold text-purple-800">
                          ₹{selectedCrop.currentPrice}
                        </p>
                        <p className="text-sm text-gray-600">per quintal</p>
                      </div>
                      <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl p-6 border-2 border-blue-200">
                        <p className="text-sm text-gray-600 mb-2">{t("market.prediction")}</p>
                        <p className="text-4xl font-bold text-blue-800">
                          ₹{selectedCrop.prediction}
                        </p>
                        <p className="text-sm text-gray-600">in 30 days</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-white rounded-xl p-4 border-2 border-gray-200">
                      <span className="text-gray-600">Weekly Change:</span>
                      <div className="flex items-center gap-2">
                        {selectedCrop.trend === "up" ? (
                          <TrendingUp className="w-6 h-6 text-green-600" />
                        ) : selectedCrop.trend === "down" ? (
                          <TrendingDown className="w-6 h-6 text-red-600" />
                        ) : (
                          <Minus className="w-6 h-6 text-gray-600" />
                        )}
                        <span
                          className={`text-2xl font-bold ${
                            selectedCrop.trend === "up"
                              ? "text-green-600"
                              : selectedCrop.trend === "down"
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          {selectedCrop.change > 0 ? "+" : ""}
                          {selectedCrop.change}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>

            {/* Price Trend Chart */}
            <Card className="shadow-xl border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="text-2xl text-purple-800 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6" />
                  {t("market.trend")} (Last 5 Weeks)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedCrop.priceHistory.map((price: number, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Week {index + 1}</span>
                        <span className="text-lg font-bold text-purple-800">₹{price}</span>
                      </div>
                      <Progress
                        value={(price / Math.max(...selectedCrop.priceHistory)) * 100}
                        className="h-3"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className={`shadow-xl border-2 ${selectedCrop.rating === 'good' ? 'border-green-400 bg-green-50' : selectedCrop.rating === 'poor' ? 'border-red-400 bg-red-50' : 'border-yellow-400 bg-yellow-50'}`}>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <TrendingUp className="w-6 h-6" />
                    {t("market.bestSell")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-gray-800">
                    {getLocalizedText(selectedCrop, "bestSell")}
                  </p>
                </CardContent>
              </Card>

              <Card className={`shadow-xl border-2 ${selectedCrop.rating === 'poor' ? 'border-green-400 bg-green-50' : selectedCrop.rating === 'good' ? 'border-red-400 bg-red-50' : 'border-yellow-400 bg-yellow-50'}`}>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <ArrowDownRight className="w-6 h-6" />
                    {t("market.bestBuy")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-gray-800">
                    {getLocalizedText(selectedCrop, "bestBuy")}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Market() {
  return (
    <ClientLayout>
      <MarketPage />
    </ClientLayout>
  );
}
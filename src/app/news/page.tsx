"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ClientLayout from "../ClientLayout";
import { ArrowLeft, Newspaper, TrendingUp, CloudRain, Lightbulb, ExternalLink, RefreshCw, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAgriculturalNews } from "@/lib/hooks/useAgriculturalNews";
import { toast } from "sonner";

const marketPrices = [
  {
    crop: "Paddy",
    cropHi: "धान",
    cropNp: "धान",
    price: "₹2,100",
    location: "Ranchi Mandi",
    change: "+5%",
    trend: "up",
  },
  {
    crop: "Wheat",
    cropHi: "गेहूं",
    cropNp: "गहुम",
    price: "₹2,350",
    location: "Jamshedpur Mandi",
    change: "+2%",
    trend: "up",
  },
  {
    crop: "Maize",
    cropHi: "मक्का",
    cropNp: "मकई",
    price: "₹1,850",
    location: "Dhanbad Mandi",
    change: "-3%",
    trend: "down",
  },
  {
    crop: "Pulses (Arhar)",
    cropHi: "दाल (अरहर)",
    cropNp: "दाल (अरहर)",
    price: "₹6,500",
    location: "Bokaro Mandi",
    change: "+8%",
    trend: "up",
  },
];

const weatherAlerts = [
  {
    id: 1,
    title: "Light Rainfall Expected",
    titleHi: "हल्की बारिश की संभावना",
    titleNp: "हलुक बरसात होखत",
    description: "Light to moderate rainfall expected in North Jharkhand over next 3 days.",
    descriptionHi: "अगले 3 दिनों में उत्तरी झारखंड में हल्की से मध्यम बारिश की संभावना।",
    descriptionNp: "अगले 3 दिन में उत्तर झारखंड में हलुक बरसात होखत।",
    severity: "low",
  },
  {
    id: 2,
    title: "Cold Wave Warning",
    titleHi: "शीतलहर की चेतावनी",
    titleNp: "ठंढा के चेतावनी",
    description: "Cold wave conditions likely in parts of Jharkhand. Protect crops.",
    descriptionHi: "झारखंड के कुछ हिस्सों में शीतलहर की स्थिति संभावित है। फसलों की रक्षा करें।",
    descriptionNp: "झारखंड के कुछ हिस्सा में ठंढा पड़त। फसल के बचावा।",
    severity: "medium",
  },
];

const dailyTips = [
  {
    id: 1,
    tip: "Use neem oil spray to control pests naturally in winter crops.",
    tipHi: "सर्दियों की फसलों में कीटों को प्राकृतिक रूप से नियंत्रित करने के लिए नीम के तेल का छिड़काव करें।",
    tipNp: "ठंढा के फसल में कीड़ा मारे के लेल नीम तेल के छिड़काव करा।",
  },
  {
    id: 2,
    tip: "Apply mulching to retain soil moisture during dry winter months.",
    tipHi: "सूखे सर्दियों के महीनों में मिट्टी की नमी बनाए रखने के लिए मल्चिंग करें।",
    tipNp: "सूखा ठंढा में माटी के नमी बचावे के लेल मल्चिंग करा।",
  },
  {
    id: 3,
    tip: "Check soil pH before sowing Rabi crops for optimal growth.",
    tipHi: "इष्टतम विकास के लिए रबी फसलों की बुवाई से पहले मिट्टी का pH जांचें।",
    tipNp: "रबी फसल बोवे से पहिले माटी के pH देखा।",
  },
];

function NewsPage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("kisan-news");
  
  // Live news with auto-refresh every 5 minutes
  const { articles, loading, error, refetch } = useAgriculturalNews({
    query: 'agriculture farming government schemes PM-Kisan India',
    region: 'jharkhand',
    limit: 15,
    pollInterval: 300000 // 5 minutes
  });

  const getLocalizedText = (item: any, field: string) => {
    const fieldMap: any = {
      title: language === "hi" ? "titleHi" : language === "np" ? "titleNp" : "title",
      description: language === "hi" ? "descriptionHi" : language === "np" ? "descriptionNp" : "description",
      tip: language === "hi" ? "tipHi" : language === "np" ? "tipNp" : "tip",
      crop: language === "hi" ? "cropHi" : language === "np" ? "cropNp" : "crop",
    };
    return item[fieldMap[field]] || item[field];
  };

  const handleRefresh = async () => {
    toast.loading("Refreshing news...", { id: "refresh" });
    await refetch();
    toast.success("News updated!", { id: "refresh" });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg sticky top-0 z-50">
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
                <h1 className="text-2xl font-bold">{t("news.title")}</h1>
                <p className="text-sm text-blue-100">Live Agricultural Updates</p>
              </div>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-white shadow-md mb-8">
            <TabsTrigger value="kisan-news" className="text-sm md:text-base h-14 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Newspaper className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">{t("news.kisanNews")}</span>
              <span className="sm:hidden">News</span>
            </TabsTrigger>
            <TabsTrigger value="market" className="text-sm md:text-base h-14 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <TrendingUp className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">{t("news.market")}</span>
              <span className="sm:hidden">Market</span>
            </TabsTrigger>
            <TabsTrigger value="weather" className="text-sm md:text-base h-14 data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
              <CloudRain className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">{t("news.weather")}</span>
              <span className="sm:hidden">Weather</span>
            </TabsTrigger>
            <TabsTrigger value="tips" className="text-sm md:text-base h-14 data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              <Lightbulb className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">{t("news.tips")}</span>
              <span className="sm:hidden">Tips</span>
            </TabsTrigger>
          </TabsList>

          {/* Kisan News Tab - Live API */}
          <TabsContent value="kisan-news" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-600 text-white">
                  Live Updates
                </Badge>
                {!loading && (
                  <span className="text-sm text-gray-600">
                    {articles.length} articles
                  </span>
                )}
              </div>
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                disabled={loading}
                className="border-2 border-blue-400"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {error && (
              <Card className="border-2 border-red-300 bg-red-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 text-red-800">
                    <div className="flex-1">
                      <p className="font-semibold">Failed to load news</p>
                      <p className="text-sm">{error}</p>
                    </div>
                    <Button onClick={handleRefresh} variant="outline" className="border-red-400">
                      Retry
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {loading && articles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-600">Loading latest agricultural news...</p>
              </div>
            ) : (
              <>
                {articles.map((news, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-blue-200">
                    <div className="md:flex">
                      {news.image && (
                        <div className="md:w-1/3">
                          <img
                            src={news.image}
                            alt={news.title}
                            className="w-full h-48 md:h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80';
                            }}
                          />
                        </div>
                      )}
                      <div className={news.image ? "md:w-2/3" : "w-full"}>
                        <CardHeader>
                          <div className="flex items-start justify-between gap-4">
                            <CardTitle className="text-2xl text-blue-800">
                              {news.title}
                            </CardTitle>
                            <Badge className="bg-blue-600 text-white shrink-0">
                              {news.source.name}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">{formatDate(news.publishedAt)}</p>
                        </CardHeader>
                        <CardContent>
                          <p className="text-lg text-gray-700 mb-4">
                            {news.description}
                          </p>
                          <Button
                            onClick={() => {
                              const isInIframe = window.self !== window.top;
                              if (isInIframe) {
                                window.parent.postMessage(
                                  { type: "OPEN_EXTERNAL_URL", data: { url: news.url } },
                                  "*"
                                );
                              } else {
                                window.open(news.url, "_blank", "noopener,noreferrer");
                              }
                            }}
                            variant="outline"
                            className="border-2 border-blue-400 text-blue-700 hover:bg-blue-50"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Read Full Article
                          </Button>
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                ))}
              </>
            )}

            {!loading && articles.length === 0 && !error && (
              <Card className="border-2 border-gray-200">
                <CardContent className="p-12 text-center">
                  <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No news articles available</p>
                  <Button onClick={handleRefresh} variant="outline" className="mt-4">
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Market Prices Tab */}
          <TabsContent value="market" className="space-y-4">
            {marketPrices.map((item, index) => (
              <Card key={index} className="border-2 border-purple-200 hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-purple-800 mb-1">
                        {getLocalizedText(item, "crop")}
                      </h3>
                      <p className="text-gray-600">{item.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-gray-800 mb-1">{item.price}</p>
                      <Badge
                        className={`text-base ${
                          item.trend === "up"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.change}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Weather Alerts Tab */}
          <TabsContent value="weather" className="space-y-4">
            {weatherAlerts.map((alert) => (
              <Card
                key={alert.id}
                className={`border-2 ${
                  alert.severity === "high"
                    ? "border-red-400 bg-red-50"
                    : alert.severity === "medium"
                    ? "border-orange-400 bg-orange-50"
                    : "border-yellow-400 bg-yellow-50"
                }`}
              >
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <CloudRain className="w-8 h-8 text-cyan-700" />
                    {getLocalizedText(alert, "title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-gray-700">
                    {getLocalizedText(alert, "description")}
                  </p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Daily Tips Tab */}
          <TabsContent value="tips" className="space-y-4">
            {dailyTips.map((item) => (
              <Card key={item.id} className="border-2 border-amber-200 hover:shadow-lg transition-all bg-gradient-to-r from-amber-50 to-yellow-50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center shrink-0">
                      <Lightbulb className="w-7 h-7 text-white" />
                    </div>
                    <p className="text-lg text-gray-800 leading-relaxed pt-2">
                      {getLocalizedText(item, "tip")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function News() {
  return (
    <ClientLayout>
      <NewsPage />
    </ClientLayout>
  );
}
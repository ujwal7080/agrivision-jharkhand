"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ClientLayout from "../ClientLayout";
import {
  ArrowLeft,
  FileText,
  Award,
  Landmark,
  Building2,
  ExternalLink,
  Phone,
  Mail,
  Download,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const governmentSchemes = [
  {
    id: 1,
    name: "PM-KISAN",
    nameHi: "पीएम-किसान",
    nameNp: "पीएम-किसान",
    description: "Direct income support of ₹6000/year to farmer families",
    descriptionHi: "किसान परिवारों को ₹6000/वर्ष की प्रत्यक्ष आय सहायता",
    descriptionNp: "किसान परिवार के लेल ₹6000/साल के सीधा मदद",
    eligibility: "All landholding farmer families",
    eligibilityHi: "सभी भूमि धारक किसान परिवार",
    eligibilityNp: "सब जमीन वाला किसान परिवार",
    contact: "1800-180-1551",
    website: "pmkisan.gov.in",
    type: "scheme",
    icon: Award,
    color: "from-green-600 to-emerald-600",
  },
  {
    id: 2,
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    nameHi: "प्रधानमंत्री फसल बीमा योजना",
    nameNp: "प्रधानमंत्री फसल बीमा योजना",
    description: "Crop insurance scheme for natural calamities",
    descriptionHi: "प्राकृतिक आपदाओं के लिए फसल बीमा योजना",
    descriptionNp: "प्राकृतिक आपदा के लेल फसल बीमा",
    eligibility: "All farmers growing notified crops",
    eligibilityHi: "अधिसूचित फसलें उगाने वाले सभी किसान",
    eligibilityNp: "सब किसान जे अधिसूचित फसल लगावत हे",
    contact: "1800-180-1551",
    website: "pmfby.gov.in",
    type: "scheme",
    icon: Award,
    color: "from-blue-600 to-indigo-600",
  },
  {
    id: 3,
    name: "Kisan Credit Card (KCC)",
    nameHi: "किसान क्रेडिट कार्ड",
    nameNp: "किसान क्रेडिट कार्ड",
    description: "Short-term credit facility for agricultural needs",
    descriptionHi: "कृषि जरूरतों के लिए अल्पकालिक ऋण सुविधा",
    descriptionNp: "खेती के जरूरत के लेल छोट अवधि के कर्जा",
    eligibility: "Farmers with land holdings",
    eligibilityHi: "भूमि धारण वाले किसान",
    eligibilityNp: "जमीन वाला किसान",
    contact: "Local Bank Branch",
    website: "banks.gov.in/kcc",
    type: "loan",
    icon: Landmark,
    color: "from-purple-600 to-pink-600",
  },
  {
    id: 4,
    name: "Soil Health Card Scheme",
    nameHi: "मृदा स्वास्थ्य कार्ड योजना",
    nameNp: "माटी स्वास्थ्य कार्ड योजना",
    description: "Free soil testing and recommendations",
    descriptionHi: "मुफ्त मिट्टी परीक्षण और सिफारिशें",
    descriptionNp: "मुफ्त माटी जांच अर सलाह",
    eligibility: "All farmers in Jharkhand",
    eligibilityHi: "झारखंड में सभी किसान",
    eligibilityNp: "झारखंड के सब किसान",
    contact: "District Agriculture Office",
    website: "soilhealth.dac.gov.in",
    type: "scheme",
    icon: Award,
    color: "from-amber-600 to-orange-600",
  },
];

const subsidies = [
  {
    id: 1,
    name: "Fertilizer Subsidy",
    nameHi: "उर्वरक सब्सिडी",
    nameNp: "खाद सब्सिडी",
    description: "Subsidy on DAP, Urea, and other fertilizers",
    descriptionHi: "डीएपी, यूरिया और अन्य उर्वरकों पर सब्सिडी",
    descriptionNp: "डीएपी, यूरिया अर अन्य खाद पर सब्सिडी",
    benefit: "Up to 50% subsidy",
    benefitHi: "50% तक सब्सिडी",
    benefitNp: "50% तलक सब्सिडी",
    contact: "Fertilizer Shop",
  },
  {
    id: 2,
    name: "Seed Subsidy",
    nameHi: "बीज सब्सिडी",
    nameNp: "बीज सब्सिडी",
    description: "Financial assistance for purchasing quality seeds",
    descriptionHi: "गुणवत्ता वाले बीज खरीदने के लिए वित्तीय सहायता",
    descriptionNp: "अच्छा बीज खरीदे के लेल आर्थिक मदद",
    benefit: "30-40% subsidy",
    benefitHi: "30-40% सब्सिडी",
    benefitNp: "30-40% सब्सिडी",
    contact: "District Agriculture Office",
  },
  {
    id: 3,
    name: "Farm Equipment Subsidy",
    nameHi: "कृषि उपकरण सब्सिडी",
    nameNp: "खेती औजार सब्सिडी",
    description: "Subsidy on tractors, pumps, and other equipment",
    descriptionHi: "ट्रैक्टर, पंप और अन्य उपकरणों पर सब्सिडी",
    descriptionNp: "ट्रैक्टर, पंप अर अन्य औजार पर सब्सिडी",
    benefit: "25-50% subsidy",
    benefitHi: "25-50% सब्सिडी",
    benefitNp: "25-50% सब्सिडी",
    contact: "Agriculture Department",
  },
];

const agencies = [
  {
    id: 1,
    name: "Department of Agriculture, Jharkhand",
    nameHi: "कृषि विभाग, झारखंड",
    nameNp: "खेती विभाग, झारखंड",
    description: "Main agricultural department for Jharkhand state",
    descriptionHi: "झारखंड राज्य के लिए मुख्य कृषि विभाग",
    descriptionNp: "झारखंड राज्य के मुख्य खेती विभाग",
    address: "Krishi Bhawan, Kanke Road, Ranchi",
    phone: "0651-2490912",
    email: "agri.dept@jharkhand.gov.in",
  },
  {
    id: 2,
    name: "Jharkhand State Seed Certification Agency",
    nameHi: "झारखंड राज्य बीज प्रमाणन एजेंसी",
    nameNp: "झारखंड राज्य बीज प्रमाणन एजेंसी",
    description: "Quality seed certification and distribution",
    descriptionHi: "गुणवत्ता बीज प्रमाणन और वितरण",
    descriptionNp: "गुणवत्ता बीज प्रमाणन अर वितरण",
    address: "Hotwar, Ranchi",
    phone: "0651-2491234",
    email: "jsssca@gmail.com",
  },
  {
    id: 3,
    name: "Krishi Vigyan Kendra (KVK)",
    nameHi: "कृषि विज्ञान केंद्र",
    nameNp: "कृषि विज्ञान केंद्र",
    description: "Agricultural training and extension center",
    descriptionHi: "कृषि प्रशिक्षण और विस्तार केंद्र",
    descriptionNp: "खेती प्रशिक्षण अर विस्तार केंद्र",
    address: "Multiple locations across Jharkhand",
    phone: "District-specific",
    email: "kvk@jharkhand.gov.in",
  },
];

function ServicesPage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("schemes");

  const getLocalizedText = (item: any, field: string) => {
    const fieldMap: any = {
      name: language === "hi" ? "nameHi" : language === "np" ? "nameNp" : "name",
      description: language === "hi" ? "descriptionHi" : language === "np" ? "descriptionNp" : "description",
      eligibility: language === "hi" ? "eligibilityHi" : language === "np" ? "eligibilityNp" : "eligibility",
      benefit: language === "hi" ? "benefitHi" : language === "np" ? "benefitNp" : "benefit",
    };
    return item[fieldMap[field]] || item[field];
  };

  const handleApply = (website: string, schemeName: string) => {
    const url = website.startsWith('http') ? website : `https://${website}`;
    
    // Check if we're in an iframe
    const isInIframe = window.self !== window.top;
    
    if (isInIframe) {
      // Post message to parent to open URL
      window.parent.postMessage(
        { type: "OPEN_EXTERNAL_URL", data: { url } },
        "*"
      );
    } else {
      // Open in new tab
      window.open(url, "_blank", "noopener,noreferrer");
    }
    
    toast.success(
      language === "hi"
        ? `${schemeName} के लिए पेज खोला जा रहा है...`
        : language === "np"
        ? `${schemeName} के लेल पेज खोलल जा रहल हे...`
        : `Opening ${schemeName} application page...`
    );
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 to-amber-600 text-white shadow-lg sticky top-0 z-50">
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
                <h1 className="text-2xl font-bold">{t("services.title")}</h1>
                <p className="text-sm text-yellow-100">Government Support for Farmers</p>
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
            <TabsTrigger
              value="schemes"
              className="text-sm md:text-base h-14 data-[state=active]:bg-yellow-600 data-[state=active]:text-white"
            >
              <Award className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">{t("services.schemes")}</span>
              <span className="sm:hidden">Schemes</span>
            </TabsTrigger>
            <TabsTrigger
              value="subsidies"
              className="text-sm md:text-base h-14 data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <FileText className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">{t("services.subsidies")}</span>
              <span className="sm:hidden">Subsidies</span>
            </TabsTrigger>
            <TabsTrigger
              value="loans"
              className="text-sm md:text-base h-14 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Landmark className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">{t("services.loans")}</span>
              <span className="sm:hidden">Loans</span>
            </TabsTrigger>
            <TabsTrigger
              value="agencies"
              className="text-sm md:text-base h-14 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <Building2 className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">{t("services.agencies")}</span>
              <span className="sm:hidden">Agencies</span>
            </TabsTrigger>
          </TabsList>

          {/* Government Schemes Tab */}
          <TabsContent value="schemes" className="space-y-6">
            {governmentSchemes
              .filter((s) => s.type === "scheme")
              .map((scheme) => {
                const Icon = scheme.icon;
                return (
                  <Card
                    key={scheme.id}
                    className="hover:shadow-2xl transition-all duration-300 border-2 border-yellow-200 overflow-hidden"
                  >
                    <div className={`h-3 bg-gradient-to-r ${scheme.color}`} />
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${scheme.color} flex items-center justify-center shrink-0`}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-2xl text-yellow-800">
                              {getLocalizedText(scheme, "name")}
                            </CardTitle>
                            <p className="text-gray-600 mt-2 text-lg">
                              {getLocalizedText(scheme, "description")}
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800 border-2 border-green-300">
                          Active
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-700 mb-2">Eligibility:</h4>
                        <p className="text-gray-700">{getLocalizedText(scheme, "eligibility")}</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 bg-white rounded-lg p-4 border-2 border-gray-200">
                          <Phone className="w-6 h-6 text-yellow-600" />
                          <div>
                            <p className="text-sm text-gray-600">Contact</p>
                            <p className="font-semibold text-gray-800">{scheme.contact}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white rounded-lg p-4 border-2 border-gray-200">
                          <ExternalLink className="w-6 h-6 text-yellow-600" />
                          <div>
                            <p className="text-sm text-gray-600">Website</p>
                            <p className="font-semibold text-gray-800 truncate">{scheme.website}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button 
                          variant="outline" 
                          className="flex-1 border-2 border-yellow-400 text-yellow-700 hover:bg-yellow-50"
                          onClick={() => handleApply(scheme.website, getLocalizedText(scheme, "name"))}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Learn More
                        </Button>
                        <Button 
                          className="flex-1 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700"
                          onClick={() => handleApply(scheme.website, getLocalizedText(scheme, "name"))}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Apply Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </TabsContent>

          {/* Subsidies Tab */}
          <TabsContent value="subsidies" className="space-y-4">
            {subsidies.map((subsidy) => (
              <Card
                key={subsidy.id}
                className="border-2 border-green-200 hover:shadow-lg transition-all"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-green-800 mb-2">
                        {getLocalizedText(subsidy, "name")}
                      </h3>
                      <p className="text-gray-700 mb-4 text-lg">
                        {getLocalizedText(subsidy, "description")}
                      </p>
                      <div className="flex items-center gap-4 flex-wrap">
                        <Badge className="bg-green-600 text-white text-base px-4 py-2">
                          {getLocalizedText(subsidy, "benefit")}
                        </Badge>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span>{subsidy.contact}</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      className="bg-gradient-to-r from-green-600 to-emerald-600"
                      disabled
                      title="Contact office for application"
                    >
                      Apply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Loans Tab */}
          <TabsContent value="loans" className="space-y-6">
            {governmentSchemes
              .filter((s) => s.type === "loan")
              .map((loan) => {
                const Icon = loan.icon;
                return (
                  <Card
                    key={loan.id}
                    className="hover:shadow-2xl transition-all duration-300 border-2 border-purple-200 overflow-hidden"
                  >
                    <div className={`h-3 bg-gradient-to-r ${loan.color}`} />
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${loan.color} flex items-center justify-center shrink-0`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-2xl text-purple-800">
                            {getLocalizedText(loan, "name")}
                          </CardTitle>
                          <p className="text-gray-600 mt-2 text-lg">
                            {getLocalizedText(loan, "description")}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-700 mb-2">Eligibility:</h4>
                        <p className="text-gray-700">{getLocalizedText(loan, "eligibility")}</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 bg-white rounded-lg p-4 border-2 border-gray-200">
                          <Phone className="w-6 h-6 text-purple-600" />
                          <div>
                            <p className="text-sm text-gray-600">Contact</p>
                            <p className="font-semibold text-gray-800">{loan.contact}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white rounded-lg p-4 border-2 border-gray-200">
                          <ExternalLink className="w-6 h-6 text-purple-600" />
                          <div>
                            <p className="text-sm text-gray-600">Website</p>
                            <p className="font-semibold text-gray-800 truncate">{loan.website}</p>
                          </div>
                        </div>
                      </div>

                      <Button 
                        className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        onClick={() => handleApply(loan.website, getLocalizedText(loan, "name"))}
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Apply for Loan
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
          </TabsContent>

          {/* Agencies Tab */}
          <TabsContent value="agencies" className="space-y-4">
            {agencies.map((agency) => (
              <Card
                key={agency.id}
                className="border-2 border-blue-200 hover:shadow-lg transition-all"
              >
                <CardHeader>
                  <CardTitle className="text-2xl text-blue-800 flex items-center gap-3">
                    <Building2 className="w-8 h-8" />
                    {getLocalizedText(agency, "name")}
                  </CardTitle>
                  <p className="text-gray-600 text-lg">
                    {getLocalizedText(agency, "description")}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3 text-gray-700">
                    <Building2 className="w-5 h-5 mt-1 text-blue-600 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-semibold">{agency.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-gray-700">
                    <Phone className="w-5 h-5 mt-1 text-blue-600 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-semibold">{agency.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-gray-700">
                    <Mail className="w-5 h-5 mt-1 text-blue-600 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold">{agency.email}</p>
                    </div>
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

export default function Services() {
  return (
    <ClientLayout>
      <ServicesPage />
    </ClientLayout>
  );
}
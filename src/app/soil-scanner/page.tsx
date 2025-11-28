"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ClientLayout from "../ClientLayout";
import { Camera, ArrowLeft, Loader2, CheckCircle, Sprout } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const soilTypes = [
  { type: "red", color: "#8B4513", fertility: 65, crop: "Paddy, Pulses, Millets" },
  { type: "black", color: "#2C1810", fertility: 85, crop: "Cotton, Wheat, Soybean" },
  { type: "sandy", color: "#C2B280", fertility: 45, crop: "Groundnut, Watermelon" },
  { type: "loamy", color: "#6B4423", fertility: 90, crop: "Wheat, Sugarcane, Vegetables" },
  { type: "alluvial", color: "#8B7355", fertility: 88, crop: "Rice, Wheat, Maize" },
  { type: "laterite", color: "#A0522D", fertility: 55, crop: "Tea, Coffee, Cashew" },
];

function SoilScannerPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streaming, setStreaming] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setStreaming(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Unable to access camera. Please allow camera permissions or upload an image.");
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvasRef.current.toDataURL("image/png");
        setCapturedImage(imageData);
        
        // Stop camera stream
        const stream = videoRef.current.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
        setStreaming(false);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeSoil = () => {
    setAnalyzing(true);
    setProgress(0);
    
    // Simulate ML analysis with progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate soil detection after 2 seconds
    setTimeout(() => {
      const randomSoil = soilTypes[Math.floor(Math.random() * soilTypes.length)];
      setResult(randomSoil);
      setAnalyzing(false);
    }, 2000);
  };

  const resetScanner = () => {
    setCapturedImage(null);
    setResult(null);
    setProgress(0);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg sticky top-0 z-50">
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
                <h1 className="text-2xl font-bold">{t("soil.title")}</h1>
                <p className="text-sm text-orange-100">CAM Soil Detection</p>
              </div>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {!capturedImage && !streaming && (
          <Card className="shadow-xl border-2 border-orange-200">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-orange-800">
                {t("soil.capture")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-4">
                <Button
                  onClick={startCamera}
                  className="h-16 text-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                >
                  <Camera className="w-8 h-8 mr-3" />
                  {t("soil.capture")}
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">OR</span>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="h-16 text-xl border-2 border-orange-400 text-orange-700 hover:bg-orange-50"
                >
                  <Camera className="w-8 h-8 mr-3" />
                  Upload Soil Image
                </Button>
              </div>

              <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6 mt-6">
                <h3 className="font-semibold text-lg text-orange-800 mb-3">How to use:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">1.</span>
                    <span>Take a clear photo of your soil</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">2.</span>
                    <span>Make sure the soil is visible and well-lit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">3.</span>
                    <span>Get instant soil type detection and crop recommendations</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Camera View */}
        {streaming && (
          <Card className="shadow-xl border-2 border-orange-200">
            <CardContent className="p-6">
              <video
                ref={videoRef}
                className="w-full rounded-lg mb-4 bg-black"
                autoPlay
                playsInline
              />
              <canvas ref={canvasRef} className="hidden" />
              <div className="flex gap-4">
                <Button
                  onClick={captureImage}
                  className="flex-1 h-14 text-xl bg-gradient-to-r from-amber-600 to-orange-600"
                >
                  <Camera className="w-6 h-6 mr-2" />
                  Capture Photo
                </Button>
                <Button
                  onClick={resetScanner}
                  variant="outline"
                  className="h-14 px-6 border-2"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Image Preview & Analysis */}
        {capturedImage && !result && (
          <Card className="shadow-xl border-2 border-orange-200">
            <CardContent className="p-6">
              <img
                src={capturedImage}
                alt="Captured soil"
                className="w-full rounded-lg mb-6"
              />
              
              {analyzing && (
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
                    <span className="text-xl font-semibold text-orange-800">
                      Analyzing soil...
                    </span>
                  </div>
                  <Progress value={progress} className="h-3" />
                  <p className="text-center text-gray-600">{progress}% Complete</p>
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  onClick={analyzeSoil}
                  disabled={analyzing}
                  className="flex-1 h-14 text-xl bg-gradient-to-r from-green-600 to-emerald-600"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-6 h-6 mr-2" />
                      {t("soil.analyze")}
                    </>
                  )}
                </Button>
                <Button
                  onClick={resetScanner}
                  variant="outline"
                  disabled={analyzing}
                  className="h-14 px-6 border-2"
                >
                  Retake
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <Card className="shadow-xl border-2 border-green-400 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="text-3xl text-center text-green-800 flex items-center justify-center gap-3">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                  Analysis Complete!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <img
                  src={capturedImage!}
                  alt="Analyzed soil"
                  className="w-full rounded-lg"
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl p-6 border-2 border-green-200 shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">
                      {t("soil.type")}
                    </h3>
                    <div className="flex items-center gap-4">
                      <div
                        className="w-16 h-16 rounded-full border-4 border-gray-200 shadow-inner"
                        style={{ backgroundColor: result.color }}
                      />
                      <div>
                        <p className="text-2xl font-bold text-green-800">
                          {t(`soil.${result.type}`)}
                        </p>
                        <p className="text-sm text-gray-600">Detected Soil Type</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 border-2 border-green-200 shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">
                      {t("soil.fertility")}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-green-700">
                          {result.fertility}
                        </span>
                        <span className="text-xl text-gray-600 mb-1">/100</span>
                      </div>
                      <Progress value={result.fertility} className="h-3" />
                      <p className="text-sm text-gray-600">
                        {result.fertility >= 80
                          ? "Excellent Fertility"
                          : result.fertility >= 60
                          ? "Good Fertility"
                          : "Moderate Fertility"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Sprout className="w-6 h-6" />
                    {t("soil.recommendation")}
                  </h3>
                  <p className="text-2xl font-bold mb-2">{result.crop}</p>
                  <p className="text-green-100">
                    These crops are best suited for {t(`soil.${result.type}`).toLowerCase()} in Jharkhand region.
                  </p>
                </div>

                <Button
                  onClick={resetScanner}
                  className="w-full h-14 text-xl bg-gradient-to-r from-amber-600 to-orange-600"
                >
                  <Camera className="w-6 h-6 mr-2" />
                  Scan Another Soil
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SoilScanner() {
  return (
    <ClientLayout>
      <SoilScannerPage />
    </ClientLayout>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ClientLayout from "../ClientLayout";
import {
  ArrowLeft,
  ShoppingCart,
  Plus,
  Minus,
  ShoppingBag,
  Sprout,
  Droplets,
  Wrench,
  Bug,
  Upload,
  ImageOff,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const products = [
  // Seeds
  {
    id: "1",
    name: "Premium Paddy Seeds",
    nameHi: "प्रीमियम धान के बीज",
    nameNp: "प्रीमियम धान बीज",
    category: "seeds",
    price: 450,
    description: "High-yield paddy seeds suitable for Jharkhand climate",
    descriptionHi: "झारखंड की जलवायु के लिए उपयुक्त उच्च उपज वाले धान के बीज",
    descriptionNp: "झारखंड के मौसम के लेल अच्छा धान बीज",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f10874ce-d36c-426b-ba98-ffafaff0b8d1/generated_images/professional-photograph-of-premium-paddy-9a05094c-20251128104514.jpg",
    seller: "AgriCorp Ranchi",
    rating: 4.5,
  },
  {
    id: "2",
    name: "Wheat Seeds (HD-2967)",
    nameHi: "गेहूं के बीज (HD-2967)",
    nameNp: "गहुम बीज (HD-2967)",
    category: "seeds",
    price: 380,
    description: "Disease-resistant wheat variety",
    descriptionHi: "रोग प्रतिरोधी गेहूं की किस्म",
    descriptionNp: "बीमारी से बचे वाला गहुम",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f10874ce-d36c-426b-ba98-ffafaff0b8d1/generated_images/professional-agricultural-photograph-of--31bbc8d8-20251128104514.jpg",
    seller: "Kisan Bhandar",
    rating: 4.8,
  },
  {
    id: "3",
    name: "Hybrid Maize Seeds",
    nameHi: "हाइब्रिड मक्का के बीज",
    nameNp: "हाइब्रिड मकई बीज",
    category: "seeds",
    price: 520,
    description: "High-quality hybrid maize for better yield",
    descriptionHi: "बेहतर उपज के लिए उच्च गुणवत्ता वाला हाइब्रिड मक्का",
    descriptionNp: "बढ़िया उपज के लेल हाइब्रिड मकई",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/095bd3d7-e43b-4758-8249-844828de485c/generated_images/high-quality-hybrid-maize-corn-seeds-in--0156cf6f-20251127172029.jpg",
    seller: "Seeds Valley",
    rating: 4.6,
  },
  // Fertilizers
  {
    id: "4",
    name: "Urea Fertilizer (50kg)",
    nameHi: "यूरिया उर्वरक (50kg)",
    nameNp: "यूरिया खाद (50kg)",
    category: "fertilizers",
    price: 300,
    description: "High-nitrogen fertilizer for crop growth",
    descriptionHi: "फसल वृद्धि के लिए उच्च नाइट्रोजन उर्वरक",
    descriptionNp: "फसल बढ़े के लेल नाइट्रोजन खाद",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f10874ce-d36c-426b-ba98-ffafaff0b8d1/generated_images/professional-photograph-of-urea-fertiliz-73b6d068-20251128104512.jpg",
    seller: "Fertilizer Hub",
    rating: 4.7,
  },
  {
    id: "5",
    name: "DAP Fertilizer (50kg)",
    nameHi: "डीएपी उर्वरक (50kg)",
    nameNp: "डीएपी खाद (50kg)",
    category: "fertilizers",
    price: 1350,
    description: "Phosphorus-rich fertilizer for root development",
    descriptionHi: "जड़ विकास के लिए फॉस्फोरस युक्त उर्वरक",
    descriptionNp: "जड़ के विकास के लेल फास्फोरस खाद",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f10874ce-d36c-426b-ba98-ffafaff0b8d1/generated_images/professional-photograph-of-dap-fertilize-17d85e73-20251128104512.jpg",
    seller: "AgriNutri",
    rating: 4.9,
  },
  {
    id: "6",
    name: "Organic Compost (25kg)",
    nameHi: "जैविक खाद (25kg)",
    nameNp: "जैविक खाद (25kg)",
    category: "fertilizers",
    price: 250,
    description: "100% organic compost for sustainable farming",
    descriptionHi: "टिकाऊ खेती के लिए 100% जैविक खाद",
    descriptionNp: "100% जैविक खाद",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f10874ce-d36c-426b-ba98-ffafaff0b8d1/generated_images/professional-photograph-of-organic-compo-6c2342e2-20251128104513.jpg",
    seller: "Green Earth",
    rating: 4.8,
  },
  // Tools
  {
    id: "7",
    name: "Garden Spade",
    nameHi: "बगीचा कुदाल",
    nameNp: "बगीचा कुदाल",
    category: "tools",
    price: 450,
    description: "Heavy-duty steel spade for digging",
    descriptionHi: "खुदाई के लिए हेवी-ड्यूटी स्टील कुदाल",
    descriptionNp: "खोदे के लेल मजबूत कुदाल",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f10874ce-d36c-426b-ba98-ffafaff0b8d1/generated_images/professional-product-photograph-of-metal-3203ad80-20251128104512.jpg",
    seller: "Tool Mart",
    rating: 4.4,
  },
  {
    id: "8",
    name: "Water Sprayer (16L)",
    nameHi: "पानी का छिड़काव यंत्र (16L)",
    nameNp: "पानी छिड़काव (16L)",
    category: "tools",
    price: 850,
    description: "Manual pump sprayer for pesticides and water",
    descriptionHi: "कीटनाशक और पानी के लिए मैनुअल पंप स्प्रेयर",
    descriptionNp: "दवा अर पानी के लेल स्प्रेयर",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f10874ce-d36c-426b-ba98-ffafaff0b8d1/generated_images/professional-product-photograph-of-agric-c5d5d141-20251128104513.jpg",
    seller: "Farm Equipment",
    rating: 4.6,
  },
  // Pesticides
  {
    id: "9",
    name: "Neem Oil (1L)",
    nameHi: "नीम का तेल (1L)",
    nameNp: "नीम तेल (1L)",
    category: "pesticides",
    price: 280,
    description: "Natural pest control solution",
    descriptionHi: "प्राकृतिक कीट नियंत्रण समाधान",
    descriptionNp: "प्राकृतिक कीड़ा नियंत्रण",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f10874ce-d36c-426b-ba98-ffafaff0b8d1/generated_images/professional-product-photograph-of-neem--3005a168-20251128104513.jpg",
    seller: "Organic Solutions",
    rating: 4.7,
  },
  {
    id: "10",
    name: "Insecticide Spray",
    nameHi: "कीटनाशक स्प्रे",
    nameNp: "कीड़ा मारे के दवा",
    category: "pesticides",
    price: 420,
    description: "Effective against common crop pests",
    descriptionHi: "सामान्य फसल कीटों के खिलाफ प्रभावी",
    descriptionNp: "आम फसल कीड़ा के खिलाफ असरदार",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f10874ce-d36c-426b-ba98-ffafaff0b8d1/generated_images/professional-product-photograph-of-insec-e6df777b-20251128104512.jpg",
    seller: "Pest Control Co.",
    rating: 4.5,
  },
];

const categoryIcons: any = {
  seeds: Sprout,
  fertilizers: Droplets,
  tools: Wrench,
  pesticides: Bug,
};

function ShopPage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("all");
  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showListDialog, setShowListDialog] = useState(false);
  const [listingForm, setListingForm] = useState({
    name: "",
    category: "seeds",
    price: "",
    description: "",
    mobile: "",
  });
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const getLocalizedText = (item: any, field: string) => {
    const fieldMap: any = {
      name: language === "hi" ? "nameHi" : language === "np" ? "nameNp" : "name",
      description: language === "hi" ? "descriptionHi" : language === "np" ? "descriptionNp" : "description",
    };
    return item[fieldMap[field]] || item[field];
  };

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const addToCart = (product: any) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
      toast.success(`${getLocalizedText(product, "name")} quantity increased!`, {
        description: `Now ${existingItem.quantity + 1} items in cart`,
      });
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
      toast.success(`${getLocalizedText(product, "name")} added to cart!`, {
        description: "Item successfully added",
      });
    }
  };

  const removeFromCart = (productId: string) => {
    const existingItem = cart.find((item) => item.id === productId);
    if (existingItem && existingItem.quantity > 1) {
      setCart(
        cart.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
      );
    } else {
      setCart(cart.filter((item) => item.id !== productId));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleImageError = (productId: string) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  const handleListProduct = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Product listing submitted! Our team will review and approve it soon.");
    setShowListDialog(false);
    setListingForm({
      name: "",
      category: "seeds",
      price: "",
      description: "",
      mobile: "",
    });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg sticky top-0 z-50">
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
                <h1 className="text-2xl font-bold">{t("shop.title")}</h1>
                <p className="text-sm text-cyan-100">Buy & Sell Agricultural Products</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <Button
                onClick={() => setShowCart(true)}
                variant="secondary"
                className="relative"
              >
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-600 text-white px-2">
                    {cart.length}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 flex justify-between items-center flex-wrap gap-4">
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="flex-1">
            <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-white shadow-md">
              <TabsTrigger value="all" className="h-12 data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
                All
              </TabsTrigger>
              <TabsTrigger value="seeds" className="h-12 data-[state=active]:bg-green-600 data-[state=active]:text-white">
                <Sprout className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">{t("shop.seeds")}</span>
              </TabsTrigger>
              <TabsTrigger value="fertilizers" className="h-12 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Droplets className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">{t("shop.fertilizers")}</span>
              </TabsTrigger>
              <TabsTrigger value="tools" className="h-12 data-[state=active]:bg-orange-600 data-[state=active]:text-white">
                <Wrench className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">{t("shop.tools")}</span>
              </TabsTrigger>
              <TabsTrigger value="pesticides" className="h-12 data-[state=active]:bg-red-600 data-[state=active]:text-white">
                <Bug className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">{t("shop.pesticides")}</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Dialog open={showListDialog} onOpenChange={setShowListDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 h-12 px-6">
                <Plus className="w-5 h-5 mr-2" />
                {t("shop.listProduct")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">{t("shop.listProduct")}</DialogTitle>
                <DialogDescription>
                  List your agricultural products or used equipment for sale
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleListProduct} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">Product Name</Label>
                  <Input
                    id="productName"
                    required
                    value={listingForm.name}
                    onChange={(e) => setListingForm({ ...listingForm, name: e.target.value })}
                    placeholder="e.g., Premium Paddy Seeds"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    required
                    value={listingForm.category}
                    onChange={(e) => setListingForm({ ...listingForm, category: e.target.value })}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="seeds">{t("shop.seeds")}</option>
                    <option value="fertilizers">{t("shop.fertilizers")}</option>
                    <option value="tools">{t("shop.tools")}</option>
                    <option value="pesticides">{t("shop.pesticides")}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    required
                    value={listingForm.price}
                    onChange={(e) => setListingForm({ ...listingForm, price: e.target.value })}
                    placeholder="450"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    required
                    value={listingForm.description}
                    onChange={(e) => setListingForm({ ...listingForm, description: e.target.value })}
                    placeholder="Describe your product..."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile">Contact Mobile</Label>
                  <Input
                    id="mobile"
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={listingForm.mobile}
                    onChange={(e) => setListingForm({ ...listingForm, mobile: e.target.value })}
                    placeholder="9876543210"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Product Image</Label>
                  <Button type="button" variant="outline" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image
                  </Button>
                </div>
                <Button type="submit" className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600">
                  Submit Listing
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const Icon = categoryIcons[product.category];
            const hasError = imageErrors[product.id];
            return (
              <Card
                key={product.id}
                className="hover:shadow-2xl transition-all duration-300 border-2 border-blue-200 overflow-hidden"
              >
                <div className="h-48 overflow-hidden relative bg-gray-100">
                  {hasError ? (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <div className="text-center">
                        <ImageOff className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-xs text-gray-500">Image unavailable</p>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={product.image}
                      alt={getLocalizedText(product, "name")}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      onError={() => handleImageError(product.id)}
                      loading="lazy"
                    />
                  )}
                  <Badge className="absolute top-2 left-2 bg-white/90 text-cyan-700">
                    <Icon className="w-3 h-3 mr-1" />
                    {t(`shop.${product.category}`)}
                  </Badge>
                </div>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {getLocalizedText(product, "name")}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {getLocalizedText(product, "description")}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-cyan-700">₹{product.price}</p>
                      <p className="text-xs text-gray-500">{product.seller}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm font-semibold">{product.rating}</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => addToCart(product)}
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {t("shop.addToCart")}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end" onClick={() => setShowCart(false)}>
          <div
            className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-6 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6" />
                  Shopping Cart
                </h2>
                <Button
                  onClick={() => setShowCart(false)}
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  size="icon"
                >
                  <ArrowLeft className="w-6 h-6" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Your cart is empty</p>
                </div>
              ) : (
                <>
                  {cart.map((item) => {
                    const hasError = imageErrors[item.id];
                    return (
                      <Card key={item.id} className="border-2 border-blue-200">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <div className="w-20 h-20 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                              {hasError ? (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                  <ImageOff className="w-8 h-8 text-gray-400" />
                                </div>
                              ) : (
                                <img
                                  src={item.image}
                                  alt={getLocalizedText(item, "name")}
                                  className="w-full h-full object-cover"
                                  onError={() => handleImageError(item.id)}
                                  loading="lazy"
                                />
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-800">
                                {getLocalizedText(item, "name")}
                              </h3>
                              <p className="text-lg font-bold text-cyan-700">₹{item.price}</p>
                              <div className="flex items-center gap-3 mt-2">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span className="font-bold">{item.quantity}</span>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8"
                                  onClick={() => addToCart(item)}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}

                  <div className="sticky bottom-0 bg-white pt-4 border-t-2 border-gray-200 space-y-4">
                    <div className="flex items-center justify-between text-xl font-bold">
                      <span>Total:</span>
                      <span className="text-cyan-700">₹{getTotalPrice()}</span>
                    </div>
                    <Button className="w-full h-14 text-xl bg-gradient-to-r from-green-600 to-emerald-600">
                      <ShoppingCart className="w-6 h-6 mr-2" />
                      Checkout
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Shop() {
  return (
    <ClientLayout>
      <ShopPage />
    </ClientLayout>
  );
}
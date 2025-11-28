# 🌾 AgriVision - Empowering Farmers of Jharkhand

A complete full-stack agricultural solution designed specifically for farmers in Jharkhand, India. AgriVision provides a beautiful, modern, farmer-friendly interface with multilingual support and offline capabilities.

## ✨ Features

### 🔐 1. Authentication System
- **Farmer Login Page** with comprehensive registration
- Collects farmer details: name, land area, location (village, district), mobile, password
- Simple and intuitive agricultural-themed design
- Data stored locally for demo purposes

### 🏡 2. Main Dashboard
- **Colorful tile-based navigation** with 7 major modules
- Icon-driven interface for easy recognition
- Smooth animations and hover effects
- Welcome message with farmer name
- Quick access to all features

### 📷 3. CAM Soil Scanner
- **Camera integration** for soil image capture
- Upload image option for devices without camera
- **AI-simulated soil detection** with 6 soil types:
  - Red soil, Black soil, Sandy soil, Loamy soil, Alluvial soil, Laterite soil
- Fertility score calculation (0-100)
- Crop recommendations based on soil type
- Progress indicator during analysis

### 📰 4. Daily News Module
- **Four sections** with tabbed interface:
  - **Kisan News**: Government updates, schemes, events
  - **Market Prices**: Real-time Jharkhand mandi prices
  - **Weather Alerts**: Local weather warnings
  - **Daily Tips**: Agricultural best practices
- News cards with images and detailed descriptions
- Jharkhand-specific content

### 📊 5. Crop Analysis & Recommendation
- **ML-based recommendation system** with input form for:
  - NPK values (Nitrogen, Phosphorus, Potassium)
  - Rainfall, temperature, soil moisture, pH level, land area
- **Detailed crop recommendations** including:
  - Suitability score (percentage)
  - Cost and profit estimates
  - Best season for cultivation
  - Fertilizer suggestions
- Multiple crop suggestions ranked by suitability

### 📉 6. Market Module
- **Live market prices** from Jharkhand mandis
- Price trend visualization (last 5 weeks)
- **Predictive analysis**: Best time to sell/buy, 30-day price prediction
- Market rating (Good/Medium/Poor timing)
- Weekly price change indicators

### 🛒 7. Shop Module
- **E-commerce marketplace** with 4 categories: Seeds, Fertilizers, Tools, Pesticides
- Product listings with images, prices, ratings
- **Shopping cart functionality**: Add/remove items, quantity adjustment
- **Farmer listing feature**: Sell your own products

### 🛂 8. Services Section
- **Government schemes** (PM-KISAN, PMFBY, KCC, Soil Health Card)
- **Subsidies information** (fertilizer, seed, equipment)
- **Loan schemes** with eligibility criteria
- **Agricultural agencies** contact details

### 📞 9. Kisan Call Center
- Large, prominent **toll-free number**: 1800-180-1551
- One-tap **direct dial functionality**
- Features highlight: 24/7, multilingual, expert advice

### 🌐 10. Multilingual Support
- **Three languages**: English, Hindi (हिंदी), Nagpuri (नागपुरी)
- Dynamic language switcher on all pages
- All text translates instantly
- Language preference saved in localStorage

## 🎨 UI/UX Features

- ✅ Beautiful farmer-friendly design
- ✅ Green/Brown agricultural theme with custom colors
- ✅ Icon-based navigation using Lucide React icons
- ✅ Large fonts and buttons for readability
- ✅ Animated transitions and hover effects
- ✅ Responsive design - works on all screen sizes
- ✅ Progressive Web App (PWA) capabilities
- ✅ Offline caching for news and market data
- ✅ Offline indicator shows connection status
- ✅ Works on low-end Android phones

## 🛠 Tech Stack

### Frontend
- **Next.js 15** (App Router)
- **React 18** with TypeScript
- **Tailwind CSS v4** with custom agricultural theme
- **Shadcn/UI** components
- **Lucide React** for icons

### Features
- React Context API (LanguageContext)
- localStorage for offline data
- PWA with service worker ready
- Custom CSS variables for agricultural colors
- Google Fonts: Noto Sans + Noto Sans Devanagari

## 🚀 Getting Started

1. **Install dependencies**
```bash
npm install
# or
bun install
```

2. **Run development server**
```bash
npm run dev
# or
bun dev
```

3. **Open in browser**
```
http://localhost:3000
```

## 📱 Mobile Installation

AgriVision can be installed as a Progressive Web App (PWA):

1. Open the app in mobile browser
2. Tap the browser menu
3. Select "Add to Home Screen" or "Install App"
4. App will open in standalone mode like a native app

## 🌟 Key Highlights

1. **Complete Full-Stack Solution**: All 9 modules fully functional
2. **Truly Multilingual**: English, Hindi, Nagpuri - all content translates
3. **Offline-First**: Works without internet using cached data
4. **Farmer-Centric Design**: Large fonts, icons, simple navigation
5. **Jharkhand-Specific**: Mandis, crops, schemes tailored for Jharkhand
6. **Mobile-Optimized**: Responsive, touch-friendly, works on low-end phones

## 🎯 Target Audience

- Farmers in Jharkhand state, India
- Users with minimal technical knowledge
- Hindi and Nagpuri speaking farmers
- Low-end Android smartphone users
- Areas with limited internet connectivity

## 📄 License

MIT License - Free to use and modify

---

**Built with ❤️ for the farmers of Jharkhand**

🌾 AgriVision - Transforming Agriculture Through Technology
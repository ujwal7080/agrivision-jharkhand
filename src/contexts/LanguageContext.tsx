import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'np'; // English, Hindi, Nagpuri

type TranslationKey = string;
type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  en: {
    // Login Page
    'app.name': 'AgriVision',
    'app.tagline': 'Empowering Farmers of Jharkhand',
    'login.title': 'Farmer Login',
    'login.email': 'Email Address',
    'login.password': 'Password',
    'login.button': 'Login',
    'login.rememberMe': 'Remember Me',
    'login.noAccount': 'Don\'t have an account?',
    'login.registerNow': 'Register Now',
    'login.invalidCredentials': 'Invalid email or password. Please make sure you have registered an account.',
    'login.success': 'Login successful!',
    'login.registeredSuccess': 'Account created successfully! Please login.',
    'login.welcome': 'Welcome back!',
    
    // Register Page
    'register.title': 'New Farmer Registration',
    'register.name': 'Full Name',
    'register.namePlaceholder': 'Enter your name',
    'register.email': 'Email Address',
    'register.village': 'Village',
    'register.villagePlaceholder': 'Enter your village',
    'register.district': 'District',
    'register.districtPlaceholder': 'e.g., Ranchi, Dhanbad',
    'register.password': 'Password',
    'register.confirmPassword': 'Confirm Password',
    'register.profilePhoto': 'Profile Photo (Optional)',
    'register.uploadPhoto': 'Upload Photo',
    'register.button': 'Register',
    'register.haveAccount': 'Already have an account?',
    'register.loginNow': 'Login Now',
    'register.passwordMismatch': 'Passwords do not match',
    'register.passwordTooShort': 'Password must be at least 6 characters',
    'register.userExists': 'Email already registered. Please login.',
    'register.failed': 'Registration failed. Please try again.',
    'register.success': 'Registration successful!',
    
    // Dashboard
    'dashboard.title': 'Main Menu',
    'dashboard.welcome': 'Welcome',
    'dashboard.weather': 'Current Weather',
    'dashboard.temperature': 'Temperature',
    'dashboard.humidity': 'Humidity',
    'dashboard.windSpeed': 'Wind Speed',
    'dashboard.location': 'Location',
    'dashboard.logout': 'Logout',
    'menu.soilScanner': 'Soil Scanner',
    'menu.news': 'Daily News',
    'menu.cropAnalysis': 'Crop Analysis',
    'menu.market': 'Market Prices',
    'menu.shop': 'Shop',
    'menu.services': 'Services',
    'menu.kisanCall': 'Helpline',
    
    // Soil Scanner
    'soil.title': 'Soil Scanner',
    'soil.capture': 'Capture Soil Image',
    'soil.analyze': 'Analyze Soil',
    'soil.type': 'Soil Type',
    'soil.fertility': 'Fertility Score',
    'soil.recommendation': 'Crop Recommendation',
    'soil.red': 'Red Soil',
    'soil.black': 'Black Soil',
    'soil.sandy': 'Sandy Soil',
    'soil.loamy': 'Loamy Soil',
    'soil.alluvial': 'Alluvial Soil',
    'soil.laterite': 'Laterite Soil',
    
    // News
    'news.title': 'Daily Agricultural News',
    'news.kisanNews': 'Kisan News',
    'news.market': 'Market Prices',
    'news.weather': 'Weather Alerts',
    'news.tips': 'Daily Tips',
    
    // Crop Analysis
    'crop.title': 'Crop Analysis',
    'crop.nitrogen': 'Nitrogen (N)',
    'crop.phosphorus': 'Phosphorus (P)',
    'crop.potassium': 'Potassium (K)',
    'crop.rainfall': 'Rainfall (mm)',
    'crop.temperature': 'Temperature (°C)',
    'crop.moisture': 'Soil Moisture (%)',
    'crop.ph': 'pH Level',
    'crop.analyze': 'Analyze & Recommend',
    'crop.recommended': 'Recommended Crops',
    'crop.cost': 'Expected Cost',
    'crop.profit': 'Expected Profit',
    'crop.season': 'Best Season',
    
    // Market
    'market.title': 'Market Prices',
    'market.currentPrice': 'Current Price',
    'market.trend': 'Price Trend',
    'market.bestSell': 'Best Time to Sell',
    'market.bestBuy': 'Best Time to Buy',
    'market.prediction': 'Price Prediction',
    
    // Shop
    'shop.title': 'Agricultural Shop',
    'shop.seeds': 'Seeds',
    'shop.fertilizers': 'Fertilizers',
    'shop.tools': 'Tools',
    'shop.pesticides': 'Pesticides',
    'shop.addToCart': 'Add to Cart',
    'shop.listProduct': 'List Your Product',
    'shop.buy': 'Buy',
    'shop.sell': 'Sell',
    
    // Services
    'services.title': 'Government Services',
    'services.schemes': 'Schemes',
    'services.subsidies': 'Subsidies',
    'services.loans': 'Loans',
    'services.agencies': 'Agricultural Agencies',
    
    // Kisan Call
    'kisan.title': 'Kisan Call Center',
    'kisan.helpline': 'Toll-Free Helpline',
    'kisan.call': 'Call Now',
    'kisan.number': '1800-180-1551',
    
    // Common
    'common.back': 'Back',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.loading': 'Loading...',
    'common.error': 'Error occurred',
    'common.success': 'Success',
    'common.saving': 'Saving...',
    
    // Profile Page
    'profile.title': 'My Profile',
    'profile.name': 'Name',
    'profile.email': 'Email',
    'profile.village': 'Village',
    'profile.district': 'District',
    'profile.state': 'State',
    'profile.edit': 'Edit Profile',
    'profile.viewProfile': 'View Profile',
    'profile.changePicture': 'Change Picture',
    'profile.uploadPicture': 'Upload Picture',
    'profile.remove': 'Remove',
    'profile.imageHint': 'JPG, PNG or GIF. Max size 2MB',
    'profile.emailHint': 'Email cannot be changed',
    'profile.notSet': 'Not set',
  },
  hi: {
    // Login Page
    'app.name': 'एग्रीविज़न',
    'app.tagline': 'झारखंड के किसानों को सशक्त बनाना',
    'login.title': 'किसान लॉगिन',
    'login.email': 'ईमेल पता',
    'login.password': 'पासवर्ड',
    'login.button': 'लॉगिन करें',
    'login.rememberMe': 'मुझे याद रखें',
    'login.noAccount': 'खाता नहीं है?',
    'login.registerNow': 'अभी पंजीकरण करें',
    'login.invalidCredentials': 'अमान्य ईमेल या पासवर्ड। कृपया सुनिश्चित करें कि आपने खाता बनाया है।',
    'login.success': 'लॉगिन सफल!',
    'login.registeredSuccess': 'खाता सफलतापूर्वक बनाया गया! कृपया लॉगिन करें।',
    'login.welcome': 'वापसी पर स्वागत है!',
    
    // Register Page
    'register.title': 'नया किसान पंजीकरण',
    'register.name': 'पूरा नाम',
    'register.namePlaceholder': 'अपना नाम दर्ज करें',
    'register.email': 'ईमेल पता',
    'register.village': 'गाँव',
    'register.villagePlaceholder': 'अपना गाँव दर्ज करें',
    'register.district': 'जिला',
    'register.districtPlaceholder': 'जैसे, रांची, धनबाद',
    'register.password': 'पासवर्ड',
    'register.confirmPassword': 'पासवर्ड की पुष्टि करें',
    'register.button': 'पंजीकरण करें',
    'register.haveAccount': 'पहले से खाता है?',
    'register.loginNow': 'अभी लॉगिन करें',
    'register.passwordMismatch': 'पासवर्ड मेल नहीं खाते',
    'register.passwordTooShort': 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए',
    'register.userExists': 'ईमेल पहले से पंजीकृत है। कृपया लॉगिन करें।',
    'register.failed': 'पंजीकरण विफल। कृपया पुनः प्रयास करें।',
    'register.success': 'पंजीकरण सफल!',
    
    // Dashboard
    'dashboard.title': 'मुख्य मेनू',
    'dashboard.welcome': 'स्वागत है',
    'dashboard.weather': 'वर्तमान मौसम',
    'dashboard.temperature': 'तापमान',
    'dashboard.humidity': 'नमी',
    'dashboard.windSpeed': 'हवा की गति',
    'dashboard.location': 'स्थान',
    'menu.soilScanner': 'मिट्टी स्कैनर',
    'menu.news': 'दैनिक समाचार',
    'menu.cropAnalysis': 'फसल विश्लेषण',
    'menu.market': 'बाज़ार',
    'menu.shop': 'दुकान',
    'menu.services': 'सेवाएं',
    'menu.kisanCall': 'किसान कॉल सेंटर',
    
    // Soil Scanner
    'soil.title': 'मिट्टी स्कैनर',
    'soil.capture': 'मिट्टी की फोटो लें',
    'soil.analyze': 'मिट्टी का विश्लेषण करें',
    'soil.type': 'मिट्टी का प्रकार',
    'soil.fertility': 'उर्वरता स्कोर',
    'soil.recommendation': 'फसल सिफारिश',
    'soil.red': 'लाल मिट्टी',
    'soil.black': 'काली मिट्टी',
    'soil.sandy': 'रेतीली मिट्टी',
    'soil.loamy': 'दोमट मिट्टी',
    'soil.alluvial': 'जलोढ़ मिट्टी',
    'soil.laterite': 'लेटराइट मिट्टी',
    
    // News
    'news.title': 'दैनिक कृषि समाचार',
    'news.kisanNews': 'किसान समाचार',
    'news.market': 'बाजार मूल्य',
    'news.weather': 'मौसम चेतावनी',
    'news.tips': 'दैनिक टिप्स',
    
    // Crop Analysis
    'crop.title': 'फसल विश्लेषण',
    'crop.nitrogen': 'नाइट्रोजन (N)',
    'crop.phosphorus': 'फास्फोरस (P)',
    'crop.potassium': 'पोटैशियम (K)',
    'crop.rainfall': 'वर्षा (mm)',
    'crop.temperature': 'तापमान (°C)',
    'crop.moisture': 'मिट्टी की नमी (%)',
    'crop.ph': 'pH स्तर',
    'crop.analyze': 'विश्लेषण और सिफारिश',
    'crop.recommended': 'अनुशंसित फसलें',
    'crop.cost': 'अपेक्षित लागत',
    'crop.profit': 'अपेक्षित लाभ',
    'crop.season': 'सर्वोत्तम मौसम',
    
    // Market
    'market.title': 'बाजार मूल्य',
    'market.currentPrice': 'वर्तमान मूल्य',
    'market.trend': 'मूल्य प्रवृत्ति',
    'market.bestSell': 'बेचने का सबसे अच्छा समय',
    'market.bestBuy': 'खरीदने का सबसे अच्छा समय',
    'market.prediction': 'मूल्य पूर्वानुमान',
    
    // Shop
    'shop.title': 'कृषि दुकान',
    'shop.seeds': 'बीज',
    'shop.fertilizers': 'उर्वरक',
    'shop.tools': 'औजार',
    'shop.pesticides': 'कीटनाशक',
    'shop.addToCart': 'कार्ट में जोड़ें',
    'shop.listProduct': 'अपना उत्पाद सूचीबद्ध करें',
    'shop.buy': 'खरीदें',
    'shop.sell': 'बेचें',
    
    // Services
    'services.title': 'सरकारी सेवाएं',
    'services.schemes': 'योजनाएं',
    'services.subsidies': 'सब्सिडी',
    'services.loans': 'ऋण',
    'services.agencies': 'कृषि एजेंसियां',
    
    // Kisan Call
    'kisan.title': 'किसान कॉल सेंटर',
    'kisan.helpline': 'टोल-फ्री हेल्पलाइन',
    'kisan.call': 'अभी कॉल करें',
    'kisan.number': '1800-180-1551',
    
    // Common
    'common.back': 'वापस',
    'common.submit': 'जमा करें',
    'common.cancel': 'रद्द करें',
    'common.save': 'सहेजें',
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि हुई',
    'common.success': 'सफलता',
    'common.saving': 'सहेज रहे हैं...',
    
    // Profile Page
    'profile.title': 'मेरी प्रोफ़ाइल',
    'profile.name': 'नाम',
    'profile.email': 'ईमेल',
    'profile.village': 'गाँव',
    'profile.district': 'जिला',
    'profile.state': 'राज्य',
    'profile.edit': 'प्रोफ़ाइल संपादित करें',
    'profile.viewProfile': 'प्रोफ़ाइल देखें',
    'profile.changePicture': 'फोटो बदलें',
    'profile.uploadPicture': 'फोटो अपलोड करें',
    'profile.remove': 'हटाएं',
    'profile.imageHint': 'JPG, PNG या GIF। अधिकतम आकार 2MB',
    'profile.emailHint': 'ईमेल नहीं बदला जा सकता',
    'profile.notSet': 'सेट नहीं है',
  },
  np: {
    // Login Page (Nagpuri)
    'app.name': 'एग्रीविज़न',
    'app.tagline': 'झारखंड के किसान मन के लेल',
    'login.title': 'किसान लॉगिन',
    'login.email': 'ईमेल पता',
    'login.password': 'पासवर्ड',
    'login.button': 'लॉगिन करा',
    'login.rememberMe': 'याद रखा',
    'login.noAccount': 'खाता नाहीं हे?',
    'login.registerNow': 'अभी पंजीकरण करा',
    'login.invalidCredentials': 'गलत ईमेल या पासवर्ड। कृपया सुनिश्चित करा कि खाता बनाय के हे।',
    'login.success': 'लॉगिन सफल!',
    'login.registeredSuccess': 'खाता बनाय गेल! कृपया लॉगिन करा।',
    'login.welcome': 'फेर आय के स्वागत हे!',
    
    // Register Page
    'register.title': 'नया किसान पंजीकरण',
    'register.name': 'पूरा नाम',
    'register.namePlaceholder': 'अपन नाम लिखा',
    'register.email': 'ईमेल पता',
    'register.village': 'गाँव',
    'register.villagePlaceholder': 'अपन गाँव लिखा',
    'register.district': 'जिला',
    'register.districtPlaceholder': 'जैसे, रांची, धनबाद',
    'register.password': 'पासवर्ड',
    'register.confirmPassword': 'पासवर्ड फेर से',
    'register.button': 'पंजीकरण करा',
    'register.haveAccount': 'पहिले से खाता हे?',
    'register.loginNow': 'अभी लॉगिन करा',
    'register.passwordMismatch': 'पासवर्ड मिलत नाहीं',
    'register.passwordTooShort': 'पासवर्ड कम से कम 6 अक्षर के होय',
    'register.userExists': 'ईमेल पहिले से पंजीकृत हे। कृपया लॉगिन करा।',
    'register.failed': 'पंजीकरण विफल। फेर से कोशिश करा।',
    'register.success': 'पंजीकरण सफल!',
    
    // Dashboard
    'dashboard.title': 'मुख्य मेनू',
    'dashboard.welcome': 'स्वागत हे',
    'dashboard.weather': 'अभी के मौसम',
    'dashboard.temperature': 'गरमी',
    'dashboard.humidity': 'नमी',
    'dashboard.windSpeed': 'हवा के रफ्तार',
    'dashboard.location': 'जगह',
    'menu.soilScanner': 'माटी स्कैनर',
    'menu.news': 'आजु के समाचार',
    'menu.cropAnalysis': 'फसल जाँच',
    'menu.market': 'बाजार',
    'menu.shop': 'दुकान',
    'menu.services': 'सेवा मन',
    'menu.kisanCall': 'किसान कॉल',
    
    // Soil Scanner
    'soil.title': 'माटी स्कैनर',
    'soil.capture': 'माटी के फोटो लेवा',
    'soil.analyze': 'माटी जाँच करा',
    'soil.type': 'माटी के किसिम',
    'soil.fertility': 'उपजाऊपन',
    'soil.recommendation': 'फसल सलाह',
    'soil.red': 'लाल माटी',
    'soil.black': 'काली माटी',
    'soil.sandy': 'रेतीला माटी',
    'soil.loamy': 'दोमट माटी',
    'soil.alluvial': 'जलोढ़ माटी',
    'soil.laterite': 'लेटराइट माटी',
    
    // News
    'news.title': 'आजु के खेती समाचार',
    'news.kisanNews': 'किसान समाचार',
    'news.market': 'बाजार भाव',
    'news.weather': 'मौसम खबर',
    'news.tips': 'आजु के टिप',
    
    // Crop Analysis
    'crop.title': 'फसल जाँच',
    'crop.nitrogen': 'नाइट्रोजन (N)',
    'crop.phosphorus': 'फास्फोरस (P)',
    'crop.potassium': 'पोटैशियम (K)',
    'crop.rainfall': 'बरसात (mm)',
    'crop.temperature': 'गरमी (°C)',
    'crop.moisture': 'माटी नमी (%)',
    'crop.ph': 'pH स्तर',
    'crop.analyze': 'जाँच अर सलाह',
    'crop.recommended': 'सलाह फसल',
    'crop.cost': 'खरचा',
    'crop.profit': 'फायदा',
    'crop.season': 'सही मौसम',
    
    // Market
    'market.title': 'बाजार भाव',
    'market.currentPrice': 'अभी के भाव',
    'market.trend': 'भाव बदलाव',
    'market.bestSell': 'बेचे के सही समय',
    'market.bestBuy': 'खरीदे के सही समय',
    'market.prediction': 'भाव अनुमान',
    
    // Shop
    'shop.title': 'खेती दुकान',
    'shop.seeds': 'बीज',
    'shop.fertilizers': 'खाद',
    'shop.tools': 'औजार',
    'shop.pesticides': 'दवा',
    'shop.addToCart': 'कार्ट में डाला',
    'shop.listProduct': 'अपन चीज बेचा',
    'shop.buy': 'खरीदा',
    'shop.sell': 'बेचा',
    
    // Services
    'services.title': 'सरकारी सेवा',
    'services.schemes': 'योजना मन',
    'services.subsidies': 'सब्सिडी',
    'services.loans': 'कर्जा',
    'services.agencies': 'खेती विभाग',
    
    // Kisan Call
    'kisan.title': 'किसान कॉल',
    'kisan.helpline': 'फ्री हेल्पलाइन',
    'kisan.call': 'अभी कॉल करा',
    'kisan.number': '1800-180-1551',
    
    // Common
    'common.back': 'पीछे',
    'common.submit': 'भेजा',
    'common.cancel': 'रद्द',
    'common.save': 'बचाओ',
    'common.loading': 'लोड हो रहल हे...',
    'common.error': 'गलती भेल',
    'common.success': 'सफल',
    'common.saving': 'बचावत हे...',
    
    // Profile Page
    'profile.title': 'हमार प्रोफ़ाइल',
    'profile.name': 'नाम',
    'profile.email': 'ईमेल',
    'profile.village': 'गाँव',
    'profile.district': 'जिला',
    'profile.state': 'राज्य',
    'profile.edit': 'प्रोफ़ाइल बदला',
    'profile.viewProfile': 'प्रोफ़ाइल देखा',
    'profile.changePicture': 'फोटो बदला',
    'profile.uploadPicture': 'फोटो लगावा',
    'profile.remove': 'हटावा',
    'profile.imageHint': 'JPG, PNG या GIF। अधिकतम 2MB',
    'profile.emailHint': 'ईमेल नाहीं बदल सकत',
    'profile.notSet': 'सेट नाहीं हे',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('agrivision-language') as Language;
    if (savedLang && ['en', 'hi', 'np'].includes(savedLang)) {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('agrivision-language', lang);
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
export interface FarmerData {
  name: string;
  landArea: number;
  village: string;
  district: string;
  state: string;
  mobile: string;
  password: string;
}

export interface SoilAnalysis {
  type: 'red' | 'black' | 'sandy' | 'loamy' | 'alluvial' | 'laterite';
  fertility: number;
  recommendedCrop: string;
  color: string;
  texture: string;
}

export interface CropData {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  rainfall: number;
  temperature: number;
  moisture: number;
  ph: number;
  landArea: number;
}

export interface CropRecommendation {
  crop: string;
  reason: string;
  cost: number;
  profit: number;
  season: string;
  fertilizer: string[];
}

export interface MarketPrice {
  crop: string;
  currentPrice: number;
  trend: 'up' | 'down' | 'stable';
  bestTimeToSell: string;
  bestTimeToBuy: string;
  prediction: number;
  rating: 'good' | 'medium' | 'poor';
  image: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'seeds' | 'fertilizers' | 'tools' | 'pesticides';
  price: number;
  description: string;
  image: string;
  seller?: string;
}

export interface GovernmentScheme {
  name: string;
  description: string;
  eligibility: string;
  contact: string;
  type: 'scheme' | 'subsidy' | 'loan';
}

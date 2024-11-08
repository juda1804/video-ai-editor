export interface FormState {
  // Configuration Step
  videoDuration: string;
  videoQuantity: string;
  useAIVoice: boolean;
  voiceOption: string;
  
  // Product Information Step
  productName: string;
  productDescription: string;
  
  // Copy Generator Step (ejemplo)
  copyStyle?: string;
  targetAudience?: string;
  
  // Production Resources Step (ejemplo)
  resourceUrls?: string[];
  
  // Combined Videos Step (ejemplo)
  selectedVideos?: string[];
  
  copies?: Array<{
    id: number;
    text: string;
  }>;
  
  videos?: File[];
  socialLinks?: Array<{
    id: number;
    url: string;
  }>;
} 
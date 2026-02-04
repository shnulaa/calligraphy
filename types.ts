export interface LocalizedString {
  en: string;
  cn: string;
}

export interface Seal {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  x: number; // Percentage X
  y: number; // Percentage Y
  size: number;
}

export interface Hotspot {
  id: string;
  x: number;
  y: number;
  title: LocalizedString;
  content: LocalizedString;
  type: 'history' | 'technique' | 'seal';
}

export interface Artifact {
  id: string;
  title: LocalizedString;
  artist: LocalizedString;
  dynasty: LocalizedString;
  images: string[];
  dimensions: { width: number; height: number };
  description: LocalizedString; // Short intro
  background: LocalizedString; // Detailed historical background
  significance: LocalizedString; // detailed artistic significance
  seals: Seal[];
  hotspots: Hotspot[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}
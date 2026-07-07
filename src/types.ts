export interface Reservation {
  id?: string;
  category?: '사주' | '타로';
  name: string;
  gender?: '남성' | '여성' | '';
  birthdate?: string; // YYYY-MM-DD
  birthTime?: string; // HH:MM or "모름"
  birthPlace?: string;
  topic: string; // Topic/Service name
  content: string; // Detailed question/concern
  phone: string;
  email: string;
  agreed: boolean;
  paymentStatus: '미결제' | '결제완료' | '환불완료';
  status: '접수완료' | '상담중' | '답변완료';
  resultText: string;
  createdAt: number; // timestamp
  updatedAt: number; // timestamp
}

export interface Review {
  id?: string;
  name: string;
  rating: number; // 1 to 5
  serviceName: string;
  content: string;
  answer: string; // Admin feedback
  createdAt: number; // timestamp
}

export interface ServiceProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  badge?: string;
}

export interface TarotCardInfo {
  name: string;
  englishName: string;
  image: string; // description of image we can generate or placeholder representation
  meaning: string;
  loveMeaning: string;
  careerMeaning: string;
  generalMeaning: string;
}

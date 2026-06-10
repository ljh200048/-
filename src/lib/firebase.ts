import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDocFromServer, 
  collection, 
  getDocs, 
  getDoc, 
  addDoc, 
  setDoc,
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  onSnapshot
} from 'firebase/firestore';
import { Reservation, Review } from '../types';
import firebaseConfig from '../firebase-applet-config.json';

// Detect if real Firebase configuration is provided
const isRealFirebaseEnabled = !!(firebaseConfig && firebaseConfig.apiKey && firebaseConfig.apiKey !== "");

let app;
let db: any = null;
let auth: any = null;

if (isRealFirebaseEnabled) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    auth = getAuth(app);
    
    // Validate Connection to Firestore (Prerequisite check from SKILL)
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.warn("Please check your Firebase configuration or network status.");
        }
      }
    };
    testConnection();
  } catch (err) {
    console.error("Failed to initialize Firebase SDK:", err);
  }
}

// Error reporting wrapper as strictly mandated by the guidelines
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// ---------------------------------------------------------
// LOCAL STORAGE SIMULATION BACKUP (High-Fidelity Offline Engine)
// ---------------------------------------------------------
const LOCAL_RESERVATIONS_KEY = 'haru_unse_reservations';
const LOCAL_REVIEWS_KEY = 'haru_unse_reviews';

// Seed reviews for brand trust if they don't exist
const initialReviews: Review[] = [
  {
    id: 'rev1',
    name: '헤이즈99',
    rating: 5,
    serviceName: '하루타로상대방마음',
    content: '헤어진 남자친구 마음이 너무 답답해서 신청했는데 성격이랑 최근 연락 상황을 너무 정확히 짚어내셔서 깜짝 놀랐어요ㅠㅠ 조언 카드대로 가볍게 연락해봤는데 답장 왔습니다!',
    answer: '하루운세를 찾아주셔서 감사합니다. 소중한 인연의 실마리가 풀리신 것 같아 저 역시 무척 기쁩니다. 마음이 흔들릴 때는 언제든 오셔서 조용히 털어놓아 주세요.',
    createdAt: Date.now() - 3 * 24 * 3600 * 1000
  },
  {
    id: 'rev2',
    name: '별빛진로',
    rating: 5,
    serviceName: '하루진로',
    content: '이직 준비하면서 제가 가고 있는 길이 맞는지 고민이 정말 많았어요. 제 성향 사주 풀이해주신 걸 보니 제가 어떤 가치를 중요시하는 사람인지 다시 생각하게 됐습니다. 추천해주신 진택에 힘입어 최종 면접 가봅니다!',
    answer: '스스로의 가능성을 열고 내딛는 보폭은 절대 헛되지 않습니다. 귀한 재능이 빛을 발하는 때가 다가오고 있으니 자신감을 가지고 정진하시길 기원합니다.',
    createdAt: Date.now() - 1 * 24 * 3600 * 1000
  },
  {
    id: 'rev3',
    name: '연우',
    rating: 4,
    serviceName: '오늘의 하루타로',
    content: '아침마다 무료 하루 타로 뽑는 재미로 하루를 시작해요. 은근히 분위기 있고 위안이 됩니다.',
    answer: '사소한 일상 속 한 자락 쉼표가 되어드릴 수 있다면 좋겠습니다. 오늘도 다정한 하루 되세요.',
    createdAt: Date.now() - 12 * 3600 * 1000
  }
];

if (!localStorage.getItem(LOCAL_REVIEWS_KEY)) {
  localStorage.setItem(LOCAL_REVIEWS_KEY, JSON.stringify(initialReviews));
}

// Simple seeded reservations for admin preview
const initialReservations: Reservation[] = [
  {
    id: 'res-demo-1',
    name: '김하늘',
    gender: '여성',
    birthdate: '1998-04-12',
    birthTime: '오전 08시 30분',
    birthPlace: '서울시 마포구',
    topic: '하루타로 - 상대방 마음',
    content: '사귄 지 1년 된 남자친구와 최근 말다툼이 잦아졌습니다. 상대방이 저에게 지친 건지, 아니면 일 때문에 예민해서 그런 건지 속마음과 관계를 회복할 조언이 필요합니다.',
    phone: '010-9876-5432',
    email: 'sky@example.com',
    agreed: true,
    paymentStatus: '결제완료',
    status: '답변완료',
    resultText: '김하늘 님, 상대방의 타로 쉼카드(Four of Swords)와 행동의 전차 카드(The Chariot)가 대비되어 나타납니다. 현재 상대방 분은 외부 환경(직장, 대인관계)에서 극심한 정신적 에너지 고갈을 겪고 있어, 연인 관계를 외면하는 것이 아니라 스스로를 추스릴 "동굴"이 필요한 시기입니다. 겉으론 퉁명스럽게 보이지만 마음속 애정의 흐름은 견고합니다. 이번 주말에는 사적인 추궁보다는 "혼자 쉴 수 있는 여유"를 짧게 양보해주시는 행동적 수용이 최고의 처방이 될 것입니다.',
    createdAt: Date.now() - 4 * 24 * 3600 * 1000,
    updatedAt: Date.now() - 3 * 24 * 3600 * 1000
  },
  {
    id: 'res-demo-2',
    name: '이도현',
    gender: '남성',
    birthdate: '1995-11-23',
    birthTime: '오후 11시 45분 (해시)',
    birthPlace: '부산시 해운대구',
    topic: '하루진로',
    content: '마케팅 대행사에서 3년째 일하는 중인데, 사주 상으로 이직운이 언제 오는지 알 수 있을까요? 그리고 제가 창업 성향인지 직장인 성향인지 궁금합니다.',
    phone: '010-1234-5678',
    email: 'dohyun@example.com',
    agreed: true,
    paymentStatus: '결제완료',
    status: '상담중',
    resultText: '',
    createdAt: Date.now() - 5 * 3600 * 1000,
    updatedAt: Date.now() - 5 * 3600 * 1000
  },
  {
    id: 'res-demo-3',
    name: '최소희',
    gender: '여성',
    birthdate: '2001-07-05',
    birthTime: '모름',
    birthPlace: '경기도 성남시',
    topic: '하루궁합',
    content: '소개팅에서 만난 사람과 3번 만났는데, 사주상 성향 궁합이 잘 맞는지 궁금합니다. 둘 다 조용한 편이라 말수가 적어요.',
    phone: '010-8765-4321',
    email: 'sohee@example.com',
    agreed: true,
    paymentStatus: '미결제',
    status: '접수완료',
    resultText: '',
    createdAt: Date.now() - 1 * 3600 * 1000,
    updatedAt: Date.now() - 1 * 3600 * 1000
  }
];

if (!localStorage.getItem(LOCAL_RESERVATIONS_KEY)) {
  localStorage.setItem(LOCAL_RESERVATIONS_KEY, JSON.stringify(initialReservations));
}

// External Database functions that proxy seamlessly to Firebase or Local Storage fallback
export const dbService = {
  isRealFirebase: isRealFirebaseEnabled,

  // 1. Get Reservations
  async getReservations(emailFilter?: string): Promise<Reservation[]> {
    if (isRealFirebaseEnabled) {
      const colPath = 'reservations';
      try {
        let q;
        if (emailFilter) {
          q = query(collection(db, colPath), where('email', '==', emailFilter), orderBy('createdAt', 'desc'));
        } else {
          q = query(collection(db, colPath), orderBy('createdAt', 'desc'));
        }
        const qs = await getDocs(q);
        return qs.docs.map(d => ({ id: d.id, ...(d.data() as any) } as Reservation));
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, colPath);
        return [];
      }
    } else {
      // Local fall back
      const dataStr = localStorage.getItem(LOCAL_RESERVATIONS_KEY) || '[]';
      let list = JSON.parse(dataStr) as Reservation[];
      if (emailFilter) {
        list = list.filter(r => r.email === emailFilter);
      }
      return list.sort((a,b) => b.createdAt - a.createdAt);
    }
  },

  // 2. Add Reservation
  async addReservation(res: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const rawRes: Reservation = {
      ...res,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    if (isRealFirebaseEnabled) {
      const colPath = 'reservations';
      try {
        const docRef = await addDoc(collection(db, colPath), rawRes);
        return docRef.id;
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, colPath);
        return '';
      }
    } else {
      const id = 'res_' + Math.random().toString(36).substr(2, 9);
      const dataStr = localStorage.getItem(LOCAL_RESERVATIONS_KEY) || '[]';
      const list = JSON.parse(dataStr) as Reservation[];
      list.push({ ...rawRes, id });
      localStorage.setItem(LOCAL_RESERVATIONS_KEY, JSON.stringify(list));
      return id;
    }
  },

  // 3. Update Reservation
  async updateReservation(id: string, updates: Partial<Reservation>): Promise<void> {
    if (isRealFirebaseEnabled) {
      const path = `reservations/${id}`;
      try {
        await updateDoc(doc(db, 'reservations', id), {
          ...updates,
          updatedAt: Date.now()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, path);
      }
    } else {
      const dataStr = localStorage.getItem(LOCAL_RESERVATIONS_KEY) || '[]';
      let list = JSON.parse(dataStr) as Reservation[];
      list = list.map(item => {
        if (item.id === id) {
          return {
            ...item,
            ...updates,
            updatedAt: Date.now()
          };
        }
        return item;
      });
      localStorage.setItem(LOCAL_RESERVATIONS_KEY, JSON.stringify(list));
    }
  },

  // 4. Delete Reservation
  async deleteReservation(id: string): Promise<void> {
    if (isRealFirebaseEnabled) {
      const path = `reservations/${id}`;
      try {
        await deleteDoc(doc(db, 'reservations', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, path);
      }
    } else {
      const dataStr = localStorage.getItem(LOCAL_RESERVATIONS_KEY) || '[]';
      let list = JSON.parse(dataStr) as Reservation[];
      list = list.filter(item => item.id !== id);
      localStorage.setItem(LOCAL_RESERVATIONS_KEY, JSON.stringify(list));
    }
  },

  // 5. Get Reviews
  async getReviews(): Promise<Review[]> {
    if (isRealFirebaseEnabled) {
      const colPath = 'reviews';
      try {
        const q = query(collection(db, colPath), orderBy('createdAt', 'desc'));
        const qs = await getDocs(q);
        return qs.docs.map(d => ({ id: d.id, ...(d.data() as any) } as Review));
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, colPath);
        return [];
      }
    } else {
      const dataStr = localStorage.getItem(LOCAL_REVIEWS_KEY) || '[]';
      const list = JSON.parse(dataStr) as Review[];
      return list.sort((a,b) => b.createdAt - a.createdAt);
    }
  },

  // 6. Add Review
  async addReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<string> {
    const rawRev: Review = {
      ...review,
      createdAt: Date.now()
    };

    if (isRealFirebaseEnabled) {
      const colPath = 'reviews';
      try {
        const docRef = await addDoc(collection(db, colPath), rawRev);
        return docRef.id;
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, colPath);
        return '';
      }
    } else {
      const id = 'rev_' + Math.random().toString(36).substr(2, 9);
      const dataStr = localStorage.getItem(LOCAL_REVIEWS_KEY) || '[]';
      const list = JSON.parse(dataStr) as Review[];
      list.push({ ...rawRev, id });
      localStorage.setItem(LOCAL_REVIEWS_KEY, JSON.stringify(list));
      return id;
    }
  },

  // 7. Reply to Review
  async replyToReview(id: string, answer: string): Promise<void> {
    if (isRealFirebaseEnabled) {
      const path = `reviews/${id}`;
      try {
        await updateDoc(doc(db, 'reviews', id), { answer });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, path);
      }
    } else {
      const dataStr = localStorage.getItem(LOCAL_REVIEWS_KEY) || '[]';
      let list = JSON.parse(dataStr) as Review[];
      list = list.map(item => {
        if (item.id === id) {
          return { ...item, answer };
        }
        return item;
      });
      localStorage.setItem(LOCAL_REVIEWS_KEY, JSON.stringify(list));
    }
  }
};

// Standard Firebase exports
export { auth };

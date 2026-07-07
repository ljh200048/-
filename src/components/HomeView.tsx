import { Moon, Sparkles, Heart, Compass, Star, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { ServiceProduct } from '../types';

interface HomeViewProps {
  onChangeTab: (tab: string) => void;
  onSelectProduct: (topic: string) => void;
}

export default function HomeView({ onChangeTab, onSelectProduct }: HomeViewProps) {
  const products: ServiceProduct[] = [
    {
      id: 'prod1',
      name: '오늘의 하루타로',
      price: 0,
      description: '카드 1장을 뽑고 깊은 호흡으로 오늘의 마음과 기분 좋은 흐름을 확인하는 무료 힐링 타로',
      badge: '무료'
    },
    {
      id: 'prod2',
      name: '하루타로 - 상대방 마음',
      price: 7900,
      description: '그 사람의 무의식적 속마음, 연락 기류, 다가올 관계 흐름과 깊이 있는 감성 조언 리딩',
      badge: '인기'
    },
    {
      id: 'prod3',
      name: '하루궁합',
      price: 29000,
      description: '나와 상대방의 생년월일 사주 조화를 바탕으로 보는 깊고 섬세한 연애 교감 궁합 리포트',
      badge: '추천'
    },
    {
      id: 'prod4',
      name: '하루진로',
      price: 25000,
      description: '타고난 사주 오행과 직무 적성 기류를 분석해 일과 이직 대운, 방향성을 안내하는 진로 비법 리포트',
      badge: '전문적'
    },
    {
      id: 'prod5',
      name: '하루종합운',
      price: 59000,
      description: '연애, 직무, 재물, 대인관계, 건강, 올해 대정의 흐름을 한 권의 책처럼 세세하게 총정리하는 마스터 사주 리딩',
      badge: '프리미엄'
    }
  ];

  return (
    <div className="space-y-16 py-8" id="home_view_root">
      {/* Hero Header */}
      <div className="relative text-center max-w-3xl mx-auto space-y-6 px-4 py-8 rounded-2xl bg-gradient-to-b from-purple-950/20 to-transparent border border-purple-900/10" id="hero_header">
        <div className="absolute top-2 left-1/2 -translate-x-1/2">
          <Moon className="w-12 h-12 text-amber-200 fill-amber-200/5 animate-pulse" />
        </div>
        
        <div className="pt-8 space-y-3">
          <p className="text-sm font-semibold tracking-widest text-amber-400 uppercase animate-pulse">
            ✧ EMOTIONAL FORTUNE PLATFORM ✧
          </p>
          <h1 className="text-3xl md:text-5xl font-sans font-extrabold tracking-tight text-white leading-tight">
            오늘의 운세가 궁금할 때,<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-purple-300">
              하루운세
            </span>
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto text-sm md:text-base leading-relaxed pt-2">
            사주와 타로로 연애, 진로, 인간관계, 마음의 고민을 가볍게 확인해보세요. 하루 한 번, 밤하늘의 다정한 위로가 당신의 마음길을 조용히 지켜줍니다.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6" id="hero_cta_buttons">
          <button 
            onClick={() => onChangeTab('tarot')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 hover:from-purple-800 hover:to-indigo-800 text-amber-100 text-sm font-semibold shadow-[0_4px_20px_rgba(107,33,168,0.4)] border border-amber-400/20 flex items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
            id="hero_btn_tarot"
          >
            <Heart className="w-4 h-4 text-amber-300 fill-amber-300/10" />
            오늘의 하루타로 무료 뽑기
          </button>
          
          <button 
            onClick={() => onChangeTab('booking')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#0E1530] border border-amber-400/30 text-amber-200 hover:bg-[#151D42] hover:border-amber-400/50 text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2"
            id="hero_btn_booking"
          >
            <Compass className="w-4 h-4 text-amber-300 animate-spin-slow" />
            1:1 맞춤 상담 신청하기
          </button>
        </div>
      </div>

      {/* Product Bento Grid */}
      <div className="space-y-6" id="home_products_section">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold text-purple-400 tracking-wider inline-flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            PRODUCTS
          </span>
          <h2 className="text-2xl font-bold text-slate-100 font-sans">하루운세 아늑한 리딩 상품</h2>
          <p className="text-gray-400 text-xs">내 마음의 크기에 맞춘 감성 사주·타로 맞춤 해설처방</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
          {products.map((prod) => (
            <div 
              key={prod.id}
              className="relative rounded-2xl bg-[#090E24]/80 p-6 flex flex-col justify-between border border-purple-900/30 hover:border-amber-400/30 hover:shadow-[0_8px_30px_rgba(139,92,246,0.1)] transition-all duration-300 group"
              id={`home_product_card_${prod.id}`}
            >
              <div>
                {/* Badge */}
                {prod.badge && (
                  <span className={`absolute top-4 right-4 text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
                    prod.price === 0 
                      ? 'bg-purple-900/40 text-purple-200 border border-purple-700/40' 
                      : 'bg-amber-950/40 text-amber-200 border border-amber-500/30'
                  }`}>
                    {prod.badge}
                  </span>
                )}

                <div className="space-y-2.5">
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-amber-200 transition-colors">
                    {prod.name}
                  </h3>
                  <div className="flex items-baseline space-x-1.5 pt-1">
                    <span className="text-2xl font-bold text-amber-300 font-mono">
                      {prod.price === 0 ? '무료' : `${prod.price.toLocaleString()}원`}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed pt-2">
                    {prod.description}
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => {
                    if (prod.price === 0) {
                      onChangeTab('tarot');
                    } else {
                      onSelectProduct(prod.name);
                    }
                  }}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold tracking-wide flex items-center justify-center gap-2.5 transition-all ${
                    prod.price === 0
                      ? 'bg-purple-950/40 border border-purple-700/30 text-purple-200 hover:bg-purple-900/40'
                      : 'bg-[#121A3B] border border-amber-400/20 text-amber-200 hover:bg-amber-400 hover:text-blue-950 hover:border-transparent'
                  }`}
                  id={`home_product_btn_${prod.id}`}
                >
                  {prod.price === 0 ? '무료 카드 뽑으러 가기' : '1:1 맞춤 상담 예약하기'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simple emotional review snapshot banner */}
      <div className="bg-gradient-to-r from-purple-950/10 via-[#0A0F29] to-purple-950/10 border-y border-purple-900/20 py-10 px-4 text-center space-y-4">
        <p className="text-amber-200/90 text-sm font-serif italic max-w-2xl mx-auto leading-relaxed">
          "오늘의 작은 인연이 내일을 견디는 다정한 지팡이가 되어 드릴 수 있도록. 하루운세 사주 명리가들과 타로 리딩진이 당신의 은은한 등불이 되겠습니다."
        </p>
        <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          개인정보의 안전한 수용 및 철저한 보안 상담 비밀 보장 일임
        </div>
      </div>

      {/* Strictly required warning notice */}
      <div className="max-w-4xl mx-auto px-4" id="disclaimer_notice">
        <div className="rounded-xl border border-dashed border-purple-900/50 bg-purple-950/10 p-5 flex items-start gap-3 text-left">
          <HelpCircle className="w-5 h-5 text-amber-400/60 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-amber-300">하루운세 이용 주의보</h4>
            <p className="text-[11px] text-gray-400 leading-relaxed md:leading-loose">
              하루운세의 모든 리딩은 절대적인 미래 예측이 아닌 자기 이해와 선택을 돕기 위한 참고용 콘텐츠입니다. 인생의 참다운 조타수는 정해진 별자리가 아니라, 바로 지금 용기를 꺼내어 선택하는 당신 자신입니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { CheckCircle2, ChevronRight, Landmark, Compass, Heart, Award, Star } from 'lucide-react';
import { ServiceProduct } from '../types';

interface ProductListViewProps {
  onSelectProduct: (topic: string) => void;
}

export default function ProductListView({ onSelectProduct }: ProductListViewProps) {
  const products: ServiceProduct[] = [
    {
      id: 'prod_tarot_mind',
      name: '하루타로 - 상대방 마음',
      price: 7900,
      description: '그 사람의 진짜 속마음, 최근 연락 기류 강도, 앞으로의 조율 방향성 및 나를 부르는 세부 행동 지침 리포트',
      badge: '조회수 1위'
    },
    {
      id: 'prod_saju_compat',
      name: '하루궁합',
      price: 29000,
      description: '나와 소중한 지인의 사주를 합배하여 서로의 융합 원소 시너지와 연애 속도감, 다툼 시의 타협 기제를 세세하게 정돈',
      badge: '연인 추천'
    },
    {
      id: 'prod_saju_career',
      name: '하루진로',
      price: 25000,
      description: '내재된 이성과 재물의 오행을 관측하여, 이직/합격 대운 흐름과 최적의 회사 유형 및 개인 전문 기술 창업 타당성 진단',
      badge: '20대 인기'
    },
    {
      id: 'prod_saju_total',
      name: '하루종합운',
      price: 59000,
      description: '연애, 직장, 금전, 건강, 대인관계 5대 명리 기포를 종합적으로 정독하고 향후 3개년의 대정 방향성을 깊이 있게 다루는 마스터 상담 리포트',
      badge: '만족도 최고'
    }
  ];

  const specs = [
    "경력 10년 이상의 동양 명리 및 서양 타로 전문 감정 리딩진 배치",
    "개인의 소중한 고민들을 100% 무명으로 감정 보호 보장 처리",
    "접수 완료 기점 24시간 이내의 깊고 따뜻한 줄글 리포트 전송 일임",
    "신청자의 오행 맞춤 힐링 우주 감색 나침반 카드 동봉 전달"
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 px-4 py-8" id="product_list_view_root">
      {/* Page Header */}
      <div className="text-center space-y-2" id="products_header">
        <span className="text-xs font-semibold text-purple-400 tracking-wider">PREMIUM COUNSELING</span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 font-sans">하루사주·타로 맞춤 해설집</h2>
        <p className="text-gray-400 text-xs md:text-sm max-w-lg mx-auto leading-relaxed">
          마음 한구석 묵직한 돌을 치워줄 장황하고 정갈한 1:1 맞춤 소통집입니다. 신청서가 접수되면 담당 풀이가가 밤하늘 은하수를 담아 감정적인 쉼표를 전해 드립니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Products Grid */}
        <div className="lg:col-span-8 space-y-6" id="products_showcase_section">
          {products.map((p) => (
            <div 
              key={p.id}
              className="relative rounded-2xl bg-[#090F26]/90 p-6 border border-purple-900/40 hover:border-amber-400/40 hover:shadow-[0_4px_25px_rgba(139,92,246,0.08)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all duration-300 group"
              id={`full_product_card_${p.id}`}
            >
              <div className="space-y-2 max-w-md">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-300 font-mono tracking-widest px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                    {p.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-100 group-hover:text-amber-200 transition-colors">
                  {p.name}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed font-light">
                  {p.description}
                </p>
              </div>

              <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto border-t md:border-t-0 border-purple-950 pt-4 md:pt-0 shrink-0">
                <span className="text-2xl font-bold text-amber-300 font-mono tracking-wider">
                  {p.price.toLocaleString()}원
                </span>
                <button
                  onClick={() => onSelectProduct(p.name)}
                  className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-[#12193C] hover:bg-amber-400 hover:text-blue-950 text-amber-200 text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1 border border-amber-400/20"
                  id={`full_product_btn_${p.id}`}
                >
                  상담 신청하기
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Sidebar */}
        <div className="lg:col-span-4 rounded-2xl bg-gradient-to-b from-[#0A102E] to-[#05091D] p-6 border border-purple-900/30 space-y-6" id="products_trust_sidebar">
          <div className="flex items-center space-x-2 text-amber-300 font-semibold text-sm">
            <Award className="w-5 h-5 text-amber-400" />
            <span>하루운세 4대 안심 보장</span>
          </div>

          <div className="space-y-4" id="trust_benefits_list">
            {specs.map((spec, index) => (
              <div key={index} className="flex gap-2.5 text-left">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-gray-300 leading-relaxed font-light">{spec}</span>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-[#030615] p-4 text-center space-y-2 border border-purple-950">
            <h4 className="text-xs font-bold text-amber-200 flex items-center justify-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              1:1 맞춤 만족도 98.4%
            </h4>
            <p className="text-[10px] text-gray-500 leading-relaxed">
              사주오행 분석 후 직접 작성한 고유의 리포트를 PDF 또는 문자 링크 형태로 소중하게 전송해 드립니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

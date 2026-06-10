import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

export default function FaqView() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      q: "하루운세 1:1 사주/타로 리포트는 어떻게 받아보나요?",
      a: "신청 완료 후 작성하신 이메일 주소로 24시간 이내에 정성스럽게 작성한 고유의 리포트가 전송됩니다. 또한 본 웹사이트의 '상담 예약' 페이지 우측의 '예약 현황 및 답변 해설지 조회' 코너에 본인의 이메일을 기입해 조회하시면, 실시간으로 관리자가 마친 정제된 줄글 풀이 리조트를 원클릭으로 열람하실 수도 있어서 무척 편리합니다."
    },
    {
      q: "상담 보안은 안전하게 철저히 보장되나요?",
      a: "그럼요. 하루운세는 철저하게 성하 가명 및 닉네임 기반으로 비공개 조율되는 고독 상담소입니다. 어떠한 신상 정보도 제3자나 불건전 매체에 일절 노출되지 않으며, 고민 수합 7일 이후 영구 정기 소거되는 엄정한 보안 원칙을 훈련받고 있습니다."
    },
    {
      q: "무료 타로와 유료 사주 리포트의 차이점은 무엇인가요?",
      a: "무료 '오늘의 하루타로'는 낱개의 1카드 위주의 일천 기운을 가상 감정 기법으로 확인하는 힐링 풀이법입니다. 반면, 유료 4대 상담 상품(상대방 마음, 하루궁합, 하루진로, 하루종합운)은 경력 10년 이상의 역학진이 사용자의 생시 보정 정보와 오행 전반의 흐름을 수동으로 분석하고 해박한 처방 문구를 직접 엮어 PDF/줄글로 정독해 드리는 극처방 프리미엄 리서치 코스입니다."
    },
    {
      q: "결제한 상담에 대해 환불을 받고 싶을 때는 어떻게 하나요?",
      a: "저희 '정책 안내' 혹은 하단 안내에 명명되어 있듯, 상담이 개시되어 감정이 완료되기 전('접수완료' 상태)에는 100% 무상 취소 환불이 즉각 실행됩니다. 다만 관리자가 오행 기포 분석을 마쳐 '상담중' 혹은 '답변완료'가 된 이후에는 개인 맞춤형 무형 콘텐츠 특성상 환불이 불가함을 부드럽게 양해 부탁드립니다."
    },
    {
      q: "태어난 시간을 정확하게 모르면 기재를 어떻게 하나요?",
      a: "정확한 출생 시각을 모르실 경우 시각 칸에 '모름' 또는 비워 주셔도 괜찮습니다. 이 경우에는 사주 원국의 ‘생년월일(삼주)’ 정보와 우주 자연 기풍을 매핑하여 신중하게 차선 명리를 리딩해 드리므로 염려 놓으셔도 좋습니다."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-12 px-4 py-8" id="faq_view_root">
      {/* Page header */}
      <div className="text-center space-y-2" id="faq_header">
        <span className="text-xs font-semibold text-purple-400 tracking-wider">FREQUENTLY ASKED QUESTIONS</span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 font-sans">도움이 필요하신가요?</h2>
        <p className="text-gray-400 text-xs md:text-sm max-w-lg mx-auto leading-relaxed">
          하루운세를 더 풍요롭고 편리하게 즐기기 위한 단골 걱정 해결책을 미리 모았습니다.
        </p>
      </div>

      {/* Accordions */}
      <div className="space-y-4 max-w-2xl mx-auto" id="faq_items_accordion">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div 
              key={idx}
              className="rounded-2xl bg-[#090E24]/80 border border-purple-950/80 overflow-hidden transition-all duration-300"
              id={`faq_accordion_${idx}`}
            >
              {/* Question heading */}
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-purple-950/20 transition-colors text-slate-100"
              >
                <div className="flex items-center space-x-3 pr-4">
                  <span className="text-amber-300 font-bold font-mono text-xs shrink-0 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">Q.{idx + 1}</span>
                  <span className="text-xs md:text-sm font-semibold">{faq.q}</span>
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 text-amber-300" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>

              {/* Answer block */}
              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-gray-300 leading-relaxed font-light border-t border-purple-950/30 whitespace-pre-line" id={`faq_answer_${idx}`}>
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

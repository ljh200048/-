import { useState } from 'react';
import { HelpCircle, Star, Sparkles, Heart, Moon, Compass, Loader, RotateCcw } from 'lucide-react';
import { tarotCards } from '../lib/fortuneData';
import { TarotCardInfo } from '../types';

export default function TarotView() {
  const [selectedCategory, setSelectedCategory] = useState<'종합' | '연애' | '진로'>('종합');
  const [userQuestion, setUserQuestion] = useState('');
  const [selectedCardIdx, setSelectedCardIdx] = useState<number | null>(null);
  const [drawnCard, setDrawnCard] = useState<TarotCardInfo | null>(null);
  const [reading, setReading] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAi, setIsAi] = useState(false);

  const categories = [
    { id: '종합', label: '오늘의 종합운', icon: Moon },
    { id: '연애', label: '상대방 마음 & 연애운', icon: Heart },
    { id: '진로', label: '진로 & 무한 가능성', icon: Compass },
  ];

  const handleDrawCard = async (cardIndex: number) => {
    if (drawnCard || isLoading) return;
    setSelectedCardIdx(cardIndex);
    setIsLoading(true);
    setReading(null);

    // Pick a card randomly from our fortune dataset
    const randomCard = tarotCards[Math.floor(Math.random() * tarotCards.length)];
    setDrawnCard(randomCard);

    try {
      const response = await fetch('/api/fortune/tarot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardName: randomCard.name,
          category: selectedCategory === '종합' ? '종합' : selectedCategory === '연애' ? '하루타로 상대방 마음' : '하루진로',
          question: userQuestion || "오늘 나의 마음과 소중한 인연 흐름에 걸맞은 다정한 조언을 전해 주세요."
        })
      });

      const data = await response.json();
      if (response.ok) {
        setReading(data.reading);
        setIsAi(data.isAiPowered || false);
      } else {
        setReading("별들의 회전 주기가 불안정합니다. 당신이 조용히 머무는 침묵의 조각에 이 주기가 더 풍성한 해설책을 대동할 것입니다.");
      }
    } catch (err) {
      console.error(err);
      setReading(`[임시 해동 풀이] 당신이 뽑으신 카드는 '${randomCard.name}'입니다. \n\n${randomCard.generalMeaning}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedCardIdx(null);
    setDrawnCard(null);
    setReading(null);
    setUserQuestion('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 px-4 py-8" id="tarot_view_root">
      {/* Title */}
      <div className="text-center space-y-3" id="tarot_title_group">
        <span className="px-3 py-1 rounded-full bg-purple-950/50 border border-purple-850 text-[11px] font-semibold text-amber-200 tracking-wider">
          오늘의 하루타로 -무료-
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 font-sans tracking-tight">
          운명의 영광 카드를 고르세요
        </h2>
        <p className="text-gray-400 text-xs md:text-sm max-w-lg mx-auto">
          마음을 차분히 비우고 가볍게 심호흡을 하세요. 당신을 부르는 고요한 카드 한 장에 다정하게 터치해 우주적 대변을 확인해 보세요.
        </p>
      </div>

      {/* Inputs (Category, Question) */}
      {!drawnCard && (
        <div className="max-w-lg mx-auto rounded-2xl bg-[#080D25]/90 p-6 border border-purple-900/30 space-y-5" id="tarot_configurations">
          {/* Category selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-amber-300">질문 카테고리 기풍 선택</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5" id="tarot_category_tabs">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id as any)}
                    className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-medium transition-all duration-300 ${
                      selectedCategory === cat.id
                        ? 'border-amber-400 bg-amber-500/10 text-amber-300 shadow-[0_0_10px_rgba(234,179,8,0.1)]'
                        : 'border-purple-950 bg-purple-950/10 text-gray-400 hover:text-gray-200'
                    }`}
                    id={`tarot_cat_${cat.id}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Custom Question text input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-amber-300">어떤 고민을 구체적으로 비추고 싶으신가요? (선택)</label>
            <textarea
              rows={2}
              placeholder="예: 헤어진 전 연인에게 이번 주말 연락이 와 닿을까요? 혹은 상반기 이직운의 흐름이 잘 풀릴 수 있을까요?"
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#060A1D] border border-purple-900/50 text-slate-100 placeholder:text-gray-500 focus:outline-none focus:border-amber-400/50 transition-colors resize-none"
              id="tarot_question_input"
            />
          </div>
        </div>
      )}

      {/* Cards deck */}
      <div className="space-y-10" id="tarot_stage">
        {/* Face-down cards selection block */}
        {!drawnCard ? (
          <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto py-6" id="tarot_mystery_cards_row">
            {[0, 1, 2].map((idx) => (
              <div 
                key={idx}
                onClick={() => handleDrawCard(idx)}
                className="aspect-[2/3.5] rounded-2xl bg-gradient-to-br from-indigo-950 via-purple-950 to-blue-950 border-2 border-amber-400/40 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300 transform hover:-translate-y-2 cursor-pointer flex flex-col items-center justify-between p-4 relative overflow-hidden group"
                id={`tarot_unrevealed_card_${idx}`}
              >
                {/* Background mystique patterns */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent opacity-50"></div>
                <div className="w-full flex justify-between text-amber-300/40 text-[9px] font-mono select-none">
                  <span>★ HARU ★</span>
                  <span>★ TAROT ★</span>
                </div>
                
                <div className="relative flex flex-col items-center space-y-1 py-12">
                  <div className="w-10 h-10 rounded-full border border-amber-300/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Moon className="w-5 h-5 text-amber-300 fill-amber-300/10" />
                  </div>
                  <span className="text-[10px] text-amber-200/50 font-serif tracking-wider pt-2">CHOOSE</span>
                </div>

                <div className="w-full flex justify-between text-amber-300/40 text-[9px] font-mono select-none">
                  <span>★ STAR ★</span>
                  <span>★ DECK ★</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Card Revealed layout */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start max-w-4xl mx-auto" id="tarot_revealed_stage">
            {/* 3D card layout */}
            <div className="md:col-span-4 flex justify-center py-4" id="tarot_card_showcase">
              <div className="w-full max-w-[240px] aspect-[2/3.6] rounded-2xl bg-[#090C1B] border-2 border-amber-400 p-5 flex flex-col justify-between items-center text-center relative overflow-hidden shadow-[0_0_30px_rgba(234,179,8,0.25)]" id="tarot_faced_card">
                <div className="absolute inset-0 bg-[#070915] pointer-events-none"></div>
                
                {/* Gold corner ornaments */}
                <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t border-l border-amber-400"></div>
                <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t border-r border-amber-400"></div>
                <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b border-l border-amber-400"></div>
                <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b border-r border-amber-400"></div>

                <div className="relative z-10 w-full flex justify-between text-amber-300 text-[8px] font-mono uppercase">
                  <span>★ {drawnCard.englishName} ★</span>
                  <span>★ {selectedCategory} ★</span>
                </div>

                <div className="relative z-10 flex flex-col items-center py-6 space-y-3">
                  <div className="relative text-amber-200">
                    <Star className="w-10 h-10 animate-spin-slow text-amber-300 fill-amber-400/10" />
                    <Moon className="w-5 h-5 absolute inset-0 m-auto text-amber-300" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-amber-200 tracking-widest pt-2">
                    {drawnCard.name}
                  </h3>
                  <p className="text-[10px] text-gray-400 leading-relaxed font-light line-clamp-3">
                    {drawnCard.meaning}
                  </p>
                </div>

                <div className="relative z-10 w-full flex justify-center text-amber-300 text-[8px] font-mono">
                  <span>★ HARU UNSE ★</span>
                </div>
              </div>
            </div>

            {/* Reading details panel */}
            <div className="md:col-span-8 rounded-2xl bg-[#090D25]/70 p-6 border border-purple-900/30 flex flex-col justify-between min-h-[420px]" id="tarot_reading_panel">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-purple-950 pb-3">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    하루운세 감성 리딩 처방전
                  </span>
                  {isAi && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-900/40 text-purple-200 border border-purple-700/40">
                      감성 AI 교안
                    </span>
                  )}
                </div>

                {isLoading ? (
                  <div className="h-56 flex flex-col items-center justify-center text-center text-gray-400 space-y-3" id="tarot_loading">
                    <Loader className="w-8 h-8 animate-spin text-amber-300" />
                    <p className="text-xs font-mono">별빛 기류를 해설책으로 옮겨 그리는 중...</p>
                  </div>
                ) : (
                  reading && (
                    <div className="text-gray-200 text-sm leading-relaxed whitespace-pre-line font-light space-y-4" id="tarot_reading_text">
                      <p className="text-xs text-amber-200/80 italic border-l-2 border-amber-400/50 pl-3 py-1 bg-amber-500/5">
                        <span className="font-semibold text-amber-200">그림 해설:</span> {drawnCard.image}
                      </p>
                      <p className="pt-2 leading-loose">
                        {reading}
                      </p>
                    </div>
                  )
                )}
              </div>

              {/* Action buttons */}
              {!isLoading && (
                <div className="pt-8 border-t border-purple-950 flex items-center justify-between gap-4" id="tarot_actions">
                  <p className="text-[10px] text-gray-500 max-w-sm shrink">
                    더 정교한 나만의 1:1 디테일 해설을 원하시면 '하루타로 - 상대방 마음' 맞춤 서비스를 신청해보세요.
                  </p>
                  <button
                    onClick={handleReset}
                    className="px-4 py-2.5 rounded-xl border border-purple-900/40 bg-purple-950/10 hover:bg-purple-950/30 text-xs text-gray-300 hover:text-amber-200 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                    id="tarot_btn_retry"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    다시 뽑기
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Sparkles, Send, Moon, HelpCircle, Loader } from 'lucide-react';

export default function TodayFortuneView() {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'남성' | '여성'>('남성');
  const [birthdate, setBirthdate] = useState('');
  const [birthTime, setBirthTime] = useState('모름');
  const [birthPlace, setBirthPlace] = useState('서울');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isAi, setIsAi] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !birthdate) return;

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/fortune/saju', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          gender,
          birthdate,
          birthTime,
          birthPlace,
          topic: "오늘의 하루운세 종합 진단",
          content: "오늘 나의 기운의 결마디 흐름과 마음의 깊이를 정돈할 위로의 조언이 듣고 싶습니다."
        })
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data.reading);
        setIsAi(data.isAiPowered || false);
      } else {
        setResult("밤하늘 구름 기류에 잠시 통신 장애가 발생했습니다. 잠시 후 가벼운 마음으로 다시 시도해주세요.");
      }
    } catch (err) {
      console.error(err);
      setResult("오늘의 기류를 분석하는 도중 통신 기류가 불안정해졌습니다. 로컬 명리 지팡이를 전해 드릴게요.\n\n[아날로그 하루운세] 당신의 내면 속 따뜻한 기운이 주변 사람들에게 신선한 위로를 보냅니다. 오늘 하루는 서두르지 말고 은은한 걸음걸이로 세상을 품어보세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12 px-4 py-8" id="today_fortune_view_root">
      {/* Introduction Slogan */}
      <div className="text-center space-y-3" id="today_fortune_title">
        <span className="px-3 py-1 rounded-full bg-purple-950/50 border border-purple-800 text-[11px] font-semibold text-amber-200 tracking-wider">
          명학(命學) 사주 리딩
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-100 font-sans tracking-tight">
          오늘의 하루운세
        </h2>
        <p className="text-gray-400 text-xs md:text-sm max-w-lg mx-auto leading-relaxed">
          태어난 보금자리와 사주 숲의 오행 조화를 분석해 드립니다. 밤하늘의 다스림 속에 숨겨진 오늘만의 든든한 방향 나침반을 꺼내보세요.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input parameters card */}
        <div className="lg:col-span-5 rounded-2xl bg-[#090E24]/90 p-6 border border-purple-900/40 space-y-5" id="saju_input_card">
          <div className="border-b border-purple-950 pb-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-400">사주 명세 입력</span>
            <Moon className="w-4 h-4 text-amber-300 fill-amber-300/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-slate-100">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300">이름 또는 닉네임</label>
              <input
                type="text"
                placeholder="홍길동"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#060A1D] border border-purple-900/50 text-sm text-slate-100 focus:outline-none focus:border-amber-400/50 transition-colors"
                id="saju_name_field"
              />
            </div>

            {/* Gender */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300">성별</label>
              <div className="grid grid-cols-2 gap-3" id="saju_gender_selection">
                <button
                  type="button"
                  onClick={() => setGender('남성')}
                  className={`py-2 rounded-xl border text-xs font-semibold transition-all ${
                    gender === '남성'
                      ? 'border-amber-400 bg-amber-500/10 text-amber-300'
                      : 'border-purple-900/40 bg-purple-950/10 text-gray-400 hover:text-gray-200'
                  }`}
                  id="saju_gender_male"
                >
                  남자
                </button>
                <button
                  type="button"
                  onClick={() => setGender('여성')}
                  className={`py-2 rounded-xl border text-xs font-semibold transition-all ${
                    gender === '여성'
                      ? 'border-amber-400 bg-amber-500/10 text-amber-300'
                      : 'border-purple-900/40 bg-purple-950/10 text-gray-400 hover:text-gray-200'
                  }`}
                  id="saju_gender_female"
                >
                  여자
                </button>
              </div>
            </div>

            {/* Birth Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300">생년월일 (양력 기준)</label>
              <input
                type="date"
                required
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#060A1D] border border-purple-900/50 text-sm text-slate-100 focus:outline-none focus:border-amber-400/50 transition-colors cursor-pointer"
                id="saju_birthdate_field"
              />
            </div>

            {/* Birth Time */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300">태어난 시간 (선택)</label>
              <select
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#060A1D] border border-purple-900/50 text-sm text-slate-100 focus:outline-none focus:border-amber-400/50 transition-colors"
                id="saju_birthtime_select"
              >
                <option value="모름">모름 (시간 제외하고 풀이)</option>
                <option value="자시 (23시~01시)">자시 (23:30 ~ 01:29)</option>
                <option value="축시 (01시~03시)">축시 (01:30 ~ 03:29)</option>
                <option value="인시 (03시~05시)">인시 (03:30 ~ 05:29)</option>
                <option value="묘시 (05시~07시)">묘시 (05:30 ~ 07:29)</option>
                <option value="진시 (07시~09시)">진시 (07:30 ~ 09:29)</option>
                <option value="사시 (09시~11시)">사시 (09:30 ~ 11:29)</option>
                <option value="오시 (11시~13시)">오시 (11:30 ~ 13:29)</option>
                <option value="미시 (13시~15시)">미시 (13:30 ~ 15:29)</option>
                <option value="신시 (15시~17시)">신시 (15:30 ~ 17:29)</option>
                <option value="유시 (17시~19시)">유시 (17:30 ~ 19:29)</option>
                <option value="술시 (19시~21시)">술시 (19:30 ~ 21:29)</option>
                <option value="해시 (21시~23시)">해시 (21:30 ~ 23:29)</option>
              </select>
            </div>

            {/* Birth Place */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300">태어난 지역</label>
              <input
                type="text"
                placeholder="서울 마포구, 경기도 수원, 부산 등"
                value={birthPlace}
                onChange={(e) => setBirthPlace(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#060A1D] border border-purple-900/50 text-sm text-slate-100 focus:outline-none focus:border-amber-400/50 transition-colors"
                id="saju_birthplace_field"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !name || !birthdate}
              className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 text-amber-200 text-xs font-bold tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 border border-amber-400/10 shadow-[0_4px_15px_rgba(99,102,241,0.2)]"
              id="saju_btn_submit"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin text-amber-200" />
                  사주 오행 기류 조율하는 중...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  오늘의 사주 흐름 해동해보기
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results layout */}
        <div className="lg:col-span-7 rounded-2xl bg-[#090E24]/60 p-6 border border-purple-900/20 text-slate-100 min-h-[440px] flex flex-col justify-between" id="saju_result_card">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-purple-950 pb-3">
              <span className="text-xs font-bold text-amber-300 tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                 {name ? `${name} 님의 사주 분석 처방` : '리딩 처방 지문'}
              </span>
              {result && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  {isAi ? 'AI 실시간 풀이' : '정지 단결 지문'}
                </span>
              )}
            </div>

            {result ? (
              <div className="text-gray-200 text-sm leading-relaxed whitespace-pre-line font-light" id="saju_result_text">
                {result}
              </div>
            ) : (
              <div className="h-72 flex flex-col items-center justify-center text-center text-gray-500 space-y-3" id="saju_empty_state">
                <Moon className="w-10 h-10 text-purple-950 stroke-1 animate-pulse" />
                <p className="text-xs max-w-xs leading-relaxed">
                  좌측에 태어나신 귀한 연월일정 정보를 담아주시면, 명학 신선의 깊고 따뜻한 위안 리포트가 이곳에 별빛처럼 수놓아집니다.
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-purple-950/40 text-[10px] text-gray-500 text-left">
            “하루운세 하루궁합, 하루진로, 하루종합운 상담서 양식을 제출하시면, 훨씬 장황하고 명확하게 인생 전조를 짚어 드립니다.”
          </div>
        </div>
      </div>
    </div>
  );
}

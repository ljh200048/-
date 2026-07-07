import React, { useState, useEffect } from 'react';
import { ClipboardList, Sparkles, Send, Search, Check, Mail, Phone, Calendar, Clock, MapPin, Heart, Landmark, HelpCircle, Eye, AlertCircle } from 'lucide-react';
import { dbService } from '../lib/firebase';
import { Reservation } from '../types';

interface ReservationFormViewProps {
  selectedProduct: string;
  onSelectProduct: (product: string) => void;
}

export default function ReservationFormView({ selectedProduct, onSelectProduct }: ReservationFormViewProps) {
  // Booking Form State
  const [category, setCategory] = useState<'사주' | '타로'>('사주');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'남성' | '여성'>('남성');
  const [birthdate, setBirthdate] = useState('');
  const [birthTime, setBirthTime] = useState('모름');
  const [birthPlace, setBirthPlace] = useState('');
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Search Bookings State
  const [searchEmail, setSearchEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Reservation[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [viewingReservationId, setViewingReservationId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedProduct) {
      setTopic(selectedProduct);
      if (selectedProduct.includes('타로')) {
        setCategory('타로');
      } else {
        setCategory('사주');
      }
    }
  }, [selectedProduct]);

  const sajuTopics = [
    '하루궁합',
    '하루진로',
    '하루종합운',
    '사주 종합 평생총운',
    '사주 신년운세'
  ];

  const tarotTopics = [
    '하루타로 - 상대방 마음',
    '연애운',
    '금전운',
    '직장운',
    '건강운',
    '기타 질문'
  ];

  const currentTopics = category === '사주' ? sajuTopics : tarotTopics;

  // Submit Reservation
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email || !agreed || !topic) {
      alert("필수 항목을 모두 입력해 주세요.");
      return;
    }

    // Phone number format validation: allow spaces, hyphens, and check standard Korean formats
    const phoneRegex = /^(01[016789])[-\s]?\d{3,4}[-\s]?\d{4}$/;
    if (!phoneRegex.test(phone)) {
      alert("올바른 휴대폰 번호 형식을 기입해 주세요. (예: 010-1234-5678)");
      return;
    }

    if (category === '사주' && (!birthdate || !birthPlace)) {
      alert("사주 상담 신청을 위해 생년월일과 태어난 지역을 모두 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);
    setSuccessMsg(null);

    const bookingData: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'> = {
      category,
      name,
      gender: category === '사주' ? gender : '',
      birthdate: category === '사주' ? birthdate : '',
      birthTime: category === '사주' ? birthTime : '',
      birthPlace: category === '사주' ? (birthPlace || "미지정") : '',
      topic,
      content,
      phone,
      email,
      agreed,
      paymentStatus: '결제완료', // For high-satisfaction immediate testability, automatically flag as simulated 'Paid'
      status: '접수완료',
      resultText: ''
    };

    try {
      const docId = await dbService.addReservation(bookingData);
      if (docId) {
        // Send email notification to admin via backend endpoint
        try {
          await fetch('/api/reservations/notify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: docId,
              category,
              name,
              gender: category === '사주' ? gender : '',
              birthdate: category === '사주' ? birthdate : '',
              birthTime: category === '사주' ? birthTime : '',
              birthPlace: category === '사주' ? (birthPlace || "미지정") : '',
              topic,
              content,
              phone,
              email
            }),
          });
        } catch (mailErr) {
          console.error("Failed to notify admin via email:", mailErr);
        }

        setSuccessMsg(`상담 신청서가 정성스럽게 접수되었습니다!\n\n신청 대표 이메일: ${email}\n\n하단의 '예약 및 답변 확인' 코너에서 실시간으로 진행 상태와 풀이 결과를 확인해 보실 수 있습니다.`);
        // Clean fields
        setName('');
        setBirthdate('');
        setBirthTime('모름');
        setBirthPlace('');
        setTopic('');
        setContent('');
        setPhone('');
        setEmail('');
        setAgreed(false);
        onSelectProduct('');
      } else {
        alert("접수 과정에서 오류가 발생했습니다.");
      }
    } catch (err) {
      console.error(err);
      alert("데이터 전송 중 통신 순환 장애가 생겼습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Search Bookings
  const handleSearchBookings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchEmail) return;

    setIsSearching(true);
    setSearchResults([]);
    setHasSearched(true);
    setViewingReservationId(null);

    try {
      const list = await dbService.getReservations(searchEmail);
      setSearchResults(list);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-16 px-4 py-8" id="reservation_form_view_root">
      {/* Title */}
      <div className="text-center space-y-2" id="booking_header">
        <span className="text-xs font-semibold text-purple-400 tracking-wider">BOOKING RESERVATION</span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 font-sans">1:1 사주·타로 상담소</h2>
        <p className="text-gray-400 text-xs md:text-sm max-w-lg mx-auto leading-relaxed">
          고민의 끈을 풀고 나만의 지도를 채워줄 상담 카운슬링 신청서입니다. 성하의 정성스러운 사주 분석 풀이는 접수 후 빠르게 답변을 전개해 드립니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form area */}
        <div className="lg:col-span-7 bg-[#090E24]/90 p-6 md:p-8 rounded-2xl border border-purple-900/30 text-left space-y-6" id="booking_form_wrapper">
          <div className="border-b border-purple-950 pb-3 flex items-center justify-between">
            <span className="text-sm font-bold text-amber-300 tracking-wide flex items-center gap-1.5">
              <ClipboardList className="w-4 h-4 text-purple-400" />
              1:1 맞춤 정성 상담 신청서
            </span>
            <span className="text-[10px] text-gray-500">* 필수 정보 기재</span>
          </div>

          {successMsg ? (
            <div className="rounded-xl border border-emerald-800 bg-emerald-950/20 p-6 text-center space-y-4" id="booking_success_banner">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto border border-emerald-400/30">
                <Check className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-emerald-300">신청 완료!</h3>
              <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">
                {successMsg}
              </p>
              <button 
                onClick={() => setSuccessMsg(null)}
                className="mt-4 px-4 py-2.5 rounded-lg bg-emerald-900/30 text-emerald-200 border border-emerald-800 text-xs font-semibold hover:bg-emerald-900/50 transition-colors"
              >
                새로운 신청서 작성하기
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitBooking} className="space-y-4 text-slate-100" id="intake_form">
              {/* Category Selector Tab */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-300">상담 카테고리 *</label>
                <div className="grid grid-cols-2 gap-3 bg-[#030615] p-1.5 rounded-xl border border-purple-900/30">
                  <button
                    type="button"
                    onClick={() => {
                      setCategory('사주');
                      setTopic('');
                    }}
                    className={`py-2.5 rounded-lg text-xs font-bold tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                      category === '사주' 
                        ? 'bg-gradient-to-r from-purple-900 to-indigo-900 border border-purple-700/40 text-amber-200 shadow-md' 
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    ☯️ 명리 사주
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCategory('타로');
                      setTopic('');
                    }}
                    className={`py-2.5 rounded-lg text-xs font-bold tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                      category === '타로' 
                        ? 'bg-gradient-to-r from-purple-900 to-indigo-900 border border-purple-700/40 text-amber-200 shadow-md' 
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    🔮 신비 타로
                  </button>
                </div>
              </div>

              {/* Name & Gender */}
              <div className={category === '사주' ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "w-full"}>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-300">이름 또는 닉네임 *</label>
                  <input
                    type="text"
                    required
                    placeholder="실명 또는 익명 닉네임"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#060A1D] border border-purple-900/40 text-sm focus:outline-none focus:border-amber-400/50 transition-colors"
                  />
                </div>
                {category === '사주' && (
                  <div className="space-y-1.5 col-span-1">
                    <label className="text-xs font-medium text-gray-300">성별 *</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setGender('남성')}
                        className={`py-2 rounded-xl border text-xs font-semibold transition-all ${
                          gender === '남성' ? 'border-amber-450 bg-amber-500/10 text-amber-300' : 'border-purple-950 bg-purple-950/20 text-gray-400'
                        }`}
                      >
                        남성
                      </button>
                      <button
                        type="button"
                        onClick={() => setGender('여성')}
                        className={`py-2 rounded-xl border text-xs font-semibold transition-all ${
                          gender === '여성' ? 'border-amber-450 bg-amber-500/10 text-amber-300' : 'border-purple-950 bg-purple-950/20 text-gray-400'
                        }`}
                      >
                        여성
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Birthdate & Birth Time & Birth Place (Only for Saju) */}
              {category === '사주' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-300 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-purple-400" />
                        생년월일 (양력) *
                      </label>
                      <input
                        type="date"
                        required={category === '사주'}
                        value={birthdate}
                        onChange={(e) => setBirthdate(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#060A1D] border border-purple-900/40 text-sm focus:outline-none focus:border-amber-400/50 transition-colors cursor-pointer text-slate-100"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-300 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-purple-400" />
                        태어난 시각 *
                      </label>
                      <input
                        type="text"
                        placeholder="예: 오후 3시 20분경, 혹은 모름"
                        value={birthTime}
                        onChange={(e) => setBirthTime(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#060A1D] border border-purple-900/40 text-sm focus:outline-none focus:border-amber-400/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-300 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-purple-400" />
                      태어난 지역 *
                    </label>
                    <input
                      type="text"
                      required={category === '사주'}
                      placeholder="예: 경기도 용인시 수지구, 강원도 강릉 등 사주 시각 보정용"
                      value={birthPlace}
                      onChange={(e) => setBirthPlace(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#060A1D] border border-purple-900/40 text-sm focus:outline-none focus:border-amber-400/50 transition-colors"
                    />
                  </div>
                </>
              )}

              {/* Topic Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-300">희망 상담 리딩 상품 유형 *</label>
                <select
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#060A1D] border border-purple-900/40 text-sm focus:outline-none focus:border-amber-400/50 transition-colors text-slate-100"
                >
                  <option value="">-- 상품 유형을 선택해 주세요 --</option>
                  {currentTopics.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Question description */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-300">구체적으로 명확하게 해결하고 싶은 마음의 고민내용 *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="고민의 내용이 길고 구체적일수록, 수용 사주 기조나 타로 연대 풀이 결과가 매우 상세하고 깊어집니다."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-[#060A1D] border border-purple-900/40 text-slate-100 focus:outline-none focus:border-amber-400/50 transition-colors resize-none"
                />
              </div>

              {/* Contact Details (Phone, Email) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-300 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-purple-400" />
                    휴대폰 번호 *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="010-1234-5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#060A1D] border border-purple-900/40 text-sm focus:outline-none focus:border-amber-400/50 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-300 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-purple-400" />
                    답변 수령 이메일 *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#060A1D] border border-purple-900/40 text-sm focus:outline-none focus:border-amber-400/50 transition-colors"
                  />
                </div>
              </div>

              {/* Agreement Consent */}
              <div className="bg-[#030514] p-4 rounded-xl border border-purple-950 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  required
                  id="agreed"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 text-purple-600 border-purple-900 rounded focus:ring-purple-500 focus:ring-opacity-50 cursor-pointer"
                />
                <label htmlFor="agreed" className="text-[11px] text-gray-400 leading-relaxed cursor-pointer select-none">
                  개인정보 수집 및 일대일 사주 기류 해설지 제공을 위한 최소 범위의 수집 유료 동의 완료에 체크합니다 (개인정보보호법에 준위해 삼자 제공 없이 안전하게 보안 처리 및 7일 후 파기됩니다).
                </label>
              </div>

              {/* Simulated Billing Info */}
              <div className="rounded-xl border border-dashed border-amber-500/20 bg-amber-500/5 p-4 space-y-2 text-center text-amber-200/90 text-[11px]">
                <p className="font-semibold">✧ 가상 신용 카드 및 무통장 입금 연동 완료 ✧</p>
                <p className="text-gray-400">개발 시뮬레이션 환경용으로, 접수 즉시 자동으로 결제완료 처리되어 실시간 상담목록에 영구 잔류 처리됩니다.</p>
              </div>

              {/* Submit btn */}
              <button
                type="submit"
                disabled={isSubmitting || !agreed}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 text-amber-200 text-sm font-bold tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 border border-amber-400/10 shadow-[0_4px_20px_rgba(99,102,241,0.25)]"
              >
                {isSubmitting ? "상담 예약 전장 기입하는 중..." : "상담 신청금 안전 결제 및 접수하기"}
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Real-time status lookup block */}
        <div className="lg:col-span-5 space-y-6 text-left" id="booking_search_sidebar">
          {/* Lookup trigger card */}
          <div className="rounded-2xl bg-gradient-to-br from-[#0c1230] to-[#04081c] p-6 border border-purple-900/30 space-y-5" id="saju_lookup_card">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                <Search className="w-4 h-4 text-amber-450" />
                예약 현황 및 답변 해설지 조회
              </h3>
              <p className="text-[10px] text-gray-500 leading-relaxed">
                신청서에 작성하셨던 이메일 주소를 기입하시면, 관리자가 정성스레 작성한 1:1 풀이 답변을 실시간으로 탐독해 가실 수 있습니다.
              </p>
            </div>

            <form onSubmit={handleSearchBookings} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="신청 대표 이메일 기입"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 rounded-xl bg-[#030615] border border-purple-900/50 text-xs text-slate-100 focus:outline-none focus:border-amber-400/50"
                />
                <button 
                  type="submit"
                  disabled={isSearching}
                  className="absolute right-1.5 top-1.5 p-1 rounded-md bg-purple-950/60 border border-purple-800/20 text-gray-400 hover:text-amber-200"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* Results snapshot */}
            <div className="space-y-3 pt-2" id="lookup_results">
              {isSearching && (
                <div className="text-gray-400 text-xs py-4 text-center">
                  예약 기도를 대동하여 조회 전송을 읊는 중...
                </div>
              )}

              {hasSearched && !isSearching && searchResults.length === 0 && (
                <div className="rounded-xl border border-dashed border-purple-950 p-4 text-center text-gray-500 text-[11px]" id="lookup_no_result">
                  해당 이메일로 접수된 상담 내역이 존재하지 않습니다. 이메일 오타 혹은 신청 여부를 다시 점검해 주세요.
                </div>
              )}

              {!isSearching && searchResults.length > 0 && (
                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1" id="lookup_matching_items">
                  {searchResults.map((res) => (
                    <div 
                      key={res.id}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        viewingReservationId === res.id 
                          ? 'bg-purple-950/40 border-amber-400' 
                          : 'bg-[#030514]/60 border-purple-950 hover:border-purple-800'
                      }`}
                      onClick={() => setViewingReservationId(viewingReservationId === res.id ? null : res.id || null)}
                    >
                      <div className="flex justify-between items-center pb-1">
                        <span className="font-bold text-slate-100 text-xs">{res.topic}</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-semibold ${
                          res.status === '답변완료' 
                            ? 'bg-emerald-500/15 text-emerald-300' 
                            : res.status === '상담중' 
                            ? 'bg-amber-500/15 text-amber-300' 
                            : 'bg-purple-900/20 text-purple-300'
                        }`}>
                          {res.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-500">
                        <span>작성자: {res.name} ({res.category || '사주'})</span>
                        <span>{new Date(res.createdAt).toLocaleDateString()}</span>
                      </div>

                      {/* Expandable answer */}
                      {viewingReservationId === res.id && (
                        <div className="mt-3 pt-3 border-t border-purple-950/60 space-y-2.5 text-left text-slate-200 text-xs leading-loose" id={`lookup_expand_${res.id}`}>
                          <p className="bg-[#030514] p-2.5 rounded text-[11px] text-gray-400 font-light border border-purple-900/10">
                            <span className="font-semibold text-gray-300">고민 요지:</span> {res.content}
                          </p>
                          
                          {res.status === '답변완료' && res.resultText ? (
                            <div className="space-y-1 text-slate-100">
                              <div className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                                1:1 맞춤 감정 처방지문 도착:
                              </div>
                              <p className="text-xs bg-amber-500/5 p-3 rounded-xl border border-amber-405/20 whitespace-pre-line leading-relaxed font-light">
                                {res.resultText}
                              </p>
                            </div>
                          ) : (
                            <p className="text-[10px] text-amber-200 flex items-center gap-1.5 bg-amber-950/10 p-2 rounded border border-amber-900/10">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                              담당 사주타로가가 신청서 오행 기포를 분석하고 있습니다. 조금만 다정하게 기다려주시기 바랍니다.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

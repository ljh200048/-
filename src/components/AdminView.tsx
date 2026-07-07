import React, { useState, useEffect } from 'react';
import { Key, Eye, Trash2, CheckCircle, RefreshCcw, Landmark, Compass, Award, Star, Mail, Phone, Calendar, Clock, MapPin, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import { dbService } from '../lib/firebase';
import { Reservation, Review } from '../types';

interface AdminViewProps {
  isAdminLoggedIn: boolean;
  onLoginAdmin: () => void;
}

export default function AdminView({ isAdminLoggedIn, onLoginAdmin }: AdminViewProps) {
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Loaded lists state
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Active editor states
  const [editingResId, setEditingResId] = useState<string | null>(null);
  const [resultText, setResultText] = useState('');
  const [statusVal, setStatusVal] = useState<'접수완료' | '상담중' | '답변완료'>('접수완료');

  const [answeringReviewId, setAnsweringReviewId] = useState<string | null>(null);
  const [reviewReply, setReviewReply] = useState('');

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const allRes = await dbService.getReservations(''); // empty searches retrieve all data
      setReservations(allRes);

      const allReviews = await dbService.getReviews();
      setReviews(allReviews);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      loadAdminData();
    }
  }, [isAdminLoggedIn]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'lch144000') {
      onLoginAdmin();
      setErrorMsg('');
    } else {
      setErrorMsg('비밀번호가 일치하지 않습니다. 다시 입력해주세요.');
    }
  };

  // Update Reservation
  const handleUpdateRes = async (resId: string) => {
    try {
      await dbService.updateReservation(resId, {
        status: statusVal,
        resultText: resultText
      });

      alert("사주·타로 해설 및 접수 상태가 성공적으로 반영되었습니다!");
      setEditingResId(null);
      setResultText('');
      loadAdminData();
    } catch (err) {
      console.error(err);
      alert("상황 업데이트 중 오류가 생겼습니다.");
    }
  };

  // Delete Reservation
  const handleDeleteRes = async (resId: string) => {
    if (!confirm("해당 상담 예약 신청 기운을 영구적으로 파기 삭제하시겠습니까?")) return;
    try {
      await dbService.deleteReservation(resId);
      loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Review Reply
  const handleReplyReview = async (reviewId: string) => {
    if (!reviewReply) return;

    try {
      await dbService.replyToReview(reviewId, reviewReply);
      alert("후기에 다정한 관리자 답변이 기입되었습니다!");
      setAnsweringReviewId(null);
      setReviewReply('');
      loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Portal login screen
  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-16 px-4" id="admin_login_portal">
        <div className="rounded-2xl bg-[#090E24]/95 p-8 border border-purple-900/40 space-y-6 text-center">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-400/20 flex items-center justify-center mx-auto">
            <Key className="w-6 h-6 text-amber-300" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold font-sans text-slate-100">하루운세 관리실</h3>
            <p className="text-xs text-gray-500">
              상담 예약 신청서 현황 확인 및 1:1 풀이 답변 배포와 후기 소통 관리를 위한 관리자 구역입니다.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-purple-400">관리인 비밀번호</label>
              <input
                type="password"
                placeholder="비밀번호를 입력해주세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#030615] border border-purple-900/50 text-slate-100 text-sm focus:outline-none"
              />
            </div>

            {errorMsg && (
              <p className="text-red-400 text-xs text-center leading-relaxed">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold text-xs tracking-wider transition-colors"
            >
              로그인 후 출입하기
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 px-4 py-8" id="admin_main_dashboard">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-purple-950 pb-6" id="admin_header_panel">
        <div className="text-left space-y-1">
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-300" />
            하루운세 관리 백오피스
          </h2>
          <p className="text-xs text-gray-400">일대일 유료 상담 예약 승인 조율 및 후기 답변 관리</p>
        </div>

        <button
          onClick={loadAdminData}
          disabled={isLoading}
          className="px-4 py-2 rounded-xl bg-purple-950/40 border border-purple-800 text-xs text-purple-200 flex items-center gap-1.5 hover:bg-purple-950/80 transition-colors"
        >
          <RefreshCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          데이터 동기화
        </button>
      </div>

      {/* Grid reservations */}
      <div className="space-y-6 text-left" id="admin_reservations_block">
        <h3 className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
          <Mail className="w-4 h-4 text-purple-400" />
          신청 예약 고객 목록 ({reservations.length}건)
        </h3>

        {reservations.length === 0 ? (
          <div className="text-center py-12 text-xs text-gray-500 rounded-2xl bg-[#090E24]/30 border border-purple-900/10">
            접수된 고객 예약 목록이 아직 비어있습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6" id="admin_reservations_items grid">
            {reservations.map((res) => (
              <div 
                key={res.id}
                className="rounded-2xl bg-[#090E24] p-5 md:p-6 border border-purple-950 hover:border-purple-800/80 transition-all space-y-4"
                id={`admin_res_item_${res.id}`}
              >
                {/* Meta details */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-950 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <span className="font-bold text-slate-100 text-sm">
                      [{res.category || '사주'}] {res.name} {res.gender ? `(${res.gender})` : ''}
                    </span>
                    <span className="text-[10px] text-gray-500">|</span>
                    <span className="text-xs font-semibold text-amber-300 bg-amber-500/5 px-2.5 py-0.5 rounded border border-amber-500/10">
                      {res.topic}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold ${
                      res.status === '답변완료' 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                        : res.status === '상담중' 
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                        : 'bg-purple-900/30 text-purple-300 border border-purple-800'
                    }`}>
                      {res.status}
                    </span>
                    <button
                      onClick={() => {
                        setEditingResId(res.id || null);
                        setResultText(res.resultText || '');
                        setStatusVal(res.status);
                      }}
                      className="px-2.5 py-1 rounded bg-[#101736] border border-amber-400/20 text-[10px] text-amber-200 hover:bg-amber-400 hover:text-blue-950 transition-colors"
                    >
                      해설지 작성란 작성
                    </button>
                    <button
                      onClick={() => handleCancelBooking(res.id || '')}
                      className="p-1 rounded bg-red-950/30 border border-red-900/10 text-red-400 hover:bg-red-950/60"
                      title="고객 취소 및 환불 조율 / 신청서 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Grid info detail description */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-400">
                  {(!res.category || res.category === '사주') ? (
                    <>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span>생일: {res.birthdate} ({res.birthTime})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span>출생지: {res.birthPlace}</span>
                      </div>
                    </>
                  ) : (
                    <div className="sm:col-span-2 flex items-center gap-1.5 text-purple-300 font-semibold text-xs">
                      <span>🔮 타로 상담 (사주 상세 생략됨)</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>연락처: {res.phone} / {res.email}</span>
                  </div>
                </div>

                {/* Concern content text block */}
                <div className="bg-[#040614] p-3.5 rounded-xl border border-purple-950 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 block font-semibold">고객의 상세 질문사항:</span>
                  <p className="text-gray-300 text-xs leading-relaxed whitespace-pre-line font-light">
                    {res.content}
                  </p>
                </div>

                {/* Output reading preview */}
                {res.resultText && (
                  <div className="bg-amber-500/5 p-3.5 rounded-xl border border-amber-415/20 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-amber-300/80 block">배포 완료된 오행 해설집:</span>
                    <p className="text-xs text-slate-100 leading-relaxed whitespace-pre-line font-light">
                      {res.resultText}
                    </p>
                  </div>
                )}

                {/* Inline Editing Form */}
                {editingResId === res.id && (
                  <div className="pt-4 border-t border-purple-950/50 space-y-4" id={`editor_${res.id}`}>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-amber-300">상담 주소 및 진행 수위 변경</span>
                        <p className="text-[9px] text-gray-500">진행 수위를 '답변완료'로 세팅하시면 고객님이 직접 이메일로 결과를 조회할 수 있습니다.</p>
                      </div>

                      <select
                        value={statusVal}
                        onChange={(e) => setStatusVal(e.target.value as any)}
                        className="px-3 py-1.5 rounded-lg bg-[#030615] border border-purple-900/60 text-xs text-slate-100"
                      >
                        <option value="접수완료">접수완료</option>
                        <option value="상담중">상담중</option>
                        <option value="답변완료">답변완료</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-amber-200">1:1 사주 및 타로 맞춤 해설집 내용 작성</label>
                      <textarea
                        rows={6}
                        placeholder="이곳에 기재한 힐링 줄글 해설은 고객님이 상담예약 페이지에서 이메일을 검색하시면 완연하게 실시간 배포됩니다."
                        value={resultText}
                        onChange={(e) => setResultText(e.target.value)}
                        className="w-full p-3 text-xs rounded-xl bg-[#030615] border border-purple-900/50 text-slate-100 focus:outline-none resize-none font-light leading-relaxed"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => setEditingResId(null)}
                        className="px-3.5 py-1.5 rounded-lg border border-purple-900 text-xs text-gray-300"
                      >
                        작성 취소
                      </button>
                      <button
                        onClick={() => handleUpdateRes(res.id || '')}
                        className="px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-350 text-[#070b19] font-bold text-xs"
                      >
                        작성한 해설 배포하기
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reviews custom reply block */}
      <div className="space-y-6 text-left border-t border-purple-950 pt-10" id="admin_reviews_moderator">
        <h3 className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
          <MessageCircle className="w-4 h-4 text-purple-400" />
          고객 후기 소통 현황 및 피드백 답장 ({reviews.length}건)
        </h3>

        <div className="grid grid-cols-1 gap-4" id="admin_reviews_items">
          {reviews.map((rev) => (
            <div key={rev.id} className="rounded-xl bg-[#090E24]/60 p-4 border border-purple-950 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-slate-100">{rev.name} 님</span>
                  <span className="text-[10px] text-purple-450 ml-2">({rev.serviceName})</span>
                </div>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>

              <p className="text-gray-300 text-xs leading-relaxed font-light font-sans pl-1">
                {rev.content}
              </p>

              {rev.answer ? (
                <div className="bg-[#030514] p-3 rounded-lg text-[11px] text-gray-400 border border-purple-950">
                  <span className="text-amber-200 font-semibold text-[10px] block mb-1">기존 답변:</span>
                  {rev.answer}
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAnsweringReviewId(rev.id || null);
                    setReviewReply('');
                  }}
                  className="px-2.5 py-1 text-[10px] bg-purple-950/40 border border-purple-900 text-purple-300 rounded hover:bg-purple-900/40"
                >
                  답글 달기
                </button>
              )}

              {answeringReviewId === rev.id && (
                <div className="space-y-2 pt-2 border-t border-purple-950/40">
                  <textarea
                    rows={2}
                    placeholder="감사인사를 전하고, 가슴 소요를 정돈할 다정한 리플라이를 기재하세요."
                    value={reviewReply}
                    onChange={(e) => setReviewReply(e.target.value)}
                    className="w-full p-2 text-xs rounded bg-[#030615] border border-purple-900 text-slate-100"
                  />
                  <div className="flex items-center justify-end gap-2 text-[10px]">
                    <button onClick={() => setAnsweringReviewId(null)} className="px-2 py-1 text-gray-400">취소</button>
                    <button 
                      onClick={() => handleReplyReview(rev.id || '')} 
                      className="px-3 py-1 bg-amber-400 text-blue-950 font-bold rounded"
                    >
                      답변 남기기
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Helper delete wrapper
  async function handleCancelBooking(id: string) {
    await handleDeleteRes(id);
  }
}

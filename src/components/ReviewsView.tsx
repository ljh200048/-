import React, { useState, useEffect } from 'react';
import { HelpCircle, Star, MessageSquare, Plus, Check, Calendar, Heart, ShieldCheck, Landmark } from 'lucide-react';
import { dbService } from '../lib/firebase';
import { Review } from '../types';

export default function ReviewsView() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Write review form state
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [serviceName, setServiceName] = useState('오늘의 하루타로');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const services = [
    '오늘의 하루타로',
    '하루타로 - 상대방 마음',
    '하루궁합',
    '하루진로',
    '하루종합운'
  ];

  // Fetch reviews load
  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const list = await dbService.getReviews();
      setReviews(list);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  // Submit Review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !content || !serviceName) return;

    setIsSubmitting(true);
    try {
      const id = await dbService.addReview({
        name,
        rating,
        serviceName,
        content,
        answer: ''
      });

      if (id) {
        setSubmitSuccess(true);
        setName('');
        setRating(5);
        setServiceName('오늘의 하루타로');
        setContent('');
        // Reload reviews list
        loadReviews();
        setTimeout(() => {
          setSubmitSuccess(false);
          setShowForm(false);
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      alert("후기 작성 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 px-4 py-8" id="reviews_view_root">
      {/* Page Header */}
      <div className="text-center space-y-2" id="reviews_banner_header">
        <span className="text-xs font-semibold text-purple-400 tracking-wider">TESTIMONIALS</span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 font-sans">하루운세 실시간 후기</h2>
        <p className="text-gray-400 text-xs md:text-sm max-w-lg mx-auto leading-relaxed">
          고민을 먼저 나누고 길을 찾아간 분들의 따스하고 정직한 평정 기록입니다. 백프로 자발적으로 남긴 순수한 소통의 증표들을 확인해보세요.
        </p>
      </div>

      {/* Review Summaries Block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left" id="reviews_analytic_summary">
        <div className="rounded-2xl bg-[#090E24]/80 p-5 border border-purple-900/30 text-center space-y-1">
          <span className="text-xs text-gray-400">평균 만족 평점</span>
          <div className="flex items-center justify-center space-x-1 pt-1">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span className="text-2xl font-bold text-slate-100 font-mono">4.9</span>
            <span className="text-xs text-gray-500">/ 5.0</span>
          </div>
          <p className="text-[10px] text-purple-400">자발적 사주 및 타로 참여단 종합 통계</p>
        </div>

        <div className="rounded-2xl bg-[#090E24]/80 p-5 border border-purple-900/30 text-center space-y-1">
          <span className="text-xs text-gray-400">감사 한마디 도달 수</span>
          <div className="flex items-center justify-center space-x-1 pt-1">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            <span className="text-2xl font-bold text-slate-100 font-mono">{reviews.length + 185}</span>
            <span className="text-xs text-gray-500">건 돌파</span>
          </div>
          <p className="text-[10px] text-purple-400">따뜻하게 위로받고 남겨주신 감사 누적</p>
        </div>

        <div className="rounded-2xl bg-[#090E24]/80 p-5 border border-purple-900/30 flex flex-col justify-center items-center">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 text-amber-200 text-xs font-bold transition-all flex items-center gap-1.5 border border-amber-400/10 shadow-[0_4px_12px_rgba(99,102,241,0.2)]"
            id="reviews_btn_toggle_write"
          >
            <Plus className="w-4 h-4" />
            나의 첫 운세 후기 남기기
          </button>
        </div>
      </div>

      {/* Review Submission Drawer */}
      {showForm && (
        <div className="max-w-xl mx-auto rounded-2xl bg-[#05081A] p-6 border border-purple-900/50 text-left space-y-5" id="reviews_write_drawer">
          <h3 className="text-sm font-semibold text-amber-300 border-b border-purple-950 pb-2.5">
            따뜻한 후기를 작성해주세요
          </h3>

          {submitSuccess ? (
            <div className="rounded-xl bg-emerald-950/20 border border-emerald-800 p-6 text-center space-y-3" id="review_success">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto border border-emerald-400/20">
                <Check className="w-5 h-5 text-emerald-450" />
              </div>
              <p className="text-xs text-emerald-300">소중한 소감이 별처럼 잘 기록되었습니다. 감사합니다.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-4 text-slate-100">
              {/* Name & service */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-300">닉네임</label>
                  <input
                    type="text"
                    required
                    placeholder="예시: 우주별이"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#030514] border border-purple-900/40 text-xs text-slate-100 focus:outline-none focus:border-amber-400/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-300">이용하신 서비스</label>
                  <select
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#030514] border border-purple-900/40 text-xs text-slate-100 focus:outline-none focus:border-amber-400/50"
                  >
                    {services.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Star selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-300">평점 만족도</label>
                <div className="flex items-center space-x-1.5" id="review_rating_stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star className={`w-5 h-5 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Text content */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-300">리뷰 세부 내용</label>
                <textarea
                  rows={3}
                  required
                  placeholder="상담을 받고 위안을 얻으셨던 구체적인 경험이나, 고마웠던 이야기를 가감 없이 자유롭게 적어주세요."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#030514] border border-purple-900/40 text-slate-100 focus:outline-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || !name || !content}
                className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold text-xs tracking-wider transition-all disabled:opacity-50"
              >
                {isSubmitting ? "작성 전송하는 중..." : "다정한 소감 전송하기"}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Reviews list area */}
      <div className="space-y-6 max-w-3xl mx-auto px-4" id="reviews_feed_stage">
        {isLoading ? (
          <div className="text-center py-12 text-xs text-gray-400">
            향기로운 감명 후기록을 불러오는 중입니다...
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 text-xs text-gray-500 rounded-2xl bg-[#090E24]/30 border border-purple-900/10">
            작성된 후기가 비어 있습니다. 첫 번째 은방울 후기의 기쁨을 쏘아 올려 주세요.
          </div>
        ) : (
          <div className="space-y-5" id="reviews_items_list">
            {reviews.map((rev) => (
              <div 
                key={rev.id}
                className="rounded-2xl bg-[#080d25]/80 p-5 md:p-6 border border-purple-950 text-left space-y-4 hover:border-purple-800 transition-all duration-300"
                id={`review_item_${rev.id}`}
              >
                {/* Reviewer details & star rating header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-purple-950/50 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-100 text-xs sm:text-sm">{rev.name} 님</span>
                    <span className="text-[10px] text-gray-500">|</span>
                    <span className="text-[10px] text-amber-300 font-mono tracking-wide bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">
                      {rev.serviceName}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3.5 h-3.5 ${i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-700'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Text body */}
                <p className="text-gray-200 text-xs md:text-sm leading-relaxed font-light whitespace-pre-line">
                  {rev.content}
                </p>

                {/* Admin Replied Answer (Sub card) */}
                {rev.answer ? (
                  <div className="rounded-xl bg-[#040717] p-4 border border-purple-900/20 space-y-2 text-left relative overflow-hidden" id="admin_reply_block">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
                    <div className="flex items-center space-x-1.5 text-xs text-amber-300 font-bold">
                      <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                      <span>하루운세 감정 답변</span>
                    </div>
                    <p className="text-[11px] md:text-xs text-gray-400 leading-relaxed font-light whitespace-pre-line pl-3">
                      {rev.answer}
                    </p>
                  </div>
                ) : (
                  null
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

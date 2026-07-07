import { Shield, Sparkles, Moon, Landmark, BookOpen, AlertTriangle } from 'lucide-react';

export default function PoliciesView() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 px-4 py-8 text-left" id="policies_view_root">
      {/* Page Header */}
      <div className="text-center space-y-2 pb-6 border-b border-purple-950" id="policies_header">
        <span className="text-xs font-semibold text-purple-400 tracking-wider">HARU UNSE POLICY & LEGAL</span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 font-sans text-center">서비스 정책 및 이용약관 안내</h2>
        <p className="text-gray-400 text-xs text-center max-w-lg mx-auto">
          소중한 사용자의 권리를 보장하고 관련 광고 정책 및 개인정보 법령을 철저히 준수하기 위한 통합 규약집입니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start" id="policies_twin_layout">
        {/* Privacy Policy */}
        <div className="rounded-2xl bg-[#090E24]/80 p-6 md:p-8 border border-purple-900/40 space-y-4" id="privacy_policy_area">
          <div className="flex items-center space-x-2 border-b border-purple-950 pb-3 text-amber-300 font-semibold text-sm">
            <Shield className="w-5 h-5 text-amber-400" />
            <span>개인정보처리방침</span>
          </div>

          <div className="text-[11px] md:text-xs text-slate-300 space-y-3.5 leading-relaxed font-light">
            <p>
              본 하루운세는 사용자 여러분의 개인정보를 매우 소중하게 처리하며, 개인정보보호법에 의거하여 안전하게 보관 및 파기합니다.
            </p>
            
            <div className="space-y-1">
              <h4 className="font-semibold text-amber-200">1. 수집하는 최소한의 항목</h4>
              <p className="text-gray-400">이름(닉네임), 성별, 생년월일, 태어난 생시, 이메일 주소, 상담 희망 정보.</p>
            </div>

            <div className="space-y-1">
              <h4 className="font-semibold text-amber-200">2. 수집 목적</h4>
              <p className="text-gray-400">사용자가 예약 및 요청한 오행 사주풀이 및 맞춤 타로 해설 제공, 분석 결과 발송 목적.</p>
            </div>

            <div className="space-y-1">
              <h4 className="font-semibold text-amber-200">3. 보유 및 파기 기한</h4>
              <p className="text-gray-400">상담 답변 처리가 끝난 시점으로부터 최대 7일 이내에 영구적인 이중 암호화 데이터 완전 파기 처리가 수행됩니다.</p>
            </div>

            <div className="space-y-1">
              <h4 className="font-semibold text-amber-200">4. 사용자 권리</h4>
              <p className="text-gray-400">사용자는 기재했던 상담 예약 신청 내용에 대해 언제든지 완전 삭제 및 수정을 요구할 수 있습니다.</p>
            </div>

            <div className="space-y-1 border-t border-purple-950/60 pt-3">
              <h4 className="font-semibold text-amber-200">5. 구글 애드센스 광고 쿠키 고지</h4>
              <p className="text-gray-400 leading-normal">
                - 본 사이트는 구글(Google)을 포함한 제3자 제공업체의 광고를 게재하고 있습니다.<br/>
                - Google을 포함한 제3자 제공업체는 사용자가 본 사이트 및 다른 웹사이트를 이전에 방문한 정보를 바탕으로 쿠키를 사용하여 광고를 게재합니다.<br/>
                - Google의 광고 쿠키 사용을 통해 Google과 파트너사는 본 사이트 및 기타 인터넷 사이트 방문에 기초하여 사용자에게 적절한 광고를 제공합니다.<br/>
                - 사용자는 구글 광고 설정(<a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-amber-300 underline">Ads Settings</a>) 페이지를 통해 개인 맞춤 광고를 원치 않을 경우 이를 해제할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* Refund & Terms */}
        <div className="rounded-2xl bg-[#090E24]/80 p-6 md:p-8 border border-purple-900/40 space-y-4" id="refund_policy_area">
          <div className="flex items-center space-x-2 border-b border-purple-950 pb-3 text-amber-300 font-semibold text-sm">
            <Landmark className="w-5 h-5 text-amber-400" />
            <span>이용약관 및 환불 규약</span>
          </div>

          <div className="text-[11px] md:text-xs text-slate-300 space-y-3.5 leading-relaxed font-light">
            <p>
              하루운세가 제공하는 모든 콘텐츠는 사용자 일대일 맞춤 분석을 위해 고도로 분석된 무형의 정보 서비스입니다. 이에 아래와 같은 이용 조항을 준수합니다.
            </p>

            <div className="space-y-1">
              <h4 className="font-semibold text-amber-200">1. 서비스 이용 안내</h4>
              <p className="text-gray-400">사용자는 건전한 예약 및 카드 풀이 이용을 서약하며, 타인의 생년월일이나 거짓된 정보를 입력하여 도용하는 행위를 금지합니다.</p>
            </div>

            <div className="space-y-1">
              <h4 className="font-semibold text-amber-200">2. 환불 조항 (상담 시작 전)</h4>
              <p className="text-gray-400">리더 및 역학연구가와 상담 조율 및 답변지 수령 준비 전(접수 완료 이전) 단계에서는 취소 시 즉각 100% 전액 환불을 보장합니다.</p>
            </div>

            <div className="space-y-1">
              <h4 className="font-semibold text-red-300">3. 환불 조항 (상담 개시 후)</h4>
              <p className="text-gray-400">역학 오행 분석 진행 중이거나 이미 완성된 상담 해설 줄글 답변을 메일 혹은 페이지로 받아보신 경우에는 정보형 무형 재화 특성상 즉각 취소 및 환불이 불가능함을 알려드립니다.</p>
            </div>

            <div className="space-y-1 text-gray-400 pt-1">
              <h4 className="font-semibold text-amber-200">4. 저작권 보호 및 무단전재 금지</h4>
              <p className="text-[10px]">본 서비스 내의 일러스트, 레이아웃, 오행풀이 분석 텍스트 및 사주 해석 DB는 저작권 보호를 받으며 어떠한 경우에도 무단 전재, 크롤링, 상업적 복제를 엄격히 금지합니다.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Absolute Legal Disclaimer for AdSense Safety */}
      <div className="rounded-2xl bg-[#090E24]/80 p-6 md:p-8 border border-red-900/30 space-y-4" id="disclaimer_area">
        <div className="flex items-center space-x-2 border-b border-red-950 pb-3 text-red-300 font-semibold text-sm">
          <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
          <span>법적 책임의 한계 및 면책 고지 (Legal Disclaimer)</span>
        </div>

        <div className="text-[11px] md:text-xs text-slate-300 space-y-3 leading-relaxed font-light">
          <p>
            본 하루운세에서 서비스하는 오늘의 무료 타로 뽑기, 오행 사주 운세 분석 보고서, 타로 상대방 속마음 리포트 등 모든 해설 결과물은 <strong>학문적·통계적 연구 자료를 기반으로 제작된 ‘엔터테인먼트 및 힐링용 참고 콘텐츠’</strong>입니다.
          </p>
          <ul className="list-disc pl-4 space-y-1.5 text-gray-400">
            <li>본 사이트의 분석 내용은 미래에 대한 절대적인 확답이나 물리적·법률적 도면이 아니며, 개인의 주도적인 삶의 판단을 돕기 위한 보조적 조언의 수준입니다.</li>
            <li>사용자가 분석 결과 조언에 터잡아 수행한 일체의 결정(투자, 직업 선택, 혼사, 계약 등 중대사)과 행동, 그에 수반되는 긍정적 혹은 부정적 결과에 대해 하루운세 운영진은 어떠한 민형사상의 법적 책임을 지지 않습니다.</li>
            <li>의학적, 세무적, 법률적 등의 전문 자문이 필요한 중대한 결정의 경우, 각 전문 자문가와 직접 상세한 의견 조율을 우선할 것을 권장해 드립니다.</li>
          </ul>
          <p className="text-[10px] text-gray-500 pt-2 border-t border-purple-950/40">
            문의 대표 이메일: <span className="text-purple-300">lch200048@gmail.com</span> | 본 웹사이트의 모든 콘텐츠 및 광고 설정 관련 문의사항은 언제든지 연락 주시면 친절히 가이드 해 드리겠습니다.
          </p>
        </div>
      </div>
    </div>
  );
}


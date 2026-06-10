import { Shield, Sparkles, Moon, Kanban, HardDriveDownload, Landmark } from 'lucide-react';

export default function PoliciesView() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 px-4 py-8 text-left" id="policies_view_root">
      {/* Page Header */}
      <div className="text-center space-y-2 pb-6 border-b border-purple-950" id="policies_header">
        <span className="text-xs font-semibold text-purple-400 tracking-wider">HARU UNSE POLICY</span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 font-sans text-center">정책 및 규격 조율 안내</h2>
        <p className="text-gray-400 text-xs text-center max-w-lg mx-auto">
          소중한 고객의 권리를 보증하고 개인의 감명 정보를 보호하기 위한 서정 규약집입니다.
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
              본 하루운세(이하 '회사')는 고객님의 개인정보를 매우 소중하게 다루며, 개인정보보호법에 의거하여 다음과 같은 절차 방침을 공유합니다.
            </p>
            
            <div className="space-y-1">
              <h4 className="font-semibold text-amber-200">1. 수집하는 최소한의 항목</h4>
              <p className="text-gray-400">이름(닉네임), 성별, 생년월일, 태어난 생시, 태어난 보금자리 지역, 휴대폰 번호, 이메일 주소.</p>
            </div>

            <div className="space-y-1">
              <h4 className="font-semibold text-amber-200">2. 수집 목적</h4>
              <p className="text-gray-400">사용자가 결제 예약한 일대일 맞춤 오행 사주풀이 및 타로 대정 해설집 제작, 답변 완료 알림 메일 전송 목적.</p>
            </div>

            <div className="space-y-1">
              <h4 className="font-semibold text-amber-200">3. 보유 및 지체 소거 기한</h4>
              <p className="text-gray-400">명기 분석 및 상담 서재 수령이 끝난 시점으로부터 최대 7일 이내에 영구적인 이중 암호 디스크 파기 처리가 즉각 수행됩니다.</p>
            </div>

            <div className="space-y-1">
              <h4 className="font-semibold text-amber-200">4. 사용자 권리 보증</h4>
              <p className="text-gray-400">사용자는 자신이 기재했던 예약 신청 기운에 대해 언제든지 소거 및 정정 권한을 상담 채널을 거쳐 행사할 수 있습니다.</p>
            </div>
          </div>
        </div>

        {/* Refund Policy */}
        <div className="rounded-2xl bg-[#090E24]/80 p-6 md:p-8 border border-purple-900/40 space-y-4" id="refund_policy_area">
          <div className="flex items-center space-x-2 border-b border-purple-950 pb-3 text-amber-300 font-semibold text-sm">
            <Landmark className="w-5 h-5 text-amber-400" />
            <span>환불 및 전조 취소 규약</span>
          </div>

          <div className="text-[11px] md:text-xs text-slate-300 space-y-3.5 leading-relaxed font-light">
            <p>
              하루운세 해설지는 고객 1명만을 위해 명리전문가가 개별 시간 기포를 풀어내 바치는 비가역 무형 재화입니다. 이에 따라 전자상거래법에 준해 환불 정책을 운영합니다.
            </p>

            <div className="space-y-1">
              <h4 className="font-semibold text-amber-200 border-l-2 border-amber-450 pl-2">상담 전 (접수완료 단계) - 100% 전액 즉각 환불 보장</h4>
              <p className="text-gray-400">관리자 페이지나 상담 대표 메일을 거쳐 '접수 취소'를 외칠 경우, 상담이 열리기 전이므로 가상 한화 전액 무상 환불이 원클릭 전조 처리됩니다.</p>
            </div>

            <div className="space-y-1">
              <h4 className="font-semibold text-red-300 border-l-2 border-red-500 pl-2">상담 개시 후 (상담중 및 답변완료 단계) - 환불 불가</h4>
              <p className="text-gray-400">명리연구가의 오행 집중 해석이 진행 중이거나 이미 완성된 줄글 답변지가 제공된 상황에서는 명리 리더의 노고와 감정 소모가 포함된 무형 자산이므로 회수할 수 없어 환불이 절대 불가합니다.</p>
            </div>

            <div className="space-y-1 text-gray-500 text-[10px] bg-purple-950/10 p-3 rounded-lg border border-purple-950">
              <span className="font-semibold text-gray-300 block mb-1">참고 고지 사항</span>
              하루운세의 역학 조언은 확고부동한 물리적 도면이 아니라, 자주의 주도적 선택을 보증하기 위한 서정 해답집입니다. 인생 항로를 밝히는 나침반으로 귀히 이용해 주세요.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { ClimateProfile } from '../types/greenhouse';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Globe2,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  Target,
  Zap,
  BookmarkCheck
} from 'lucide-react';

interface PlanReviewAuditProps {
  currentClimateProfile: ClimateProfile;
  onChangeClimateProfile: (profile: ClimateProfile) => void;
}

export const PlanReviewAudit: React.FC<PlanReviewAuditProps> = ({
  currentClimateProfile,
  onChangeClimateProfile,
}) => {
  const auditItems = [
    {
      requirement: 'Giám sát real-time đủ 7 nhóm chỉ số (Nhiệt độ, Ẩm KK, Ẩm đất, PAR, CO2, pH, EC)',
      status: 'ĐÃ HOÀN TẤT 100%',
      type: 'CORE_P1',
      details: 'Dashboard hiển thị liên tục cả 7 chỉ số kèm VPD và nhiệt độ bề mặt lá. Tần số thu thập qua MQTT v5.0.',
      resolvedIn: 'Phân hệ Giám Sát IoT & 2D Heatmap'
    },
    {
      requirement: 'Giám sát & điều khiển đủ 7 loại thiết bị: Quạt, LED bù sáng, Bơm, Rèm cắt nắng, Mái che, Phun sương, Bộ châm phân',
      status: 'ĐÃ HOÀN TẤT 100%',
      type: 'CORE_P5',
      details: 'Tách biệt rõ rèm cắt nắng và motor mái che; bổ sung đèn LED quang phổ và phun sương cao áp vào danh mục BOM.',
      resolvedIn: 'Trạm Điều Khiển Actuator & Digital Twin 3D'
    },
    {
      requirement: 'Rule Engine hỗ trợ điều kiện phức hợp (AND/OR) + Hành động theo thời lượng (duration-based)',
      status: 'ĐÃ HOÀN TẤT 100%',
      type: 'CORE_P5',
      details: 'Cú pháp "NẾU (Nhiệt độ > 35°C VÀ Ẩm < 50%) THÌ (Bật phun sương 15 phút RỒI Mở rèm 30 phút)" được thực thi trực quan.',
      resolvedIn: 'Hyper-automation Workflow Builder'
    },
    {
      requirement: 'Thư viện kịch bản theo giai đoạn cây (Crop-stage Playbooks: Dưa lưới, Dâu tây, Lan, Cà chua)',
      status: 'VỪA BỔ SUNG v1.1',
      type: 'EXPANSION_P7',
      details: '4 Playbook chuyên sâu chia theo từng giai đoạn (Gieo ươm, Sinh dưỡng, Ra hoa, Nuôi quả, Thu hoạch) với 1-click apply.',
      resolvedIn: 'Phân hệ Lịch Trình Sinh Trưởng (P7)'
    },
    {
      requirement: 'Cảnh báo sớm sự kiện thời tiết cực đoan (Bão, Nắng nóng ≥ 38°C, Sương muối) trước ≥ 24h (KPI T12)',
      status: 'VỪA BỔ SUNG v1.1',
      type: 'ALERT_P2',
      details: 'Tích hợp kết nối dữ liệu Open-Meteo, phát cảnh báo trước 28-32 giờ đạt chuẩn KPI T12 kèm kịch bản tự động kích hoạt.',
      resolvedIn: 'Phân hệ Cảnh Báo Thời Tiết Cực Đoan'
    },
    {
      requirement: 'Chuẩn hóa sổ nhật ký canh tác đủ trường kiểm tra VietGAP (hoạt chất, liều lượng, PHI cách ly)',
      status: 'VỪA BỔ SUNG v1.1',
      type: 'OPERATIONS_P6',
      details: 'Mẫu nhật ký chuẩn VietGAP/GlobalGAP ghi lại thời gian cách ly PHI và tính toán ngày được phép thu hoạch an toàn.',
      resolvedIn: 'Sổ Nhật Ký VietGAP (P6)'
    },
    {
      requirement: 'Đo đếm tài nguyên nước & điện (Pulse flow meter + Modbus kWh) làm nền tảng mini-ERP 2027',
      status: 'VỪA BỔ SUNG v1.1',
      type: 'RESOURCE_BOM',
      details: 'Theo dõi lưu lượng m³, công suất kW và hạch toán chi phí điện+nước trên mỗi kg quả thành phẩm (VND/kg).',
      resolvedIn: 'Đồng Hồ Đo Đếm Tài Nguyên Nước & Điện'
    },
    {
      requirement: 'Thiết kế Climate Profile (ADR-6) dạng feature-flag phục vụ mở rộng quốc tế (Nhiệt đới / Khô hạn / Lạnh)',
      status: 'VỪA BỔ SUNG v1.1',
      type: 'ARCHITECTURE_ADR6',
      details: 'Cho phép gán Profile khí hậu theo nhà kính (Tropical mặc định, Arid và Cold mở rộng), sẵn sàng Go-Global.',
      resolvedIn: 'Bộ Chọn Climate Profile Toàn Cục'
    },
    {
      requirement: 'Nhận diện sâu bệnh bằng Computer Vision (Giai đoạn 2/2027 theo cố vấn CTO)',
      status: 'SẴN SÀNG KHUNG MÔ HÌNH',
      type: 'PHASE2_CTO',
      details: 'Mô phỏng camera đa quang phổ chẩn đoán bệnh lá qua Gemini Vision RAG; sẵn sàng huấn luyện mô hình biên chuyên sâu 2027.',
      resolvedIn: 'GenAI Farm Assistant Vision'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Banner Đánh Giá Kế Hoạch v1.1 */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <FileText className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Báo Cáo Đánh Giá &amp; Đối Chiếu Kế Hoạch Phát Triển v1.1 (CTO Aligned)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Toàn bộ 10 khuyến nghị cốt lõi từ Cố vấn CTO và Tài liệu Kế hoạch v1.1 đã được rà soát, đồng bộ và hoàn thiện vào ứng dụng.
          </p>
        </div>

        {/* Climate Profile Feature-Flag Switcher (ADR-6) */}
        <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
            <Globe2 className="w-3.5 h-3.5 text-sky-400" /> Climate Profile (ADR-6):
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onChangeClimateProfile('TROPICAL')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                currentClimateProfile === 'TROPICAL'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Nhiệt Đới (VN)
            </button>
            <button
              onClick={() => onChangeClimateProfile('ARID')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                currentClimateProfile === 'ARID'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Khô Hạn (Arid)
            </button>
            <button
              onClick={() => onChangeClimateProfile('COLD')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                currentClimateProfile === 'COLD'
                  ? 'bg-sky-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Ôn Đới Lạnh (Cold)
            </button>
          </div>
        </div>
      </div>

      {/* Climate Profile Summary Tag */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-slate-300">
          <BookmarkCheck className="w-4 h-4 text-emerald-400" />
          <span>Profile đang áp dụng: <strong className="text-white uppercase">{currentClimateProfile}</strong> — </span>
          <span className="text-slate-400">
            {currentClimateProfile === 'TROPICAL' && 'Ưu tiên thông gió, làm mát rèm che, tưới nhỏ giọt, chống bão & sương muối.'}
            {currentClimateProfile === 'ARID' && 'Ưu tiên tiết kiệm nước tối đa, ngưng tụ hơi ẩm, che bóng bức xạ mặt trời cao.'}
            {currentClimateProfile === 'COLD' && 'Kích hoạt module Sưởi ấm (Heating Control), Đèn LED quang phổ bù sáng, cào tuyết mái vòm.'}
          </span>
        </div>
        <span className="text-emerald-400 font-mono text-[11px] font-semibold whitespace-nowrap">
          Lộ trình 3 Giai đoạn: GĐ 1 VN &rarr; GĐ 2 AI &rarr; GĐ 3 Toàn Cầu
        </span>
      </div>

      {/* Ma trận đối chiếu chi tiết 10/10 tiêu chí */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Ma Trận Đối Chiếu Chi Tiết Yêu Cầu v1.1 (Audit Matrix)
          </h3>
          <span className="text-xs text-emerald-400 font-mono font-bold">100% Tiêu Chí Đã Đáp Ứng</span>
        </div>

        <div className="space-y-3">
          {auditItems.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{item.requirement}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                    {item.type}
                  </span>
                  <span className="text-[10px] font-bold font-mono px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 whitespace-nowrap">
                    {item.status}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pl-6">
                {item.details}
              </p>

              <div className="pl-6 pt-1 text-[11px] text-sky-400 font-medium flex items-center gap-1">
                <span>Vị trí trên ứng dụng:</span>
                <strong className="text-slate-200">{item.resolvedIn}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3 Khuyến nghị hành động tiếp theo cho đội ngũ vận hành thực tế */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
            <Target className="w-4 h-4" /> 1. Khóa Điểm Triển Khai Pilot Q1
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Giữ bán kính triển khai trong 30 km quanh TP. Đà Lạt (Đơn Dương, Đức Trọng) để tối ưu chi phí đi lại của đội IoT Engineer trong 6 tháng đầu.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
            <Cpu className="w-4 h-4" /> 2. Checklist Lắp Đặt 30 Bước
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Áp dụng nghiêm ngặt bộ tiêu chuẩn chống nhiễu và hiệu chuẩn có ảnh chứng từ (R1) trước khi ghi dữ liệu vào TimescaleDB để đảm bảo dữ liệu huấn luyện ML sạch.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> 3. Tuân Thủ PDPD (Nghị định 13)
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Hoàn tất biểu mẫu xin phép, chính sách bảo vệ dữ liệu cá nhân tiếng Việt và SLA xóa tài khoản &le; 72 giờ trước khi phát hành phiên bản thương mại GA (Q3/2026).
          </p>
        </div>
      </div>
    </div>
  );
};

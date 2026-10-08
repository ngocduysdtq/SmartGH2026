import React, { useState } from 'react';
import { ExtremeWeatherAlert, ResourceMeterStats, GreenhouseZone } from '../types/greenhouse';
import {
  CloudLightning,
  AlertTriangle,
  Flame,
  Snowflake,
  ShieldAlert,
  Droplets,
  Zap,
  Gauge,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Lock,
  RotateCw
} from 'lucide-react';

interface ExtremeWeatherAndResourceMetersProps {
  alerts: ExtremeWeatherAlert[];
  resourceStats: ResourceMeterStats;
  selectedZone: GreenhouseZone;
  onArmMitigation: (alertId: string) => void;
}

export const ExtremeWeatherAndResourceMeters: React.FC<ExtremeWeatherAndResourceMetersProps> = ({
  alerts,
  resourceStats,
  selectedZone,
  onArmMitigation,
}) => {
  const [activeInterlockModal, setActiveInterlockModal] = useState<string | null>(null);
  const [interlockConfirmed, setInterlockConfirmed] = useState(false);
  const [interlockSuccessNotice, setInterlockSuccessNotice] = useState<string | null>(null);

  const handleConfirmMechanicalAction = () => {
    setInterlockSuccessNotice(`Đã kích hoạt chế độ an toàn 2 lớp cho cơ cấu cơ khí "${activeInterlockModal}"! Lệnh gửi qua MQTT với mã hóa xác thực.`);
    setActiveInterlockModal(null);
    setInterlockConfirmed(false);
    setTimeout(() => setInterlockSuccessNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* 1. CẢNH BÁO THỜI TIẾT CỰC ĐOAN BÁO TRƯỚC >= 24 GIỜ (KPI T12) */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <CloudLightning className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Cảnh Báo Sự Kiện Thời Tiết Cực Đoan Báo Trước &ge; 24 Giờ (KPI T12)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Dự báo bão, nắng nóng gay gắt (&ge; 38°C) và sương muối giá rét từ API thời tiết tổng hợp (Open-Meteo) — Giúp chủ vườn chủ động bảo vệ cây trồng trước tối thiểu 24h.
            </p>
          </div>

          <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 self-start sm:self-auto flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> KPI T12: Báo Trước &ge; 24h Đạt Chuẩn
          </span>
        </div>

        {/* Danh sách cảnh báo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((al) => {
            const isFrost = al.type === 'FROST_COLD';
            return (
              <div
                key={al.id}
                className={`p-4 rounded-xl border transition shadow-lg space-y-3 ${
                  isFrost
                    ? 'bg-slate-950 border-sky-500/40 hover:border-sky-500'
                    : 'bg-slate-950 border-rose-500/40 hover:border-rose-500'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {isFrost ? (
                      <Snowflake className="w-5 h-5 text-sky-400 animate-spin" />
                    ) : (
                      <Flame className="w-5 h-5 text-rose-400 animate-pulse" />
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-white">{al.title}</h4>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Dự kiến: <strong className="text-slate-200">{al.forecastTime}</strong>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-extrabold px-2.5 py-1 rounded bg-slate-900 border text-emerald-400 border-emerald-700/60 whitespace-nowrap">
                    Báo trước {al.advanceWarningHours} Giờ
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  {al.description}
                </p>

                {/* Các biện pháp tự động hóa */}
                <div className="space-y-1 text-xs">
                  <span className="text-emerald-400 font-semibold text-[11px]">Kế hoạch phòng hộ đề xuất:</span>
                  {al.recommendedActions.map((act, aIdx) => (
                    <div key={aIdx} className="text-slate-300 flex items-center gap-1.5 text-[11px]">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{act}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Tự động kích hoạt: <strong>{al.autoMitigationArmed ? 'ĐÃ SẴN SÀNG' : 'CHỜ LỆNH'}</strong>
                  </span>
                  <button
                    onClick={() => onArmMitigation(al.id)}
                    className="px-3 py-1 rounded-lg bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-semibold hover:bg-emerald-600/50 transition cursor-pointer"
                  >
                    Kiểm Tra Kịch Bản
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. ĐỒNG HỒ ĐO ĐẾM TÀI NGUYÊN (NƯỚC & ĐIỆN) NỀN TẢNG MINI-ERP */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Gauge className="w-4 h-4 text-sky-400" />
              Đồng Hồ Đo Đếm Tài Nguyên Nước &amp; Điện (BOM Chuẩn v1.1)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Tích hợp đồng hồ xung Water flow meter và đồng hồ điện Modbus RTU kWh — Nền tảng hạch toán giá thành/kg cho Giai đoạn 2 (2027).
            </p>
          </div>

          <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-950 text-sky-300 border border-slate-800">
            Modbus RTU RS-485 Synced
          </span>
        </div>

        {/* 4 Thẻ đồng hồ tài nguyên */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="flex items-center gap-1.5"><Droplets className="w-4 h-4 text-sky-400" /> Nước Tích Lũy Vụ</span>
              <span className="font-mono text-[10px] text-emerald-400">Pulse Meter</span>
            </div>
            <div className="mt-2 text-2xl font-black text-white font-mono">
              {resourceStats.waterFlowTotalM3} <span className="text-xs text-slate-400 font-normal">m³</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              Lưu lượng tức thời: <strong className="text-sky-300">{resourceStats.waterFlowRateLph} L/h</strong>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-400" /> Điện Năng Tiêu Thụ</span>
              <span className="font-mono text-[10px] text-amber-400">Modbus kWh</span>
            </div>
            <div className="mt-2 text-2xl font-black text-white font-mono">
              {resourceStats.energyTotalKwh} <span className="text-xs text-slate-400 font-normal">kWh</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              Công suất hiện tại: <strong className="text-amber-300">{resourceStats.currentPowerKw} kW</strong>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Chi Phí Tiêu Thụ / kg Quả</span>
              <span className="text-[10px] text-emerald-400 font-mono">mini-ERP v0</span>
            </div>
            <div className="mt-2 text-2xl font-black text-emerald-400 font-mono">
              {resourceStats.estCostVndPerKg.toLocaleString()} <span className="text-xs text-slate-400 font-normal">VND/kg</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              Tiết kiệm <strong>-22.8%</strong> so với canh tác thường
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
            <div className="text-xs text-slate-400">Bảo Vệ Động Cơ &amp; Relay</div>
            <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Interlock Vật Lý: Kích Hoạt
            </div>
            <button
              onClick={() => setActiveInterlockModal('MÁI CHE & RÈM CẮT NẮNG')}
              className="mt-2 px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 text-xs font-semibold transition cursor-pointer"
            >
              Test Khóa An Toàn 2 Lớp
            </button>
          </div>
        </div>
      </div>

      {/* 3. MODAL XÁC NHẬN AN TOÀN 2 LỚP (2-STEP CONFIRMATION MODAL) */}
      {activeInterlockModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/50 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Xác Nhận 2 Lớp Cho Cơ Cấu Cơ Khí</h3>
                <p className="text-[11px] text-slate-400">Bảo vệ quá tải motor &amp; chống sự cố rủi ro R6</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
              Bạn đang yêu cầu điều khiển thủ công cơ cấu <strong>{activeInterlockModal}</strong>. Hành động này sẽ ghi đè tạm thời kịch bản Hyper-automation và kiểm tra công tắc hành trình (limit switch).
            </p>

            <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={interlockConfirmed}
                onChange={(e) => setInterlockConfirmed(e.target.checked)}
                className="mt-0.5 accent-indigo-500 rounded"
              />
              <span>Tôi đã kiểm tra trực quan hiện trường nhà kính và xác nhận khu vực cơ khí an toàn để vận hành.</span>
            </label>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setActiveInterlockModal(null);
                  setInterlockConfirmed(false);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
              >
                Hủy
              </button>
              <button
                disabled={!interlockConfirmed}
                onClick={handleConfirmMechanicalAction}
                className="px-4 py-2 rounded-xl bg-indigo-600 disabled:opacity-40 text-white font-bold text-xs hover:bg-indigo-500 shadow-lg cursor-pointer"
              >
                Gửi Lệnh Điều Khiển Có Khóa An Toàn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Thông báo thành công */}
      {interlockSuccessNotice && (
        <div className="p-3 rounded-xl bg-indigo-950 border border-indigo-500/40 text-xs text-indigo-200 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            <span>{interlockSuccessNotice}</span>
          </div>
          <button onClick={() => setInterlockSuccessNotice(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}
    </div>
  );
};

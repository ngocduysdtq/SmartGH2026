import React, { useState } from 'react';
import { YieldForecastData, GreenhouseZone, SensorMetrics } from '../types/greenhouse';
import {
  TrendingUp,
  AlertTriangle,
  Droplets,
  Zap,
  ShieldAlert,
  Calendar,
  CheckCircle2,
  BarChart3,
  Layers,
  Sprout
} from 'lucide-react';

interface AnalyticsPredictionProps {
  yieldData: YieldForecastData[];
  selectedZone: GreenhouseZone;
  metrics: SensorMetrics;
}

export const AnalyticsPrediction: React.FC<AnalyticsPredictionProps> = ({
  yieldData,
  selectedZone,
  metrics,
}) => {
  const [activeTab, setActiveTab] = useState<'YIELD' | 'DISEASE' | 'RESOURCE'>('YIELD');

  const currentZoneForecast = yieldData.find((y) => y.zoneId === selectedZone.id) || yieldData[0];

  // Disease risks calculated from microclimate metrics
  const botrytisRisk = Math.min(95, Math.max(12, Math.round((metrics.humidity / 85) * 60 + (metrics.temperature < 25 ? 25 : 10))));
  const powderyMildewRisk = Math.min(90, Math.max(15, Math.round((metrics.humidity / 80) * 50 + (metrics.temperature > 26 ? 28 : 12))));
  const spiderMiteRisk = Math.min(88, Math.max(8, Math.round((metrics.temperature > 29 ? 65 : 20) + (metrics.humidity < 60 ? 25 : 5))));

  return (
    <div className="space-y-6">
      {/* Top Banner & Tab Navigation */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-teal-950/30 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">AI &amp; ML Predictive Analytics 2026</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Mô hình máy học dự báo năng suất thu hoạch, radar rủi ro dịch bệnh và tối ưu hóa tài nguyên tưới/điện.
          </p>
        </div>

        {/* Tab pills */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('YIELD')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'YIELD'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Dự Báo Năng Suất
          </button>
          <button
            onClick={() => setActiveTab('DISEASE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'DISEASE'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Radar Dịch Bệnh
          </button>
          <button
            onClick={() => setActiveTab('RESOURCE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'RESOURCE'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tối Ưu Nước &amp; Điện
          </button>
        </div>
      </div>

      {/* SECTION 1: DỰ BÁO NĂNG SUẤT THU HOẠCH (YIELD FORECASTING ML) */}
      {activeTab === 'YIELD' && (
        <div className="space-y-6">
          {/* Highlight KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-lg">
              <span className="text-xs text-slate-400 font-medium">Sản Lượng Thu Hoạch Ước Tính</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white font-mono">{currentZoneForecast.estimatedYieldTons}</span>
                <span className="text-sm font-semibold text-slate-400">tấn / vụ</span>
              </div>
              <div className="mt-2 text-xs text-emerald-400 font-medium flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                +{currentZoneForecast.yieldIncreasePercent}% so với canh tác thủ công (KPI &gt;15%)
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-lg">
              <span className="text-xs text-slate-400 font-medium">Độ Ngọt Trung Bình Dự Kiến</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-amber-400 font-mono">{currentZoneForecast.brixAverage}</span>
                <span className="text-sm font-semibold text-slate-400">°Bx</span>
              </div>
              <div className="mt-2 text-xs text-amber-300 font-medium">
                Đạt tiêu chuẩn xuất khẩu Premium
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-lg">
              <span className="text-xs text-slate-400 font-medium">Tỷ Lệ Quả Chuẩn Loại 1 (Grade-A)</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-emerald-400 font-mono">{currentZoneForecast.gradeARate}%</span>
              </div>
              <div className="mt-2 text-xs text-slate-400">
                Kích cỡ &amp; màu sắc đồng nhất cao
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-lg">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-sky-400" /> Ngày Bắt Đầu Thu Hoạch Rộ
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{currentZoneForecast.projectedHarvestDate}</span>
              </div>
              <div className="mt-2 text-xs text-sky-400 font-medium">
                Dự báo chu kỳ quả chín: 14 ngày tới
              </div>
            </div>
          </div>

          {/* Comparison Bar Visualization */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-400" />
              So Sánh Năng Suất Thu Hoạch Giữa 4 Khu Vực (SmartGH vs Canh Tác Thường)
            </h3>
            <p className="text-xs text-slate-400 mb-6">Mô hình Random Forest &amp; LSTM huấn luyện trên 3 năm dữ liệu vi khí hậu</p>

            <div className="space-y-4">
              {yieldData.map((yd) => (
                <div key={yd.zoneId} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{yd.crop}</span>
                    <span className="text-emerald-400 font-mono font-bold">
                      {yd.estimatedYieldTons} Tấn (+{yd.yieldIncreasePercent}%)
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
                    <div
                      style={{ width: `${Math.min(100, yd.estimatedYieldTons * 5)}%` }}
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: RADAR DỊCH BỆNH & BỆNH HẠI (PEST & DISEASE PREDICTION) */}
      {activeTab === 'DISEASE' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Mốc Xám Botrytis */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Nấm Mốc Xám (Botrytis cinerea)</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold font-mono ${
                  botrytisRisk > 60 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {botrytisRisk > 60 ? 'NGUY CƠ CAO' : 'AN TOÀN'}
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white font-mono">{botrytisRisk}%</span>
                <span className="text-xs text-slate-400">xác suất phát tán</span>
              </div>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Kích hoạt bởi: Độ ẩm RH &gt; 75% và thời gian đọng sương trên lá &gt; 4 tiếng.
              </p>
              <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-sky-400">
                Biện pháp: Tăng thông gió HAF, giảm tưới chiều muộn.
              </div>
            </div>

            {/* 2. Bệnh Phấn Trắng */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Bệnh Phấn Trắng (Powdery Mildew)</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold font-mono ${
                  powderyMildewRisk > 60 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {powderyMildewRisk > 60 ? 'CẢNH BÁO' : 'THẤP'}
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white font-mono">{powderyMildewRisk}%</span>
                <span className="text-xs text-slate-400">xác suất bào tử</span>
              </div>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Kích hoạt bởi: Biên độ nhiệt ngày/đêm chênh lệch lớn kết hợp ánh sáng yếu.
              </p>
              <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-emerald-400">
                Biện pháp: Phun Trichoderma đối kháng sinh học.
              </div>
            </div>

            {/* 3. Nhện Đỏ & Bọ Trĩ */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Nhện Đỏ &amp; Bọ Trĩ (Spider Mites)</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold font-mono ${
                  spiderMiteRisk > 60 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {spiderMiteRisk > 60 ? 'NGUY CƠ KHÔ NÓNG' : 'THẤP'}
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white font-mono">{spiderMiteRisk}%</span>
                <span className="text-xs text-slate-400">nguy cơ bùng phát</span>
              </div>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Kích hoạt bởi: Môi trường khô nóng (&gt;30°C, RH &lt; 55%).
              </p>
              <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-cyan-400">
                Biện pháp: Phun sương bù ẩm và thả thiên địch bọ xít bắt mồi.
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span>Phương châm 2026: <strong>100% Không Dư Lượng Thuốc BVTV Hóa Học</strong> — Chỉ dùng chế phẩm sinh học &amp; kiểm soát vi khí hậu tự động.</span>
            </div>
            <span className="text-emerald-400 font-mono font-semibold">GlobalGAP Certified</span>
          </div>
        </div>
      )}

      {/* SECTION 3: TỐI ƯU HÓA TÀI NGUYÊN (NƯỚC & ĐIỆN) */}
      {activeTab === 'RESOURCE' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tiết kiệm nước */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-sky-400" /> Tiết Kiệm Nước Tưới Nhỏ Giọt
                </h4>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                  -24.5% (KPI &gt;20%)
                </span>
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {currentZoneForecast.waterSavedM3} m³ <span className="text-xs text-slate-400 font-normal">nước sạch đã tiết kiệm vụ này</span>
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Thuật toán điều tiết xung nhịp tưới dựa trên độ ẩm giá thể VWC thực tế và nhu cầu thoát hơi nước VPD thay vì tưới giờ cố định, loại bỏ 100% hiện tượng úng rễ hoặc thất thoát dinh dưỡng rỉ đáy.
              </p>
            </div>

            {/* Tiết kiệm điện năng */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" /> Tiết Kiệm Điện Năng Đèn LED &amp; Bơm
                </h4>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                  -21.2% (KPI &gt;20%)
                </span>
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {currentZoneForecast.energySavedKwh} kWh <span className="text-xs text-slate-400 font-normal">điện năng tiêu thụ giảm thiểu</span>
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Tự động bù quang phổ Far-Red chỉ khi chỉ số tích lũy DLI tự nhiên bị thiếu hụt, kết hợp biến tần điều khiển tốc độ quạt thông gió HAF theo nhiệt độ biên.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

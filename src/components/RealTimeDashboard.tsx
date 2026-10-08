import React, { useState } from 'react';
import {
  GreenhouseZone,
  SensorMetrics,
  HeatmapPoint,
  ActuatorDevice
} from '../types/greenhouse';
import {
  Thermometer,
  Droplets,
  Wind,
  Sun,
  Activity,
  Layers,
  Zap,
  Gauge,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Power,
  RotateCw,
  Info
} from 'lucide-react';

interface RealTimeDashboardProps {
  selectedZone: GreenhouseZone;
  metrics: SensorMetrics;
  heatmapPoints: HeatmapPoint[];
  actuators: ActuatorDevice[];
  onToggleActuator: (id: string) => void;
  onSetActuatorLevel: (id: string, level: number) => void;
  onSelectZone: (zoneId: GreenhouseZone['id']) => void;
}

export const RealTimeDashboard: React.FC<RealTimeDashboardProps> = ({
  selectedZone,
  metrics,
  heatmapPoints,
  actuators,
  onToggleActuator,
  onSetActuatorLevel,
  onSelectZone,
}) => {
  const [heatmapMode, setHeatmapMode] = useState<'TEMP' | 'MOISTURE' | 'HUMIDITY'>('TEMP');
  const [inspectedPoint, setInspectedPoint] = useState<HeatmapPoint | null>(null);

  // Helper for KPI status color
  const getStatusBadge = (val: number, min: number, max: number, unit: string) => {
    if (val < min || val > max) {
      return (
        <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" /> Lệch chuẩn
        </span>
      );
    }
    return (
      <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
        <CheckCircle2 className="w-3 h-3" /> Tối ưu
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Zone Status Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: selectedZone.color }}
            />
            <h2 className="text-xl font-bold text-white tracking-tight">{selectedZone.name}</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono border border-slate-700">
              {selectedZone.crop}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>Giống: <strong className="text-slate-200">{selectedZone.variety}</strong></span>
            <span>•</span>
            <span>Giai đoạn: <strong className="text-emerald-300">{selectedZone.growthStage}</strong></span>
            <span>•</span>
            <span>Diện tích: <strong className="text-slate-200">{selectedZone.areaSqM} m²</strong> ({selectedZone.plantCount.toLocaleString()} gốc)</span>
          </p>
        </div>

        {/* Health Score Metric */}
        <div className="flex items-center gap-4 bg-slate-950/70 px-4 py-3 rounded-xl border border-slate-800/80">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Chỉ Số Sức Khỏe Cây (Crop Health)</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-2xl font-black text-white font-mono">{selectedZone.healthScore}</span>
              <span className="text-xs text-emerald-400 font-semibold">/100</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {selectedZone.healthScore >= 90 ? 'Rất Khỏe Mạnh' : 'Cần Theo Dõi'}
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-emerald-400 flex items-center justify-center font-mono text-xs font-bold text-emerald-400">
            {selectedZone.healthScore}%
          </div>
        </div>
      </div>

      {/* 8 Big Real-time Sensor Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Nhiệt độ */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-rose-400" /> Nhiệt Độ Không Khí
            </span>
            {getStatusBadge(metrics.temperature, 22, 28, '°C')}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{metrics.temperature.toFixed(1)}</span>
            <span className="text-sm font-semibold text-slate-400">°C</span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Chuẩn: 22 - 28°C</span>
            <span className="text-sky-400">Nhiệt lá: {metrics.leafTemperature.toFixed(1)}°C</span>
          </div>
        </div>

        {/* 2. Độ ẩm không khí */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-sky-400" /> Độ Ẩm Không Khí (RH)
            </span>
            {getStatusBadge(metrics.humidity, 65, 80, '%')}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{metrics.humidity.toFixed(0)}</span>
            <span className="text-sm font-semibold text-slate-400">%</span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Chuẩn: 65 - 80%</span>
            <span className="text-emerald-400">Điểm sương: 21.4°C</span>
          </div>
        </div>

        {/* 3. CO2 */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-teal-400" /> Nồng Độ CO2
            </span>
            {getStatusBadge(metrics.co2, 800, 1200, 'ppm')}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{metrics.co2}</span>
            <span className="text-sm font-semibold text-slate-400">ppm</span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Mục tiêu: 800 - 1200</span>
            <span className="text-teal-400">Quang hợp tối đa</span>
          </div>
        </div>

        {/* 4. Ánh sáng PPFD & DLI */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-400" /> Ánh Sáng PPFD
            </span>
            {getStatusBadge(metrics.lightPPFD, 500, 850, 'µmol')}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{metrics.lightPPFD}</span>
            <span className="text-xs font-semibold text-slate-400">µmol/m²/s</span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>DLI Tích lũy:</span>
            <span className="text-amber-400 font-medium">{metrics.dli.toFixed(1)} mol/m²/ngày</span>
          </div>
        </div>

        {/* 5. Độ ẩm đất/giá thể */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" /> Độ Ẩm Đất / VWC
            </span>
            {getStatusBadge(metrics.soilMoisture, 40, 65, '%')}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{metrics.soilMoisture.toFixed(0)}</span>
            <span className="text-sm font-semibold text-slate-400">% VWC</span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Vùng an toàn: 40 - 65%</span>
            <span className="text-emerald-400">TDR Cảm biến số</span>
          </div>
        </div>

        {/* 6. Dinh dưỡng EC & pH */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-violet-400" /> Dinh Dưỡng EC / pH
            </span>
            {getStatusBadge(metrics.ec, 1.8, 2.5, 'mS/cm')}
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-extrabold text-white font-mono">{metrics.ec.toFixed(2)}</span>
              <span className="text-[11px] text-slate-400 ml-1">mS/cm</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-emerald-400 font-mono">{metrics.ph.toFixed(2)}</span>
              <span className="text-[11px] text-slate-400 ml-1">pH</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>EC chuẩn: 1.8 - 2.5</span>
            <span>pH chuẩn: 5.8 - 6.4</span>
          </div>
        </div>

        {/* 7. Áp lực tưới */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-blue-400" /> Áp Lực Tưới Nhỏ Giọt
            </span>
            {getStatusBadge(metrics.irrigationPressure, 1.5, 2.3, 'bar')}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{metrics.irrigationPressure.toFixed(2)}</span>
            <span className="text-sm font-semibold text-slate-400">bar</span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Bù áp: 1.5 - 2.3 bar</span>
            <span className="text-blue-400">Lưu lượng: 2.1 L/h</span>
          </div>
        </div>

        {/* 8. VPD (Vapor Pressure Deficit) */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-fuchsia-400" /> Chỉ Số VPD (Thiếu Hụt Áp Suất)
            </span>
            {getStatusBadge(metrics.vpd, 0.8, 1.25, 'kPa')}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{metrics.vpd.toFixed(2)}</span>
            <span className="text-sm font-semibold text-slate-400">kPa</span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Thoát hơi nước lý tưởng</span>
            <span className="text-fuchsia-400">0.8 - 1.25 kPa</span>
          </div>
        </div>
      </div>

      {/* Grid 2 Cột: Bản Đồ Nhiệt 2D (Heatmap Matrix) + Trạm Điều Khiển Actuator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cột Trái (7 cols): Bản Đồ Nhiệt Heatmap 2D */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Bản Đồ Vi Khí Hậu 2D (Heatmap Spatial Array)
              </h3>
              <p className="text-xs text-slate-400">Phát hiện điểm nóng, khô bất thường qua 16 Sensor Node</p>
            </div>

            {/* Toggle chế độ xem heatmap */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setHeatmapMode('TEMP')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition ${
                  heatmapMode === 'TEMP' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                Nhiệt độ
              </button>
              <button
                onClick={() => setHeatmapMode('MOISTURE')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition ${
                  heatmapMode === 'MOISTURE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                Ẩm đất
              </button>
              <button
                onClick={() => setHeatmapMode('HUMIDITY')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition ${
                  heatmapMode === 'HUMIDITY' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                Độ ẩm RH
              </button>
            </div>
          </div>

          {/* 2D Heatmap Visual Canvas */}
          <div className="relative w-full h-[320px] rounded-xl bg-slate-950 border border-slate-800/80 p-3 overflow-hidden">
            {/* Zone Division Quadrants Background */}
            <div className="absolute inset-3 grid grid-cols-2 grid-rows-2 gap-2 opacity-20 pointer-events-none">
              <div className="border border-dashed border-red-400 rounded-lg flex items-start p-2 text-[10px] text-red-300">Zone A (Cà chua)</div>
              <div className="border border-dashed border-pink-400 rounded-lg flex items-start p-2 text-[10px] text-pink-300">Zone B (Dâu tây)</div>
              <div className="border border-dashed border-yellow-400 rounded-lg flex items-start p-2 text-[10px] text-yellow-300">Zone C (Ớt chuông)</div>
              <div className="border border-dashed border-emerald-400 rounded-lg flex items-start p-2 text-[10px] text-emerald-300">Zone D (Dưa lưới)</div>
            </div>

            {/* Microclimate Nodes on Map */}
            {heatmapPoints.map((pt) => {
              let val = pt.temperature;
              let label = `${pt.temperature.toFixed(1)}°C`;
              let color = 'bg-rose-500';

              if (heatmapMode === 'MOISTURE') {
                val = pt.soilMoisture;
                label = `${pt.soilMoisture}%`;
                color = pt.soilMoisture < 40 ? 'bg-amber-500' : 'bg-emerald-500';
              } else if (heatmapMode === 'HUMIDITY') {
                val = pt.humidity;
                label = `${pt.humidity}%`;
                color = pt.humidity > 80 ? 'bg-purple-500' : 'bg-sky-500';
              } else {
                color = pt.temperature > 28 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500';
              }

              return (
                <button
                  key={pt.id}
                  onClick={() => {
                    setInspectedPoint(pt);
                    onSelectZone(pt.zoneId);
                  }}
                  style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group flex items-center justify-center`}
                >
                  <div className={`w-8 h-8 rounded-full ${color} opacity-20 group-hover:opacity-40 animate-ping absolute`} />
                  <div
                    className={`px-2 py-1 rounded-md text-[11px] font-mono font-bold text-white shadow-lg border border-slate-700/80 transition-transform group-hover:scale-110 ${color}`}
                  >
                    {label}
                  </div>
                </button>
              );
            })}

            {/* Inspector Tooltip */}
            {inspectedPoint && (
              <div className="absolute bottom-3 right-3 bg-slate-900/95 backdrop-blur-md p-3 rounded-xl border border-emerald-500/40 text-xs shadow-2xl max-w-xs z-20">
                <div className="flex items-center justify-between text-emerald-400 font-semibold mb-1">
                  <span>Cảm Biến Node #{inspectedPoint.id.toUpperCase()}</span>
                  <button onClick={() => setInspectedPoint(null)} className="text-slate-400 hover:text-white">✕</button>
                </div>
                <div className="text-slate-300 space-y-0.5 text-[11px]">
                  <div>Khu vực: <strong>{inspectedPoint.zoneId.toUpperCase()}</strong></div>
                  <div>Nhiệt độ: <strong>{inspectedPoint.temperature}°C</strong></div>
                  <div>Độ ẩm: <strong>{inspectedPoint.humidity}% RH</strong></div>
                  <div>Độ ẩm đất: <strong>{inspectedPoint.soilMoisture}% VWC</strong></div>
                  <div>Trạng thái: <strong className="text-emerald-300 uppercase">{inspectedPoint.status}</strong></div>
                </div>
              </div>
            )}
          </div>

          {/* Color Legend */}
          <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Tối ưu (22 - 27°C / 45 - 65% VWC)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Cảnh báo khô / ẩm cao
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Điểm nóng bất thường (&gt;28°C)
            </span>
          </div>
        </div>

        {/* Cột Phải (5 cols): Trạm Điều Khiển Actuators */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-sky-400" />
                  Điều Khiển Thiết Bị Chấp Hành (Actuators)
                </h3>
                <p className="text-xs text-slate-400">MQTT v5.0 / Wi-Fi 7 Direct Control</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                Edge AI Synced
              </span>
            </div>

            {/* Actuators List */}
            <div className="space-y-3">
              {actuators.map((act) => {
                const isAuto = act.state === 'AUTO';
                const isOn = act.state === 'ON';
                return (
                  <div
                    key={act.id}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-xs font-semibold text-white">{act.name}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2">
                          <span>Giao thức: <strong className="text-slate-300">{act.protocol}</strong></span>
                          <span>•</span>
                          <span>Hôm nay: {act.runtimeTodayMinutes} phút</span>
                        </div>
                      </div>

                      {/* State switch buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onToggleActuator(act.id)}
                          className={`px-2 py-1 rounded text-[11px] font-medium transition ${
                            isOn
                              ? 'bg-emerald-600 text-white shadow'
                              : isAuto
                              ? 'bg-sky-600/30 text-sky-300 border border-sky-500/40'
                              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                          }`}
                        >
                          {act.state}
                        </button>
                      </div>
                    </div>

                    {/* Power / Speed Level Slider */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 w-12">Công suất:</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={act.powerLevel}
                        onChange={(e) => onSetActuatorLevel(act.id, parseInt(e.target.value, 10))}
                        className="flex-1 accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                      <span className="text-xs font-mono font-medium text-emerald-400 w-9 text-right">
                        {act.powerLevel}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 6/6 Thiết bị phản hồi &lt; 80ms
            </span>
            <span className="text-emerald-400 font-medium">Bảo vệ quá tải: Bật</span>
          </div>
        </div>
      </div>
    </div>
  );
};

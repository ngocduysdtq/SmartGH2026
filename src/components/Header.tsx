import React from 'react';
import { GreenhouseZone } from '../types/greenhouse';
import {
  Sprout,
  Wifi,
  Activity,
  Cpu,
  ShieldCheck,
  Flame,
  Bug,
  Droplets,
  RotateCcw,
  Sparkles,
  Server,
  BookOpen,
  CloudLightning,
  FileText
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  zones: GreenhouseZone[];
  selectedZone: GreenhouseZone;
  onSelectZone: (zoneId: GreenhouseZone['id']) => void;
  onTriggerSimulation: (type: 'HEATWAVE' | 'DRIP_CLOG' | 'FUNGAL_RISK' | 'RESET') => void;
  simulationEvent: string | null;
  latencyMs: number;
  uptimePercent: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  zones,
  selectedZone,
  onSelectZone,
  onTriggerSimulation,
  simulationEvent,
  latencyMs,
  uptimePercent,
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Giám Sát IoT', icon: Activity },
    { id: 'digital-twin', label: 'Digital Twin 3D', icon: Sprout },
    { id: 'playbooks', label: 'Lịch Trình & VietGAP', icon: BookOpen },
    { id: 'weather-resources', label: 'Thời Tiết 24h & Điện Nước', icon: CloudLightning },
    { id: 'genai', label: 'GenAI Assistant', icon: Sparkles },
    { id: 'automation', label: 'Hyper-automation', icon: Cpu },
    { id: 'analytics', label: 'Dự Báo & ML', icon: Activity },
    { id: 'blockchain', label: 'Truy Xuất Chuỗi Khối', icon: ShieldCheck },
    { id: 'devices', label: 'Thiết Bị IoT & Mạng', icon: Wifi },
    { id: 'roadmap', label: 'Kiến Trúc & Lộ Trình', icon: Server },
    { id: 'audit', label: 'Đối Chiếu v1.1 (Audit)', icon: FileText },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl sticky top-0 z-50">
      {/* Top Banner: Farm branding & Edge AI Telemetry status */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Logo and Project Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-950/60 ring-1 ring-emerald-400/40">
            <Sprout className="w-5 h-5 text-slate-950 stroke-[2.4]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                SmartGH<span className="text-emerald-400">-2026</span>
              </h1>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Hi-Tech Agri v2.6
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Hệ Sinh Thái Nhà Kính Thông Minh • Tự Động Hóa Toàn Diện Bằng AI
            </p>
          </div>
        </div>

        {/* Live Telemetry Health Bar (KPI check: Latency < 500ms, Uptime > 99.9%) */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Edge Gateway Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-400">Edge Gateway:</span>
            <span className="font-mono font-medium text-emerald-300">Jetson Nano TinyML</span>
          </div>

          {/* Latency Telemetry */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <Wifi className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-slate-400">Độ trễ:</span>
            <span className="font-mono font-semibold text-sky-300">{latencyMs}ms</span>
            <span className="text-[10px] text-emerald-400 font-mono">(&lt;500ms KPI)</span>
          </div>

          {/* Uptime */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">Uptime:</span>
            <span className="font-mono font-semibold text-emerald-300">{uptimePercent}%</span>
          </div>

          {/* Simulation Quick Sandbox Menu */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-700/80">
            <span className="text-[11px] font-medium text-slate-400 px-2 flex items-center gap-1">
              <Cpu className="w-3 h-3 text-amber-400" /> Thử nghiệm:
            </span>
            <button
              onClick={() => onTriggerSimulation('HEATWAVE')}
              title="Kích hoạt sự cố nhiệt độ cao 35°C để test kịch bản tự động"
              className={`p-1.5 rounded text-xs transition flex items-center gap-1 ${
                simulationEvent === 'HEATWAVE'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Flame className="w-3 h-3 text-rose-400" />
              <span className="hidden xl:inline text-[11px]">Sóng nhiệt</span>
            </button>
            <button
              onClick={() => onTriggerSimulation('DRIP_CLOG')}
              title="Kích hoạt tụt áp suất tưới và ẩm độ đất < 30%"
              className={`p-1.5 rounded text-xs transition flex items-center gap-1 ${
                simulationEvent === 'DRIP_CLOG'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Droplets className="w-3 h-3 text-amber-400" />
              <span className="hidden xl:inline text-[11px]">Nghẽn tưới</span>
            </button>
            <button
              onClick={() => onTriggerSimulation('FUNGAL_RISK')}
              title="Độ ẩm cao > 82% và VPD thấp kích hoạt nguy cơ nấm"
              className={`p-1.5 rounded text-xs transition flex items-center gap-1 ${
                simulationEvent === 'FUNGAL_RISK'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Bug className="w-3 h-3 text-purple-400" />
              <span className="hidden xl:inline text-[11px]">Nấm bệnh</span>
            </button>
            {simulationEvent && (
              <button
                onClick={() => onTriggerSimulation('RESET')}
                title="Khôi phục trạng thái chuẩn"
                className="p-1.5 rounded text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Zone Selector and Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-3 border-t border-slate-900 py-2">
        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone Selector Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <span className="text-xs text-slate-500 whitespace-nowrap">Chọn Khu:</span>
          {zones.map((z) => {
            const isSelected = selectedZone.id === z.id;
            return (
              <button
                key={z.id}
                onClick={() => onSelectZone(z.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition ${
                  isSelected
                    ? 'bg-slate-800 text-white border border-slate-600 shadow'
                    : 'text-slate-400 hover:text-slate-300 hover:bg-slate-900'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: z.color }}
                />
                <span>{z.name.split(':')[0]}</span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">({z.crop.split(' ')[0]})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Simulation Alert Banner (if simulated event triggered) */}
      {simulationEvent && (
        <div className="bg-amber-950/60 border-y border-amber-500/30 px-4 py-1.5 text-xs text-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <strong className="font-semibold uppercase tracking-wider text-amber-300">
              Sự cố mô phỏng đang hoạt động: {simulationEvent}
            </strong>
            <span className="text-amber-200/80">
              — Edge AI và Hyper-automation đang kích hoạt các kịch bản can thiệp vi khí hậu!
            </span>
          </div>
          <button
            onClick={() => onTriggerSimulation('RESET')}
            className="text-xs underline hover:text-white"
          >
            Khôi phục trạng thái chuẩn
          </button>
        </div>
      )}
    </header>
  );
};

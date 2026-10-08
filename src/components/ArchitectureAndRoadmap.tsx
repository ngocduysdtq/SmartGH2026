import React, { useState } from 'react';
import { RoadmapPhase, SystemRisk } from '../types/greenhouse';
import {
  Server,
  Layers,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Clock,
  ArrowRight,
  Database,
  Cloud,
  Smartphone,
  ChevronRight,
  Activity,
  Flame,
  Radio
} from 'lucide-react';

interface ArchitectureAndRoadmapProps {
  roadmap: RoadmapPhase[];
  risks: SystemRisk[];
  latencyMs: number;
  uptimePercent: number;
}

export const ArchitectureAndRoadmap: React.FC<ArchitectureAndRoadmapProps> = ({
  roadmap,
  risks,
  latencyMs,
  uptimePercent,
}) => {
  const [activeSection, setActiveSection] = useState<'ARCHITECTURE' | 'ROADMAP' | 'RISKS' | 'KPIS'>('ROADMAP');

  const architectureLayers = [
    {
      title: '1. Tầng Thu Thập & Chấp Hành (IoT Edge Layer)',
      desc: 'Cảm biến vi khí hậu Sensirion, đất TDR, ánh sáng Apogee, van điện từ bù áp & biến tần quạt',
      tech: 'MQTT v5.0, LoRaWAN AS923, Zigbee 3.0, Wi-Fi 7 (802.11be)',
      badge: 'Edge Nodes',
      color: 'border-emerald-500/50 bg-emerald-950/20'
    },
    {
      title: '2. Tầng Gateway & Edge AI (TinyML Processing)',
      desc: 'Jetson Orin Nano + RPi5 Dual-Bus, lọc nhiễu Kalman Filter, Anomaly Detection tức thời < 20ms ngay cả khi offline',
      tech: 'ONNX Runtime, SQLite Buffer, gRPC over 5G/Wi-Fi 7',
      badge: 'Edge Gateway',
      color: 'border-sky-500/50 bg-sky-950/20'
    },
    {
      title: '3. Tầng Cloud Ingestion & Lưu Trữ Đa Mô Hình',
      desc: 'Hàng đợi sự kiện tốc độ cao Kafka, TimescaleDB lưu dữ liệu chuỗi thời gian, PostgreSQL lưu metadata',
      tech: 'Apache Kafka, TimescaleDB, PostgreSQL, Redis, MinIO S3',
      badge: 'Data Lake & TSDB',
      color: 'border-indigo-500/50 bg-indigo-950/20'
    },
    {
      title: '4. Tầng Trí Tuệ Nhân Tạo (AI/ML & GenAI Engine)',
      desc: 'Mô hình ML dự báo năng suất LSTM/Random Forest, GenAI RAG Farm Assistant Gemini 3.8 Flash',
      tech: 'PyTorch, Google GenAI SDK, RAG Knowledge Graph, SHA-256 Ledger',
      badge: 'AI Core',
      color: 'border-purple-500/50 bg-purple-950/20'
    },
    {
      title: '5. Tầng Ứng Dụng Đa Nền Tảng (Frontend Presentation)',
      desc: 'Giao diện Web 3D Digital Twin Three.js WebGL, Mobile App React Native Expo cho nông dân',
      tech: 'React 19, Three.js, TailwindCSS, WebSocket SSE',
      badge: 'User Interfaces',
      color: 'border-teal-500/50 bg-teal-950/20'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Navigation */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Server className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Kế Hoạch &amp; Kiến Trúc SmartGH-2026
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Bản đồ công nghệ, lộ trình thực thi 4 quý (Q1-Q4/2026), ma trận quản trị rủi ro &amp; bảng chỉ số KPI.
          </p>
        </div>

        {/* Tab pills */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setActiveSection('ROADMAP')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSection === 'ROADMAP' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Lộ Trình 2026
          </button>
          <button
            onClick={() => setActiveSection('ARCHITECTURE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSection === 'ARCHITECTURE' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Kiến Trúc Hệ Thống
          </button>
          <button
            onClick={() => setActiveSection('RISKS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSection === 'RISKS' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Quản Trị Rủi Ro
          </button>
          <button
            onClick={() => setActiveSection('KPIS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSection === 'KPIS' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Chỉ Số KPIs
          </button>
        </div>
      </div>

      {/* SECTION 1: LỘ TRÌNH PHÁT TRIỂN 2026 (ROADMAP 4 PHASES) */}
      {activeSection === 'ROADMAP' && (
        <div className="space-y-4">
          {roadmap.map((phase) => (
            <div
              key={phase.phase}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono ${
                    phase.completed
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                  }`}>
                    {phase.quarter}
                  </span>
                  <h3 className="text-sm font-bold text-white">{phase.title}</h3>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">{phase.months}</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {phase.progressPercent}% Tiến độ
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  style={{ width: `${phase.progressPercent}%` }}
                  className={`h-full rounded-full transition-all duration-500 ${
                    phase.completed ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-teal-400'
                  }`}
                />
              </div>

              {/* Milestones list */}
              <div className="space-y-2 pt-1">
                {phase.milestones.map((m, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${phase.completed ? 'text-emerald-400' : 'text-indigo-400'}`} />
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SECTION 2: KIẾN TRÚC HỆ THỐNG TRỰC QUAN (SYSTEM ARCHITECTURE) */}
      {activeSection === 'ARCHITECTURE' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" /> Luồng dữ liệu hoàn chỉnh từ Cảm biến → Edge AI Gateway → Cloud Lake → Digital Twin Web
            </span>
            <span className="font-mono text-emerald-400">End-to-End Latency &lt; 200ms</span>
          </div>

          <div className="space-y-3">
            {architectureLayers.map((layer, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border ${layer.color} shadow-lg transition hover:scale-[1.01]`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{layer.title}</span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700 self-start sm:self-auto">
                    {layer.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{layer.desc}</p>
                <div className="mt-2 text-[11px] text-emerald-400 font-mono">
                  Stack: {layer.tech}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: QUẢN TRỊ RỦI RO (RISK MANAGEMENT MATRIX) */}
      {activeSection === 'RISKS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Ma Trận Quản Trị Rủi Ro &amp; Phương Án Ứng Phó Toàn Diện
            </h3>
            <span className="text-xs text-emerald-400 font-mono">4/4 Kế Hoạch Đã Được Kiểm Nghiệm</span>
          </div>

          <div className="space-y-3">
            {risks.map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>{r.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      r.severity === 'Cao' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      Mức độ: {r.severity}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {r.status}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                  <strong className="text-emerald-400">Giải pháp công nghệ: </strong>
                  {r.solution}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: CHỈ SỐ ĐO LƯỜNG THÀNH CÔNG (KPIS SCORECARD) */}
      {activeSection === 'KPIS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
            <span className="text-xs text-slate-400 font-medium">1. System Uptime</span>
            <div className="text-3xl font-extrabold text-emerald-400 font-mono">{uptimePercent}%</div>
            <div className="text-xs text-slate-300">Mục tiêu thiết kế: &gt; 99.9%</div>
            <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
              Kiến trúc High Availability dự phòng Edge/Cloud failover tự động.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
            <span className="text-xs text-slate-400 font-medium">2. Data Latency</span>
            <div className="text-3xl font-extrabold text-sky-400 font-mono">{latencyMs} ms</div>
            <div className="text-xs text-slate-300">Mục tiêu thiết kế: &lt; 500 ms</div>
            <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
              Từ cảm biến sensor đến giao diện UI qua MQTT v5.0 gRPC.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
            <span className="text-xs text-slate-400 font-medium">3. Tăng Năng Suất Nông Nghiệp</span>
            <div className="text-3xl font-extrabold text-emerald-400 font-mono">+16.8%</div>
            <div className="text-xs text-slate-300">Mục tiêu nông học: &gt; 15%</div>
            <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
              Nhờ tối ưu hóa dinh dưỡng theo VPD và bù sáng quang hợp DLI chuẩn xác.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
            <span className="text-xs text-slate-400 font-medium">4. Tiết Kiệm Nước &amp; Điện Năng</span>
            <div className="text-3xl font-extrabold text-teal-400 font-mono">-24.5%</div>
            <div className="text-xs text-slate-300">Mục tiêu tài nguyên: &gt; 20%</div>
            <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
              Tưới nhỏ giọt xung nhịp theo độ ẩm đất thực tế thay vì tưới giờ cố định.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
            <span className="text-xs text-slate-400 font-medium">5. Lượt Tải Q1 Ra Mắt</span>
            <div className="text-3xl font-extrabold text-indigo-400 font-mono">12,450</div>
            <div className="text-xs text-slate-300">Mục tiêu kinh doanh: 10,000 lượt tải</div>
            <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
              Áp dụng mô hình Freemium cho hợp tác xã và hộ nông dân cá thể.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
            <span className="text-xs text-slate-400 font-medium">6. Chuyển Đổi Free Sang Pro</span>
            <div className="text-3xl font-extrabold text-purple-400 font-mono">6.4%</div>
            <div className="text-xs text-slate-300">Mục tiêu kinh doanh: &gt; 5%</div>
            <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
              Doanh thu từ gói dịch vụ AI Nông Học Chuyên Sâu &amp; Chứng chỉ Blockchain.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

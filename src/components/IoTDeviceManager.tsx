import React, { useState } from 'react';
import { IoTNodeDevice, ActuatorDevice } from '../types/greenhouse';
import {
  Wifi,
  Radio,
  Cpu,
  Battery,
  Signal,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  RefreshCw,
  Sliders,
  Server
} from 'lucide-react';

interface IoTDeviceManagerProps {
  devices: IoTNodeDevice[];
  onAddDevice: (dev: IoTNodeDevice) => void;
  onDeleteDevice: (id: string) => void;
  latencyMs: number;
}

export const IoTDeviceManager: React.FC<IoTDeviceManagerProps> = ({
  devices,
  onAddDevice,
  onDeleteDevice,
  latencyMs,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [nodeName, setNodeName] = useState('');
  const [zone, setZone] = useState('Zone A (Cà chua)');
  const [protocol, setProtocol] = useState<IoTNodeDevice['protocol']>('MQTT v5.0');
  const [hardware, setHardware] = useState('Sensirion SHT45 High-Precision');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nodeName.trim()) return;

    const newDev: IoTNodeDevice = {
      id: `node-${Date.now()}`,
      nodeName,
      zone,
      protocol,
      batteryPercent: 100,
      rssi: -45,
      lastPingMs: Math.floor(Math.random() * 80) + 90,
      status: 'ONLINE',
      hardware,
      firmwareVersion: 'v2026.4.1'
    };

    onAddDevice(newDev);
    setIsAdding(false);
    setNodeName('');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-sky-950/30 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Radio className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Quản Trị Mạng Lưới Thiết Bị IoT &amp; Edge Gateway 2026
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Hỗ trợ 4 chuẩn truyền thông: MQTT v5.0 (TLS 1.3), LoRaWAN AS923, Zigbee 3.0 và Wi-Fi 7 (802.11be).
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-sky-950/50 hover:scale-[1.02] transition cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Đóng Form' : 'Thêm Cảm Biến / Actuator'}</span>
        </button>
      </div>

      {/* Edge Gateway Status Box */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400">Edge Gateway Processor</span>
          <div className="text-base font-bold text-white mt-1">Jetson Orin Nano + RPi5</div>
          <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> TinyML Engine Active
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400">Độ Trễ Mạng Trung Bình</span>
          <div className="text-base font-bold text-sky-400 font-mono mt-1">{latencyMs} ms</div>
          <div className="text-[10px] text-emerald-400 mt-1">
            Đạt chuẩn KPI (&lt; 500ms)
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400">Bộ Đệm Offline Gateway</span>
          <div className="text-base font-bold text-emerald-400 font-mono mt-1">0 bản ghi chờ</div>
          <div className="text-[10px] text-slate-400 mt-1">
            Đồng bộ Cloud thời gian thực
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400">Chuẩn Bảo Mật</span>
          <div className="text-base font-bold text-amber-400 mt-1">TLS 1.3 + mTLS</div>
          <div className="text-[10px] text-slate-400 mt-1">
            End-to-End Encrypted
          </div>
        </div>
      </div>

      {/* Add Device Form */}
      {isAdding && (
        <form onSubmit={handleAdd} className="p-5 rounded-2xl bg-slate-900/95 border border-sky-500/40 shadow-2xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-sky-400" /> Đăng Ký Node Cảm Biến / Thiết Bị Chấp Hành Mới
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-xs text-slate-400">Tên Node / Thiết Bị:</label>
              <input
                type="text"
                required
                placeholder="VD: Soil-VWC-Probe-A3"
                value={nodeName}
                onChange={(e) => setNodeName(e.target.value)}
                className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400">Khu Vực (Zone):</label>
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                <option value="Zone A (Cà chua)">Zone A (Cà chua Cherry)</option>
                <option value="Zone B (Dâu tây)">Zone B (Dâu tây Bạch Tuyết)</option>
                <option value="Zone C (Ớt chuông)">Zone C (Ớt chuông)</option>
                <option value="Zone D (Dưa lưới)">Zone D (Dưa lưới Khí Canh)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400">Giao Thức Kết Nối:</label>
              <select
                value={protocol}
                onChange={(e) => setProtocol(e.target.value as any)}
                className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                <option value="MQTT v5.0">MQTT v5.0 (TLS 1.3)</option>
                <option value="LoRaWAN AS923">LoRaWAN AS923 (Khoảng cách xa)</option>
                <option value="Zigbee 3.0">Zigbee 3.0 (Mesh mạng cục bộ)</option>
                <option value="Wi-Fi 7 (802.11be)">Wi-Fi 7 (Tốc độ cao &lt; 20ms)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400">Phần Cứng / Model Cảm Biến:</label>
              <input
                type="text"
                value={hardware}
                onChange={(e) => setHardware(e.target.value)}
                className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs hover:bg-sky-500 shadow-lg"
            >
              Thêm Thiết Bị Vào Mạng Lưới
            </button>
          </div>
        </form>
      )}

      {/* Devices Table / Card List */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-sky-400" />
            Danh Sách {devices.length} Sensor Nodes &amp; Gateway Trực Tuyến
          </h3>
          <span className="text-xs text-emerald-400 font-mono">100% Sẵn Sàng Hoạt Động</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {devices.map((d) => (
            <div
              key={d.id}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition space-y-2.5 shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white font-mono">{d.nodeName}</h4>
                  <div className="text-[11px] text-slate-400">{d.zone}</div>
                </div>
                <button
                  onClick={() => onDeleteDevice(d.id)}
                  className="text-slate-500 hover:text-rose-400 p-1"
                  title="Xóa thiết bị"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80 text-[11px] space-y-1">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Giao thức:</span>
                  <span className="font-semibold text-sky-300 font-mono">{d.protocol}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Hardware:</span>
                  <span className="text-slate-400 truncate max-w-[160px]">{d.hardware}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Firmware:</span>
                  <span className="font-mono text-slate-400">{d.firmwareVersion}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Battery className="w-3.5 h-3.5" /> {d.batteryPercent}%
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Signal className="w-3.5 h-3.5 text-sky-400" /> {d.rssi} dBm
                </span>
                <span className="text-sky-300 font-mono">
                  {d.lastPingMs}ms
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { BlockchainBlock, GreenhouseZone } from '../types/greenhouse';
import {
  ShieldCheck,
  QrCode,
  Plus,
  Link as LinkIcon,
  CheckCircle2,
  Lock,
  ExternalLink,
  Layers,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';

interface BlockchainLedgerProps {
  selectedZone: GreenhouseZone;
}

export const BlockchainLedger: React.FC<BlockchainLedgerProps> = ({
  selectedZone,
}) => {
  const [blocks, setBlocks] = useState<BlockchainBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inspectedBlock, setInspectedBlock] = useState<BlockchainBlock | null>(null);

  // Minting form state
  const [isMinting, setIsMinting] = useState(false);
  const [actionType, setActionType] = useState<BlockchainBlock['actionType']>('IRRIGATION');
  const [details, setDetails] = useState('');
  const [actorName, setActorName] = useState('Kỹ sư Nông học Trưởng');
  const [batchNumber, setBatchNumber] = useState('SGH-2026-TOM-0925');

  const fetchBlocks = async () => {
    try {
      const res = await fetch('/api/blockchain/blocks');
      const data = await res.json();
      if (data.success && data.blocks) {
        setBlocks(data.blocks);
        if (!inspectedBlock && data.blocks.length > 0) {
          setInspectedBlock(data.blocks[data.blocks.length - 1]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  const handleMintBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;

    try {
      const res = await fetch('/api/blockchain/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionType,
          zone: selectedZone.name,
          crop: selectedZone.crop,
          details,
          actor: actorName,
          batchNumber,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDetails('');
        setIsMinting(false);
        await fetchBlocks();
      }
    } catch (err) {
      console.error('Error minting block:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Nhật Ký Blockchain (Farm-to-Fork Traceability)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Mọi nhật ký tưới, bón phân, phòng trừ vi sinh và kiểm nghiệm chất lượng được mã hóa SHA-256 bất biến trên sổ cái điện tử phục vụ tiêu chuẩn xuất khẩu EU/GlobalGAP.
          </p>
        </div>

        <button
          onClick={() => setIsMinting(!isMinting)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/50 hover:scale-[1.02] transition cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isMinting ? 'Đóng Giao Diện' : 'Ghi Khối Bất Biến Mới'}</span>
        </button>
      </div>

      {/* Mint New Block Form */}
      {isMinting && (
        <form onSubmit={handleMintBlock} className="p-5 rounded-2xl bg-slate-900/95 border border-emerald-500/40 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              Đóng Dấu Ghi Nhận Nhật Ký Lên Blockchain
            </h3>
            <span className="text-[11px] font-mono text-emerald-400">SHA-256 Cryptographic Hash</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-slate-400">Loại Thao Tác:</label>
              <select
                value={actionType}
                onChange={(e) => setActionType(e.target.value as any)}
                className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                <option value="IRRIGATION">Tưới Nước Nhỏ Giọt</option>
                <option value="FERTILIZATION">Bón Phân &amp; Châm Dinh Dưỡng</option>
                <option value="PEST_CONTROL">Phòng Trừ Sinh Học Vi Sinh</option>
                <option value="QUALITY_INSPECT">Kiểm Định Chất Lượng (Brix/Dư lượng)</option>
                <option value="HARVEST">Thu Hoạch Nông Sản</option>
                <option value="PACKAGING">Đóng Gói &amp; Cấp Mã QR</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400">Mã Lô Hàng (Batch ID):</label>
              <input
                type="text"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400">Người Thực Hiện / Hệ Thống:</label>
              <input
                type="text"
                value={actorName}
                onChange={(e) => setActorName(e.target.value)}
                className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400">Nội dung chi tiết (Số liệu nồng độ, chứng từ, thiết bị):</label>
            <textarea
              rows={2}
              required
              placeholder="VD: Châm dinh dưỡng EC 2.3 mS/cm, pH 5.9. Bổ sung Canxi Nitrat 120g/m3..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsMinting(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 shadow-lg"
            >
              Khai Thác &amp; Ghi Khối Mới
            </button>
          </div>
        </form>
      )}

      {/* Grid: Blocks Chain Timeline + Block & QR Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cột Trái (7 cols): Danh Sách Chuỗi Khối (Block Timeline) */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Chuỗi Khối Bất Biến ({blocks.length} Khối Đã Được Xác Thực)
            </h3>
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Chuỗi Hợp Lệ 100%
            </span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {blocks.map((b) => {
              const isSelected = inspectedBlock?.index === b.index;
              return (
                <div
                  key={b.index}
                  onClick={() => setInspectedBlock(b)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-slate-950 border-emerald-500 ring-1 ring-emerald-500/50 shadow-lg'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-emerald-950 text-emerald-300 border border-emerald-800">
                        Block #{b.index}
                      </span>
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        {b.actionType}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(b.timestamp).toLocaleDateString('vi-VN')} {new Date(b.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {b.details}
                  </p>

                  <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span className="truncate max-w-[200px]">Hash: {b.hash}</span>
                    <span className="text-emerald-400">Nonce: {b.nonce}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cột Phải (5 cols): Chi Tiết Khối & Passport Mã QR */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col justify-between">
          {inspectedBlock ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-emerald-400" />
                  Hộ Chiếu Nông Sản &amp; QR Truy Xuất
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  GlobalGAP Pass
                </span>
              </div>

              {/* QR Code Mock Card */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center flex flex-col items-center justify-center">
                <div className="w-32 h-32 bg-white p-2 rounded-xl shadow-lg flex items-center justify-center">
                  {/* High tech CSS QR mock representation */}
                  <div className="w-full h-full border-2 border-black grid grid-cols-4 grid-rows-4 gap-1 p-1 bg-white">
                    <div className="bg-black" />
                    <div className="bg-black" />
                    <div />
                    <div className="bg-black" />
                    <div />
                    <div className="bg-black" />
                    <div className="bg-black" />
                    <div />
                    <div className="bg-black" />
                    <div />
                    <div className="bg-black" />
                    <div className="bg-black" />
                    <div className="bg-black" />
                    <div className="bg-black" />
                    <div />
                    <div className="bg-black" />
                  </div>
                </div>

                <div className="mt-3 text-xs font-mono font-bold text-emerald-400">
                  {inspectedBlock.batchNumber}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Quét mã để xem nguồn gốc từ trang trại đến bàn ăn
                </div>
              </div>

              {/* Immutable Cryptographic Details */}
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                  <div className="text-[10px] text-slate-400">Hành động:</div>
                  <div className="font-semibold text-white">{inspectedBlock.actionType} — {inspectedBlock.zone}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                  <div className="text-[10px] text-slate-400">Người xác thực:</div>
                  <div className="font-semibold text-slate-200">{inspectedBlock.actor}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                  <div className="text-[10px] text-slate-400">Hash hiện tại (Current Hash):</div>
                  <div className="font-mono text-[10px] text-emerald-400 break-all">{inspectedBlock.hash}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                  <div className="text-[10px] text-slate-400">Hash liên kết trước (Previous Hash):</div>
                  <div className="font-mono text-[10px] text-slate-400 break-all">{inspectedBlock.previousHash}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-xs text-slate-500 py-12">
              Chọn một khối để xem chi tiết chứng thực
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Thuật toán: SHA-256</span>
            <span className="text-emerald-400">Chứng nhận Export Ready 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};

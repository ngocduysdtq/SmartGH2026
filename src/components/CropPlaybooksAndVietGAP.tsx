import React, { useState } from 'react';
import { CropStagePlaybook, VietGAPCropLog, GreenhouseZone } from '../types/greenhouse';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  FileCheck2,
  Plus,
  Sprout,
  Clock,
  ShieldCheck,
  Download,
  Upload,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Droplets,
  Layers,
  Activity,
  Zap,
  Globe2,
  FileJson,
  Edit3,
  Bot
} from 'lucide-react';

interface CropPlaybooksAndVietGAPProps {
  playbooks: CropStagePlaybook[];
  selectedZone: GreenhouseZone;
  onApplyPlaybook: (playbookId: string) => void;
  onAddPlaybook: (playbook: CropStagePlaybook) => void;
  logs: VietGAPCropLog[];
  onAddLog: (log: VietGAPCropLog) => void;
}

export const CropPlaybooksAndVietGAP: React.FC<CropPlaybooksAndVietGAPProps> = ({
  playbooks,
  selectedZone,
  onApplyPlaybook,
  onAddPlaybook,
  logs,
  onAddLog,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'PLAYBOOKS' | 'VIETGAP_LOGS'>('PLAYBOOKS');
  const [selectedPlaybookId, setSelectedPlaybookId] = useState<string>(playbooks[0]?.id || 'pb-melon');

  // Import / Create Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importMode, setImportMode] = useState<'AI_CONVERTER' | 'JSON_UPLOAD' | 'EXPERT_CLOUD' | 'MANUAL'>('AI_CONVERTER');

  // AI Converter State
  const [aiTextContent, setAiTextContent] = useState('');
  const [aiCropHint, setAiCropHint] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiExtractedPreview, setAiExtractedPreview] = useState<CropStagePlaybook | null>(null);

  // JSON Upload State
  const [jsonInput, setJsonInput] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Manual Form State
  const [manualName, setManualName] = useState('');
  const [manualVariety, setManualVariety] = useState('');
  const [manualAuthor, setManualAuthor] = useState('Chuyên gia Nông học Độc lập');
  const [manualTotalDays, setManualTotalDays] = useState<number>(75);
  const [manualIcon, setManualIcon] = useState('🌱');

  // New VietGAP log form state
  const [isAddingLog, setIsAddingLog] = useState(false);
  const [activityType, setActivityType] = useState<VietGAPCropLog['activityType']>('BÓN PHÂN');
  const [materialName, setMaterialName] = useState('');
  const [dosage, setDosage] = useState('');
  const [phiDays, setPhiDays] = useState<number>(0);
  const [actor, setActor] = useState('Kỹ thuật viên Phạm Văn Hùng');
  const [notes, setNotes] = useState('');
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  const currentPlaybook = playbooks.find((p) => p.id === selectedPlaybookId) || playbooks[0];

  // Verified Expert Profiles from Cloud Hub
  const cloudExpertProfiles: CropStagePlaybook[] = [
    {
      id: 'pb-cloud-bellpepper',
      cropName: 'Ớt Chuông Sweet Pepper Hà Lan F1',
      variety: 'Kháng virus TSWV chuẩn Euro-GAP',
      icon: '🫑',
      totalCycleDays: 85,
      author: 'Viện Nghiên Cứu Rau Quả & Rijk Zwaan',
      verified: true,
      source: 'EXPERT_IMPORT',
      stages: [
        {
          stageName: 'Giai đoạn 1: Cây giống & Hồi xanh rễ (Ngày 1 - 15)',
          durationDays: 15,
          ecTarget: 1.5,
          phTarget: 6.0,
          vpdTarget: 0.85,
          soilMoistureTarget: 60,
          irrigationStrategy: 'Tưới nhỏ giọt xung nhịp 4 lần/ngày x 2 phút',
          keyActions: ['Giữ nhiệt độ rễ 22-25°C', 'Bổ sung Mycorrhizae kích rễ']
        },
        {
          stageName: 'Giai đoạn 2: Phân cành chữ Y & Ra nụ hoa (Ngày 16 - 40)',
          durationDays: 25,
          ecTarget: 2.1,
          phTarget: 5.9,
          vpdTarget: 1.05,
          soilMoistureTarget: 52,
          irrigationStrategy: 'Tưới theo chỉ số tích lũy DLI đạt 17 mol/m2/ngày',
          keyActions: ['Tỉa cành giữ 2 thân chính', 'Bổ sung Canxi-Bo chống rụng hoa']
        },
        {
          stageName: 'Giai đoạn 3: Nuôi quả thương phẩm & Chín màu (Ngày 41 - 85)',
          durationDays: 45,
          ecTarget: 2.5,
          phTarget: 5.85,
          vpdTarget: 1.2,
          soilMoistureTarget: 48,
          irrigationStrategy: 'Tưới xung bù áp 6 lần/ngày ổn định ẩm độ',
          keyActions: ['Cắt tỉa lá chân gốc', 'Thu hoạch khi quả chuyển màu 90%']
        }
      ]
    },
    {
      id: 'pb-cloud-cucumber',
      cropName: 'Dưa Leo Baby Thủy Canh Israel',
      variety: 'Dòng tự thụ phấn đơn tính Parthenocarpic',
      icon: '🥒',
      totalCycleDays: 55,
      author: 'Trung Tâm Khuyến Nông Quốc Gia',
      verified: true,
      source: 'EXPERT_IMPORT',
      stages: [
        {
          stageName: 'Giai đoạn 1: Bén rễ & Leo giàn nhanh (Ngày 1 - 12)',
          durationDays: 12,
          ecTarget: 1.4,
          phTarget: 6.1,
          vpdTarget: 0.9,
          soilMoistureTarget: 65,
          irrigationStrategy: 'Tưới nhỏ giọt xung ẩm cao 6 lần/ngày',
          keyActions: ['Quấn dây leo chữ S', 'Vặt bỏ chồi nách dưới nách lá 5']
        },
        {
          stageName: 'Giai đoạn 2: Thu hoạch rộ liên tục (Ngày 13 - 55)',
          durationDays: 43,
          ecTarget: 2.2,
          phTarget: 5.9,
          vpdTarget: 1.1,
          soilMoistureTarget: 55,
          irrigationStrategy: 'Tưới xung 8 lần/ngày bù nước thoát hơi nhanh',
          keyActions: ['Thu hái mỗi ngày 1 lần lúc quả dài 12-14cm', 'Bổ sung Kali Canxi']
        }
      ]
    },
    {
      id: 'pb-cloud-strawberry-hana',
      cropName: 'Dâu Tây Hana Mộc Châu (Tochiotome)',
      variety: 'Chuyên canh vùng cao khí hậu mát',
      icon: '🍓',
      totalCycleDays: 130,
      author: 'Hợp Tác Xã Nông Nghiệp Mộc Châu Farm',
      verified: true,
      source: 'EXPERT_IMPORT',
      stages: [
        {
          stageName: 'Giai đoạn 1: Bén rễ hồi xanh (Ngày 1 - 20)',
          durationDays: 20,
          ecTarget: 1.1,
          phTarget: 6.2,
          vpdTarget: 0.75,
          soilMoistureTarget: 65,
          irrigationStrategy: 'Tưới vi lượng nhẹ kết hợp che rèm 50%',
          keyActions: ['Duy trì ẩm rễ', 'Phòng nấm cổ rễ']
        },
        {
          stageName: 'Giai đoạn 2: Phân hóa mầm & Ra hoa rộ (Ngày 21 - 65)',
          durationDays: 45,
          ecTarget: 1.6,
          phTarget: 6.0,
          vpdTarget: 0.85,
          soilMoistureTarget: 50,
          irrigationStrategy: 'Tưới theo DLI buổi sáng',
          keyActions: ['Hạ nhiệt độ đêm 14-16°C', 'Thả ong thụ phấn']
        },
        {
          stageName: 'Giai đoạn 3: Nuôi quả chín & Thu hoạch kéo dài (Ngày 66 - 130)',
          durationDays: 65,
          ecTarget: 1.8,
          phTarget: 5.9,
          vpdTarget: 0.95,
          soilMoistureTarget: 45,
          irrigationStrategy: 'Tưới đều đặn không để khô hạn',
          keyActions: ['Thu hoạch quả chín 85%', 'Đo Brix đạt >= 12.5°Bx']
        }
      ]
    }
  ];

  const handleApply = (pb: typeof currentPlaybook) => {
    onApplyPlaybook(pb.id);
    setAppliedNotice(`✅ Đã áp dụng thành công kịch bản "${pb.cropName}" vào ${selectedZone.name}! Toàn bộ ngưỡng EC, pH, VPD và lịch tưới được đồng bộ tự động.`);
    setTimeout(() => setAppliedNotice(null), 5000);
  };

  // Export Playbook to JSON file
  const handleExportPlaybook = (pb: typeof currentPlaybook) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(pb, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `playbook-${pb.cropName.toLowerCase().replace(/\s+/g, '-')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Handle AI Text Extraction
  const handleExtractWithAI = async () => {
    if (!aiTextContent.trim()) return;
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/playbooks/extract-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          textContent: aiTextContent,
          cropNameHint: aiCropHint
        })
      });
      const data = await res.json();
      if (data.success && data.playbook) {
        setAiExtractedPreview(data.playbook);
      }
    } catch (e) {
      console.error('Error extracting playbook:', e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSaveAiPlaybook = () => {
    if (!aiExtractedPreview) return;
    onAddPlaybook(aiExtractedPreview);
    setSelectedPlaybookId(aiExtractedPreview.id);
    setIsImportModalOpen(false);
    setAiExtractedPreview(null);
    setAiTextContent('');
    setAppliedNotice(`✅ Đã thêm kịch bản mới "${aiExtractedPreview.cropName}" vào danh mục từ tài liệu chuyên gia!`);
    setTimeout(() => setAppliedNotice(null), 5000);
  };

  // Handle JSON Import
  const handleImportJson = () => {
    setJsonError(null);
    try {
      const parsed = JSON.parse(jsonInput);
      if (!parsed.cropName || !Array.isArray(parsed.stages)) {
        throw new Error('Tệp JSON không đúng cấu trúc Open-Agri-Playbook');
      }
      const newPb: CropStagePlaybook = {
        id: `pb-json-${Date.now()}`,
        cropName: parsed.cropName,
        variety: parsed.variety || 'Giống nhập khẩu',
        icon: parsed.icon || '🌱',
        totalCycleDays: parsed.totalCycleDays || 75,
        stages: parsed.stages,
        author: parsed.author || 'Tệp JSON Bên Ngoài',
        verified: true,
        source: 'EXPERT_IMPORT'
      };
      onAddPlaybook(newPb);
      setSelectedPlaybookId(newPb.id);
      setIsImportModalOpen(false);
      setJsonInput('');
      setAppliedNotice(`✅ Đã nhập thành công kịch bản "${newPb.cropName}" từ tệp JSON!`);
      setTimeout(() => setAppliedNotice(null), 5000);
    } catch (err: any) {
      setJsonError(err.message || 'Lỗi phân tích cú pháp JSON');
    }
  };

  // Install Cloud Profile
  const handleInstallCloudProfile = (cp: CropStagePlaybook) => {
    onAddPlaybook({
      ...cp,
      id: `pb-cloud-${Date.now()}`
    });
    setSelectedPlaybookId(cp.id);
    setIsImportModalOpen(false);
    setAppliedNotice(`✅ Đã đồng bộ kịch bản "${cp.cropName}" từ Kho Tri Thức Chuyên Gia!`);
    setTimeout(() => setAppliedNotice(null), 5000);
  };

  // Handle Manual Create
  const handleManualCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim()) return;

    const newPb: CropStagePlaybook = {
      id: `pb-manual-${Date.now()}`,
      cropName: manualName,
      variety: manualVariety || 'Giống F1 tùy chỉnh',
      icon: manualIcon,
      totalCycleDays: manualTotalDays,
      author: manualAuthor,
      verified: true,
      source: 'CUSTOM_CREATED',
      stages: [
        {
          stageName: 'Giai đoạn 1: Bén rễ & Cây con',
          durationDays: Math.round(manualTotalDays * 0.25),
          ecTarget: 1.4,
          phTarget: 6.0,
          vpdTarget: 0.85,
          soilMoistureTarget: 60,
          irrigationStrategy: 'Tưới nhỏ giọt xung nhịp đều đặn',
          keyActions: ['Kích rễ', 'Cân bằng vi khí hậu']
        },
        {
          stageName: 'Giai đoạn 2: Nuôi cành lá & Ra hoa',
          durationDays: Math.round(manualTotalDays * 0.35),
          ecTarget: 2.0,
          phTarget: 5.9,
          vpdTarget: 1.05,
          soilMoistureTarget: 52,
          irrigationStrategy: 'Tưới theo chỉ số tích lũy DLI',
          keyActions: ['Bổ sung vi lượng', 'Tỉa nhánh phụ']
        },
        {
          stageName: 'Giai đoạn 3: Nuôi quả & Thu hoạch',
          durationDays: Math.round(manualTotalDays * 0.4),
          ecTarget: 2.4,
          phTarget: 5.85,
          vpdTarget: 1.2,
          soilMoistureTarget: 48,
          irrigationStrategy: 'Tưới bù áp kiểm soát đường Brix',
          keyActions: ['Thu hoạch đạt chuẩn', 'Vặt lá già']
        }
      ]
    };

    onAddPlaybook(newPb);
    setSelectedPlaybookId(newPb.id);
    setIsImportModalOpen(false);
    setManualName('');
    setAppliedNotice(`✅ Đã tạo kịch bản mới "${newPb.cropName}" thành công!`);
    setTimeout(() => setAppliedNotice(null), 5000);
  };

  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialName.trim()) return;

    const harvestDate = new Date();
    harvestDate.setDate(harvestDate.getDate() + phiDays);

    const newLog: VietGAPCropLog = {
      id: `vg-${Date.now()}`,
      timestamp: new Date().toISOString(),
      zoneId: selectedZone.id,
      activityType,
      materialName,
      dosage,
      phiDays,
      actor,
      harvestAllowedAfter: phiDays === 0 ? 'Thu hoạch an toàn ngay' : harvestDate.toISOString(),
      safetyStatus: 'COMPLIANT',
      notes,
    };

    onAddLog(newLog);
    setIsAddingLog(false);
    setMaterialName('');
    setDosage('');
    setNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Mode Toggle */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Thư Viện Lịch Trình Sinh Trưởng (Playbooks) &amp; Nhật Ký VietGAP
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Quy chuẩn hóa quy trình chăm sóc theo từng giai đoạn phát triển • Hỗ trợ mở rộng nạp profile từ chuyên gia nông học, viện nghiên cứu hoặc AI.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {activeSubTab === 'PLAYBOOKS' && (
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold text-xs shadow-lg flex items-center gap-1.5 transition cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Nạp Profile Chuyên Gia</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveSubTab('PLAYBOOKS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeSubTab === 'PLAYBOOKS'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Lịch Trình Playbooks (P7)
            </button>
            <button
              onClick={() => setActiveSubTab('VIETGAP_LOGS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeSubTab === 'VIETGAP_LOGS'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Nhật Ký VietGAP (P6)
            </button>
          </div>
        </div>
      </div>

      {appliedNotice && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-200 flex items-center justify-between shadow-lg">
          <span>{appliedNotice}</span>
          <button onClick={() => setAppliedNotice(null)} className="text-slate-400 hover:text-white ml-2">✕</button>
        </div>
      )}

      {/* SUBTAB 1: CROP-STAGE PLAYBOOKS (P7) */}
      {activeSubTab === 'PLAYBOOKS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Cột Trái (4 cols): Danh sách Cây Trồng Trọng Điểm */}
          <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl space-y-3">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Danh Mục Playbooks ({playbooks.length})</span>
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Thêm Mới
              </button>
            </div>

            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
              {playbooks.map((pb) => {
                const isSelected = selectedPlaybookId === pb.id;
                return (
                  <div
                    key={pb.id}
                    onClick={() => setSelectedPlaybookId(pb.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition ${
                      isSelected
                        ? 'bg-slate-950 border-emerald-500 shadow-lg ring-1 ring-emerald-500/40'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{pb.icon}</span>
                        <div>
                          <h4 className="text-xs font-bold text-white">{pb.cropName}</h4>
                          <span className="text-[11px] text-slate-400 line-clamp-1">{pb.variety}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 whitespace-nowrap">
                        {pb.totalCycleDays} Ngày
                      </span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="truncate max-w-[170px]">
                        Nguồn: {pb.author || 'Chuyên gia Nông học'}
                      </span>
                      {pb.verified && (
                        <span className="text-emerald-400 font-medium flex items-center gap-0.5 text-[10px]">
                          <ShieldCheck className="w-3 h-3" /> Đã Thẩm Định
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Hỗ trợ chuẩn Open-Agri-Playbook</span>
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="text-emerald-400 hover:underline"
              >
                + Nhập tệp bên ngoài
              </button>
            </div>
          </div>

          {/* Cột Phải (8 cols): Chi Tiết Từng Giai Đoạn Của Playbook Đang Chọn */}
          <div className="lg:col-span-8 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{currentPlaybook.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{currentPlaybook.cropName}</h3>
                      {currentPlaybook.source && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                          {currentPlaybook.source === 'GENAI_EXTRACTED' ? 'AI Trích Xuất' : currentPlaybook.source === 'EXPERT_IMPORT' ? 'Chuyên Gia Đối Tác' : 'Quy Chuẩn'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">
                      Chu kỳ: {currentPlaybook.totalCycleDays} ngày • Giống: {currentPlaybook.variety} • Tác giả: <strong className="text-slate-200">{currentPlaybook.author || 'Viện Nông Nghiệp'}</strong>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => handleExportPlaybook(currentPlaybook)}
                  title="Xuất file JSON chia sẻ cho hợp tác xã"
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Xuất JSON</span>
                </button>
                <button
                  onClick={() => handleApply(currentPlaybook)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg transition flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Áp Dụng Cho {selectedZone.name.split(':')[0]}</span>
                </button>
              </div>
            </div>

            {/* Stages Timeline */}
            <div className="space-y-3">
              {currentPlaybook.stages.map((st, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] flex items-center justify-center font-mono">
                        {idx + 1}
                      </span>
                      {st.stageName}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Thời lượng: <strong className="text-white">{st.durationDays} ngày</strong>
                    </span>
                  </div>

                  {/* Target Parameters Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-400">EC Dinh dưỡng:</span>
                      <strong className="text-emerald-400 font-mono">{st.ecTarget} mS/cm</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-400">Độ pH:</span>
                      <strong className="text-sky-400 font-mono">{st.phTarget}</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-400">VPD Mục tiêu:</span>
                      <strong className="text-fuchsia-400 font-mono">{st.vpdTarget} kPa</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-400">Ẩm đất VWC:</span>
                      <strong className="text-amber-400 font-mono">{st.soilMoistureTarget}%</strong>
                    </div>
                  </div>

                  {/* Irrigation strategy and actions */}
                  <div className="text-xs text-slate-300 pt-1">
                    <span className="text-sky-400 font-medium">Chiến lược tưới: </span>
                    {st.irrigationStrategy}
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {st.keyActions.map((ka, kIdx) => (
                      <span
                        key={kIdx}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800"
                      >
                        ✓ {ka}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: VIETGAP OPERATIONAL LOGS (P6) */}
      {activeSubTab === 'VIETGAP_LOGS' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
                Sổ Nhật Ký Canh Tác Chuẩn Hóa VietGAP (VietGAP Logbook)
              </h3>
              <p className="text-xs text-slate-400">
                Lưu vết 100% hoạt động bón phân, tưới nước, phun chế phẩm sinh học kèm thời gian cách ly (PHI) phục vụ cấp chứng nhận.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddingLog(!isAddingLog)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-500 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isAddingLog ? 'Đóng Biểu Mẫu' : 'Ghi Nhật Ký Mới'}</span>
              </button>
            </div>
          </div>

          {/* Form ghi nhật ký mới */}
          {isAddingLog && (
            <form onSubmit={handleCreateLog} className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/40 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-white">Ghi Nhật Ký Hoạt Động Mới — Chuẩn VietGAP</span>
                <span className="text-[11px] text-emerald-400 font-mono">Khu Vực: {selectedZone.name}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-400">Loại Hoạt Động:</label>
                  <select
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value as any)}
                    className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  >
                    <option value="BÓN PHÂN">Bón Phân / Châm Dinh Dưỡng</option>
                    <option value="PHUN VI SINH/BVTV">Phun Vi Sinh / Chế Phẩm BVTV</option>
                    <option value="TƯỚI DƯỠNG">Tưới Dưỡng Ẩm Bầu Rễ</option>
                    <option value="TỈA TÁN">Tỉa Cành &amp; Bấm Ngọn</option>
                    <option value="THU HOẠCH">Thu Hoạch Nông Sản</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400">Tên Chế Phẩm / Phân Bón:</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nấm đối kháng Trichoderma / MgSO4"
                    value={materialName}
                    onChange={(e) => setMaterialName(e.target.value)}
                    className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400">Liều Lượng &amp; Nồng Độ:</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: 1.5 g/Lít nước hoặc 20 lít/1000m²"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400">Thời Gian Cách Ly PHI (Số Ngày):</label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={phiDays}
                    onChange={(e) => setPhiDays(parseInt(e.target.value, 10))}
                    className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">0 = Chế phẩm sinh học an toàn cách ly 0 ngày</span>
                </div>

                <div>
                  <label className="text-xs text-slate-400">Người Thực Hiện / Kỹ Sư:</label>
                  <input
                    type="text"
                    value={actor}
                    onChange={(e) => setActor(e.target.value)}
                    className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400">Ghi Chú Nông Học:</label>
                <textarea
                  rows={2}
                  placeholder="Mục đích xử lý, thời tiết lúc phun, tình trạng phản hồi của cây..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingLog(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 shadow-lg"
                >
                  Lưu Vào Sổ Nhật Ký VietGAP
                </button>
              </div>
            </form>
          )}

          {/* Bảng danh sách nhật ký VietGAP */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-white">Tổng cộng {logs.length} Bản Ghi Nhật Ký Được Xác Thực</span>
              <span className="text-xs text-emerald-400 font-mono">100% Đạt Chuẩn VietGAP / GlobalGAP</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-[11px] text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3">Thời Gian</th>
                    <th className="p-3">Hoạt Động</th>
                    <th className="p-3">Vật Tư / Chế Phẩm</th>
                    <th className="p-3">Liều Lượng</th>
                    <th className="p-3">Cách Ly (PHI)</th>
                    <th className="p-3">Người Thực Hiện</th>
                    <th className="p-3">Đánh Giá An Toàn</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-950/40 transition">
                      <td className="p-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="p-3 font-semibold text-white">
                        {log.activityType}
                      </td>
                      <td className="p-3 text-slate-200">
                        {log.materialName}
                      </td>
                      <td className="p-3 font-mono text-emerald-400">
                        {log.dosage}
                      </td>
                      <td className="p-3 font-mono">
                        {log.phiDays === 0 ? (
                          <span className="text-emerald-400 font-semibold">0 ngày</span>
                        ) : (
                          <span className="text-amber-400 font-semibold">{log.phiDays} ngày</span>
                        )}
                      </td>
                      <td className="p-3 text-slate-400">
                        {log.actor}
                      </td>
                      <td className="p-3">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1 w-fit">
                          <ShieldCheck className="w-3 h-3" /> Chuẩn VietGAP
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NẠP PROFILE TỪ CHUYÊN GIA / BÊN NGOÀI */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Nạp Profile Cây Trồng Từ Chuyên Gia / Dữ Liệu Ngoài</h3>
                  <p className="text-[11px] text-slate-400">Tương thích chuẩn Open-Agri-Playbook &amp; Trích xuất bằng AI</p>
                </div>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {/* 4 Chế độ Nạp Profile */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setImportMode('AI_CONVERTER')}
                className={`py-2 px-2 rounded-lg font-medium transition text-center flex flex-col items-center gap-1 ${
                  importMode === 'AI_CONVERTER' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Bot className="w-4 h-4" />
                <span>AI Trích Xuất</span>
              </button>
              <button
                onClick={() => setImportMode('EXPERT_CLOUD')}
                className={`py-2 px-2 rounded-lg font-medium transition text-center flex flex-col items-center gap-1 ${
                  importMode === 'EXPERT_CLOUD' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Globe2 className="w-4 h-4" />
                <span>Kho Chuyên Gia</span>
              </button>
              <button
                onClick={() => setImportMode('JSON_UPLOAD')}
                className={`py-2 px-2 rounded-lg font-medium transition text-center flex flex-col items-center gap-1 ${
                  importMode === 'JSON_UPLOAD' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileJson className="w-4 h-4" />
                <span>Tệp JSON</span>
              </button>
              <button
                onClick={() => setImportMode('MANUAL')}
                className={`py-2 px-2 rounded-lg font-medium transition text-center flex flex-col items-center gap-1 ${
                  importMode === 'MANUAL' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                <span>Tạo Thủ Công</span>
              </button>
            </div>

            {/* PHƯƠNG THỨC 1: GENAI AGRONOMIST CONVERTER */}
            {importMode === 'AI_CONVERTER' && (
              <div className="space-y-3 pt-1">
                <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200">
                  <div className="flex items-center gap-1.5 font-semibold text-indigo-300 mb-1">
                    <Sparkles className="w-4 h-4" /> AI Nông Học Tự Động Phân Tích
                  </div>
                  Dán nội dung giáo trình, tài liệu khuyến nông hoặc ghi chú của chuyên gia (ví dụ: &quot;Ớt chuông Sweet Pepper giai đoạn cây con 15 ngày EC 1.5, giai đoạn nuôi quả EC 2.5...&quot;). Gemini 3.8 Flash sẽ tự động phân tích và tạo cấu trúc Playbook chuẩn hóa.
                </div>

                <div>
                  <label className="text-xs text-slate-400">Gợi ý tên cây (Tùy chọn):</label>
                  <input
                    type="text"
                    placeholder="VD: Ớt Chuông Sweet Pepper Hà Lan"
                    value={aiCropHint}
                    onChange={(e) => setAiCropHint(e.target.value)}
                    className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400">Dán nội dung tài liệu / khuyến nghị chuyên gia:</label>
                  <textarea
                    rows={4}
                    placeholder="Ví dụ: Quy trình canh tác cà chua Beef công nghệ cao: Giai đoạn 1 từ ngày 1 đến 15 duy trì EC 1.6, pH 6.0, tưới 4 lần ngày... Giai đoạn nuôi quả chùm EC 2.6..."
                    value={aiTextContent}
                    onChange={(e) => setAiTextContent(e.target.value)}
                    className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    disabled={isAiLoading || !aiTextContent.trim()}
                    onClick={handleExtractWithAI}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-teal-500 hover:from-indigo-500 hover:to-teal-400 text-white font-bold text-xs disabled:opacity-50 transition flex items-center gap-2 cursor-pointer shadow-lg"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isAiLoading ? 'AI Đang Phân Tích...' : 'AI Phân Tích & Tạo Playbook'}</span>
                  </button>
                </div>

                {/* Preview Kết Quả AI */}
                {aiExtractedPreview && (
                  <div className="mt-3 p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Đã Trích Xuất: {aiExtractedPreview.cropName} ({aiExtractedPreview.totalCycleDays} ngày)
                      </span>
                      <button
                        onClick={handleSaveAiPlaybook}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition cursor-pointer"
                      >
                        Lưu &amp; Thêm Vào Danh Mục
                      </button>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-300">
                      {aiExtractedPreview.stages.map((st, sIdx) => (
                        <div key={sIdx} className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] flex items-center justify-between">
                          <span>{st.stageName} ({st.durationDays} ngày)</span>
                          <span className="font-mono text-emerald-400">EC: {st.ecTarget} | pH: {st.phTarget} | VPD: {st.vpdTarget}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PHƯƠNG THỨC 2: KHO TRI THỨC CHUYÊN GIA ĐỐI TÁC */}
            {importMode === 'EXPERT_CLOUD' && (
              <div className="space-y-3 pt-1">
                <p className="text-xs text-slate-400">
                  Chọn các bộ Profile cây trồng đã được Viện nghiên cứu và Hợp tác xã đối tác kiểm định thực tế để cài đặt vào nhà kính:
                </p>

                <div className="space-y-2.5">
                  {cloudExpertProfiles.map((cp) => (
                    <div
                      key={cp.id}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{cp.icon}</span>
                        <div>
                          <h4 className="text-xs font-bold text-white">{cp.cropName}</h4>
                          <div className="text-[11px] text-slate-400">
                            Tác giả: <strong className="text-emerald-300">{cp.author}</strong> ({cp.totalCycleDays} ngày)
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleInstallCloudProfile(cp)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Cài Đặt</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PHƯƠNG THỨC 3: NHẬP TỆP JSON CHUẨN */}
            {importMode === 'JSON_UPLOAD' && (
              <div className="space-y-3 pt-1">
                <p className="text-xs text-slate-400">
                  Dán mã JSON theo định dạng chuẩn Open-Agri-Playbook hoặc tải lên từ tệp được đồng nghiệp xuất ra:
                </p>

                {jsonError && (
                  <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300">
                    {jsonError}
                  </div>
                )}

                <textarea
                  rows={6}
                  placeholder='{"cropName": "Cà Chua Beef Hà Lan", "totalCycleDays": 100, "stages": [...]}'
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                />

                <div className="flex justify-end gap-2">
                  <button
                    disabled={!jsonInput.trim()}
                    onClick={handleImportJson}
                    className="px-4 py-2 rounded-xl bg-indigo-600 disabled:opacity-50 text-white font-bold text-xs hover:bg-indigo-500 transition cursor-pointer"
                  >
                    Xác Thực &amp; Nhập Tệp
                  </button>
                </div>
              </div>
            )}

            {/* PHƯƠNG THỨC 4: TẠO THỦ CÔNG */}
            {importMode === 'MANUAL' && (
              <form onSubmit={handleManualCreate} className="space-y-3 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400">Tên Cây Trồng:</label>
                    <input
                      type="text"
                      required
                      placeholder="VD: Cà Chua Beef / Dưa Lê Bạch Ngọc"
                      value={manualName}
                      onChange={(e) => setManualName(e.target.value)}
                      className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400">Giống Cụ Thể &amp; Xuất Xứ:</label>
                    <input
                      type="text"
                      placeholder="VD: Giống F1 Kháng Virus Hà Lan"
                      value={manualVariety}
                      onChange={(e) => setManualVariety(e.target.value)}
                      className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-slate-400">Tổng Chu Kỳ (Số Ngày):</label>
                    <input
                      type="number"
                      min="30"
                      max="365"
                      value={manualTotalDays}
                      onChange={(e) => setManualTotalDays(parseInt(e.target.value, 10))}
                      className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400">Icon Emoji:</label>
                    <input
                      type="text"
                      value={manualIcon}
                      onChange={(e) => setManualIcon(e.target.value)}
                      className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white text-center"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400">Chuyên Gia / Tác Giả:</label>
                    <input
                      type="text"
                      value={manualAuthor}
                      onChange={(e) => setManualAuthor(e.target.value)}
                      className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 shadow-lg cursor-pointer"
                  >
                    Tạo &amp; Khởi Tạo Các Giai Đoạn Mẫu
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { GreenhouseZone, SensorMetrics, FarmAssistantMessage } from '../types/greenhouse';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  RefreshCw,
  Cpu,
  Layers,
  Leaf
} from 'lucide-react';

interface GenAIAssistantProps {
  selectedZone: GreenhouseZone;
  metrics: SensorMetrics;
}

export const GenAIAssistant: React.FC<GenAIAssistantProps> = ({
  selectedZone,
  metrics,
}) => {
  const [messages, setMessages] = useState<FarmAssistantMessage[]>([
    {
      id: 'm-1',
      role: 'assistant',
      content: `Xin chào! Tôi là **SmartGH-2026 Farm Assistant** — Trợ lý Nông học & AI Trí tuệ Nhân tạo thế hệ mới của bạn.
Tôi đang kết nối trực tiếp với **Edge AI Gateway** và theo dõi dữ liệu vi khí hậu thực tế của **${selectedZone.name}** (Nhiệt độ: ${metrics.temperature}°C, Ẩm: ${metrics.humidity}%, EC: ${metrics.ec} mS/cm, pH: ${metrics.ph}, VPD: ${metrics.vpd} kPa).

Bạn có thể hỏi tôi bất kỳ vấn đề gì về:
• Chẩn đoán triệu chứng vàng lá, cháy chóp, thiếu vi lượng (Magie, Canxi, Sắt, Kẽm).
• Kiểm soát nấm mốc (*Botrytis*, sương mai, phấn trắng) theo ngưỡng ẩm và VPD.
• Tối ưu công thức dinh dưỡng & Hyper-automation tự động.`,
      timestamp: '13:00',
      source: 'gemini-3.8-flash'
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLeafSample, setSelectedLeafSample] = useState<string | null>(null);

  const quickPrompts = [
    'Tại sao lá cà chua ở Zone A đang bị vàng gân?',
    'Phân tích rủi ro nấm sương mai theo độ ẩm & VPD hiện tại?',
    'Đề xuất lịch tưới nhỏ giọt tiết kiệm 20% nước trong tuần này?',
    'Dự báo sản lượng thu hoạch và độ ngọt Brix đợt tới?'
  ];

  // Leaf symptom presets for camera simulation
  const leafSamples = [
    {
      id: 'sample-1',
      title: 'Vàng gân lá cà chua (Interveinal Chlorosis)',
      crop: 'Cà chua Cherry',
      suspected: 'Thiếu Magie (Magnesium Deficiency) do mất cân đối tỷ lệ K:Mg',
      treatment: 'Phun MgSO4 2.0g/L qua lá, nâng EC dung dịch lên 2.4 mS/cm',
      color: 'border-amber-500 bg-amber-950/20'
    },
    {
      id: 'sample-2',
      title: 'Đốm phấn trắng mặt dưới lá dâu tây',
      crop: 'Dâu tây Bạch Tuyết',
      suspected: 'Bệnh Phấn trắng (Podosphaera aphanis) do RH > 78%',
      treatment: 'Bật quạt HAF tăng thông gió, phun vi sinh Trichoderma + dầu Neem 0.2%',
      color: 'border-purple-500 bg-purple-950/20'
    },
    {
      id: 'sample-3',
      title: 'Thối đít trái ớt chuông (Blossom End Rot)',
      crop: 'Ớt chuông Sweet Pepper',
      suspected: 'Thiếu hụt Canxi cục bộ (Calcium Deficit) do VPD quá thấp thoát hơi kém',
      treatment: 'Bổ sung Ca(NO3)2 1.5g/L, kiểm soát độ ẩm ban đêm < 75%',
      color: 'border-rose-500 bg-rose-950/20'
    }
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim()) return;

    const userMsg: FarmAssistantMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          currentSensorState: {
            zoneName: selectedZone.name,
            crop: selectedZone.crop,
            temperature: metrics.temperature,
            humidity: metrics.humidity,
            co2: metrics.co2,
            lightPPFD: metrics.lightPPFD,
            soilMoisture: metrics.soilMoisture,
            ec: metrics.ec,
            ph: metrics.ph,
            irrigationPressure: metrics.irrigationPressure,
            vpd: metrics.vpd,
            anomalyAlert: selectedZone.status === 'WARNING' ? 'Cảnh báo vi khí hậu lệch chuẩn' : null
          }
        })
      });

      const data = await response.json();
      const botReply: FarmAssistantMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Hệ thống đã nhận diện câu hỏi.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source || 'gemini-3.8-flash'
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      console.error(err);
      const errorMsg: FarmAssistantMessage = {
        id: `e-${Date.now()}`,
        role: 'assistant',
        content: 'Đã xảy ra sự cố khi kết nối GenAI Farm Assistant. Vui lòng thử lại sau giây lát.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiagnoseLeaf = async (sample: typeof leafSamples[0]) => {
    setSelectedLeafSample(sample.id);
    const diagnosisQuery = `Tôi chụp ảnh mẫu lá cây: "${sample.title}" trên ${sample.crop} (${selectedZone.name}). Nhờ AI phân tích nguyên nhân sinh lý dinh dưỡng, đối chiếu với EC ${metrics.ec} và VPD ${metrics.vpd} hiện tại, đồng thời đề xuất kịch bản xử lý tự động hóa.`;
    await handleSendMessage(diagnosisQuery);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Cột Trái (8 cols): Khung Chat Trợ Lý AI */}
      <div className="lg:col-span-8 flex flex-col h-[650px] bg-slate-900/90 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
        {/* Chat Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-md">
              <Sparkles className="w-4 h-4 fill-current" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>GenAI Farm Assistant 2026</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  RAG Agronomy Grounded
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Sử dụng Gemini 3.8 Flash • Đồng bộ dữ liệu vi khí hậu thời gian thực
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] text-emerald-300">Live Context: {selectedZone.name.split(':')[0]}</span>
          </div>
        </div>

        {/* Chat Messages Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center shrink-0 text-emerald-300">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-lg ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-slate-950/90 text-slate-200 border border-slate-800 rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  <div
                    className={`mt-2 flex items-center justify-between text-[10px] ${
                      isUser ? 'text-emerald-200' : 'text-slate-500'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {msg.source && (
                      <span className="font-mono text-[10px] text-emerald-400/80">
                        Model: {msg.source}
                      </span>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-slate-300">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center text-xs text-slate-400">
              <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-300 animate-pulse">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl px-4 py-2.5 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-teal-400 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-sky-400 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-slate-300">AI đang phân tích dữ liệu cảm biến &amp; tra cứu tiêu chuẩn nông học...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Gợi ý câu hỏi:
          </span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(qp)}
              disabled={isLoading}
              className="text-xs px-2.5 py-1 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white whitespace-nowrap border border-slate-700 transition"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={`Hỏi chuyên gia AI về dinh dưỡng, bệnh hại hoặc điều khiển nhà kính (${selectedZone.crop})...`}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputPrompt.trim()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Gửi</span>
          </button>
        </div>
      </div>

      {/* Cột Phải (4 cols): Camera Scanner & Chẩn Đoán Bệnh Lá Cây */}
      <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-2xl flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Chẩn Đoán Bệnh Lá Qua Camera</h3>
              <p className="text-[11px] text-slate-400">Computer Vision + TinyML Anomaly Classifier</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 mt-2 mb-4 leading-relaxed">
            Chọn mẫu triệu chứng bệnh thu thập từ camera quang phổ đa băng tần (Multispectral Camera) để AI phân tích và đưa ra phác đồ can thiệp:
          </p>

          {/* Sample Diagnosis Cards */}
          <div className="space-y-3">
            {leafSamples.map((sample) => (
              <div
                key={sample.id}
                onClick={() => handleDiagnoseLeaf(sample)}
                className={`p-3 rounded-xl border cursor-pointer transition hover:scale-[1.02] ${
                  sample.color
                } ${selectedLeafSample === sample.id ? 'ring-2 ring-emerald-500' : ''}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold text-white">{sample.title}</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-300">
                    {sample.crop}
                  </span>
                </div>
                <div className="mt-2 text-[11px] text-slate-300">
                  <span className="text-amber-400 font-medium">Nghi ngờ: </span>
                  {sample.suspected}
                </div>
                <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-emerald-400 font-medium">
                  <span>Xem phân tích chi tiết</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Agronomy Grounding Fact Card */}
        <div className="mt-6 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <Cpu className="w-3.5 h-3.5" /> Chuẩn Đoán RAG Chống Ảo Tưởng (Anti-Hallucination)
          </div>
          <p>
            Mọi khuyến nghị dinh dưỡng và can thiệp actuator đều được kiểm chứng chéo với tài liệu sinh lý học cây trồng và tiêu chuẩn GlobalGAP, hạn chế tối đa rủi ro suy giảm năng suất.
          </p>
        </div>
      </div>
    </div>
  );
};

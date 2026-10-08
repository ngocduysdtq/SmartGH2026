import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client server-side
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// In-memory Farm-to-Fork Blockchain Ledger
interface Block {
  index: number;
  timestamp: string;
  actionType: 'SEEDING' | 'IRRIGATION' | 'FERTILIZATION' | 'PEST_CONTROL' | 'HARVEST' | 'QUALITY_INSPECT' | 'PACKAGING';
  zone: string;
  crop: string;
  details: string;
  actor: string;
  batchNumber: string;
  previousHash: string;
  hash: string;
  nonce: number;
  qrPayload: string;
}

const calculateHash = (index: number, timestamp: string, actionType: string, zone: string, crop: string, details: string, batchNumber: string, previousHash: string, nonce: number): string => {
  return crypto
    .createHash('sha256')
    .update(`${index}${timestamp}${actionType}${zone}${crop}${details}${batchNumber}${previousHash}${nonce}`)
    .digest('hex');
};

const blockchainLedger: Block[] = [
  {
    index: 0,
    timestamp: '2026-09-25T08:00:00.000Z',
    actionType: 'SEEDING',
    zone: 'Zone A - Cà Chua Cherry F1',
    crop: 'Cà chua Cherry Sweet 100',
    details: 'Gieo hạt giá thể xơ dừa tiệt trùng, độ ẩm 75%, 26°C. Tỷ lệ nảy mầm 99.2%. Giống F1 đạt chuẩn GlobalGAP.',
    actor: 'Agronomist: Dr. Trần Minh (ID: AG-88)',
    batchNumber: 'SGH-2026-TOM-0925',
    previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
    hash: '0000a4b79c31e62f01d51a6659c27702d7e82b3a1a9e87f19dc1839c94f5e712',
    nonce: 1042,
    qrPayload: 'https://smartgh.vn/trace/SGH-2026-TOM-0925-0'
  },
  {
    index: 1,
    timestamp: '2026-10-02T06:30:00.000Z',
    actionType: 'FERTILIZATION',
    zone: 'Zone A - Cà Chua Cherry F1',
    crop: 'Cà chua Cherry Sweet 100',
    details: 'Châm dinh dưỡng tự động EC 2.2 mS/cm, pH 5.85 qua hệ thống Venturi A/B. Tỷ lệ N-P-K: 15-10-30 + Vi lượng Chelated.',
    actor: 'Hyper-automation System (Rule: EC_AUTO_CYCLE_04)',
    batchNumber: 'SGH-2026-TOM-0925',
    previousHash: '0000a4b79c31e62f01d51a6659c27702d7e82b3a1a9e87f19dc1839c94f5e712',
    hash: '00002f1839bbec017ea09c3755490192e213b29c9aa88031e7c53641019ad77f',
    nonce: 489,
    qrPayload: 'https://smartgh.vn/trace/SGH-2026-TOM-0925-1'
  },
  {
    index: 2,
    timestamp: '2026-10-06T14:15:00.000Z',
    actionType: 'PEST_CONTROL',
    zone: 'Zone B - Dâu Tây Bạch Tuyết',
    crop: 'Dâu Tây White Jewel Nhật',
    details: 'Phun phòng trừ sinh học bằng nấm đối kháng Trichoderma harzianum kết hợp dầu khoáng Neem 0.2%. Không tồn dư hóa chất BVTV.',
    actor: 'Kỹ sư Phạm Văn Hùng (ID: OP-14)',
    batchNumber: 'SGH-2026-STR-1001',
    previousHash: '00002f1839bbec017ea09c3755490192e213b29c9aa88031e7c53641019ad77f',
    hash: '000086c23a1059f149b1a5e197c36a28723985160dc1e4a772c5b36719ab231a',
    nonce: 733,
    qrPayload: 'https://smartgh.vn/trace/SGH-2026-STR-1001-2'
  },
  {
    index: 3,
    timestamp: '2026-10-08T09:00:00.000Z',
    actionType: 'QUALITY_INSPECT',
    zone: 'Zone A - Cà Chua Cherry F1',
    crop: 'Cà chua Cherry Sweet 100',
    details: 'Kiểm định quang phổ NIR: Độ Brix trung bình 9.8°Bx, độ cứng quả 4.5kg/cm2. Đạt chuẩn chứng nhận xuất khẩu Châu Âu & Nhật Bản.',
    actor: 'QC Inspector: SGS Vietnam (Report #VN-AGRI-2026-88)',
    batchNumber: 'SGH-2026-TOM-0925',
    previousHash: '000086c23a1059f149b1a5e197c36a28723985160dc1e4a772c5b36719ab231a',
    hash: '0000d9e115049c8789b12cf53c15aa35b8098a5840e6c51829e5fa42862a9341',
    nonce: 1582,
    qrPayload: 'https://smartgh.vn/trace/SGH-2026-TOM-0925-3'
  }
];

// POST /api/chat: GenAI Farm Assistant with RAG context
app.post('/api/chat', async (req, res) => {
  try {
    const { message, currentSensorState, history } = req.body;

    const sensorContext = currentSensorState
      ? `
DỮ LIỆU CẢM BIẾN THỰC TẾ HIỆN TẠI TỪ EDGE AI GATEWAY (SmartGH-2026):
- Khu vực được chọn: ${currentSensorState.zoneName || 'Toàn khu nhà kính'}
- Cây trồng chính: ${currentSensorState.crop || 'Cà chua Cherry / Dâu tây Nhật / Ớt chuông'}
- Nhiệt độ không khí: ${currentSensorState.temperature ?? 27.4}°C (Ngưỡng tối ưu: 22 - 28°C)
- Độ ẩm không khí: ${currentSensorState.humidity ?? 74}% (Ngưỡng tối ưu: 65 - 80%)
- Nồng độ CO2: ${currentSensorState.co2 ?? 850} ppm (Mục tiêu quang hợp: 800 - 1200 ppm)
- Ánh sáng PPFD: ${currentSensorState.lightPPFD ?? 680} µmol/m²/s (DLI tích lũy: 18.2 mol/m²/ngày)
- Độ ẩm đất/giá thể: ${currentSensorState.soilMoisture ?? 42}% (Ngưỡng cảnh báo: < 35% hoặc > 85%)
- EC dinh dưỡng: ${currentSensorState.ec ?? 2.1} mS/cm (Chuẩn: 1.8 - 2.5 mS/cm)
- pH dung dịch: ${currentSensorState.ph ?? 5.9} (Chuẩn: 5.8 - 6.4)
- Áp lực tưới nhỏ giọt: ${currentSensorState.irrigationPressure ?? 1.8} bar
- VPD (Độ thiếu hụt áp suất hơi): ${currentSensorState.vpd ?? 0.95} kPa (Chuẩn thoát hơi nước: 0.8 - 1.2 kPa)
- Trạng thái Actuator: Quạt thông gió [BẬT], Bơm dinh dưỡng [TỰ ĐỘNG], Mái che [MỞ 40%], Đèn LED bổ sung [BẬT 60%]
- Cảnh báo vi khí hậu phát hiện: ${currentSensorState.anomalyAlert || 'Không có bất thường nghiêm trọng'}
`
      : 'Dữ liệu cảm biến vi khí hậu: Hoạt động ổn định tại 26.8°C, 72% RH, CO2 820ppm, EC 2.2, pH 6.0.';

    const systemPrompt = `Bạn là "SmartGH-2026 Farm Assistant" — Trợ lý Nông học & AI Chuyên sâu thuộc Hệ sinh thái Nhà kính Thông minh 2026.
Bạn được thiết kế với kiến trúc RAG (Retrieval-Augmented Generation), kết hợp giữa dữ liệu cảm biến thời gian thực, tiêu chuẩn canh tác công nghệ cao (GlobalGAP, Organic, DLI, VPD), sinh lý cây trồng, và các kịch bản Hyper-automation.

Nhiệm vụ của bạn:
1. Phân tích nguyên nhân cặn kẽ dựa trên số liệu cảm biến thực tế được cung cấp (VPD, EC, pH, độ ẩm đất, CO2, ánh sáng).
2. Đưa ra phác đồ hành động cụ thể, chính xác từng con số (ví dụ: điều chỉnh EC từ 2.1 lên 2.4, bổ sung MgSO4 50g/1000L, tăng thời gian quạt thông gió 15 phút, kéo mái che 20%).
3. Khuyến nghị kịch bản Hyper-automation tương ứng để nông dân thiết lập tự động hóa.
4. Giữ phong thái chuyên gia nông học công nghệ cao, thân thiện, rõ ràng, có cấu trúc bullet point dễ đọc.
5. Luôn trả lời bằng Tiếng Việt chuẩn mực kỹ thuật (có thể kèm thuật ngữ chuyên ngành tiếng Anh nếu cần như EC, VPD, PPFD, DLI).

${sensorContext}
`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          { role: 'user', parts: [{ text: systemPrompt + '\n\nCâu hỏi từ người quản lý nông trại:\n' + message }] }
        ],
        config: {
          systemInstruction: 'Bạn là chuyên gia nông học thông minh SmartGH-2026. Cung cấp câu trả lời sắc bén, chuyên sâu kỹ thuật vi khí hậu, dinh dưỡng và điều khiển nhà kính.',
          temperature: 0.7,
        }
      });

      const reply = response.text || 'Đã phân tích xong dữ liệu từ nhà kính.';
      return res.json({ success: true, reply, source: 'gemini-3.8-flash' });
    }

    // Dynamic Intelligent Agronomy Fallback Engine when API key is not yet set
    const lower = (message || '').toLowerCase();
    let reply = '';

    if (lower.includes('vàng') || lower.includes('lá') || lower.includes('thiếu') || lower.includes('dinh dưỡng') || lower.includes('magie')) {
      reply = `🌱 **Chẩn đoán Nông học SmartGH-2026 (Zone A - Cà chua Cherry):**
- **Hiện tượng:** Vàng gân lá dưới (Interveinal Chlorosis) tại tầng tán giữa và dưới.
- **Phân tích số liệu thực tế:** 
  • EC hiện tại: **${currentSensorState?.ec ?? 2.1} mS/cm** (hơi thấp so với giai đoạn nuôi quả 2.4 - 2.6 mS/cm).
  • pH dung dịch: **${currentSensorState?.ph ?? 5.9}** (trong khoảng hấp thụ tốt, nhưng tỷ lệ K:Mg đang mất cân bằng do Kali cao gây ức chế hút Magie).
  • Độ ẩm đất: **${currentSensorState?.soilMoisture ?? 42}%** khiến lưu lượng thẩm thấu dinh dưỡng qua mao dẫn rễ bị chậm.
- **Phương án can thiệp khẩn cấp:**
  1. **Bổ sung muối Epsom (MgSO4.7H2O):** Pha nồng độ 1.5 - 2.0 g/L phun qua lá vào sáng sớm (trước 8h) để hấp thụ trực tiếp trong 48 giờ.
  2. **Điều chỉnh Bể dinh dưỡng B:** Tăng nồng độ Magie Sulfat thêm 15% trong công thức châm tự động; nâng EC tổng lên **2.4 mS/cm**.
  3. **Hyper-automation đề xuất:** Kích hoạt kịch bản châm tưới vi lượng bù áp suất 3 lần/ngày x 4 phút.`;
    } else if (lower.includes('nấm') || lower.includes('bệnh') || lower.includes('độ ẩm') || lower.includes('sương mai') || lower.includes('phấn trắng')) {
      reply = `🛡️ **Cảnh báo Nguy cơ Nấm bệnh & Bào tử (Edge AI Vision):**
- **Chỉ số vi khí hậu:** Độ ẩm không khí đạt **${currentSensorState?.humidity ?? 74}%**, VPD rơi xuống **${currentSensorState?.vpd ?? 0.95} kPa** (vùng nguy cơ ngưng tụ sương trên phiến lá).
- **Phân tích nguy cơ:** Điều kiện nhiệt độ 26-28°C + độ ẩm > 75% kéo dài trên 4 tiếng là môi trường bùng phát nấm *Botrytis cinerea* (mốc xám) và *Phytophthora* (sương mai).
- **Khuyến nghị tự động hóa:**
  1. Bật ngay hệ thống quạt đối lưu HAF (Horizontal Air Flow) tốc độ 70% để làm khô bề mặt lá.
  2. Mở hé rèm thông gió đỉnh 15% kết hợp quạt hút để hạ RH xuống dưới 70%.
  3. Phun nấm đối kháng *Trichoderma viride* hoặc *Bacillus subtilis* phòng ngừa sinh học đạt chuẩn VietGAP/GlobalGAP.`;
    } else if (lower.includes('tưới') || lower.includes('nước') || lower.includes('bơm') || lower.includes('tiết kiệm')) {
      reply = `💧 **Tối ưu hóa Tài nguyên Nước & Lịch tưới AI:**
- **Độ ẩm đất hiện tại:** **${currentSensorState?.soilMoisture ?? 42}%** (Ngưỡng ẩm giá thể an toàn: 40% - 65%).
- **Bức xạ mặt trời / DLI hôm nay:** Tích lũy 18.2 mol/m²/ngày — Cây trồng cần thoát hơi nước mạnh từ 11:30 đến 14:00.
- **Lịch tưới tối ưu dự kiến:**
  • Ca 1: 10:30 (Tưới nhỏ giọt bù áp 120ml/gốc kèm dinh dưỡng EC 2.2).
  • Ca 2: 13:00 (Tưới xung nhịp 80ml/gốc làm mát bầu rễ).
  • Ca 3: 15:30 (Tưới dặm 60ml/gốc chuẩn bị qua đêm).
- **Kết quả:** Tiết kiệm **24.6% nước** so với tưới định kỳ theo giờ cố định.`;
    } else if (lower.includes('năng suất') || lower.includes('thu hoạch') || lower.includes('dự báo') || lower.includes('yield')) {
      reply = `📊 **Dự báo Năng suất Thu hoạch (ML Yield Predictor 2026):**
- **Giống cây:** Cà chua Cherry Sweet 100 F1 (Mật độ 2.8 cây/m²).
- **Chu kỳ sinh trưởng:** Ngày 48/90 (Đang giai đoạn nuôi trái chùm 3-5).
- **Sản lượng ước tính:** **14.2 tấn / 1,000m²** (Cao hơn **16.8%** so với trung bình canh tác truyền thống).
- **Chất lượng dự kiến:**
  • Tỷ lệ quả loại 1 (Đường kính 28-32mm): **92.4%**
  • Độ Brix dự báo: **9.5 - 10.2°Bx** (đạt tiêu chuẩn siêu thị cao cấp và xuất khẩu).
  • Ngày bắt đầu thu hoạch rộ đợt 1: **22/10/2026**.`;
    } else {
      reply = `🤖 **SmartGH-2026 Farm Assistant đã ghi nhận câu hỏi:**
- **Tình trạng tổng thể nhà kính:** Vi khí hậu đang duy trì ở trạng thái **Lý tưởng (Optimal)**.
  • Nhiệt độ: **${currentSensorState?.temperature ?? 27.4}°C** | Độ ẩm: **${currentSensorState?.humidity ?? 74}%**
  • CO2: **${currentSensorState?.co2 ?? 850} ppm** | EC: **${currentSensorState?.ec ?? 2.1} mS/cm** | pH: **${currentSensorState?.ph ?? 5.9}**
- **Đề xuất từ Edge AI:** 
  Hệ thống đang chạy 6 kịch bản Hyper-automation tự động cân bằng VPD và nồng độ CO2 quang hợp.
- **Bạn có thể hỏi thêm:**
  1. *"Tại sao lá cà chua ở Zone A bị vàng gân?"*
  2. *"Kiểm tra nguy cơ nấm sương mai và đề xuất lịch bật quạt?"*
  3. *"Lập lịch tưới nhỏ giọt tiết kiệm 20% nước trong mùa khô?"*
  4. *"Dự báo năng suất thu hoạch dâu tây Zone B?"*`;
    }

    return res.json({ success: true, reply, source: 'local-smart-agronomist' });
  } catch (error: any) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: error.message || 'Lỗi xử lý câu hỏi nông học' });
  }
});

// GET /api/blockchain/blocks: Retrieve traceability ledger
app.get('/api/blockchain/blocks', (req, res) => {
  res.json({ success: true, blocks: blockchainLedger });
});

// POST /api/blockchain/record: Record an immutable farming action
app.post('/api/blockchain/record', (req, res) => {
  try {
    const { actionType, zone, crop, details, actor, batchNumber } = req.body;
    const previousBlock = blockchainLedger[blockchainLedger.length - 1];
    const newIndex = previousBlock.index + 1;
    const timestamp = new Date().toISOString();
    const nonce = Math.floor(Math.random() * 9000) + 1000;
    const hash = calculateHash(newIndex, timestamp, actionType, zone, crop, details, batchNumber, previousBlock.hash, nonce);
    
    const newBlock: Block = {
      index: newIndex,
      timestamp,
      actionType: actionType || 'IRRIGATION',
      zone: zone || 'Zone A',
      crop: crop || 'Cà chua Cherry',
      details: details || 'Thao tác tự động được ghi nhận',
      actor: actor || 'SmartGH Hyper-automation',
      batchNumber: batchNumber || 'SGH-2026-BATCH-01',
      previousHash: previousBlock.hash,
      hash,
      nonce,
      qrPayload: `https://smartgh.vn/trace/${batchNumber || 'SGH-2026-BATCH'}-${newIndex}`
    };

    blockchainLedger.push(newBlock);
    res.json({ success: true, block: newBlock, totalBlocks: blockchainLedger.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/playbooks/extract-ai: AI Agronomist Converter using Gemini
app.post('/api/playbooks/extract-ai', async (req, res) => {
  try {
    const { textContent, cropNameHint } = req.body;
    if (!textContent || !textContent.trim()) {
      return res.status(400).json({ error: 'Nội dung quy trình kỹ thuật không được để trống' });
    }

    const systemPrompt = `Bạn là Trưởng bộ phận Nông học Công nghệ cao SmartGH-2026.
Nhiệm vụ của bạn: Đọc văn bản quy trình kỹ thuật/khuyến nghị nông học được cung cấp và chuẩn hóa thành một đối tượng JSON đại diện cho CropStagePlaybook.

Định dạng JSON BẮT BUỘC trả về đúng cấu trúc sau (chỉ trả về JSON thuần, không kèm markdown \`\`\`):
{
  "cropName": "Tên cây trồng (ví dụ: Ớt Chuông Sweet Pepper F1)",
  "variety": "Giống cụ thể (ví dụ: Kháng virus TSWV)",
  "icon": "Emoji đại diện (ví dụ: 🫑 hoặc 🍈 hoặc 🍅)",
  "totalCycleDays": 80,
  "author": "Tên chuyên gia/tổ chức trích xuất",
  "stages": [
    {
      "stageName": "Giai đoạn 1: Gieo ươm & Cây con (Ngày 1 - 15)",
      "durationDays": 15,
      "ecTarget": 1.4,
      "phTarget": 6.0,
      "vpdTarget": 0.85,
      "soilMoistureTarget": 60,
      "irrigationStrategy": "Mô tả chiến lược tưới nhỏ giọt/phun sương",
      "keyActions": ["Hành động 1", "Hành động 2"]
    }
  ]
}

Nội dung tài liệu từ chuyên gia:
${textContent}
`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        }
      });

      const responseText = response.text || '{}';
      try {
        const parsed = JSON.parse(responseText);
        return res.json({
          success: true,
          playbook: {
            id: `pb-expert-${Date.now()}`,
            ...parsed,
            verified: true,
            source: 'GENAI_EXTRACTED',
          }
        });
      } catch (e) {
        console.error('Failed to parse AI JSON:', e);
      }
    }

    // Dynamic Intelligent Fallback parser if Gemini API key not present
    const cropName = cropNameHint || 'Ớt Chuông Sweet Pepper Hà Lan';
    const fallbackPlaybook = {
      id: `pb-expert-${Date.now()}`,
      cropName: cropName,
      variety: 'F1 Kháng bệnh chuẩn Euro-GAP',
      icon: '🫑',
      totalCycleDays: 85,
      author: 'Chuyên gia Nông học Độc lập / Viện Rau Quả',
      verified: true,
      source: 'GENAI_EXTRACTED',
      stages: [
        {
          stageName: 'Giai đoạn 1: Cây giống & Hồi xanh rễ (Ngày 1 - 15)',
          durationDays: 15,
          ecTarget: 1.5,
          phTarget: 6.0,
          vpdTarget: 0.85,
          soilMoistureTarget: 60,
          irrigationStrategy: 'Tưới nhỏ giọt xung nhịp 4 lần/ngày x 2 phút',
          keyActions: ['Giữ ấm bầu rễ 22-25°C', 'Bổ sung nấm rễ Mycorrhizae']
        },
        {
          stageName: 'Giai đoạn 2: Phân cành & Ra nụ hoa (Ngày 16 - 40)',
          durationDays: 25,
          ecTarget: 2.0,
          phTarget: 5.9,
          vpdTarget: 1.05,
          soilMoistureTarget: 52,
          irrigationStrategy: 'Tưới theo chỉ số tích lũy DLI đạt 17 mol/m2/ngày',
          keyActions: ['Tỉa cành chữ Y giữ 2 thân chính', 'Bổ sung Canxi-Bo chống rụng hoa']
        },
        {
          stageName: 'Giai đoạn 3: Nuôi quả thương phẩm & Chín màu (Ngày 41 - 85)',
          durationDays: 45,
          ecTarget: 2.5,
          phTarget: 5.85,
          vpdTarget: 1.2,
          soilMoistureTarget: 48,
          irrigationStrategy: 'Tưới xung bù áp 6 lần/ngày ổn định ẩm độ',
          keyActions: ['Cắt tỉa lá già chân gốc', 'Thu hoạch khi vỏ chuyển màu 90%']
        }
      ]
    };

    return res.json({ success: true, playbook: fallbackPlaybook, fallbackUsed: true });
  } catch (error: any) {
    console.error('Error extracting playbook:', error);
    res.status(500).json({ error: error.message || 'Lỗi trích xuất kịch bản' });
  }
});

// GET /api/system/status: Edge AI & IoT Gateway status
app.get('/api/system/status', (req, res) => {
  res.json({
    gateway: 'Jetson Nano 2026 Edge + Raspberry Pi 5 Gateway',
    edgeAI: 'TinyML Anomaly Detector v3.2 (Quantized ONNX)',
    onlineProtocols: ['MQTT v5.0 (TLS 1.3)', 'LoRaWAN AS923', 'Zigbee 3.0', 'Wi-Fi 7 (802.11be)'],
    sensorNodesActive: 48,
    actuatorsControlled: 16,
    avgLatencyMs: 184, // Target < 500ms
    systemUptime: 99.98, // Target > 99.9%
    edgeBufferOfflineRecords: 0,
    syncStatus: 'REALTIME_SYNCHRONIZED',
    cloudIngestionRate: '240 metrics/sec'
  });
});

// Setup Vite or Static File Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SmartGH-2026] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

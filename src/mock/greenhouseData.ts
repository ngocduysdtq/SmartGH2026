import {
  GreenhouseZone,
  SensorMetrics,
  HeatmapPoint,
  ActuatorDevice,
  IoTNodeDevice,
  AutomationWorkflowRule,
  YieldForecastData,
  SystemRisk,
  RoadmapPhase,
  VietGAPCropLog,
  ExtremeWeatherAlert,
  ResourceMeterStats,
  CropStagePlaybook
} from '../types/greenhouse';

export const INITIAL_ZONES: GreenhouseZone[] = [
  {
    id: 'zone-a',
    name: 'Khu A: Cà Chua Cherry F1',
    crop: 'Cà chua Cherry Sweet 100',
    variety: 'F1 Vô hạn (Indeterminate)',
    growthStage: 'Đậu quả & Nuôi trái rộ (Ngày 48/90)',
    areaSqM: 1200,
    plantCount: 3360,
    healthScore: 94,
    status: 'OPTIMAL',
    color: '#ef4444'
  },
  {
    id: 'zone-b',
    name: 'Khu B: Dâu Tây Bạch Tuyết',
    crop: 'Dâu Tây White Jewel Nhật Bản',
    variety: 'Mô hình giá thể treo A-frame',
    growthStage: 'Phát triển hoa & Kết trái non',
    areaSqM: 850,
    plantCount: 5200,
    healthScore: 88,
    status: 'WARNING',
    color: '#ec4899'
  },
  {
    id: 'zone-c',
    name: 'Khu C: Ớt Chuông Sweet Pepper',
    crop: 'Ớt chuông Đỏ & Vàng Hà Lan',
    variety: 'F1 Kháng virus TSWV',
    growthStage: 'Tạo quả thương phẩm tầng 2',
    areaSqM: 1000,
    plantCount: 2800,
    healthScore: 96,
    status: 'OPTIMAL',
    color: '#eab308'
  },
  {
    id: 'zone-d',
    name: 'Khu D: Dưa Lưới Khí Canh',
    crop: 'Dưa lưới Huỳnh Long F1',
    variety: 'Aeroponics Box Mist',
    growthStage: 'Tạo vân lưới & Tích lũy đường Brix',
    areaSqM: 950,
    plantCount: 1900,
    healthScore: 92,
    status: 'OPTIMAL',
    color: '#10b981'
  }
];

export const INITIAL_SENSOR_METRICS: Record<string, SensorMetrics> = {
  'zone-a': {
    temperature: 26.8,
    humidity: 72,
    co2: 860,
    lightPPFD: 720,
    dli: 19.4,
    soilMoisture: 45,
    ec: 2.2,
    ph: 5.95,
    irrigationPressure: 1.85,
    vpd: 0.98,
    leafTemperature: 25.4
  },
  'zone-b': {
    temperature: 24.2,
    humidity: 79,
    co2: 780,
    lightPPFD: 540,
    dli: 15.1,
    soilMoisture: 38,
    ec: 1.75,
    ph: 6.2,
    irrigationPressure: 1.6,
    vpd: 0.72,
    leafTemperature: 23.8
  },
  'zone-c': {
    temperature: 27.5,
    humidity: 68,
    co2: 910,
    lightPPFD: 690,
    dli: 18.6,
    soilMoisture: 52,
    ec: 2.4,
    ph: 5.85,
    irrigationPressure: 1.9,
    vpd: 1.15,
    leafTemperature: 26.2
  },
  'zone-d': {
    temperature: 28.1,
    humidity: 64,
    co2: 940,
    lightPPFD: 810,
    dli: 21.2,
    soilMoisture: 58,
    ec: 2.5,
    ph: 5.9,
    irrigationPressure: 2.1,
    vpd: 1.32,
    leafTemperature: 26.9
  }
};

export const INITIAL_HEATMAP_POINTS: HeatmapPoint[] = [
  { id: 'p1', x: 15, y: 20, zoneId: 'zone-a', temperature: 26.2, humidity: 73, soilMoisture: 46, status: 'normal' },
  { id: 'p2', x: 35, y: 22, zoneId: 'zone-a', temperature: 27.4, humidity: 71, soilMoisture: 44, status: 'normal' },
  { id: 'p3', x: 18, y: 45, zoneId: 'zone-a', temperature: 28.5, humidity: 68, soilMoisture: 36, status: 'dry' },
  { id: 'p4', x: 38, y: 48, zoneId: 'zone-a', temperature: 26.8, humidity: 72, soilMoisture: 45, status: 'normal' },
  
  { id: 'p5', x: 62, y: 20, zoneId: 'zone-b', temperature: 23.8, humidity: 81, soilMoisture: 35, status: 'wet' },
  { id: 'p6', x: 84, y: 22, zoneId: 'zone-b', temperature: 24.5, humidity: 78, soilMoisture: 39, status: 'normal' },
  { id: 'p7', x: 65, y: 45, zoneId: 'zone-b', temperature: 25.1, humidity: 76, soilMoisture: 40, status: 'normal' },
  { id: 'p8', x: 86, y: 48, zoneId: 'zone-b', temperature: 23.4, humidity: 82, soilMoisture: 34, status: 'cold' },

  { id: 'p9', x: 16, y: 65, zoneId: 'zone-c', temperature: 27.2, humidity: 69, soilMoisture: 53, status: 'normal' },
  { id: 'p10', x: 37, y: 68, zoneId: 'zone-c', temperature: 28.8, humidity: 66, soilMoisture: 48, status: 'hot' },
  { id: 'p11', x: 18, y: 85, zoneId: 'zone-c', temperature: 27.0, humidity: 70, soilMoisture: 54, status: 'normal' },
  { id: 'p12', x: 38, y: 88, zoneId: 'zone-c', temperature: 27.6, humidity: 67, soilMoisture: 51, status: 'normal' },

  { id: 'p13', x: 64, y: 65, zoneId: 'zone-d', temperature: 28.0, humidity: 65, soilMoisture: 59, status: 'normal' },
  { id: 'p14', x: 85, y: 67, zoneId: 'zone-d', temperature: 29.2, humidity: 62, soilMoisture: 55, status: 'hot' },
  { id: 'p15', x: 66, y: 85, zoneId: 'zone-d', temperature: 27.8, humidity: 66, soilMoisture: 60, status: 'normal' },
  { id: 'p16', x: 87, y: 88, zoneId: 'zone-d', temperature: 28.2, humidity: 63, soilMoisture: 57, status: 'normal' },
];

export const INITIAL_ACTUATORS: ActuatorDevice[] = [
  {
    id: 'act-1',
    name: 'Bơm tưới nhỏ giọt Zone A & C',
    category: 'PUMP',
    zoneId: 'zone-a',
    state: 'AUTO',
    powerLevel: 80,
    runtimeTodayMinutes: 45,
    lastActivated: '10 phút trước',
    protocol: 'MQTT'
  },
  {
    id: 'act-2',
    name: 'Quạt hút đối lưu HAF tầng trên',
    category: 'FAN',
    zoneId: 'ALL',
    state: 'ON',
    powerLevel: 75,
    runtimeTodayMinutes: 320,
    lastActivated: 'Đang chạy',
    protocol: 'Wi-Fi 7'
  },
  {
    id: 'act-3',
    name: 'Mái che phản quang tự động 2 lớp',
    category: 'SHADE',
    zoneId: 'ALL',
    state: 'AUTO',
    powerLevel: 40, // 40% open
    runtimeTodayMinutes: 18,
    lastActivated: '35 phút trước',
    protocol: 'Zigbee'
  },
  {
    id: 'act-4',
    name: 'Đèn LED bổ sung quang phổ Far-Red',
    category: 'LIGHT',
    zoneId: 'zone-b',
    state: 'ON',
    powerLevel: 65,
    runtimeTodayMinutes: 240,
    lastActivated: 'Đang chạy',
    protocol: 'MQTT'
  },
  {
    id: 'act-5',
    name: 'Hệ thống phun sương vi áp suất 70 bar',
    category: 'MIST',
    zoneId: 'ALL',
    state: 'OFF',
    powerLevel: 0,
    runtimeTodayMinutes: 12,
    lastActivated: '1 giờ trước',
    protocol: 'LoRaWAN'
  },
  {
    id: 'act-6',
    name: 'Bộ châm phân bón vi lượng Bể A/B',
    category: 'NUTRIENT',
    zoneId: 'zone-a',
    state: 'AUTO',
    powerLevel: 100,
    runtimeTodayMinutes: 28,
    lastActivated: '42 phút trước',
    protocol: 'MQTT'
  }
];

export const INITIAL_IOT_NODES: IoTNodeDevice[] = [
  {
    id: 'node-01',
    nodeName: 'Edge-Gateway-Master-01',
    zone: 'Trung tâm điều khiển',
    protocol: 'Wi-Fi 7 (802.11be)',
    batteryPercent: 100,
    rssi: -38,
    lastPingMs: 12,
    status: 'ONLINE',
    hardware: 'Jetson Orin Nano + RPi5 Dual-Bus',
    firmwareVersion: 'v2026.4.12'
  },
  {
    id: 'node-02',
    nodeName: 'Microclimate-Probe-A1',
    zone: 'Zone A (Cà chua)',
    protocol: 'MQTT v5.0',
    batteryPercent: 94,
    rssi: -52,
    lastPingMs: 140,
    status: 'ONLINE',
    hardware: 'Sensirion SHT45 + NDIR SCD41',
    firmwareVersion: 'v2026.2.0'
  },
  {
    id: 'node-03',
    nodeName: 'Soil-EC-VWC-Array-B2',
    zone: 'Zone B (Dâu tây)',
    protocol: 'LoRaWAN AS923',
    batteryPercent: 88,
    rssi: -68,
    lastPingMs: 220,
    status: 'ONLINE',
    hardware: 'TDR-315H High Precision Soil Probe',
    firmwareVersion: 'v2026.1.9'
  },
  {
    id: 'node-04',
    nodeName: 'PPFD-Quantum-Sensor-C1',
    zone: 'Zone C (Ớt chuông)',
    protocol: 'Zigbee 3.0',
    batteryPercent: 91,
    rssi: -59,
    lastPingMs: 165,
    status: 'ONLINE',
    hardware: 'Apogee SQ-500 Quantum PAR',
    firmwareVersion: 'v2026.3.1'
  },
  {
    id: 'node-05',
    nodeName: 'Aeroponics-Pressure-D1',
    zone: 'Zone D (Dưa lưới)',
    protocol: 'MQTT v5.0',
    batteryPercent: 98,
    rssi: -47,
    lastPingMs: 95,
    status: 'ONLINE',
    hardware: 'Keller 21Y Piezoresistive Transmitter',
    firmwareVersion: 'v2026.3.5'
  }
];

export const INITIAL_RULES: AutomationWorkflowRule[] = [
  {
    id: 'rule-01',
    name: 'Cân Bằng Ẩm Độ Đất & Thoát Hơi Nước Zone A',
    description: 'NẾU (Độ ẩm đất < 35% VÀ Độ ẩm không khí > 75%) THÌ (Bật quạt hút 10 phút RỒI Tưới nhỏ giọt 5 phút)',
    enabled: true,
    zoneId: 'zone-a',
    trigger: {
      metric: 'soilMoisture',
      operator: '<',
      threshold: 35
    },
    condition: {
      metric: 'humidity',
      operator: '>',
      threshold: 75
    },
    actions: [
      { actuatorCategory: 'FAN', action: 'TURN_ON', level: 85, durationMinutes: 10 },
      { actuatorCategory: 'PUMP', action: 'TURN_ON', level: 80, durationMinutes: 5 }
    ],
    executionsToday: 6,
    lastTriggered: '08:45 Hôm nay'
  },
  {
    id: 'rule-02',
    name: 'Giải Nhiệt Nắng Gắt & Chống Sốc Nhiệt PPFD',
    description: 'NẾU (Nhiệt độ > 31°C VÀ Ánh sáng PPFD > 750 µmol) THÌ (Đóng mái che 50% VÀ Bật phun sương vi giọt 3 phút)',
    enabled: true,
    zoneId: 'ALL',
    trigger: {
      metric: 'temperature',
      operator: '>',
      threshold: 31
    },
    condition: {
      metric: 'lightPPFD',
      operator: '>',
      threshold: 750
    },
    actions: [
      { actuatorCategory: 'SHADE', action: 'SET_LEVEL', level: 50, durationMinutes: 60 },
      { actuatorCategory: 'MIST', action: 'TURN_ON', level: 100, durationMinutes: 3 }
    ],
    executionsToday: 2,
    lastTriggered: '12:15 Hôm nay'
  },
  {
    id: 'rule-03',
    name: 'Điều Tiết VPD & Ngăn Ngừa Bệnh Phấn Trắng',
    description: 'NẾU (VPD < 0.75 kPa VÀ Độ ẩm > 78%) THÌ (Tăng tốc quạt đối lưu HAF lên 80% VÀ Tắt bơm sương)',
    enabled: true,
    zoneId: 'zone-b',
    trigger: {
      metric: 'vpd',
      operator: '<',
      threshold: 0.75
    },
    condition: {
      metric: 'humidity',
      operator: '>',
      threshold: 78
    },
    actions: [
      { actuatorCategory: 'FAN', action: 'SET_LEVEL', level: 80, durationMinutes: 20 },
      { actuatorCategory: 'MIST', action: 'TURN_OFF', durationMinutes: 0 }
    ],
    executionsToday: 4,
    lastTriggered: '07:30 Sáng nay'
  },
  {
    id: 'rule-04',
    name: 'Bù Nồng Độ CO2 Quang Hợp Giờ Vàng',
    description: 'NẾU (CO2 < 800 ppm VÀ Ánh sáng PPFD > 600) THÌ (Đóng nhẹ rèm thông gió VÀ Châm CO2 hữu cơ)',
    enabled: true,
    zoneId: 'ALL',
    trigger: {
      metric: 'co2',
      operator: '<',
      threshold: 800
    },
    condition: {
      metric: 'lightPPFD',
      operator: '>',
      threshold: 600
    },
    actions: [
      { actuatorCategory: 'SHADE', action: 'SET_LEVEL', level: 30, durationMinutes: 45 }
    ],
    executionsToday: 5,
    lastTriggered: '09:10 Sáng nay'
  }
];

export const YIELD_FORECASTS: YieldForecastData[] = [
  {
    crop: 'Cà chua Cherry Sweet 100 F1',
    zoneId: 'zone-a',
    projectedHarvestDate: '22/10/2026',
    estimatedYieldTons: 14.8,
    yieldIncreasePercent: 18.2, // >15% KPI
    brixAverage: 9.8,
    gradeARate: 93.4,
    waterSavedM3: 420, // 24.5% saved (>20% KPI)
    energySavedKwh: 680 // 21.2% saved
  },
  {
    crop: 'Dâu Tây White Jewel Nhật Bản',
    zoneId: 'zone-b',
    projectedHarvestDate: '05/11/2026',
    estimatedYieldTons: 6.2,
    yieldIncreasePercent: 16.5,
    brixAverage: 13.4,
    gradeARate: 91.0,
    waterSavedM3: 310,
    energySavedKwh: 540
  },
  {
    crop: 'Ớt chuông Sweet Pepper Đỏ',
    zoneId: 'zone-c',
    projectedHarvestDate: '15/11/2026',
    estimatedYieldTons: 18.5,
    yieldIncreasePercent: 17.8,
    brixAverage: 8.2,
    gradeARate: 95.2,
    waterSavedM3: 490,
    energySavedKwh: 720
  },
  {
    crop: 'Dưa lưới Khí Canh Huỳnh Long',
    zoneId: 'zone-d',
    projectedHarvestDate: '28/10/2026',
    estimatedYieldTons: 12.0,
    yieldIncreasePercent: 21.4,
    brixAverage: 15.6,
    gradeARate: 96.0,
    waterSavedM3: 560,
    energySavedKwh: 610
  }
];

export const ROADMAP_PHASES: RoadmapPhase[] = [
  {
    phase: 'Phase 1',
    title: 'Nền tảng & Thu thập Dữ liệu (Q1/2026)',
    quarter: 'Q1 / 2026',
    months: 'Tháng 1 - Tháng 3',
    milestones: [
      'Tháng 1: Thiết kế UI/UX hiện đại, kiến trúc DB TimescaleDB & PostgreSQL, setup CI/CD Cloud',
      'Tháng 2: Phát triển Backend Core, MQTT Broker TLS 1.3, CRUD thiết bị IoT đa giao thức',
      'Tháng 3: Triển khai Dashboard Web/Mobile Real-time Data, tích hợp Edge Gateway Jetson Nano'
    ],
    completed: true,
    progressPercent: 100
  },
  {
    phase: 'Phase 2',
    title: 'Trí tuệ & Tự động hóa (Q2/2026)',
    quarter: 'Q2 / 2026',
    months: 'Tháng 4 - Tháng 6',
    milestones: [
      'Tháng 4: Rule Engine Hyper-automation đa điều kiện (bơm, quạt, mái che theo ngưỡng)',
      'Tháng 5: Huấn luyện ML Yield Forecasting & Anomaly Detection vi khí hậu trực tiếp tại biên',
      'Tháng 6: Tích hợp Image Processing nhận diện bệnh hại qua camera nhà kính thời gian thực'
    ],
    completed: true,
    progressPercent: 100
  },
  {
    phase: 'Phase 3',
    title: 'Digital Twin 3D & GenAI (Q3/2026) - Milestone Đột Phá',
    quarter: 'Q3 / 2026',
    months: 'Tháng 7 - Tháng 9',
    milestones: [
      'Tháng 7: Bản sao số Digital Twin 3D (Three.js WebGL tích hợp WebSocket telemetry)',
      'Tháng 8: GenAI Farm Assistant chuyên sâu (RAG kết hợp dữ liệu lịch sử canh tác)',
      'Tháng 9: Tối ưu TinyML Edge AI độ trễ < 200ms, hỗ trợ chế độ Offline-first hoàn chỉnh'
    ],
    completed: true,
    progressPercent: 95
  },
  {
    phase: 'Phase 4',
    title: 'Scaling & Traceability (Q4/2026)',
    quarter: 'Q4 / 2026',
    months: 'Tháng 10 - Tháng 12',
    milestones: [
      'Tháng 10: Tích hợp Blockchain Ledger cho truy xuất nguồn gốc Farm-to-Fork xuất khẩu',
      'Tháng 11: Multi-tenant SaaS scaling (quản trị tập trung hàng trăm nhà kính liên kết)',
      'Tháng 12: Ra mắt Official v1.0, kích hoạt chiến dịch Go-to-Market toàn cầu 2027'
    ],
    completed: false,
    progressPercent: 65
  }
];

export const SYSTEM_RISKS: SystemRisk[] = [
  {
    id: 'risk-1',
    name: 'Mất kết nối Internet (Offline Network)',
    severity: 'Cao',
    solution: 'Edge AI (Jetson/TinyML) xử lý ra quyết định tại chỗ; Gateway lưu trữ đệm SQLite local và tự động Sync lên TimescaleDB ngay khi phục hồi mạng.',
    status: 'MITIGATED'
  },
  {
    id: 'risk-2',
    name: 'Sensor hỏng / Sai số bất thường',
    severity: 'Trung bình',
    solution: 'Thuật toán Isolation Forest & Kalman Filter loại bỏ data nhiễu (outliers) trước khi ghi DB; tự động gắn cờ cảnh báo bảo dưỡng kỹ thuật.',
    status: 'MITIGATED'
  },
  {
    id: 'risk-3',
    name: 'GenAI Ảo tưởng (Hallucination)',
    severity: 'Cao',
    solution: 'Kiến trúc RAG (Retrieval-Augmented Generation) khóa chặt tri thức theo tiêu chuẩn tài liệu nông học chuẩn hóa, chỉ trả lời dựa trên vi khí hậu thực.',
    status: 'MITIGATED'
  },
  {
    id: 'risk-4',
    name: 'Bảo mật IoT (Nguy cơ Botnet / Tấn công mạng)',
    severity: 'Trung bình',
    solution: 'Mã hóa End-to-End TLS 1.3 cho MQTT/gRPC, xác thực Mutual-TLS (mTLS), phân quyền RBAC và định kỳ OTA signed firmware.',
    status: 'MONITORING'
  }
];

export const CROP_PLAYBOOKS: CropStagePlaybook[] = [
  {
    id: 'pb-melon',
    cropName: 'Dưa Lưới Khí Canh (Muskmelon)',
    variety: 'Huỳnh Long F1 / Kim Cô Nương',
    icon: '🍈',
    totalCycleDays: 75,
    appliedToZone: 'zone-d',
    author: 'Viện Cây Ăn Quả & Wageningen Alumni',
    verified: true,
    source: 'SYSTEM_DEFAULT',
    stages: [
      {
        stageName: 'Giai đoạn 1: Gieo ươm & Bén rễ (Ngày 1 - 10)',
        durationDays: 10,
        ecTarget: 1.2,
        phTarget: 6.2,
        vpdTarget: 0.8,
        soilMoistureTarget: 65,
        irrigationStrategy: 'Phun sương nhẹ 2 giờ/lần x 30 giây, độ ẩm giá thể ổn định',
        keyActions: ['Tưới kích rễ Humic Acid', 'Giữ nhiệt độ rễ 24 - 26°C']
      },
      {
        stageName: 'Giai đoạn 2: Phát triển thân lá & Leo giàn (Ngày 11 - 28)',
        durationDays: 18,
        ecTarget: 1.8,
        phTarget: 6.0,
        vpdTarget: 1.0,
        soilMoistureTarget: 55,
        irrigationStrategy: 'Tưới nhỏ giọt bù áp 4 lần/ngày theo DLI quang hợp',
        keyActions: ['Tỉa chồi nách dưới nách lá thứ 10', 'Bổ sung Canxi Bo chống nứt thân']
      },
      {
        stageName: 'Giai đoạn 3: Thụ phấn & Đậu quả nách 11-13 (Ngày 29 - 38)',
        durationDays: 10,
        ecTarget: 1.9,
        phTarget: 5.9,
        vpdTarget: 1.1,
        soilMoistureTarget: 50,
        irrigationStrategy: 'Giảm nhẹ lượng nước để hạn chế phát triển chồi ngọn, giữ khô ráo cho phấn hoa',
        keyActions: ['Thụ phấn nhân tạo buổi sáng 7h-9h', 'Tuyển chọn giữ 1 quả đẹp nhất/cây']
      },
      {
        stageName: 'Giai đoạn 4: Nuôi quả & Nở vân lưới (Ngày 39 - 62)',
        durationDays: 24,
        ecTarget: 2.4,
        phTarget: 5.8,
        vpdTarget: 1.25,
        soilMoistureTarget: 58,
        irrigationStrategy: 'Tưới đều đặn không để biên độ ẩm giao động lớn tránh nứt quả',
        keyActions: ['Treo dây đỡ quả', 'Tăng tỷ lệ Kali và Magie trong bể dinh dưỡng B']
      },
      {
        stageName: 'Giai đoạn 5: Tích lũy đường Brix & Thu hoạch (Ngày 63 - 75)',
        durationDays: 13,
        ecTarget: 2.6,
        phTarget: 6.0,
        vpdTarget: 1.35,
        soilMoistureTarget: 40,
        irrigationStrategy: 'Cắt giảm 40% lượng tưới 7 ngày trước thu hoạch để cô đặc đường',
        keyActions: ['Đo kiểm quang phổ NIR Brix đạt >= 14°Bx', 'Cắt cuống chữ T bảo quản mát']
      }
    ]
  },
  {
    id: 'pb-strawberry',
    cropName: 'Dâu Tây Bạch Tuyết & Tochiotome',
    variety: 'Mô hình giá thể A-Frame Nhật',
    icon: '🍓',
    totalCycleDays: 120,
    appliedToZone: 'zone-b',
    author: 'ĐH Nông Lâm & Viện KHKT Nông Lâm Nghiệp Tây Nguyên',
    verified: true,
    source: 'SYSTEM_DEFAULT',
    stages: [
      {
        stageName: 'Giai đoạn 1: Hồi xanh sau cấy mô (Ngày 1 - 15)',
        durationDays: 15,
        ecTarget: 1.2,
        phTarget: 6.2,
        vpdTarget: 0.7,
        soilMoistureTarget: 60,
        irrigationStrategy: 'Tưới xung vi lượng 6 lần/ngày x 2 phút',
        keyActions: ['Kéo rèm cắt nắng 50%', 'Phòng nấm rễ bằng Trichoderma']
      },
      {
        stageName: 'Giai đoạn 2: Phân hóa mầm hoa & Tán lá (Ngày 16 - 45)',
        durationDays: 30,
        ecTarget: 1.6,
        phTarget: 6.0,
        vpdTarget: 0.85,
        soilMoistureTarget: 50,
        irrigationStrategy: 'Tưới theo chỉ số tích lũy DLI đạt 16 mol/m2/ngày',
        keyActions: ['Tỉa ngó nhánh', 'Bổ sung Lân hữu cơ và Canxi Chelate']
      },
      {
        stageName: 'Giai đoạn 3: Nở hoa & Thụ phấn nuôi trái (Ngày 46 - 85)',
        durationDays: 40,
        ecTarget: 1.8,
        phTarget: 5.9,
        vpdTarget: 0.95,
        soilMoistureTarget: 45,
        irrigationStrategy: 'Kiểm soát tưới buổi sáng, hạn chế ướt bầu hoa chiều tối',
        keyActions: ['Thả ong thụ phấn hoặc quạt gió đối lưu nhẹ', 'Đặt bẫy dính vàng bọ trĩ']
      },
      {
        stageName: 'Giai đoạn 4: Chín rộ & Thu hoạch từng đợt (Ngày 86 - 120)',
        durationDays: 35,
        ecTarget: 1.9,
        phTarget: 5.8,
        vpdTarget: 1.0,
        soilMoistureTarget: 42,
        irrigationStrategy: 'Tưới giọt đều đặn EC 1.8 - 2.0 mS/cm',
        keyActions: ['Thu hái sáng sớm trước 8h30', 'Đóng khay bảo ôn làm mát 4°C']
      }
    ]
  },
  {
    id: 'pb-orchid',
    cropName: 'Hoa Lan Hồ Điệp (Phalaenopsis)',
    variety: 'Dòng hoa cắt cành & chậu xuất khẩu',
    icon: '🌸',
    totalCycleDays: 150,
    author: 'Hiệp Hội Hoa Đà Lạt & Chuyên Gia Đài Loan',
    verified: true,
    source: 'SYSTEM_DEFAULT',
    stages: [
      {
        stageName: 'Giai đoạn 1: Sinh trưởng sinh dưỡng (Lá & Rễ)',
        durationDays: 60,
        ecTarget: 1.0,
        phTarget: 5.8,
        vpdTarget: 0.8,
        soilMoistureTarget: 55,
        irrigationStrategy: 'Tưới phun sương định kỳ khi giá thể vỏ thông se mặt',
        keyActions: ['Duy trì nhiệt độ 28°C ban ngày, 24°C ban đêm', 'Ánh sáng 60% rèm che']
      },
      {
        stageName: 'Giai đoạn 2: Xử lý nhiệt độ cảm ứng vòi hoa',
        durationDays: 45,
        ecTarget: 1.2,
        phTarget: 5.7,
        vpdTarget: 0.9,
        soilMoistureTarget: 50,
        irrigationStrategy: 'Giảm ẩm độ, tưới phân có tỷ lệ P-K cao',
        keyActions: ['Hạ nhiệt độ ban đêm xuống 18 - 20°C kích ngồng hoa', 'Bật quạt đối lưu HAF']
      },
      {
        stageName: 'Giai đoạn 3: Nuôi ngồng hoa & Nở hoa thương phẩm',
        durationDays: 45,
        ecTarget: 1.3,
        phTarget: 5.8,
        vpdTarget: 0.95,
        soilMoistureTarget: 45,
        irrigationStrategy: 'Tưới nhỏ giọt dưới gốc, tuyệt đối không ướt cánh hoa',
        keyActions: ['Cắm ty uốn cành nghệ thuật', 'Bổ sung Canxi chống rụng nụ']
      }
    ]
  },
  {
    id: 'pb-tomato',
    cropName: 'Cà Chua Cherry Sweet 100 F1',
    variety: 'Vô hạn (Indeterminate)',
    icon: '🍅',
    totalCycleDays: 90,
    appliedToZone: 'zone-a',
    author: 'Viện Nghiên Cứu Rau Quả Gia Lâm & Dr. Trần Minh',
    verified: true,
    source: 'SYSTEM_DEFAULT',
    stages: [
      {
        stageName: 'Giai đoạn 1: Bén rễ phát triển thân chính (Ngày 1 - 20)',
        durationDays: 20,
        ecTarget: 1.6,
        phTarget: 6.0,
        vpdTarget: 0.85,
        soilMoistureTarget: 60,
        irrigationStrategy: 'Tưới nhỏ giọt 4 lần/ngày x 3 phút',
        keyActions: ['Quấn dây leo chữ S', 'Vặt bỏ chồi nách gốc']
      },
      {
        stageName: 'Giai đoạn 2: Ra hoa chùm 1-3 & Đậu quả (Ngày 21 - 45)',
        durationDays: 25,
        ecTarget: 2.1,
        phTarget: 5.9,
        vpdTarget: 1.05,
        soilMoistureTarget: 50,
        irrigationStrategy: 'Tưới bù áp theo bức xạ quang hợp DLI',
        keyActions: ['Rung chùm hoa hỗ trợ thụ phấn', 'Bổ sung Magie Sulfat và Bo']
      },
      {
        stageName: 'Giai đoạn 3: Nuôi quả rộ & Chín thu hoạch (Ngày 46 - 90)',
        durationDays: 45,
        ecTarget: 2.4,
        phTarget: 5.85,
        vpdTarget: 1.15,
        soilMoistureTarget: 45,
        irrigationStrategy: 'Tưới 6 xung/ngày, ổn định ẩm độ chống nứt quả',
        keyActions: ['Vặt tỉa lá già chân gốc', 'Thu hoạch chùm quả chín đỏ 90%']
      }
    ]
  }
];

export const INITIAL_VIETGAP_LOGS: VietGAPCropLog[] = [
  {
    id: 'vg-01',
    timestamp: '2026-10-07T07:30:00.000Z',
    zoneId: 'zone-a',
    activityType: 'BÓN PHÂN',
    materialName: 'Dinh dưỡng thủy canh A/B + Magie Sulfat (MgSO4.7H2O)',
    dosage: 'Nâng EC lên 2.3 mS/cm, MgSO4 1.8 g/L',
    phiDays: 0,
    actor: 'Hệ thống Hyper-automation (Rule: EC_AUTO_CYCLE_04)',
    harvestAllowedAfter: 'Thu hoạch an toàn ngay',
    safetyStatus: 'COMPLIANT',
    notes: 'Bù vi lượng Magie chống vàng gân lá, không tồn dư hóa chất.'
  },
  {
    id: 'vg-02',
    timestamp: '2026-10-06T15:00:00.000Z',
    zoneId: 'zone-b',
    activityType: 'PHUN VI SINH/BVTV',
    materialName: 'Nấm đối kháng Trichoderma harzianum + Tinh dầu Neem sinh học',
    dosage: 'Nồng độ 0.25%, phun mịn 15 lít/1,000m²',
    phiDays: 3,
    actor: 'Kỹ sư Phạm Văn Hùng (ID: OP-14)',
    harvestAllowedAfter: '2026-10-09T15:00:00.000Z',
    safetyStatus: 'COMPLIANT',
    notes: 'Phòng ngừa phấn trắng sinh học, đạt tiêu chuẩn VietGAP/GlobalGAP.'
  },
  {
    id: 'vg-03',
    timestamp: '2026-10-04T08:15:00.000Z',
    zoneId: 'zone-d',
    activityType: 'TƯỚI DƯỠNG',
    materialName: 'Dung dịch khoáng hữu cơ chiết xuất rong biển (Seaweed Extract)',
    dosage: 'Liều 1ml/L nước tưới nhỏ giọt',
    phiDays: 0,
    actor: 'Kỹ sư Trần Hữu Đạt (ID: OP-09)',
    harvestAllowedAfter: 'Thu hoạch an toàn ngay',
    safetyStatus: 'COMPLIANT',
    notes: 'Kích thích tích lũy đường Brix tự nhiên cho dưa lưới.'
  }
];

export const INITIAL_WEATHER_ALERTS: ExtremeWeatherAlert[] = [
  {
    id: 'ew-01',
    type: 'FROST_COLD',
    title: 'Cảnh Báo Sương Muối & Không Khí Lạnh Tăng Cường Vùng Cao',
    advanceWarningHours: 32, // >= 24h KPI T12
    forecastTime: 'Đêm mai 23:00 - Sáng sớm (09/10/2026)',
    severity: 'WARNING',
    description: 'Nhiệt độ ngoài trời dự báo hạ xuống 8.5°C, độ ẩm ngưng tụ đạt 95%. Nguy cơ đọng sương lạnh gây bỏng lá non và thui chột hoa dâu tây.',
    recommendedActions: [
      'Đóng kín rèm thông gió đỉnh và rèm vách từ 18:00',
      'Kích hoạt sưởi ấm hoặc bật đèn quang phổ bù nhiệt (Supplemental Heating)',
      'Bật quạt đối lưu HAF tốc độ thấp chống đọng giọt trên tán lá'
    ],
    autoMitigationArmed: true
  },
  {
    id: 'ew-02',
    type: 'HEATWAVE_40C',
    title: 'Dự Báo Nắng Nóng Gay Gắt & Bức Xạ Cực Đại (≥ 38°C)',
    advanceWarningHours: 28, // >= 24h KPI T12
    forecastTime: '11:00 - 15:30 Ngày 10/10/2026',
    severity: 'CRITICAL',
    description: 'Chỉ số UV đạt mức 11, bức xạ PAR ngoài trời > 1200 µmol/m²/s. Nguy cơ sốc nhiệt và cháy mép lá cây con.',
    recommendedActions: [
      'Kéo rèm cắt nắng 2 lớp phủ 70% từ 10:30',
      'Kích hoạt hệ thống phun sương làm mát vi áp suất 70 bar chu kỳ 5 phút/lần',
      'Tăng lưu lượng tưới nhỏ giọt làm mát vùng rễ'
    ],
    autoMitigationArmed: true
  }
];

export const INITIAL_RESOURCE_STATS: ResourceMeterStats = {
  waterFlowTotalM3: 142.8,
  waterFlowRateLph: 1240, // Lít/giờ
  energyTotalKwh: 385.4,
  currentPowerKw: 4.85,
  estCostVndPerKg: 2850 // VND tiền điện+nước/kg quả (nền tảng mini-ERP 2027)
};

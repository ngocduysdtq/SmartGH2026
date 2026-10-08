export type ZoneId = 'zone-a' | 'zone-b' | 'zone-c' | 'zone-d';

export interface GreenhouseZone {
  id: ZoneId;
  name: string;
  crop: string;
  variety: string;
  growthStage: string;
  areaSqM: number;
  plantCount: number;
  healthScore: number; // 0 - 100
  status: 'OPTIMAL' | 'WARNING' | 'ALERT';
  color: string;
}

export interface SensorMetrics {
  temperature: number; // °C
  humidity: number; // % RH
  co2: number; // ppm
  lightPPFD: number; // µmol/m²/s
  dli: number; // Daily Light Integral mol/m²/day
  soilMoisture: number; // % VWC
  ec: number; // mS/cm
  ph: number;
  irrigationPressure: number; // bar
  vpd: number; // Vapor Pressure Deficit (kPa)
  leafTemperature: number; // °C
}

export interface HeatmapPoint {
  id: string;
  x: number; // 0 - 100%
  y: number; // 0 - 100%
  zoneId: ZoneId;
  temperature: number;
  humidity: number;
  soilMoisture: number;
  status: 'normal' | 'hot' | 'cold' | 'dry' | 'wet';
}

export interface ActuatorDevice {
  id: string;
  name: string;
  category: 'FAN' | 'PUMP' | 'SHADE' | 'LIGHT' | 'MIST' | 'NUTRIENT';
  zoneId: ZoneId | 'ALL';
  state: 'ON' | 'OFF' | 'AUTO';
  powerLevel: number; // 0 - 100%
  runtimeTodayMinutes: number;
  lastActivated: string;
  protocol: 'MQTT' | 'Zigbee' | 'LoRaWAN' | 'Wi-Fi 7';
}

export interface IoTNodeDevice {
  id: string;
  nodeName: string;
  zone: string;
  protocol: 'MQTT v5.0' | 'LoRaWAN AS923' | 'Zigbee 3.0' | 'Wi-Fi 7 (802.11be)';
  batteryPercent: number;
  rssi: number; // dBm
  lastPingMs: number;
  status: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
  hardware: string;
  firmwareVersion: string;
}

export interface AutomationWorkflowRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  zoneId: ZoneId | 'ALL';
  trigger: {
    metric: keyof SensorMetrics;
    operator: '>' | '<' | '>=' | '<=';
    threshold: number;
  };
  condition?: {
    metric: keyof SensorMetrics;
    operator: '>' | '<' | '>=' | '<=';
    threshold: number;
  };
  actions: {
    actuatorCategory: ActuatorDevice['category'];
    action: 'TURN_ON' | 'TURN_OFF' | 'SET_LEVEL';
    level?: number;
    durationMinutes: number;
  }[];
  executionsToday: number;
  lastTriggered?: string;
}

export interface FarmAssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  source?: string;
  attachments?: string[];
  recommendationActions?: string[];
}

export interface BlockchainBlock {
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

export interface YieldForecastData {
  crop: string;
  zoneId: ZoneId;
  projectedHarvestDate: string;
  estimatedYieldTons: number;
  yieldIncreasePercent: number; // vs traditional farming (target >15%)
  brixAverage: number;
  gradeARate: number;
  waterSavedM3: number; // target >20%
  energySavedKwh: number;
}

export interface SystemRisk {
  id: string;
  name: string;
  severity: 'Cao' | 'Trung bình' | 'Thấp';
  solution: string;
  status: 'MITIGATED' | 'MONITORING' | 'ACTIVE';
}

export interface RoadmapPhase {
  phase: string;
  title: string;
  quarter: string;
  months: string;
  milestones: string[];
  completed: boolean;
  progressPercent: number;
}

export type ClimateProfile = 'TROPICAL' | 'ARID' | 'COLD';

export interface CropGrowthStage {
  stageName: string;
  durationDays: number;
  ecTarget: number;
  phTarget: number;
  vpdTarget: number;
  soilMoistureTarget: number;
  irrigationStrategy: string;
  keyActions: string[];
}

export interface CropStagePlaybook {
  id: string;
  cropName: string;
  variety: string;
  icon: string;
  totalCycleDays: number;
  stages: CropGrowthStage[];
  appliedToZone?: ZoneId;
  author?: string;
  verified?: boolean;
  source?: 'SYSTEM_DEFAULT' | 'EXPERT_IMPORT' | 'CUSTOM_CREATED' | 'GENAI_EXTRACTED';
}

export interface VietGAPCropLog {
  id: string;
  timestamp: string;
  zoneId: ZoneId;
  activityType: 'TƯỚI DƯỠNG' | 'BÓN PHÂN' | 'PHUN VI SINH/BVTV' | 'TỈA TÁN' | 'THU HOẠCH' | 'KIỂM ĐỊNH';
  materialName: string;
  dosage: string;
  phiDays: number; // Pre-Harvest Interval (Thời gian cách ly)
  actor: string;
  harvestAllowedAfter: string;
  safetyStatus: 'COMPLIANT' | 'WARNING';
  notes: string;
}

export interface ExtremeWeatherAlert {
  id: string;
  type: 'TYPHOON' | 'HEATWAVE_40C' | 'FROST_COLD' | 'STORM_WIND';
  title: string;
  advanceWarningHours: number; // >= 24h (KPI T12)
  forecastTime: string;
  severity: 'WARNING' | 'CRITICAL';
  description: string;
  recommendedActions: string[];
  autoMitigationArmed: boolean;
}

export interface ResourceMeterStats {
  waterFlowTotalM3: number;
  waterFlowRateLph: number;
  energyTotalKwh: number;
  currentPowerKw: number;
  estCostVndPerKg: number;
}

import React, { useState, useEffect } from 'react';
import {
  GreenhouseZone,
  SensorMetrics,
  HeatmapPoint,
  ActuatorDevice,
  IoTNodeDevice,
  AutomationWorkflowRule,
  ClimateProfile,
  VietGAPCropLog,
  ExtremeWeatherAlert,
  ResourceMeterStats
} from './types/greenhouse';
import {
  INITIAL_ZONES,
  INITIAL_SENSOR_METRICS,
  INITIAL_HEATMAP_POINTS,
  INITIAL_ACTUATORS,
  INITIAL_IOT_NODES,
  INITIAL_RULES,
  YIELD_FORECASTS,
  ROADMAP_PHASES,
  SYSTEM_RISKS,
  CROP_PLAYBOOKS,
  INITIAL_VIETGAP_LOGS,
  INITIAL_WEATHER_ALERTS,
  INITIAL_RESOURCE_STATS
} from './mock/greenhouseData';

import { Header } from './components/Header';
import { RealTimeDashboard } from './components/RealTimeDashboard';
import { DigitalTwin3D } from './components/DigitalTwin3D';
import { GenAIAssistant } from './components/GenAIAssistant';
import { HyperAutomationBuilder } from './components/HyperAutomationBuilder';
import { AnalyticsPrediction } from './components/AnalyticsPrediction';
import { BlockchainLedger } from './components/BlockchainLedger';
import { IoTDeviceManager } from './components/IoTDeviceManager';
import { ArchitectureAndRoadmap } from './components/ArchitectureAndRoadmap';
import { CropPlaybooksAndVietGAP } from './components/CropPlaybooksAndVietGAP';
import { ExtremeWeatherAndResourceMeters } from './components/ExtremeWeatherAndResourceMeters';
import { PlanReviewAudit } from './components/PlanReviewAudit';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [zones, setZones] = useState<GreenhouseZone[]>(INITIAL_ZONES);
  const [selectedZoneId, setSelectedZoneId] = useState<GreenhouseZone['id']>('zone-a');

  const [metricsMap, setMetricsMap] = useState<Record<string, SensorMetrics>>(INITIAL_SENSOR_METRICS);
  const [heatmapPoints, setHeatmapPoints] = useState<HeatmapPoint[]>(INITIAL_HEATMAP_POINTS);
  const [actuators, setActuators] = useState<ActuatorDevice[]>(INITIAL_ACTUATORS);
  const [iotNodes, setIotNodes] = useState<IoTNodeDevice[]>(INITIAL_IOT_NODES);
  const [rules, setRules] = useState<AutomationWorkflowRule[]>(INITIAL_RULES);
  const [playbooks, setPlaybooks] = useState(CROP_PLAYBOOKS);
  const [vietgapLogs, setVietgapLogs] = useState<VietGAPCropLog[]>(INITIAL_VIETGAP_LOGS);
  const [weatherAlerts, setWeatherAlerts] = useState<ExtremeWeatherAlert[]>(INITIAL_WEATHER_ALERTS);
  const [resourceStats, setResourceStats] = useState<ResourceMeterStats>(INITIAL_RESOURCE_STATS);
  const [climateProfile, setClimateProfile] = useState<ClimateProfile>('TROPICAL');

  const [simulationEvent, setSimulationEvent] = useState<'HEATWAVE' | 'DRIP_CLOG' | 'FUNGAL_RISK' | null>(null);
  const [latencyMs, setLatencyMs] = useState<number>(184);
  const [uptimePercent, setUptimePercent] = useState<number>(99.98);

  const selectedZone = zones.find((z) => z.id === selectedZoneId) || zones[0];
  const currentMetrics = metricsMap[selectedZoneId] || INITIAL_SENSOR_METRICS['zone-a'];

  // Actuator active states for 3D model & visual feedback
  const fanActuator = actuators.find((a) => a.category === 'FAN');
  const mistActuator = actuators.find((a) => a.category === 'MIST');
  const ledActuator = actuators.find((a) => a.category === 'LIGHT');
  const shadeActuator = actuators.find((a) => a.category === 'SHADE');

  const fanActive = fanActuator?.state === 'ON' || fanActuator?.state === 'AUTO';
  const mistActive = mistActuator?.state === 'ON';
  const ledActive = ledActuator?.state === 'ON' || ledActuator?.state === 'AUTO';
  const shadePercent = shadeActuator ? shadeActuator.powerLevel : 40;

  // Real-time gentle sensor telemetry jitter to simulate live stream
  useEffect(() => {
    const interval = setInterval(() => {
      if (simulationEvent) return; // Do not jitter during active simulated events

      setMetricsMap((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((zId) => {
          const m = next[zId];
          const tempDelta = (Math.random() - 0.5) * 0.2;
          const humDelta = (Math.random() - 0.5) * 0.5;
          const co2Delta = Math.floor((Math.random() - 0.5) * 8);
          const soilDelta = (Math.random() - 0.5) * 0.2;

          next[zId] = {
            ...m,
            temperature: Math.round((m.temperature + tempDelta) * 10) / 10,
            humidity: Math.round((m.humidity + humDelta) * 10) / 10,
            co2: Math.max(650, Math.min(1300, m.co2 + co2Delta)),
            soilMoisture: Math.round((m.soilMoisture + soilDelta) * 10) / 10,
          };
        });
        return next;
      });

      // Fluctuate latency subtly between 140ms and 210ms (<500ms target)
      setLatencyMs(Math.floor(140 + Math.random() * 60));
    }, 4000);

    return () => clearInterval(interval);
  }, [simulationEvent]);

  // Handler for Sandbox Simulations
  const handleTriggerSimulation = (type: 'HEATWAVE' | 'DRIP_CLOG' | 'FUNGAL_RISK' | 'RESET') => {
    if (type === 'RESET') {
      setSimulationEvent(null);
      setMetricsMap(INITIAL_SENSOR_METRICS);
      setZones(INITIAL_ZONES);
      setActuators(INITIAL_ACTUATORS);
      return;
    }

    setSimulationEvent(type);

    if (type === 'HEATWAVE') {
      // Heatwave event: Temp spikes to 34.5°C, Light PPFD spikes, Hyper-automation reacts
      setMetricsMap((prev) => ({
        ...prev,
        [selectedZoneId]: {
          ...prev[selectedZoneId],
          temperature: 34.5,
          humidity: 52,
          vpd: 1.85,
          soilMoisture: 33,
          leafTemperature: 33.2,
        },
      }));
      // Auto-trigger fan and mist
      setActuators((prev) =>
        prev.map((a) => {
          if (a.category === 'FAN') return { ...a, state: 'ON', powerLevel: 100 };
          if (a.category === 'MIST') return { ...a, state: 'ON', powerLevel: 90 };
          if (a.category === 'SHADE') return { ...a, powerLevel: 75 };
          return a;
        })
      );
    } else if (type === 'DRIP_CLOG') {
      // Drip clog: pressure drops, soil moisture drops to 26%
      setMetricsMap((prev) => ({
        ...prev,
        [selectedZoneId]: {
          ...prev[selectedZoneId],
          irrigationPressure: 0.65,
          soilMoisture: 26,
        },
      }));
      setZones((prev) =>
        prev.map((z) => (z.id === selectedZoneId ? { ...z, status: 'WARNING', healthScore: 82 } : z))
      );
    } else if (type === 'FUNGAL_RISK') {
      // Fungal bloom risk: humidity rises to 88%, VPD drops to 0.45 kPa
      setMetricsMap((prev) => ({
        ...prev,
        [selectedZoneId]: {
          ...prev[selectedZoneId],
          humidity: 88,
          vpd: 0.45,
          temperature: 24.0,
        },
      }));
      setZones((prev) =>
        prev.map((z) => (z.id === selectedZoneId ? { ...z, status: 'WARNING', healthScore: 79 } : z))
      );
    }
  };

  // Actuator toggle
  const handleToggleActuator = (id: string) => {
    setActuators((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const nextState: ActuatorDevice['state'] = a.state === 'ON' ? 'OFF' : a.state === 'OFF' ? 'AUTO' : 'ON';
        return { ...a, state: nextState };
      })
    );
  };

  // Actuator power level
  const handleSetActuatorLevel = (id: string, level: number) => {
    setActuators((prev) => prev.map((a) => (a.id === id ? { ...a, powerLevel: level } : a)));
  };

  // Rules handlers
  const handleToggleRule = (ruleId: string) => {
    setRules((prev) => prev.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r)));
  };

  const handleAddRule = (newRule: AutomationWorkflowRule) => {
    setRules((prev) => [newRule, ...prev]);
  };

  const handleDeleteRule = (ruleId: string) => {
    setRules((prev) => prev.filter((r) => r.id !== ruleId));
  };

  // IoT devices handler
  const handleAddDevice = (dev: IoTNodeDevice) => {
    setIotNodes((prev) => [dev, ...prev]);
  };

  const handleDeleteDevice = (id: string) => {
    setIotNodes((prev) => prev.filter((d) => d.id !== id));
  };

  // Playbooks & VietGAP handler
  const handleApplyPlaybook = (playbookId: string) => {
    const pb = playbooks.find((p) => p.id === playbookId);
    if (!pb || !pb.stages[0]) return;
    const firstStage = pb.stages[0];
    setMetricsMap((prev) => ({
      ...prev,
      [selectedZoneId]: {
        ...prev[selectedZoneId],
        ec: firstStage.ecTarget,
        ph: firstStage.phTarget,
        vpd: firstStage.vpdTarget,
        soilMoisture: firstStage.soilMoistureTarget,
      },
    }));
  };

  const handleAddPlaybook = (newPb: any) => {
    setPlaybooks((prev) => [newPb, ...prev]);
  };

  const handleAddVietGAPLog = (log: VietGAPCropLog) => {
    setVietgapLogs((prev) => [log, ...prev]);
  };

  const handleArmMitigation = (alertId: string) => {
    setWeatherAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, autoMitigationArmed: true } : a))
    );
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Header & Sub-navigation */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        zones={zones}
        selectedZone={selectedZone}
        onSelectZone={setSelectedZoneId}
        onTriggerSimulation={handleTriggerSimulation}
        simulationEvent={simulationEvent}
        latencyMs={latencyMs}
        uptimePercent={uptimePercent}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Tab 1: Dashboard Real-time IoT */}
        {currentTab === 'dashboard' && (
          <RealTimeDashboard
            selectedZone={selectedZone}
            metrics={currentMetrics}
            heatmapPoints={heatmapPoints}
            actuators={actuators}
            onToggleActuator={handleToggleActuator}
            onSetActuatorLevel={handleSetActuatorLevel}
            onSelectZone={setSelectedZoneId}
          />
        )}

        {/* Tab 2: Digital Twin 3D Interactive View */}
        {currentTab === 'digital-twin' && (
          <div className="space-y-4">
            <DigitalTwin3D
              selectedZone={selectedZone}
              onSelectZone={setSelectedZoneId}
              zones={zones}
              metrics={currentMetrics}
              fanActive={fanActive}
              mistActive={mistActive}
              ledActive={ledActive}
              shadePercent={shadePercent}
            />

            {/* Quick Microclimate Strip Under 3D Canvas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Nhiệt độ 3D</span>
                <span className="text-base font-bold font-mono text-white">{currentMetrics.temperature}°C</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Độ ẩm RH</span>
                <span className="text-base font-bold font-mono text-sky-400">{currentMetrics.humidity}%</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Chỉ số VPD</span>
                <span className="text-base font-bold font-mono text-fuchsia-400">{currentMetrics.vpd} kPa</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Độ ẩm đất VWC</span>
                <span className="text-base font-bold font-mono text-emerald-400">{currentMetrics.soilMoisture}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Crop-stage Playbooks (P7) & VietGAP Logs (P6) */}
        {currentTab === 'playbooks' && (
          <CropPlaybooksAndVietGAP
            playbooks={playbooks}
            selectedZone={selectedZone}
            onApplyPlaybook={handleApplyPlaybook}
            onAddPlaybook={handleAddPlaybook}
            logs={vietgapLogs}
            onAddLog={handleAddVietGAPLog}
          />
        )}

        {/* Tab 4: Extreme Weather Early Warning (P2 / T12) & Resource Meters */}
        {currentTab === 'weather-resources' && (
          <ExtremeWeatherAndResourceMeters
            alerts={weatherAlerts}
            resourceStats={resourceStats}
            selectedZone={selectedZone}
            onArmMitigation={handleArmMitigation}
          />
        )}

        {/* Tab 5: GenAI Farm Assistant & Leaf Disease Vision */}
        {currentTab === 'genai' && (
          <GenAIAssistant
            selectedZone={selectedZone}
            metrics={currentMetrics}
          />
        )}

        {/* Tab 6: Hyper-automation Visual Workflow Builder */}
        {currentTab === 'automation' && (
          <HyperAutomationBuilder
            rules={rules}
            onToggleRule={handleToggleRule}
            onAddRule={handleAddRule}
            onDeleteRule={handleDeleteRule}
            currentMetrics={currentMetrics}
            zones={zones}
          />
        )}

        {/* Tab 7: Analytics & ML Yield Prediction */}
        {currentTab === 'analytics' && (
          <AnalyticsPrediction
            yieldData={YIELD_FORECASTS}
            selectedZone={selectedZone}
            metrics={currentMetrics}
          />
        )}

        {/* Tab 8: Blockchain Farm-to-Fork Traceability */}
        {currentTab === 'blockchain' && (
          <BlockchainLedger
            selectedZone={selectedZone}
          />
        )}

        {/* Tab 9: IoT Device & Network Manager */}
        {currentTab === 'devices' && (
          <IoTDeviceManager
            devices={iotNodes}
            onAddDevice={handleAddDevice}
            onDeleteDevice={handleDeleteDevice}
            latencyMs={latencyMs}
          />
        )}

        {/* Tab 10: System Architecture, Roadmap 2026 & Risks */}
        {currentTab === 'roadmap' && (
          <ArchitectureAndRoadmap
            roadmap={ROADMAP_PHASES}
            risks={SYSTEM_RISKS}
            latencyMs={latencyMs}
            uptimePercent={uptimePercent}
          />
        )}

        {/* Tab 11: Plan Review Audit & CTO Recommendations Matrix */}
        {currentTab === 'audit' && (
          <PlanReviewAudit
            currentClimateProfile={climateProfile}
            onChangeClimateProfile={setClimateProfile}
          />
        )}
      </main>

      {/* Global AgriTech Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>SmartGH-2026 Ecosystem • Next-Gen Digital Agriculture</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">TinyML Edge AI + Gemini 3.8 Flash RAG</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>Uptime: {uptimePercent}%</span>
            <span>Latency: {latencyMs}ms</span>
            <span className="text-emerald-400">GlobalGAP Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

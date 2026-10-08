import React, { useState } from 'react';
import {
  AutomationWorkflowRule,
  GreenhouseZone,
  SensorMetrics,
  ActuatorDevice
} from '../types/greenhouse';
import {
  Cpu,
  Plus,
  Play,
  CheckCircle2,
  Trash2,
  Sliders,
  Clock,
  ArrowRight,
  Sparkles,
  Zap,
  Activity,
  Layers,
  Wind,
  Droplets,
  Sun
} from 'lucide-react';

interface HyperAutomationBuilderProps {
  rules: AutomationWorkflowRule[];
  onToggleRule: (ruleId: string) => void;
  onAddRule: (rule: AutomationWorkflowRule) => void;
  onDeleteRule: (ruleId: string) => void;
  currentMetrics: SensorMetrics;
  zones: GreenhouseZone[];
}

export const HyperAutomationBuilder: React.FC<HyperAutomationBuilderProps> = ({
  rules,
  onToggleRule,
  onAddRule,
  onDeleteRule,
  currentMetrics,
  zones,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  // Form State for new custom rule
  const [ruleName, setRuleName] = useState('');
  const [triggerMetric, setTriggerMetric] = useState<keyof SensorMetrics>('soilMoisture');
  const [triggerOp, setTriggerOp] = useState<'<' | '>' | '<=' | '>='>('<');
  const [triggerVal, setTriggerVal] = useState<number>(30);

  const [hasCondition, setHasCondition] = useState<boolean>(true);
  const [conditionMetric, setConditionMetric] = useState<keyof SensorMetrics>('humidity');
  const [conditionOp, setConditionOp] = useState<'<' | '>' | '<=' | '>='>('>');
  const [conditionVal, setConditionVal] = useState<number>(80);

  const [action1Actuator, setAction1Actuator] = useState<ActuatorDevice['category']>('FAN');
  const [action1Duration, setAction1Duration] = useState<number>(10);
  const [action1Level, setAction1Level] = useState<number>(85);

  const [action2Actuator, setAction2Actuator] = useState<ActuatorDevice['category']>('PUMP');
  const [action2Duration, setAction2Duration] = useState<number>(5);
  const [action2Level, setAction2Level] = useState<number>(80);

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName.trim()) return;

    const newRule: AutomationWorkflowRule = {
      id: `rule-${Date.now()}`,
      name: ruleName,
      description: `NẾU (${metricLabel(triggerMetric)} ${triggerOp} ${triggerVal}${hasCondition ? ` VÀ ${metricLabel(conditionMetric)} ${conditionOp} ${conditionVal}` : ''}) THÌ (${actuatorLabel(action1Actuator)} ${action1Duration} phút RỒI ${actuatorLabel(action2Actuator)} ${action2Duration} phút)`,
      enabled: true,
      zoneId: 'zone-a',
      trigger: {
        metric: triggerMetric,
        operator: triggerOp,
        threshold: triggerVal,
      },
      condition: hasCondition
        ? {
            metric: conditionMetric,
            operator: conditionOp,
            threshold: conditionVal,
          }
        : undefined,
      actions: [
        {
          actuatorCategory: action1Actuator,
          action: 'TURN_ON',
          level: action1Level,
          durationMinutes: action1Duration,
        },
        {
          actuatorCategory: action2Actuator,
          action: 'TURN_ON',
          level: action2Level,
          durationMinutes: action2Duration,
        },
      ],
      executionsToday: 0,
      lastTriggered: 'Chưa kích hoạt',
    };

    onAddRule(newRule);
    setIsCreating(false);
    setRuleName('');
  };

  const metricLabel = (m: keyof SensorMetrics) => {
    switch (m) {
      case 'temperature': return 'Nhiệt độ';
      case 'humidity': return 'Độ ẩm không khí';
      case 'soilMoisture': return 'Độ ẩm đất';
      case 'co2': return 'Nồng độ CO2';
      case 'lightPPFD': return 'Ánh sáng PPFD';
      case 'vpd': return 'Chỉ số VPD';
      case 'ec': return 'EC Dinh dưỡng';
      case 'ph': return 'Độ pH';
      default: return m;
    }
  };

  const actuatorLabel = (a: ActuatorDevice['category']) => {
    switch (a) {
      case 'FAN': return 'Bật Quạt hút HAF';
      case 'PUMP': return 'Tưới nhỏ giọt';
      case 'MIST': return 'Phun sương làm mát';
      case 'SHADE': return 'Điều chỉnh mái che';
      case 'LIGHT': return 'Đèn LED quang phổ';
      case 'NUTRIENT': return 'Châm phân vi lượng Bể A/B';
    }
  };

  // Test current rules against live sensor readings
  const handleTestRunRule = (rule: AutomationWorkflowRule) => {
    const triggerCurrent = currentMetrics[rule.trigger.metric];
    let triggerPassed = false;
    if (rule.trigger.operator === '<') triggerPassed = triggerCurrent < rule.trigger.threshold;
    if (rule.trigger.operator === '>') triggerPassed = triggerCurrent > rule.trigger.threshold;
    if (rule.trigger.operator === '<=') triggerPassed = triggerCurrent <= rule.trigger.threshold;
    if (rule.trigger.operator === '>=') triggerPassed = triggerCurrent >= rule.trigger.threshold;

    let conditionPassed = true;
    if (rule.condition) {
      const condCurrent = currentMetrics[rule.condition.metric];
      if (rule.condition.operator === '<') conditionPassed = condCurrent < rule.condition.threshold;
      if (rule.condition.operator === '>') conditionPassed = condCurrent > rule.condition.threshold;
      if (rule.condition.operator === '<=') conditionPassed = condCurrent <= rule.condition.threshold;
      if (rule.condition.operator === '>=') conditionPassed = condCurrent >= rule.condition.threshold;
    }

    if (triggerPassed && conditionPassed) {
      setTestResult(`✅ [KÍCH HOẠT THÀNH CÔNG] Kịch bản "${rule.name}" thỏa mãn điều kiện thực tế: ${metricLabel(rule.trigger.metric)} hiện tại (${triggerCurrent}) ${rule.trigger.operator} ${rule.trigger.threshold}! Hệ thống gửi lệnh MQTT điều khiển ${rule.actions.map(a => actuatorLabel(a.actuatorCategory)).join(' và ')}.`);
    } else {
      setTestResult(`ℹ️ [CHƯA ĐỦ ĐIỀU KIỆN KÍCH HOẠT] Kịch bản "${rule.name}": Giá trị cảm biến hiện tại đang trong khoảng an toàn (${metricLabel(rule.trigger.metric)}: ${triggerCurrent}), kịch bản ở chế độ chờ.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Cpu className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">Hyper-automation Rule Engine 2026</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tự động hóa toàn diện: Thu thập dữ liệu sensor → TinyML phân tích → Ra quyết định → Điều khiển van/bơm/mái che tức thì không cần can thiệp thủ công.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/50 hover:scale-[1.02] transition cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isCreating ? 'Đóng Trình Tạo' : 'Tạo Kịch Bản Mới'}</span>
        </button>
      </div>

      {/* Test Execution Result Alert */}
      {testResult && (
        <div className="p-3.5 rounded-xl bg-slate-900 border border-indigo-500/40 text-xs text-indigo-200 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{testResult}</span>
          </div>
          <button onClick={() => setTestResult(null)} className="text-slate-400 hover:text-white ml-2">✕</button>
        </div>
      )}

      {/* Visual Workflow Builder Form (When active) */}
      {isCreating && (
        <form onSubmit={handleCreateRule} className="p-5 rounded-2xl bg-slate-900/95 border border-indigo-500/40 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              Thiết Kế Kịch Bản Tự Động Hóa (IF - AND - THEN Flow)
            </h3>
            <span className="text-[11px] text-slate-400">Trực quan hóa khối điều khiển</span>
          </div>

          <div>
            <label className="text-xs text-slate-300 font-medium">Tên kịch bản:</label>
            <input
              type="text"
              required
              placeholder="VD: Cân Bằng Ẩm Độ Đất & Thông Gió Khẩn Cấp"
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Node Visual Chain */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Block 1: TRIGGER (NẾU) */}
            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 space-y-2">
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> 1. TRIGGER (NẾU)
              </div>
              <div>
                <label className="text-[10px] text-slate-400">Biến số cảm biến:</label>
                <select
                  value={triggerMetric}
                  onChange={(e) => setTriggerMetric(e.target.value as keyof SensorMetrics)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                >
                  <option value="soilMoisture">Độ ẩm đất (% VWC)</option>
                  <option value="temperature">Nhiệt độ không khí (°C)</option>
                  <option value="humidity">Độ ẩm không khí (% RH)</option>
                  <option value="vpd">Chỉ số VPD (kPa)</option>
                  <option value="co2">Nồng độ CO2 (ppm)</option>
                  <option value="lightPPFD">Ánh sáng PPFD (µmol)</option>
                  <option value="ec">EC Dinh dưỡng</option>
                </select>
              </div>
              <div className="flex gap-2">
                <select
                  value={triggerOp}
                  onChange={(e) => setTriggerOp(e.target.value as any)}
                  className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white w-20"
                >
                  <option value="<">&lt; Nhỏ hơn</option>
                  <option value=">">&gt; Lớn hơn</option>
                  <option value="<=">&le; Nhỏ hơn hoặc bằng</option>
                  <option value=">=">&ge; Lớn hơn hoặc bằng</option>
                </select>
                <input
                  type="number"
                  step="any"
                  value={triggerVal}
                  onChange={(e) => setTriggerVal(parseFloat(e.target.value))}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                />
              </div>
            </div>

            {/* Block 2: CONDITION (VÀ) */}
            <div className="p-4 rounded-xl bg-slate-950 border border-sky-500/40 space-y-2">
              <div className="text-[11px] font-bold text-sky-400 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-400" /> 2. ĐIỀU KIỆN (VÀ)
                </span>
                <input
                  type="checkbox"
                  checked={hasCondition}
                  onChange={(e) => setHasCondition(e.target.checked)}
                  className="accent-sky-500"
                />
              </div>
              {hasCondition ? (
                <>
                  <div>
                    <label className="text-[10px] text-slate-400">Biến số thứ hai:</label>
                    <select
                      value={conditionMetric}
                      onChange={(e) => setConditionMetric(e.target.value as keyof SensorMetrics)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    >
                      <option value="humidity">Độ ẩm không khí (% RH)</option>
                      <option value="temperature">Nhiệt độ không khí (°C)</option>
                      <option value="soilMoisture">Độ ẩm đất (% VWC)</option>
                      <option value="lightPPFD">Ánh sáng PPFD (µmol)</option>
                      <option value="vpd">Chỉ số VPD (kPa)</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={conditionOp}
                      onChange={(e) => setConditionOp(e.target.value as any)}
                      className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white w-20"
                    >
                      <option value=">">&gt; Lớn hơn</option>
                      <option value="<">&lt; Nhỏ hơn</option>
                      <option value=">=">&ge; Lớn hơn hoặc bằng</option>
                      <option value="<=">&le; Nhỏ hơn hoặc bằng</option>
                    </select>
                    <input
                      type="number"
                      step="any"
                      value={conditionVal}
                      onChange={(e) => setConditionVal(parseFloat(e.target.value))}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                </>
              ) : (
                <div className="text-xs text-slate-500 italic pt-4">Bỏ qua điều kiện bổ sung</div>
              )}
            </div>

            {/* Block 3: ACTIONS (THÌ & RỒI) */}
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-2">
              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> 3. HÀNH ĐỘNG (THÌ... RỒI...)
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Hành động 1:</span>
                  <span>{action1Duration} phút</span>
                </div>
                <div className="flex gap-1.5">
                  <select
                    value={action1Actuator}
                    onChange={(e) => setAction1Actuator(e.target.value as any)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-white"
                  >
                    <option value="FAN">Bật Quạt Hút HAF</option>
                    <option value="PUMP">Tưới Nhỏ Giọt</option>
                    <option value="MIST">Phun Sương Làm Mát</option>
                    <option value="SHADE">Điều Chỉnh Mái Che</option>
                  </select>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={action1Duration}
                    onChange={(e) => setAction1Duration(parseInt(e.target.value, 10))}
                    className="w-16 bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Hành động 2 (RỒI):</span>
                  <span>{action2Duration} phút</span>
                </div>
                <div className="flex gap-1.5">
                  <select
                    value={action2Actuator}
                    onChange={(e) => setAction2Actuator(e.target.value as any)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-white"
                  >
                    <option value="PUMP">Tưới Nhỏ Giọt</option>
                    <option value="FAN">Bật Quạt Hút HAF</option>
                    <option value="MIST">Phun Sương Làm Mát</option>
                    <option value="NUTRIENT">Châm Phân Vi Lượng</option>
                  </select>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={action2Duration}
                    onChange={(e) => setAction2Duration(parseInt(e.target.value, 10))}
                    className="w-16 bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition shadow-lg"
            >
              Lưu &amp; Kích Hoạt Kịch Bản
            </button>
          </div>
        </form>
      )}

      {/* Rules Active List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rules.map((rule) => {
          return (
            <div
              key={rule.id}
              className={`p-4 rounded-2xl border transition shadow-lg ${
                rule.enabled
                  ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-950/60 border-slate-900 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h4 className="text-sm font-bold text-white">{rule.name}</h4>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 font-mono text-emerald-400">
                      <Clock className="w-3 h-3" /> Đã chạy hôm nay: {rule.executionsToday} lần
                    </span>
                    <span>•</span>
                    <span>Gần nhất: {rule.lastTriggered}</span>
                  </div>
                </div>

                {/* Enable / Disable Toggle Switch */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleRule(rule.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      rule.enabled
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {rule.enabled ? 'ĐANG CHẠY' : 'TẠM DỪNG'}
                  </button>
                  <button
                    onClick={() => onDeleteRule(rule.id)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 transition"
                    title="Xóa kịch bản"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Rule Visual Flow Sentence */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 space-y-1.5 my-3">
                <div className="font-mono text-emerald-400/90 leading-relaxed">
                  {rule.description}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                <span className="text-[11px] text-slate-500">Khu vực: {rule.zoneId.toUpperCase()}</span>
                <button
                  onClick={() => handleTestRunRule(rule)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-700/60 text-indigo-300 text-xs font-medium flex items-center gap-1.5 transition"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Chạy Thử Nghiệm Ngay</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

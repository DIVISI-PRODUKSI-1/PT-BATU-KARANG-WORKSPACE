export type ProductionType = 'SKM' | 'SKT' | 'SPM'; // Sigaret Kretek Mesin, Sigaret Kretek Tangan, Sigaret Putih Mesin

export type MachineStatus = 'RUNNING' | 'IDLE' | 'MAINTENANCE' | 'ALERT';

export type ShiftName = 'SHIFT_1_PAGI' | 'SHIFT_2_SIANG' | 'SHIFT_3_MALAM';

export interface CigaretteProduct {
  id: string;
  code: string;
  name: string;
  type: ProductionType;
  sticksPerPack: number; // 12, 16, 20
  packsPerSlop: number;  // 10
  slopsPerBal: number;   // 20
  targetSpeedBpm?: number; // batang per menit (untuk mesin)
  targetSticksPerShift: number;
  exciseTariffPerStick: number; // Rp per batang cukai
  retailPriceHJE: number; // Harga Jual Eceran per bungkus
  exciseStampSeries: string; // e.g. "SERI-II-SKM-2026"
}

export interface MachineTelemetry {
  id: string;
  code: string;
  name: string;
  lineId: string;
  lineName: string;
  type: 'MAKER' | 'PACKER' | 'FILTER_ASSEMBLER' | 'ROLLING_BENCH';
  category: ProductionType;
  status: MachineStatus;
  currentSpeedBpm: number; // Batang / Bungkus per menit
  targetSpeedBpm: number;
  activeProduct: string;
  operatorInCharge: string;
  uptimeMinutes: number;
  downtimeMinutes: number;
  rejectSticksCount: number;
  outputSticksCount: number;
  oee: {
    availability: number; // 0 - 100%
    performance: number;  // 0 - 100%
    quality: number;      // 0 - 100%
    overall: number;      // 0 - 100%
  };
  temperatureC?: number;
  tobaccoMoisturePct?: number; // standard 12.5% - 13.5%
  lastIssue?: string;
  updatedAt: string;
}

export interface ProductionLine {
  id: string;
  name: string;
  type: ProductionType;
  capacityPerShift: number; // in sticks
  currentShiftOutput: number;
  targetShiftOutput: number;
  oeeScore: number;
  activeStaffCount: number; // pelinting & mandor untuk SKT, operator untuk SKM
  machines: MachineTelemetry[];
}

export interface RawMaterialStock {
  id: string;
  code: string;
  name: string;
  category: 'TEMBAKAU' | 'CENGKEH' | 'SAUS_FLAVOR' | 'PAPIR_BOBBIN' | 'FILTER_TOW' | 'ALUMINUM_FOIL' | 'KARTON_PACK';
  stockOnHand: number;
  unit: string;
  minThreshold: number;
  dailyConsumptionRate: number;
  estimatedDaysLeft: number;
  supplierOrigin: string;
  moistureStandardPct?: string;
  status: 'SAFE' | 'WARNING' | 'CRITICAL';
}

export interface ExciseStampInventory {
  id: string;
  stampCode: string;
  series: string;
  applicableProduct: string;
  tariffPerStick: number;
  sheetsInStock: number; // lembar pita cukai
  stampsPerSheet: number; // e.g. 120 keping per lembar
  totalStampsOnHand: number; // keping pita cukai
  usedTodayStamps: number;
  damagedStampsAffkir: number; // rusak saat penempelan mesin (wajib dicatat di CK-4)
  remainingStamps: number;
  reconciliationStatus: 'MATCHED' | 'DISCREPANCY' | 'PENDING_AUDIT';
  discrepancyCount: number;
  lastAuditTimestamp: string;
}

export interface ShiftReport {
  id: string;
  reportNumber: string;
  date: string;
  shift: ShiftName;
  supervisor: string;
  aiVerifier: string;
  totalSticksProduced: number;
  totalPacksProduced: number;
  totalBalesProduced: number;
  totalRejectSticks: number;
  overallPlantOEE: number;
  exciseStampsReconciled: boolean;
  tobaccoConsumedKg: number;
  cloveConsumedKg: number;
  sauceConsumedLiter: number;
  majorIncidents: string[];
  aiExecutiveSummary: string;
  status: 'DRAFT' | 'VERIFIED_AI' | 'APPROVED_MANAGEMENT';
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: string;
  text: string;
  metadata?: {
    actionType?: 'SHIFT_REPORT' | 'ANOMALY_ALERT' | 'EXCISE_AUDIT' | 'OEE_DIAGNOSIS' | 'SQL_QUERY';
    dataPayload?: any;
    confidenceScore?: number;
  };
}

export interface AIAutonomousTask {
  id: string;
  timeScheduled: string;
  taskTitle: string;
  description: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'SCHEDULED';
  resultSummary: string;
  targetModule: 'CK-4 Bea Cukai' | 'OEE Monitor' | 'Material Forecast' | 'Absensi SKT' | 'Daily Wrap-up';
}

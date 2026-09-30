export interface FactoryAlert {
  id: string;
  machineId: string;
  machineCode: string;
  machineName: string;
  lineName: string;
  alertType: 'LOW_OEE' | 'SUDDEN_DOWNTIME' | 'CRITICAL_SPEED_DROP';
  severity: 'CRITICAL' | 'WARNING';
  title: string;
  message: string;
  currentOee?: number;
  downtimeMinutes?: number;
  aiDiagnosis: string;
  timestamp: string;
  acknowledged: boolean;
}

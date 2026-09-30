export interface HourlyPerformanceData {
  time: string; // e.g. "06:00", "07:00", etc.
  actualSticks: number;
  targetSticks: number;
  oeeAvailability: number;
  oeePerformance: number;
  oeeQuality: number;
  overallOee: number;
  skm1Sticks: number;
  skm2Sticks: number;
  sktSticks: number;
  notes?: string;
}

export interface DailyPerformanceData {
  date: string;
  day: string;
  totalSticks: number;
  targetSticks: number;
  overallOee: number;
  rejectRatePct: number;
  cukaiPacks: number;
}

export const HOURLY_PERFORMANCE_DATA: HourlyPerformanceData[] = [
  {
    time: "06:00 - 07:00",
    actualSticks: 860000,
    targetSticks: 945000,
    oeeAvailability: 91.5,
    oeePerformance: 94.0,
    oeeQuality: 99.1,
    overallOee: 85.2,
    skm1Sticks: 410000,
    skm2Sticks: 350000,
    sktSticks: 100000,
    notes: "Start-up shift & pemanasan silinder saus"
  },
  {
    time: "07:00 - 08:00",
    actualSticks: 955000,
    targetSticks: 945000,
    oeeAvailability: 98.0,
    oeePerformance: 97.2,
    oeeQuality: 99.0,
    overallOee: 94.3,
    skm1Sticks: 465000,
    skm2Sticks: 385000,
    sktSticks: 105000,
    notes: "Laju nominal tercapai di Maker 01 & 02"
  },
  {
    time: "08:00 - 09:00",
    actualSticks: 960000,
    targetSticks: 945000,
    oeeAvailability: 98.2,
    oeePerformance: 97.5,
    oeeQuality: 98.9,
    overallOee: 94.7,
    skm1Sticks: 470000,
    skm2Sticks: 385000,
    sktSticks: 105000,
    notes: "Produktivitas puncak pagi"
  },
  {
    time: "09:00 - 10:00",
    actualSticks: 710000,
    targetSticks: 945000,
    oeeAvailability: 76.5,
    oeePerformance: 88.0,
    oeeQuality: 97.8,
    overallOee: 65.8,
    skm1Sticks: 460000,
    skm2Sticks: 145000,
    sktSticks: 105000,
    notes: "Line SKM 2 (MKR-02) jamming suction tape 42 mnt"
  },
  {
    time: "10:00 - 11:00",
    actualSticks: 935000,
    targetSticks: 945000,
    oeeAvailability: 95.0,
    oeePerformance: 96.0,
    oeeQuality: 98.8,
    overallOee: 90.1,
    skm1Sticks: 465000,
    skm2Sticks: 365000,
    sktSticks: 105000,
    notes: "MKR-02 kembali normal pasca ganti pisau potong"
  },
  {
    time: "11:00 - 12:00",
    actualSticks: 920000,
    targetSticks: 945000,
    oeeAvailability: 94.2,
    oeePerformance: 95.5,
    oeeQuality: 99.2,
    overallOee: 89.2,
    skm1Sticks: 455000,
    skm2Sticks: 365000,
    sktSticks: 100000,
    notes: "Re-threading bobbin kertas papir"
  },
  {
    time: "12:00 - 13:00",
    actualSticks: 830000,
    targetSticks: 945000,
    oeeAvailability: 87.0,
    oeePerformance: 93.0,
    oeeQuality: 99.1,
    overallOee: 80.2,
    skm1Sticks: 410000,
    skm2Sticks: 330000,
    sktSticks: 90000,
    notes: "Jeda makan siang bergilir operator & pelinting"
  },
  {
    time: "13:00 - 14:00",
    actualSticks: 927400,
    targetSticks: 945000,
    oeeAvailability: 95.5,
    oeePerformance: 96.2,
    oeeQuality: 99.3,
    overallOee: 91.2,
    skm1Sticks: 460000,
    skm2Sticks: 370000,
    sktSticks: 97400,
    notes: "Final sprint & rekonsiliasi pita cukai shift 1"
  }
];

export const DAILY_PERFORMANCE_DATA: DailyPerformanceData[] = [
  { date: "24 Sep", day: "Kam", totalSticks: 6920000, targetSticks: 7200000, overallOee: 86.4, rejectRatePct: 1.3, cukaiPacks: 445000 },
  { date: "25 Sep", day: "Jum", totalSticks: 7150000, targetSticks: 7200000, overallOee: 88.1, rejectRatePct: 1.1, cukaiPacks: 462000 },
  { date: "26 Sep", day: "Sab", totalSticks: 7080000, targetSticks: 7200000, overallOee: 87.5, rejectRatePct: 1.2, cukaiPacks: 457000 },
  { date: "27 Sep", day: "Min", totalSticks: 5400000, targetSticks: 5500000, overallOee: 89.2, rejectRatePct: 0.9, cukaiPacks: 348000 },
  { date: "28 Sep", day: "Sen", totalSticks: 7280000, targetSticks: 7200000, overallOee: 89.5, rejectRatePct: 1.0, cukaiPacks: 470000 },
  { date: "29 Sep", day: "Sel", totalSticks: 7350000, targetSticks: 7200000, overallOee: 90.2, rejectRatePct: 1.1, cukaiPacks: 474000 },
  { date: "30 Sep", day: "Rab", totalSticks: 6597400, targetSticks: 7570000, overallOee: 87.2, rejectRatePct: 1.2, cukaiPacks: 428845 }
];

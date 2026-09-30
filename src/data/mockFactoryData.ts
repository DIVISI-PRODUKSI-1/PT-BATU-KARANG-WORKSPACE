import {
  CigaretteProduct,
  ProductionLine,
  RawMaterialStock,
  ExciseStampInventory,
  ShiftReport,
  AIAutonomousTask
} from '../types/tobacco-system';

export const INITIAL_PRODUCTS: CigaretteProduct[] = [
  {
    id: 'prod-1',
    code: 'SKM-BKR-16',
    name: 'Batu Karang Filter Bold 16s',
    type: 'SKM',
    sticksPerPack: 16,
    packsPerSlop: 10,
    slopsPerBal: 20,
    targetSpeedBpm: 7500, // 7.500 batang/menit
    targetSticksPerShift: 3600000, // 3,6 juta batang / shift
    exciseTariffPerStick: 1226, // Tarif Cukai Golongan II SKM
    retailPriceHJE: 31500, // Rp 31.500 / bungkus
    exciseStampSeries: 'SERI-II-SKM-2026-B'
  },
  {
    id: 'prod-2',
    code: 'SKM-MLD-16',
    name: 'Batu Karang Mild Menthol 16s',
    type: 'SKM',
    sticksPerPack: 16,
    packsPerSlop: 10,
    slopsPerBal: 20,
    targetSpeedBpm: 6500,
    targetSticksPerShift: 3120000,
    exciseTariffPerStick: 1226,
    retailPriceHJE: 32000,
    exciseStampSeries: 'SERI-II-SKM-2026-M'
  },
  {
    id: 'prod-3',
    code: 'SKT-KLB-12',
    name: 'Batu Karang Kretek Tangan Prima 12s',
    type: 'SKT',
    sticksPerPack: 12,
    packsPerSlop: 10,
    slopsPerBal: 20,
    targetSpeedBpm: 0, // Manual Hand-rolled
    targetSticksPerShift: 850000, // 850 ribu batang / shift (400 pelinting)
    exciseTariffPerStick: 498, // Tarif Cukai Golongan II SKT
    retailPriceHJE: 15500, // Rp 15.500 / bungkus
    exciseStampSeries: 'SERI-II-SKT-2026-A'
  },
  {
    id: 'prod-4',
    code: 'SKT-KST-12',
    name: 'Batu Karang Kretek Istimewa Non-Filter 12s',
    type: 'SKT',
    sticksPerPack: 12,
    packsPerSlop: 10,
    slopsPerBal: 20,
    targetSpeedBpm: 0,
    targetSticksPerShift: 620000,
    exciseTariffPerStick: 498,
    retailPriceHJE: 16000,
    exciseStampSeries: 'SERI-II-SKT-2026-B'
  }
];

export const INITIAL_LINES: ProductionLine[] = [
  {
    id: 'line-skm-1',
    name: 'Line SKM 1 (High-Speed Protos-M8 & HLP)',
    type: 'SKM',
    capacityPerShift: 3600000,
    currentShiftOutput: 3125000,
    targetShiftOutput: 3600000,
    oeeScore: 88.4,
    activeStaffCount: 8,
    machines: [
      {
        id: 'mach-skm-m1',
        code: 'MKR-01',
        name: 'Protos-M8 High-Speed Maker',
        lineId: 'line-skm-1',
        lineName: 'Line SKM 1',
        type: 'MAKER',
        category: 'SKM',
        status: 'RUNNING',
        currentSpeedBpm: 7200,
        targetSpeedBpm: 7500,
        activeProduct: 'Batu Karang Filter Bold 16s',
        operatorInCharge: 'Bambang Sudiro (Senior Mech)',
        uptimeMinutes: 412,
        downtimeMinutes: 28,
        rejectSticksCount: 38400,
        outputSticksCount: 3125000,
        oee: {
          availability: 93.6,
          performance: 96.0,
          quality: 98.8,
          overall: 88.8
        },
        temperatureC: 48.2,
        tobaccoMoisturePct: 13.1,
        lastIssue: 'Pembersihan nozzle lem tipping filter (downtime 14 menit)',
        updatedAt: 'Baru saja'
      },
      {
        id: 'mach-skm-p1',
        code: 'PCK-01',
        name: 'HLP-250 High-Speed Packer & Boxer',
        lineId: 'line-skm-1',
        lineName: 'Line SKM 1',
        type: 'PACKER',
        category: 'SKM',
        status: 'RUNNING',
        currentSpeedBpm: 450, // pack per menit
        targetSpeedBpm: 468,
        activeProduct: 'Batu Karang Filter Bold 16s',
        operatorInCharge: 'Rudi Hartono',
        uptimeMinutes: 405,
        downtimeMinutes: 35,
        rejectSticksCount: 1420,
        outputSticksCount: 195312, // packs (195.312 x 16 = 3.125.000 batang)
        oee: {
          availability: 92.0,
          performance: 96.2,
          quality: 99.3,
          overall: 87.9
        },
        temperatureC: 42.0,
        lastIssue: 'Roll foil aluminum habis, re-threading 8 menit',
        updatedAt: 'Baru saja'
      }
    ]
  },
  {
    id: 'line-skm-2',
    name: 'Line SKM 2 (Molins Mark 9 & Boxer 180)',
    type: 'SKM',
    capacityPerShift: 3120000,
    currentShiftOutput: 2680000,
    targetShiftOutput: 3120000,
    oeeScore: 82.5,
    activeStaffCount: 8,
    machines: [
      {
        id: 'mach-skm-m2',
        code: 'MKR-02',
        name: 'Molins MK-9 Cigarette Maker',
        lineId: 'line-skm-2',
        lineName: 'Line SKM 2',
        type: 'MAKER',
        category: 'SKM',
        status: 'RUNNING',
        currentSpeedBpm: 5900,
        targetSpeedBpm: 6500,
        activeProduct: 'Batu Karang Mild Menthol 16s',
        operatorInCharge: 'Supriyadi S.',
        uptimeMinutes: 380,
        downtimeMinutes: 60,
        rejectSticksCount: 46200,
        outputSticksCount: 2680000,
        oee: {
          availability: 86.3,
          performance: 90.7,
          quality: 98.3,
          overall: 76.9
        },
        temperatureC: 51.5,
        tobaccoMoisturePct: 12.8,
        lastIssue: 'Jamming pada suction tape & ganti pisau potong rod',
        updatedAt: '2 mnt lalu'
      },
      {
        id: 'mach-skm-p2',
        code: 'PCK-02',
        name: 'GD-X2 Hinge-Lid Packer',
        lineId: 'line-skm-2',
        lineName: 'Line SKM 2',
        type: 'PACKER',
        category: 'SKM',
        status: 'RUNNING',
        currentSpeedBpm: 380,
        targetSpeedBpm: 406,
        activeProduct: 'Batu Karang Mild Menthol 16s',
        operatorInCharge: 'Wawan Prasetyo',
        uptimeMinutes: 410,
        downtimeMinutes: 30,
        rejectSticksCount: 980,
        outputSticksCount: 167500, // packs
        oee: {
          availability: 93.1,
          performance: 93.5,
          quality: 99.4,
          overall: 86.5
        },
        temperatureC: 39.4,
        lastIssue: 'Sensor verifikasi pita cukai mendeteksi misalignment',
        updatedAt: '1 mnt lalu'
      }
    ]
  },
  {
    id: 'line-skt-hall-a',
    name: 'Hall SKT Unit A (Padat Karya Linting Tangan)',
    type: 'SKT',
    capacityPerShift: 850000,
    currentShiftOutput: 792400,
    targetShiftOutput: 850000,
    oeeScore: 93.2,
    activeStaffCount: 384, // pelinting & pemotong aktif
    machines: [
      {
        id: 'mach-skt-benches',
        code: 'SKT-A-384',
        name: 'Meja Linting Tangan & Gunting Unit A (384 Stasiun)',
        lineId: 'line-skt-hall-a',
        lineName: 'Hall SKT Unit A',
        type: 'ROLLING_BENCH',
        category: 'SKT',
        status: 'RUNNING',
        currentSpeedBpm: 1650, // total output kelompok per menit
        targetSpeedBpm: 1770,
        activeProduct: 'Batu Karang Kretek Tangan Prima 12s',
        operatorInCharge: 'Ibu Warsinah (Mandor Senior) & 384 Pengrajin',
        uptimeMinutes: 435,
        downtimeMinutes: 5,
        rejectSticksCount: 6300, // cacat gembos / sobek
        outputSticksCount: 792400,
        oee: {
          availability: 98.8,
          performance: 95.1,
          quality: 99.2,
          overall: 93.2
        },
        temperatureC: 27.5,
        tobaccoMoisturePct: 13.4,
        lastIssue: 'Toleransi kelembaban tembakau ideal (13.4%), tarikan optimal',
        updatedAt: 'Baru saja'
      }
    ]
  }
];

export const INITIAL_RAW_MATERIALS: RawMaterialStock[] = [
  {
    id: 'mat-1',
    code: 'RAW-TOB-MD',
    name: 'Tembakau Madura Grade A (Rajangan)',
    category: 'TEMBAKAU',
    stockOnHand: 48500, // kg
    unit: 'kg',
    minThreshold: 15000,
    dailyConsumptionRate: 3200,
    estimatedDaysLeft: 15.1,
    supplierOrigin: 'Pamekasan & Sumenep, Madura',
    moistureStandardPct: '12.8% - 13.5%',
    status: 'SAFE'
  },
  {
    id: 'mat-2',
    code: 'RAW-TOB-TMG',
    name: 'Tembakau Temanggung Srintil Blend',
    category: 'TEMBAKAU',
    stockOnHand: 24200,
    unit: 'kg',
    minThreshold: 10000,
    dailyConsumptionRate: 1800,
    estimatedDaysLeft: 13.4,
    supplierOrigin: 'Kledung - Temanggung',
    moistureStandardPct: '13.0% - 13.6%',
    status: 'SAFE'
  },
  {
    id: 'mat-3',
    code: 'RAW-CLV-MND',
    name: 'Cengkeh Pilihan Rajang (Clove Manado)',
    category: 'CENGKEH',
    stockOnHand: 18600,
    unit: 'kg',
    minThreshold: 8000,
    dailyConsumptionRate: 1450,
    estimatedDaysLeft: 12.8,
    supplierOrigin: 'Minahasa, Sulawesi Utara',
    moistureStandardPct: '11.5% - 12.5%',
    status: 'SAFE'
  },
  {
    id: 'mat-4',
    code: 'RAW-FLV-04B',
    name: 'Saus Perasa Aroma Cengkeh & Rempah Formula #04B',
    category: 'SAUS_FLAVOR',
    stockOnHand: 4200,
    unit: 'liter',
    minThreshold: 2000,
    dailyConsumptionRate: 380,
    estimatedDaysLeft: 11.0,
    supplierOrigin: 'Laboratorium Flavour In-House',
    status: 'SAFE'
  },
  {
    id: 'mat-5',
    code: 'RAW-PPR-6000',
    name: 'Kertas Sigaret Papir (Bobbin 6.000m)',
    category: 'PAPIR_BOBBIN',
    stockOnHand: 840,
    unit: 'bobbin',
    minThreshold: 300,
    dailyConsumptionRate: 65,
    estimatedDaysLeft: 12.9,
    supplierOrigin: 'Surabaya Packaging Industry',
    status: 'SAFE'
  },
  {
    id: 'mat-6',
    code: 'RAW-FLT-TOW',
    name: 'Filter Tow Acetate 120mm Rod',
    category: 'FILTER_TOW',
    stockOnHand: 520000,
    unit: 'rod',
    minThreshold: 200000,
    dailyConsumptionRate: 45000,
    estimatedDaysLeft: 11.5,
    supplierOrigin: 'PT Daicel Celanese Indo',
    status: 'SAFE'
  }
];

export const INITIAL_EXCISE_STAMPS: ExciseStampInventory[] = [
  {
    id: 'cukai-1',
    stampCode: 'PC-2026-SKM-II-B',
    series: 'SERI-II-SKM-2026-B',
    applicableProduct: 'Batu Karang Filter Bold 16s',
    tariffPerStick: 1226,
    sheetsInStock: 2500, // lembar
    stampsPerSheet: 120, // 120 keping per lembar = 300.000 keping
    totalStampsOnHand: 300000,
    usedTodayStamps: 195312,
    damagedStampsAffkir: 142, // afkir penempelan (tercatat di log CK-4)
    remainingStamps: 104546,
    reconciliationStatus: 'MATCHED',
    discrepancyCount: 0,
    lastAuditTimestamp: 'Hari ini, 13:45 WIB'
  },
  {
    id: 'cukai-2',
    stampCode: 'PC-2026-SKM-II-M',
    series: 'SERI-II-SKM-2026-M',
    applicableProduct: 'Batu Karang Mild Menthol 16s',
    tariffPerStick: 1226,
    sheetsInStock: 2200,
    stampsPerSheet: 120,
    totalStampsOnHand: 264000,
    usedTodayStamps: 167500,
    damagedStampsAffkir: 185,
    remainingStamps: 96315,
    reconciliationStatus: 'MATCHED',
    discrepancyCount: 0,
    lastAuditTimestamp: 'Hari ini, 13:45 WIB'
  },
  {
    id: 'cukai-3',
    stampCode: 'PC-2026-SKT-II-A',
    series: 'SERI-II-SKT-2026-A',
    applicableProduct: 'Batu Karang Kretek Tangan Prima 12s',
    tariffPerStick: 498,
    sheetsInStock: 1200,
    stampsPerSheet: 120,
    totalStampsOnHand: 144000,
    usedTodayStamps: 66033, // 792.400 batang / 12 = 66.033 bungkus
    damagedStampsAffkir: 42,
    remainingStamps: 77925,
    reconciliationStatus: 'MATCHED',
    discrepancyCount: 0,
    lastAuditTimestamp: 'Hari ini, 13:50 WIB'
  }
];

export const INITIAL_SHIFT_REPORTS: ShiftReport[] = [
  {
    id: 'rep-20260930-s1',
    reportNumber: 'RPT/BKR/2026/09/30-S1',
    date: '30 September 2026',
    shift: 'SHIFT_1_PAGI',
    supervisor: 'Ir. Hendro Wibowo (Kabag Produksi)',
    aiVerifier: 'Aria - AI Autonomous Operations Officer v3.2',
    totalSticksProduced: 6597400,
    totalPacksProduced: 428845,
    totalBalesProduced: 2144,
    totalRejectSticks: 90900,
    overallPlantOEE: 87.2,
    exciseStampsReconciled: true,
    tobaccoConsumedKg: 5820,
    cloveConsumedKg: 2610,
    sauceConsumedLiter: 640,
    majorIncidents: [
      'Line SKM 2 (MKR-02): Jamming suction belt 42 menit pkl 09:15, pisau diganti oleh teknisi shift 1.',
      'Kelembaban tembakau Madura batch #MDR-88 terjaga stabil di 13.1%.',
      'Afkir pita cukai 369 keping dicatat dengan Berita Acara internal untuk pelaporan CK-4 ke Bea Cukai.'
    ],
    aiExecutiveSummary: 'Produksi Shift 1 mencapai 94.8% dari target kapasitas (6.597.400 batang dari target 6.960.000). Efisiensi OEE pabrik berada pada 87.2% (World Class standard >85%). Seluruh konsumsi pita cukai tercatat 100% klop terhadap jumlah pack yang masuk ke Gudang Jadi (Finished Goods Warehouse) tanpa deviasi. Rekomendasi AI: Jadwalkan penggantian suction tape cadangan di Maker 02 pada jeda shift.',
    status: 'VERIFIED_AI'
  }
];

export const INITIAL_AI_TASKS: AIAutonomousTask[] = [
  {
    id: 'task-1',
    timeScheduled: '06:05 WIB',
    taskTitle: 'Rekonsiliasi Shift Malam & Handover Pagi',
    description: 'Verifikasi volume batang maker vs pack masuk slop vs pemakaian pita cukai shift malam.',
    status: 'COMPLETED',
    resultSummary: 'Verifikasi selesai: 6.120.000 batang valid, zero variance pita cukai.',
    targetModule: 'Daily Wrap-up'
  },
  {
    id: 'task-2',
    timeScheduled: '10:00 WIB',
    taskTitle: 'Audit Kelembaban Tembakau & Reject Tipping',
    description: 'Analisis sensor moisture tembakau di silo primary processing dan reject rod maker.',
    status: 'COMPLETED',
    resultSummary: 'Moisture stabil di 13.1%. Reject rod turun 0.3% pasca adjustment nozzle lem.',
    targetModule: 'OEE Monitor'
  },
  {
    id: 'task-3',
    timeScheduled: '13:55 WIB',
    taskTitle: 'Penyusunan Draft Dokumen Bea Cukai CK-4',
    description: 'Generate rekapitulasi mutasi harian barang kena cukai dan lembar pita cukai rusak/afkir.',
    status: 'COMPLETED',
    resultSummary: 'Draft CK-4 siap diekspor. 369 keping afkir terlampir dengan nomor seri.',
    targetModule: 'CK-4 Bea Cukai'
  },
  {
    id: 'task-4',
    timeScheduled: '14:15 WIB',
    taskTitle: 'Otomasi Pengiriman Ringkasan Shift 1 ke WhatsApp Owner',
    description: 'Kompilasi ringkasan output batang, OEE line, dan cost tembakau ke eksekutif.',
    status: 'SCHEDULED',
    resultSummary: 'Menunggu penutupan shift dan verifikasi akhir supervisor jam 14:00.',
    targetModule: 'Daily Wrap-up'
  },
  {
    id: 'task-5',
    timeScheduled: '16:00 WIB',
    taskTitle: 'Forecasting Kebutuhan Bahan Baku 7 Hari ke Depan',
    description: 'Simulasi target produksi minggu depan terhadap stok tembakau Madura & cengkeh.',
    status: 'SCHEDULED',
    resultSummary: 'Model prediktif disiapkan untuk menjalankan run kuotasi Purchase Order.',
    targetModule: 'Material Forecast'
  }
];

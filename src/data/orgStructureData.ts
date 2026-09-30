export interface JobPosition {
  id: string;
  code: string;
  title: string;
  division: 'DIREKSI' | 'PRODUKSI' | 'QC_LAB' | 'CUKAI_GUDANG' | 'HRD_GA' | 'KEUANGAN';
  level: number; // 1: Direksi, 2: Manajer, 3: Supervisor/Mandor, 4: Pelaksana
  reportsTo?: string; // id of parent position
  holderName?: string;
  headcount: number;
  location: string;
  description: string;
  keyResponsibilities: string[];
  kpiMetrics: string[];
  aiIntegrationRole: string; // bagaimana AI mendukung posisi ini
}

export const COMPANY_PROFILE = {
  name: "PT Batu Karang",
  address: "Jl. Raya Parangargo 153 Wagir - Malang, Jawa Timur",
  industry: "Industri Hasil Tembakau (IHT) - SKM & SKT",
  plantLocation: "Kawasan Industri & Pabrik Wagir, Malang",
  email: "divisi1.BKR@gmail.com",
  established: "Pabrik Sigaret Kretek Mesin & Sigaret Kretek Tangan"
};

export const ORG_POSITIONS: JobPosition[] = [
  // --- LEVEL 1: DIREKSI & EKSEKUTIF ---
  {
    id: 'pos-dirut',
    code: 'BKR-DIR-01',
    title: 'Direktur Utama (President Director / Owner)',
    division: 'DIREKSI',
    level: 1,
    holderName: 'Pemilik Perusahaan / Dewan Direksi',
    headcount: 1,
    location: 'Kantor Direksi Wagir - Malang',
    description: 'Pemimpin tertinggi penentu arah strategis bisnis rokok, ekspansi pasar, investasi mesin maker, dan kebijakan umum perusahaan.',
    keyResponsibilities: [
      'Menetapkan visi, arah target produksi bulanan/tahunan pabrik.',
      'Memantau kinerja operasional, efisiensi OEE, dan profitabilitas perusahaan.',
      'Menyetujui alokasi belanja modal (mesin maker, packer, dan persediaan tembakau musim panen).',
      'Memastikan tata kelola kepatuhan penuh terhadap ketentuan cukai dan ketenagakerjaan RI.'
    ],
    kpiMetrics: [
      'Pencapaian Total Output Produksi (Target Batang/Tahun)',
      'OEE Pabrik Konsisten > 85%',
      'Margin Profitabilitas & Tingkat Kepatuhan Regulasi Bea Cukai 100%'
    ],
    aiIntegrationRole: 'Menerima ringkasan eksekutif harian otomatis di WhatsApp/Dashboard, notifikasi deviasi kritis biaya, dan rekomendasi strategis bahan baku.'
  },
  {
    id: 'pos-ai-officer',
    code: 'BKR-AI-00',
    title: 'Aria · AI Autonomous Operations & Admin Officer',
    division: 'DIREKSI',
    level: 1,
    reportsTo: 'pos-dirut',
    holderName: 'Sistem Agen AI Otonom v3.2',
    headcount: 1,
    location: 'Cloud & Local Server PT Batu Karang',
    description: 'Karyawan berbasis AI yang bertindak sebagai Staf Khusus Operasional Direksi untuk audit telemetri, rekonsiliasi pita cukai, dan pelaporan otomatis.',
    keyResponsibilities: [
      'Mengagregasi data mesin maker, packer, dan meja linting setiap 60 detik.',
      'Melakukan verifikasi silang otomatis antara keping pita cukai terpakai dan pack gudang (CK-4).',
      'Mendeteksi akar masalah (root cause) lonjakan reject dan downtime mesin.',
      'Menyusun memo laporan shift resmi pada pukul 14:05, 22:05, dan 06:05 WIB.'
    ],
    kpiMetrics: [
      'Zero Error Laporan Rekonsiliasi Cukai',
      'Kecepatan Generate Shift Wrap-Up < 3 detik pasca shift berakhir',
      'Akurasi Deteksi Anomali OEE Mesin > 98%'
    ],
    aiIntegrationRole: 'Pusat inteligensi sistem yang melayani seluruh jajaran manajemen dari Direktur hingga Mandor.'
  },
  {
    id: 'pos-dir-ops',
    code: 'BKR-DIR-02',
    title: 'Direktur Operasional & Pabrik',
    division: 'DIREKSI',
    level: 1,
    reportsTo: 'pos-dirut',
    holderName: 'Ir. Soekarno Hadi',
    headcount: 1,
    location: 'Kantor Operasional Pabrik Parangargo',
    description: 'Penanggung jawab seluruh aktivitas rantai pasok, keandalan mesin pabrik, dan kelancaran produksi SKM & SKT.',
    keyResponsibilities: [
      'Mengawasi efektivitas lini produksi SKM berkecepatan tinggi dan hall padat karya SKT.',
      'Mengelola ketersediaan bahan baku tembakau, cengkeh, saus perasa, dan kemasan.',
      'Menjamin standar keselamatan kerja (K3) dan kebersihan sanitasi lingkungan pabrik.'
    ],
    kpiMetrics: [
      'Realisasi Jadwal Produksi (Schedule Attainment > 95%)',
      'Pabrik OEE (Availability, Performance, Quality)',
      'Pengurangan Downtime Tak Terencana Mesin Maker & Packer'
    ],
    aiIntegrationRole: 'Mengakses dashboard diagnostik OEE real-time dan rekomendasi maintenance preventif mesin dari AI.'
  },
  {
    id: 'pos-dir-fin',
    code: 'BKR-DIR-03',
    title: 'Direktur Keuangan & Kepatuhan Cukai',
    division: 'DIREKSI',
    level: 1,
    reportsTo: 'pos-dirut',
    holderName: 'Dra. Endang Purwaningsih, Ak.',
    headcount: 1,
    location: 'Kantor Finansial Parangargo 153',
    description: 'Pengendali perbendaharaan kas, alokasi anggaran pemesanan pita cukai ke kas negara, dan akuntansi biaya.',
    keyResponsibilities: [
      'Mengelola likuiditas pembelian pita cukai (CK-1) ke Kantor Pelayanan Bea dan Cukai (KPPBC).',
      'Mengontrol biaya pokok produksi (HPP) tembakau, saus, papir, filter, dan upah pelinting.',
      'Memastikan kepatuhan pelaporan pajak pertambahan nilai (PPN) hasil tembakau dan PPh.'
    ],
    kpiMetrics: [
      'Ketepatan Waktu Penyetoran Cukai ke Kas Negara (Zero Denda)',
      'Akurasi Buku Rekening Pita Cukai',
      'Efisiensi Biaya Pokok Produksi per Batang Rokok'
    ],
    aiIntegrationRole: 'Audit deviasi fisik otomatis dari AI yang mencegah potensi denda administrasi Bea Cukai.'
  },

  // --- LEVEL 2: MANAJER DIVISI ---
  {
    id: 'pos-mgr-plant',
    code: 'BKR-MGR-PRD',
    title: 'Kepala Pabrik / Plant Manager',
    division: 'PRODUKSI',
    level: 2,
    reportsTo: 'pos-dir-ops',
    holderName: 'Budi Santoso, S.T.',
    headcount: 1,
    location: 'Lantai Produksi Parangargo 153 Wagir',
    description: 'Memimpin operasional harian lantai pabrik, mengkoordinasikan seksi primary (saus & rajang) dan seksi secondary (maker, packer, SKT).',
    keyResponsibilities: [
      'Memastikan target shift harian (Pagi, Siang, Malam) tercapai sesuai kuota.',
      'Mengatur rotasi kerja operator mesin dan pengrajin giling linting tangan.',
      'Menindaklanjuti alarm anomali reject rate yang dilaporkan oleh sistem AI.'
    ],
    kpiMetrics: [
      'Volume Output Batang per Shift',
      'Reject Rate Rod Mesin Maker < 1.5%',
      'Konsumsi Bahan Baku Sesuai Standar Bill of Materials (BOM)'
    ],
    aiIntegrationRole: 'Menerima alert instan saat mesin maker mengalami jamming atau kadar air tembakau di luar rentang toleransi.'
  },
  {
    id: 'pos-mgr-qa',
    code: 'BKR-MGR-QA',
    title: 'Manajer Pengendalian Mutu & Lab (QA/QC)',
    division: 'QC_LAB',
    level: 2,
    reportsTo: 'pos-dir-ops',
    holderName: 'Ahmad Fauzi, M.Si.',
    headcount: 1,
    location: 'Laboratorium Uji Fisik & Kimia Wagir',
    description: 'Memastikan rasa, tarikan hisapan, kadar air rajangan, serta berat batang rokok sesuai spesifikasi formula racikan PT Batu Karang.',
    keyResponsibilities: [
      'Menguji kadar air (moisture %) tembakau Madura & Temanggung (target 12.8% - 13.5%).',
      'Mengukur resistensi hisapan (draw resistance) dan berat batang filter SKM.',
      'Melakukan uji organoleptik aroma saus rempah formula in-house.'
    ],
    kpiMetrics: [
      'Tingkat Kesesuaian Spesifikasi Batang > 99.2%',
      'Zero Complain Konsumen terkait Batang Rusak / Gembos',
      'Presisi Kadar Air Rajangan Tembakau Silo'
    ],
    aiIntegrationRole: 'AI menghubungkan sensor kelembaban di silo penyimpanan dengan data kualitas batang hasil mesin maker.'
  },
  {
    id: 'pos-mgr-cukai',
    code: 'BKR-MGR-CUK',
    title: 'Manajer Kepatuhan Bea Cukai & Gudang',
    division: 'CUKAI_GUDANG',
    level: 2,
    reportsTo: 'pos-dir-fin',
    holderName: 'Raden Mas Haryo, S.E.',
    headcount: 1,
    location: 'Gudang Cukai & Penyimpanan Etiket Wagir',
    description: 'Pejabat penghubung resmi dengan Kantor Bea Cukai (KPPBC), penanggung jawab brankas pita cukai dan dokumen CK-4.',
    keyResponsibilities: [
      'Mengawasi penerimaan fisik lembar pita cukai dari bank persepsi / kantor pos / Bea Cukai.',
      'Mengontrol serah-terima pita cukai ke operator mesin packer dan meja packing SKT.',
      'Menyusun Berita Acara Kerusakan / Afkir Pita Cukai untuk penghapusan buku rekening CK-5.'
    ],
    kpiMetrics: [
      'Nol Deviasi Fisik Pita Cukai (Zero Discrepancy)',
      'Kelengkapan Dokumen CK-4 dan CK-5 Bea Cukai',
      'Keamanan Brankas Cukai & Akurasi Opname Harian'
    ],
    aiIntegrationRole: 'AI secara otomatis membuat draf Berita Acara afkir dan merekonsiliasi setiap keping pita cukai yang ditempel.'
  },
  {
    id: 'pos-mgr-hrd',
    code: 'BKR-MGR-HRD',
    title: 'Manajer Personalia & Hubungan Industrial (HRD/GA)',
    division: 'HRD_GA',
    level: 2,
    reportsTo: 'pos-dir-ops',
    holderName: 'Siti Rahmawati, S.Psi.',
    headcount: 1,
    location: 'Kantor Administrasi Parangargo',
    description: 'Mengelola hubungan kerja ratusan pekerja padat karya linting tangan SKT, absensi operator shift, jaminan sosial Ketenagakerjaan, dan K3.',
    keyResponsibilities: [
      'Mengatur jadwal shift dan pemenuhan kuorum pelinting di Hall SKT Unit A & B.',
      'Menghitung upah borongan pelinting dan penggunting berdasarkan jumlah batang lolos mandor.',
      'Menjaga keselamatan kerja, kesehatan lingkungan, dan kepatuhan norma ketenagakerjaan.'
    ],
    kpiMetrics: [
      'Tingkat Kehadiran Kerja Pelinting SKT > 96%',
      'Ketepatan Perhitungan Upah Borongan Batang',
      'Zero Accident (Kecelakaan Kerja Fatal di Pabrik)'
    ],
    aiIntegrationRole: 'AI mengintegrasikan data timbangan output per meja pelinting langsung ke sistem rekap presensi dan produktivitas.'
  },
  {
    id: 'pos-mgr-finance',
    code: 'BKR-MGR-ACC',
    title: 'Manajer Akuntansi Biaya & Pengadaan',
    division: 'KEUANGAN',
    level: 2,
    reportsTo: 'pos-dir-fin',
    holderName: 'Dewi Lestari, S.E., M.Ak.',
    headcount: 1,
    location: 'Kantor Keuangan Parangargo 153',
    description: 'Menghitung biaya bahan baku tembakau, cengkeh, saus, bobbin papir, filter rod, dan mengelola order pembelian ke petani/supplier.',
    keyResponsibilities: [
      'Menghitung Harga Pokok Penjualan (HPP) per slop dan per bal rokok.',
      'Melakukan audit invoice supplier tembakau Madura & Temanggung.',
      'Menyusun proyeksi cash flow belanja bahan baku musiman.'
    ],
    kpiMetrics: [
      'Akurasi Rekonsiliasi Finansial Akhir Bulan',
      'Efisiensi Pembelian Bahan Baku Tembakau',
      'Ketepatan Pencatatan Utang/Piutang Distributor'
    ],
    aiIntegrationRole: 'AI menyajikan forecast kebutuhan restock bahan baku 7-14 hari ke depan berdasarkan kapasitas produksi terencana.'
  },

  // --- LEVEL 3: SUPERVISOR & MANDOR LAPANGAN ---
  {
    id: 'pos-spv-skm',
    code: 'BKR-SPV-SKM',
    title: 'Supervisor Produksi SKM (Maker & Packer Mesin)',
    division: 'PRODUKSI',
    level: 3,
    reportsTo: 'pos-mgr-plant',
    holderName: 'Bambang Sudiro',
    headcount: 3, // 3 shift
    location: 'Lini Mesin SKM 1 & 2 Parangargo',
    description: 'Memimpin teknisi mekanik, operator maker Protos/Molins, dan packer HLP/GD selama giliran shift berjalan.',
    keyResponsibilities: [
      'Memastikan mesin maker berjalan pada kecepatan target (7.200 - 7.500 bpm).',
      'Mengawasi pergantian bobbin kertas papir, filter rod, dan foil aluminum.',
      'Mencatat log gangguan mekanik ke sistem bila terjadi downtime > 5 menit.'
    ],
    kpiMetrics: [
      'OEE Mesin SKM > 88%',
      'Kecepatan Penanganan Jamming Suction/Pisau < 15 menit',
      'Kebersihan Lini Mesin Antar Shift'
    ],
    aiIntegrationRole: 'Menerima alert langsung di tablet kontrol jika sensor getaran atau suhu bearing maker naik di atas batas wajar.'
  },
  {
    id: 'pos-spv-skt',
    code: 'BKR-SPV-SKT',
    title: 'Supervisor Hall SKT (Sigaret Kretek Tangan)',
    division: 'PRODUKSI',
    level: 3,
    reportsTo: 'pos-mgr-plant',
    holderName: 'Ibu Warsinah (Mandor Senior)',
    headcount: 2,
    location: 'Hall SKT Unit A & B Wagir',
    description: 'Mengkoordinasikan para mandor kelompok giling, pengrajin pelinting, pemotong gunting, dan penimbang kemasan manual.',
    keyResponsibilities: [
      'Mendistribusikan tembakau racikan saus dan papir ke meja pelinting.',
      'Memeriksa kerapian hasil lintingan, kepadatan ujung batang, dan keseragaman panjang batang.',
      'Menghitung jumlah setoran batang dari masing-masing meja pengrajin.'
    ],
    kpiMetrics: [
      'Kerapian Batang Kretek Tangan Lolos Sortir > 98.5%',
      'Kapasitas Output Meja Linting Mencapai Target Shift',
      'Pengurangan Tembakau Ceceran / Rontok di Lantai'
    ],
    aiIntegrationRole: 'Sistem mencatat rekap total batang meja linting per jam dan menampilkan peringkat kelompok pengrajin terproduktif.'
  },
  {
    id: 'pos-spv-primary',
    code: 'BKR-SPV-PRM',
    title: 'Supervisor Pengolahan Bahan & Saus (Primary)',
    division: 'PRODUKSI',
    level: 3,
    reportsTo: 'pos-mgr-plant',
    holderName: 'Agus Triono',
    headcount: 2,
    location: 'Area Silo & Tangki Saus Parangargo',
    description: 'Bertanggung jawab atas proses perajangan tembakau, cengkeh, proses pengkondisian uap (*casing*), dan penyemprotan saus flavor.',
    keyResponsibilities: [
      'Menimbang rasio campuran tembakau Madura, Temanggung, dan cengkeh sesuai formula BOM.',
      'Mengatur suhu drum silinder penyemprot saus aroma.',
      'Memantau kadar air hasil perajangan sebelum diumpankan ke mesin maker.'
    ],
    kpiMetrics: [
      'Konsistensi Formula Saus Sesuai Resep Standar',
      'Kadar Air Rajangan Masuk Maker 13.0% ± 0.3%',
      'Efisiensi Penggunaan Cengkeh & Tembakau'
    ],
    aiIntegrationRole: 'AI membaca sensor moisture inline dan merekomendasikan penyesuaian laju uap secara presisi.'
  },
  {
    id: 'pos-spv-cukai',
    code: 'BKR-SPV-CUK',
    title: 'Supervisor Brankas Pita Cukai & Retur Afkir',
    division: 'CUKAI_GUDANG',
    level: 3,
    reportsTo: 'pos-mgr-cukai',
    holderName: 'Kusuma Wardana',
    headcount: 2,
    location: 'Brankas Khusus Berpengaman Parangargo 153',
    description: 'Petugas berwenang pemegang kunci ganda brankas pita cukai, melakukan timbang terima dan pemeriksaan nomor seri lembar cukai.',
    keyResponsibilities: [
      'Menghitung lembar pita cukai masuk dan keluar brankas dengan disaksikan saksi ganda.',
      'Menghitung fisik keping pita cukai yang rusak/cacat tempel di mesin packer untuk dokumen CK-4.',
      'Menyiapkan berkas opname harian bersama sistem automasi AI.'
    ],
    kpiMetrics: [
      'Zero Loss Pita Cukai di Dalam Brankas',
      'Kecepatan Pelayanan Penyiapan Pita Cukai ke Mesin Packer',
      'Akurasi Nomor Seri Register Lembar Cukai'
    ],
    aiIntegrationRole: 'Validasi silang otomatis di mana pintu brankas dan nomor registrasi tervalidasi dengan kode batch packer.'
  },

  // --- LEVEL 4: OPERATOR, TEKNISI, & PENGRAJIN ---
  {
    id: 'pos-op-maker',
    code: 'BKR-OP-MKR',
    title: 'Operator & Teknisi Mekanik Maker SKM',
    division: 'PRODUKSI',
    level: 4,
    reportsTo: 'pos-spv-skm',
    holderName: 'Tim Teknisi & Operator Maker',
    headcount: 12,
    location: 'Lini Maker Protos & Molins',
    description: 'Menjalankan mesin pembuat batang rokok, mengontrol tarikan kertas papir, pengeleman sisi, dan pisau pemotong.',
    keyResponsibilities: [
      'Memasang roll papir bobbin dan filter rod.',
      'Memeriksa pengeleman lidah papir dan kekencangan filter.',
      'Melakukan pembersihan berkala nozzle lem dan serbuk tembakau.'
    ],
    kpiMetrics: ['Uptime Mesin', 'Reject Rod Batang < 1.0%', 'Kecepatan Laju Operasi'],
    aiIntegrationRole: 'Menerima panduan perbaikan cepat (troubleshooting) saat terjadi error mekanik dari sistem AI.'
  },
  {
    id: 'pos-op-packer',
    code: 'BKR-OP-PCK',
    title: 'Operator Mesin Packer & Penempel Cukai',
    division: 'PRODUKSI',
    level: 4,
    reportsTo: 'pos-spv-skm',
    holderName: 'Tim Operator Packer & Boxer',
    headcount: 12,
    location: 'Lini Packer HLP & Boxer GD',
    description: 'Mengoperasikan mesin pembungkus rokok ke dalam kemasan bungkus, menempelkan pita cukai, pembungkusan slop, dan bal.',
    keyResponsibilities: [
      'Memastikan penempelan pita cukai presisi di leher bungkus rokok.',
      'Memeriksa kerapian segel plastik transparan (OPP film) dan aluminum foil.',
      'Menghitung dan memisahkan pita cukai yang rusak/rusak tempel untuk diserahkan ke brankas.'
    ],
    kpiMetrics: ['Kerapian Tempel Cukai 100%', 'Reject Kemasan < 0.5%', 'Output Slop Masuk Gudang'],
    aiIntegrationRole: 'Sensor kamera optik packer terhubung ke AI untuk mendeteksi pita cukai yang miring atau terlipat.'
  },
  {
    id: 'pos-craft-skt',
    code: 'BKR-CRF-SKT',
    title: 'Pengrajin Pelinting & Pemotong SKT (Padat Karya)',
    division: 'PRODUKSI',
    level: 4,
    reportsTo: 'pos-spv-skt',
    holderName: 'Kelompok Pengrajin Ibu-Ibu Pelinting',
    headcount: 384,
    location: 'Meja Linting Unit A & B Parangargo Wagir',
    description: 'Tenaga kerja terampil yang melinting rokok kretek secara manual menggunakan alat giling tradisional kayu dan memotong rapi dengan gunting.',
    keyResponsibilities: [
      'Menggiling rajangan tembakau dan cengkeh ke dalam kertas papir dengan takaran pas.',
      'Menggunting sisa ujung batang rokok agar rata dan rapi.',
      'Menyusun rokok per 100 batang di atas ancak bambu/kayu untuk diserahkan ke mandor.'
    ],
    kpiMetrics: ['Target Output 2.000 - 2.500 Batang/Orang/Hari', 'Kerapian Tarikan & Kepadatan Batang', 'Presisi Berat'],
    aiIntegrationRole: 'AI menghitung total setoran timbangan per meja secara nirkabel dan mencatat rekap premi borongan secara adil.'
  }
];

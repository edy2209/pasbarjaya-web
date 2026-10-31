import { ClanData, WarHighlight, ClanEvent, FeedbackSuggestion, AdminUser } from './types';

export const mockClanData: ClanData = {
  tag: "#2P9V8Q2Y8",
  name: "PASBARJAYA",
  type: "Invite Only",
  description: "🔥 Klan resmi pejuang PASBARJAYA Indonesia! Solid, kompak, aktif donasi 24/7. Selalu war non-stop & berjuang habis-habisan di Clan War League (CWL). No kutu loncat! Pantang pulang sebelum 3 bintang ⭐⭐⭐",
  location: {
    id: 32000115,
    name: "Indonesia",
    isCountry: true,
    countryCode: "ID",
  },
  badgeUrl: "https://api-assets.clashofclans.com/badges/512/w_r6b2_3vIu5d9Jm0w9_0v7q1.png",
  clanLevel: 18,
  clanPoints: 49820,
  clanBuilderBasePoints: 39150,
  clanCapitalPoints: 3120,
  capitalHallLevel: 10,
  requiredTrophies: 2800,
  warFrequency: "Always",
  warWinStreak: 14,
  warWins: 418,
  warTies: 15,
  warLosses: 102,
  warLeague: "Master League I",
  membersCount: 48,
  memberList: [
    {
      tag: "#98YLP880",
      name: "PBJ • RajaPerang",
      role: "leader",
      expLevel: 245,
      league: {
        name: "Legend League",
        iconUrl: "https://api-assets.clashofclans.com/leagues/72/R2zmhyqQ0_lKcDR5EyghXCxECUSTU09veWv4hwTX_O8.png"
      },
      trophies: 5640,
      builderBaseTrophies: 4520,
      clanRank: 1,
      previousClanRank: 1,
      donations: 12450,
      donationsReceived: 3200,
      townHallLevel: 17,
      warStars: 2150
    },
    {
      tag: "#82CPL029",
      name: "PBJ • SultanMinang",
      role: "coLeader",
      expLevel: 238,
      league: {
        name: "Legend League",
        iconUrl: "https://api-assets.clashofclans.com/leagues/72/R2zmhyqQ0_lKcDR5EyghXCxECUSTU09veWv4hwTX_O8.png"
      },
      trophies: 5490,
      builderBaseTrophies: 4310,
      clanRank: 2,
      previousClanRank: 3,
      donations: 18900,
      donationsReceived: 4100,
      townHallLevel: 17,
      warStars: 1980
    },
    {
      tag: "#PL0921AQ",
      name: "Sikumbang • War",
      role: "coLeader",
      expLevel: 226,
      league: {
        name: "Titan League I",
        iconUrl: "https://api-assets.clashofclans.com/leagues/72/q5JsnOUboc27W9A39j1_hL6N0Q7H8qZf3VpA_tT0d0s.png"
      },
      trophies: 4980,
      builderBaseTrophies: 3950,
      clanRank: 3,
      previousClanRank: 2,
      donations: 9800,
      donationsReceived: 5600,
      townHallLevel: 17,
      warStars: 1820
    },
    {
      tag: "#288CVKLM",
      name: "GarudaPasbar",
      role: "coLeader",
      expLevel: 219,
      league: {
        name: "Titan League I",
        iconUrl: "https://api-assets.clashofclans.com/leagues/72/q5JsnOUboc27W9A39j1_hL6N0Q7H8qZf3VpA_tT0d0s.png"
      },
      trophies: 4890,
      builderBaseTrophies: 3820,
      clanRank: 4,
      previousClanRank: 4,
      donations: 8400,
      donationsReceived: 3900,
      townHallLevel: 16,
      warStars: 1650
    },
    {
      tag: "#998YCQOP",
      name: "Alvaro • 3Star",
      role: "admin",
      expLevel: 205,
      league: {
        name: "Titan League II",
        iconUrl: "https://api-assets.clashofclans.com/leagues/72/l-Gz_HjGfD-i3k2e8jG1L2gN8sR7d1pX3qK9lZ0uW1k.png"
      },
      trophies: 4620,
      builderBaseTrophies: 3600,
      clanRank: 5,
      previousClanRank: 6,
      donations: 6300,
      donationsReceived: 4200,
      townHallLevel: 16,
      warStars: 1480
    },
    {
      tag: "#878TYUQW",
      name: "RizkyLaloGod",
      role: "admin",
      expLevel: 198,
      league: {
        name: "Titan League II",
        iconUrl: "https://api-assets.clashofclans.com/leagues/72/l-Gz_HjGfD-i3k2e8jG1L2gN8sR7d1pX3qK9lZ0uW1k.png"
      },
      trophies: 4540,
      builderBaseTrophies: 3450,
      clanRank: 6,
      previousClanRank: 5,
      donations: 7100,
      donationsReceived: 3800,
      townHallLevel: 16,
      warStars: 1520
    },
    {
      tag: "#34VBN890",
      name: "DatuakMaringgih",
      role: "admin",
      expLevel: 194,
      league: {
        name: "Titan League III",
        iconUrl: "https://api-assets.clashofclans.com/leagues/72/l-Gz_HjGfD-i3k2e8jG1L2gN8sR7d1pX3qK9lZ0uW1k.png"
      },
      trophies: 4320,
      builderBaseTrophies: 3200,
      clanRank: 7,
      previousClanRank: 8,
      donations: 5500,
      donationsReceived: 4900,
      townHallLevel: 15,
      warStars: 1390
    },
    {
      tag: "#551OPLKJ",
      name: "BayuElectro",
      role: "member",
      expLevel: 182,
      league: {
        name: "Champion League I",
        iconUrl: "https://api-assets.clashofclans.com/leagues/72/jhiZomPdqPojZ9J1l_Gk7G2vY3ZqU1sT8d0gK3mL0uE.png"
      },
      trophies: 3950,
      builderBaseTrophies: 3100,
      clanRank: 8,
      previousClanRank: 7,
      donations: 4300,
      donationsReceived: 5100,
      townHallLevel: 15,
      warStars: 1180
    },
    {
      tag: "#667UIOPM",
      name: "FadhilRootRider",
      role: "member",
      expLevel: 175,
      league: {
        name: "Champion League II",
        iconUrl: "https://api-assets.clashofclans.com/leagues/72/jhiZomPdqPojZ9J1l_Gk7G2vY3ZqU1sT8d0gK3mL0uE.png"
      },
      trophies: 3680,
      builderBaseTrophies: 2900,
      clanRank: 9,
      previousClanRank: 10,
      donations: 3900,
      donationsReceived: 4400,
      townHallLevel: 15,
      warStars: 980
    },
    {
      tag: "#112LKJMN",
      name: "BintangPasbar",
      role: "member",
      expLevel: 168,
      league: {
        name: "Champion League III",
        iconUrl: "https://api-assets.clashofclans.com/leagues/72/jhiZomPdqPojZ9J1l_Gk7G2vY3ZqU1sT8d0gK3mL0uE.png"
      },
      trophies: 3420,
      builderBaseTrophies: 2800,
      clanRank: 10,
      previousClanRank: 9,
      donations: 2800,
      donationsReceived: 3200,
      townHallLevel: 14,
      warStars: 890
    },
    {
      tag: "#774BVCXX",
      name: "ShadowStrike",
      role: "member",
      expLevel: 160,
      league: {
        name: "Master League I",
        iconUrl: "https://api-assets.clashofclans.com/leagues/72/4wtS1stWZQumNmAXekqhg_R4n0gK8jX7qW1eY8uM3sD.png"
      },
      trophies: 3180,
      builderBaseTrophies: 2600,
      clanRank: 11,
      previousClanRank: 12,
      donations: 2400,
      donationsReceived: 2900,
      townHallLevel: 14,
      warStars: 760
    },
    {
      tag: "#990ZXCPO",
      name: "AhmadSniper",
      role: "member",
      expLevel: 154,
      league: {
        name: "Master League II",
        iconUrl: "https://api-assets.clashofclans.com/leagues/72/4wtS1stWZQumNmAXekqhg_R4n0gK8jX7qW1eY8uM3sD.png"
      },
      trophies: 2980,
      builderBaseTrophies: 2450,
      clanRank: 12,
      previousClanRank: 11,
      donations: 1950,
      donationsReceived: 2100,
      townHallLevel: 14,
      warStars: 690
    }
  ]
};

export const mockHighlights: WarHighlight[] = [
  {
    id: "hl-cwl-01",
    title: "CWL Round 6: Penentu Promosi Master I vs Viking Elite",
    category: "cwl",
    opponentClan: "Viking Elite #89L0C",
    opponentTag: "#89L0C",
    videoUrl: "https://pub-cloudflare-r2.pasbarjaya.com/videos/cwl-round6-raja-perang.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
    stars: 3,
    destructionPercentage: 100,
    attackerName: "PBJ • RajaPerang",
    attackerTag: "#98YLP880",
    attackerTownHall: 17,
    defenderName: "OlafTheRed",
    defenderTownHall: 17,
    armyStrategy: "Root Rider + Super Archer Blimp Dive",
    armyIcons: ["Root Rider", "Super Archer", "Healer", "Grand Warden"],
    date: "24 Okt 2026",
    notes: "Clutch 3-star di detik ke-12 sisa waktu war! Mengamankan tiket juara 1 pool CWL dan promosi divisi."
  },
  {
    id: "hl-cwl-02",
    title: "Queen Charge Twin Hog Hybrid Anti 3-Star Base",
    category: "cwl",
    opponentClan: "Apex Predators #V9801",
    opponentTag: "#V9801",
    videoUrl: "https://pub-cloudflare-r2.pasbarjaya.com/videos/cwl-qc-hybrid-sultan.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop",
    stars: 3,
    destructionPercentage: 100,
    attackerName: "PBJ • SultanMinang",
    attackerTag: "#82CPL029",
    attackerTownHall: 17,
    defenderName: "ApexGeneral",
    defenderTownHall: 17,
    armyStrategy: "Queen Charge + Miner Hog Hybrid",
    armyIcons: ["Archer Queen", "Healer", "Hog Rider", "Miner"],
    date: "22 Okt 2026",
    notes: "Queen charge tembus ke core Town Hall & Eagle Artillery tanpa Spell Freeze terbuang."
  },
  {
    id: "hl-cwl-03",
    title: "Lalo Masterclass: 3 Bintang Bersih vs Maxed TH17",
    category: "cwl",
    opponentClan: "Dragon Heart #PL230",
    opponentTag: "#PL230",
    videoUrl: "https://pub-cloudflare-r2.pasbarjaya.com/videos/cwl-lalo-rizky.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=800&auto=format&fit=crop",
    stars: 3,
    destructionPercentage: 100,
    attackerName: "RizkyLaloGod",
    attackerTag: "#878TYUQW",
    attackerTownHall: 16,
    defenderName: "HeartDefender",
    defenderTownHall: 17,
    armyStrategy: "Sui Hero + LavaLoon Swarm",
    armyIcons: ["Lava Hound", "Balloon", "Minion", "Royal Champion"],
    date: "20 Okt 2026",
    notes: "Pukulan underdog TH16 meratakan base TH17 maxed dengan timing Warden Tome yang sempurna."
  },
  {
    id: "hl-classic-01",
    title: "Classic War: Perfect War 60/60 Bintang vs Tokyo Samurai",
    category: "classic",
    opponentClan: "Tokyo Samurai #KJ991",
    opponentTag: "#KJ991",
    videoUrl: "https://pub-cloudflare-r2.pasbarjaya.com/videos/classic-perfect-war-pbj.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800&auto=format&fit=crop",
    stars: 3,
    destructionPercentage: 100,
    attackerName: "Sikumbang • War",
    attackerTag: "#PL0921AQ",
    attackerTownHall: 17,
    defenderName: "KenjiLeader",
    defenderTownHall: 17,
    armyStrategy: "Zap Titan Smash + Flame Flinger",
    armyIcons: ["Electro Titan", "Flame Flinger", "Witches", "Earthquake"],
    date: "17 Okt 2026",
    notes: "Serangan pembuka nomor 1 musuh yang langsung meruntuhkan moral lawan. Skor akhir: 60 - 54."
  },
  {
    id: "hl-classic-02",
    title: "Comeback Dramatis Detik Terakhir War Win Streak ke-14",
    category: "classic",
    opponentClan: "Bayern Warriors #DE880",
    opponentTag: "#DE880",
    videoUrl: "https://pub-cloudflare-r2.pasbarjaya.com/videos/classic-clutch-alvaro.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop",
    stars: 3,
    destructionPercentage: 100,
    attackerName: "Alvaro • 3Star",
    attackerTag: "#998YCQOP",
    attackerTownHall: 16,
    defenderName: "KlausWar",
    defenderTownHall: 16,
    armyStrategy: "Super Bowler Smash + Log Launcher",
    armyIcons: ["Super Bowler", "Log Launcher", "Ice Golem", "Jump Spell"],
    date: "12 Okt 2026",
    notes: "War tersisa 40 detik, butuh 3 bintang untuk pertahankan win streak klan. Terlaksana 100% destruction!"
  },
  {
    id: "hl-classic-03",
    title: "Air Superiority: Mass Dragon + Overgrowth Spell Blitz",
    category: "classic",
    opponentClan: "Black Pearl Indo #ID009",
    opponentTag: "#ID009",
    videoUrl: "https://pub-cloudflare-r2.pasbarjaya.com/videos/classic-massdragon-garuda.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    stars: 3,
    destructionPercentage: 100,
    attackerName: "GarudaPasbar",
    attackerTag: "#288CVKLM",
    attackerTownHall: 16,
    defenderName: "KaptenJack",
    defenderTownHall: 16,
    armyStrategy: "Mass Dragon + Overgrowth + Battle Blimp",
    armyIcons: ["Dragon", "Dragon Rider", "Overgrowth Spell", "Freeze"],
    date: "05 Okt 2026",
    notes: "Overgrowth spell membekukan core Inferno & Eagle, naga menyapu sisi luar dengan mulus."
  }
];

export const mockEvents: ClanEvent[] = [
  {
    id: "ev-01",
    title: "CWL Bonus Star Challenge & Pasbar Championship",
    slug: "cwl-bonus-star-challenge-oktober",
    category: "War Championship",
    status: "active",
    startDate: "24 Okt 2026",
    endDate: "05 Nov 2026",
    bannerUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop",
    prizePool: "Rp 1.500.000 + Gold Pass Supercell Season Depan",
    description: "Event kompetisi internal klan PASBARJAYA untuk menentukan pembagian bonus medal CWL dan penghargaan pejuang tersolid! Poin dihitung dari perolehan bintang, persentase destruction rata-rata, dan disiplin war.",
    rules: [
      "Wajib gunakan 2x serangan pada Classic War dan 1x serangan tiap putaran CWL.",
      "Target serangan harus sesuai briefing Leader / Co-Leader di grup WhatsApp.",
      "Tiga bintang pada nomor atas klan lawan bernilai poin multiplier 1.5x.",
      "Pelanggaran absen war = pengurangan 50 poin leaderboard."
    ],
    leaderboard: [
      {
        rank: 1,
        playerName: "PBJ • RajaPerang",
        playerTag: "#98YLP880",
        townHallLevel: 17,
        score: 1480,
        starsEarned: 21,
        attacksUsed: 7
      },
      {
        rank: 2,
        playerName: "PBJ • SultanMinang",
        playerTag: "#82CPL029",
        townHallLevel: 17,
        score: 1420,
        starsEarned: 20,
        attacksUsed: 7
      },
      {
        rank: 3,
        playerName: "RizkyLaloGod",
        playerTag: "#878TYUQW",
        townHallLevel: 16,
        score: 1390,
        starsEarned: 20,
        attacksUsed: 7
      },
      {
        rank: 4,
        playerName: "Sikumbang • War",
        playerTag: "#PL0921AQ",
        townHallLevel: 17,
        score: 1310,
        starsEarned: 19,
        attacksUsed: 7
      },
      {
        rank: 5,
        playerName: "Alvaro • 3Star",
        playerTag: "#998YCQOP",
        townHallLevel: 16,
        score: 1250,
        starsEarned: 18,
        attacksUsed: 7
      },
      {
        rank: 6,
        playerName: "GarudaPasbar",
        playerTag: "#288CVKLM",
        townHallLevel: 16,
        score: 1190,
        starsEarned: 17,
        attacksUsed: 7
      },
      {
        rank: 7,
        playerName: "DatuakMaringgih",
        playerTag: "#34VBN890",
        townHallLevel: 15,
        score: 1120,
        starsEarned: 16,
        attacksUsed: 6
      },
      {
        rank: 8,
        playerName: "FadhilRootRider",
        playerTag: "#667UIOPM",
        townHallLevel: 15,
        score: 1040,
        starsEarned: 15,
        attacksUsed: 6
      }
    ]
  },
  {
    id: "ev-02",
    title: "Trophy Rush & Donasi Marathon Pasbar 2026",
    slug: "trophy-rush-donasi-marathon",
    category: "Push Trophy & Donasi",
    status: "upcoming",
    startDate: "10 Nov 2026",
    endDate: "20 Nov 2026",
    bannerUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop",
    prizePool: "Diamond CoC 5000 Gems + Merchandise Kaos Eksklusif PASBARJAYA",
    description: "Saatnya push rank sampai tembus Legend League! Anggota dengan kenaikan trofi tertinggi dan kontribusi donasi terbanyak akan membawa pulang merchandise eksklusif klan.",
    rules: [
      "Terbuka untuk seluruh member dari TH14 sampai TH17.",
      "Perhitungan donasi minimal 5.000 troops selama periode event.",
      "Kenaikan trofi dihitung dari baseline tanggal mulai event.",
      "Dilarang meminta troop klan untuk farming drop trofi disengaja."
    ],
    leaderboard: [
      {
        rank: 1,
        playerName: "PBJ • SultanMinang",
        playerTag: "#82CPL029",
        townHallLevel: 17,
        score: 500,
        starsEarned: 0,
        attacksUsed: 0
      },
      {
        rank: 2,
        playerName: "GarudaPasbar",
        playerTag: "#288CVKLM",
        townHallLevel: 16,
        score: 450,
        starsEarned: 0,
        attacksUsed: 0
      }
    ]
  },
  {
    id: "ev-03",
    title: "Clan Games Speedrun: Target 75.000 Poin 24 Jam",
    slug: "clan-games-speedrun-oktober",
    category: "Clan Games",
    status: "completed",
    startDate: "22 Sep 2026",
    endDate: "28 Sep 2026",
    bannerUrl: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=1200&auto=format&fit=crop",
    prizePool: "Tier 7 Full Reward Unlocked + Role Elder Promosi",
    description: "Tercapai sukses besar! Seluruh member PASBARJAYA berhasil membuka Tier 7 maksimal Clan Games hanya dalam tempo 28 jam.",
    rules: [
      "Setiap member wajib mencapai minimal 2.000 poin.",
      "Member yang mencapai 4.000 poin maksimal berhak memilih bonus tambahan."
    ],
    leaderboard: [
      {
        rank: 1,
        playerName: "PBJ • RajaPerang",
        playerTag: "#98YLP880",
        townHallLevel: 17,
        score: 4000,
        starsEarned: 12,
        attacksUsed: 12
      },
      {
        rank: 2,
        playerName: "RizkyLaloGod",
        playerTag: "#878TYUQW",
        townHallLevel: 16,
        score: 4000,
        starsEarned: 12,
        attacksUsed: 12
      },
      {
        rank: 3,
        playerName: "Sikumbang • War",
        playerTag: "#PL0921AQ",
        townHallLevel: 17,
        score: 4000,
        starsEarned: 12,
        attacksUsed: 12
      }
    ]
  }
];

export const mockFeedback: FeedbackSuggestion[] = [
  {
    id: "saran-01",
    senderName: "BintangPasbar",
    playerTag: "#112LKJMN",
    category: "war",
    message: "Izin saran min, untuk war Classic hari Sabtu kalau bisa rotasi base disamakan targetnya per level TH biar TH14 gak keteteran lawan mirror TH15.",
    createdAt: "28 Okt 2026",
    status: "pending"
  },
  {
    id: "saran-02",
    senderName: "FadhilRootRider",
    playerTag: "#667UIOPM",
    category: "event",
    message: "Keren banget ada leaderboard event di web! Saran kalau bisa nambahin mini turnamen 1v1 antar member klan di akhir bulan.",
    createdAt: "27 Okt 2026",
    status: "reviewed"
  },
  {
    id: "saran-03",
    senderName: "ClasherAnonim",
    category: "donasi",
    message: "Mohon ditegur member yang donasi goblin kalau permintaannya Super Archer untuk war pertahanan castle.",
    createdAt: "25 Okt 2026",
    status: "pending"
  }
];

export const mockAdmins: AdminUser[] = [
  {
    id: "adm-01",
    username: "leader_pasbar",
    email: "leader@pasbarjaya.com",
    role: "superadmin",
    cocTag: "#98YLP880",
    createdAt: "01 Jan 2026"
  },
  {
    id: "adm-02",
    username: "co_sultan",
    email: "sultan@pasbarjaya.com",
    role: "superadmin",
    cocTag: "#82CPL029",
    createdAt: "15 Jan 2026"
  },
  {
    id: "adm-03",
    username: "mod_alvaro",
    email: "alvaro@pasbarjaya.com",
    role: "moderator",
    cocTag: "#998YCQOP",
    createdAt: "01 Mar 2026"
  }
];

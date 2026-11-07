/**
 * Script Lokal: Sync Data Klan dari Supercell API ke MongoDB Atlas
 *
 * Cara pakai:
 * 1. Sekali jalan:
 *    node scripts/sync-clan.js
 *
 * 2. Jalan otomatis berulang tiap 5 menit (background):
 *    node scripts/sync-clan.js --watch
 */

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// 1. Baca .env.local
const envPath = path.resolve(__dirname, '../.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ File .env.local tidak ditemukan di:', envPath);
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
for (const line of envContent.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const idx = trimmed.indexOf('=');
    if (idx > -1) {
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
      env[key] = val;
    }
  }
}

const token = env.COC_API_TOKEN;
const rawTag = env.COC_CLAN_TAG || '#2JVVR0LLL';
const clanTag = rawTag.startsWith('#') ? rawTag : `#${rawTag}`;
const mongoUri = env.MONGODB_URI;

if (!token) {
  console.error('❌ COC_API_TOKEN belum diset di .env.local');
  process.exit(1);
}

if (!mongoUri) {
  console.error('❌ MONGODB_URI belum diset di .env.local');
  process.exit(1);
}

// 2. Schema Mongoose untuk ClanCache
const ClanCacheSchema = new mongoose.Schema(
  {
    clanTag: { type: String, required: true, unique: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    cachedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

const ClanCache = mongoose.models.ClanCache || mongoose.model('ClanCache', ClanCacheSchema);

function mapApiResponse(data, defaultTag) {
  return {
    tag: data.tag || defaultTag,
    name: data.name || 'PASBARJAYA',
    type: data.type || 'Invite Only',
    description: data.description || '',
    location: data.location || { id: 32000115, name: 'Indonesia', isCountry: true, countryCode: 'ID' },
    badgeUrl: data.badgeUrls?.large || data.badgeUrls?.medium || '',
    clanLevel: data.clanLevel || 1,
    clanPoints: data.clanPoints || 0,
    clanBuilderBasePoints: data.clanBuilderBasePoints || 0,
    clanCapitalPoints: data.clanCapital?.clanCapitalPoints || 0,
    capitalHallLevel: data.clanCapital?.capitalHallLevel || 1,
    requiredTrophies: data.requiredTrophies || 0,
    warFrequency: data.warFrequency || 'Always',
    warWinStreak: data.warWinStreak || 0,
    warWins: data.warWins || 0,
    warTies: data.warTies || 0,
    warLosses: data.warLosses || 0,
    warLeague: data.warLeague?.name || 'Unranked',
    membersCount: data.members || 0,
    memberList: (data.memberList || []).map((m, idx) => ({
      tag: m.tag,
      name: m.name,
      role: m.role === 'leader' ? 'leader' : m.role === 'coLeader' ? 'coLeader' : m.role === 'admin' ? 'admin' : 'member',
      expLevel: m.expLevel || 100,
      league: {
        name: m.league?.name || 'Unranked',
        iconUrl: m.league?.iconUrls?.medium || m.league?.iconUrls?.small || m.league?.iconUrls?.tiny || '',
      },
      builderBaseLeague: m.builderBaseLeague ? {
        name: m.builderBaseLeague.name,
        id: m.builderBaseLeague.id,
      } : undefined,
      trophies: m.trophies || 0,
      builderBaseTrophies: m.builderBaseTrophies || 0,
      clanRank: m.clanRank || idx + 1,
      previousClanRank: m.previousClanRank || idx + 1,
      donations: m.donations || 0,
      donationsReceived: m.donationsReceived || 0,
      townHallLevel: m.townHallLevel || 14,
      warStars: m.warStars || 0,
    })),
  };
}

async function runSync() {
  const timestamp = new Date().toLocaleTimeString('id-ID');
  console.log(`\n[${timestamp}] 🔄 Mengambil data real-time klan ${clanTag} dari Supercell API...`);

  try {
    const encodedTag = encodeURIComponent(clanTag);
    const res = await fetch(`https://api.clashofclans.com/v1/clans/${encodedTag}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`❌ Supercell API Gagal (HTTP ${res.status}): ${errText}`);
      return false;
    }

    const apiData = await res.json();
    const mapped = mapApiResponse(apiData, clanTag);

    console.log(`✅ Data diterima dari Supercell: "${mapped.name}" (Level ${mapped.clanLevel}, ${mapped.membersCount} Member)`);

    // Hubungkan ke MongoDB jika belum terhubung
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(mongoUri, { bufferCommands: false });
      console.log('✅ Terhubung ke MongoDB Atlas');
    }

    // Upsert ke ClanCache
    await ClanCache.findOneAndUpdate(
      { clanTag },
      { data: mapped, cachedAt: new Date() },
      { upsert: true, new: true }
    );

    console.log(`🚀 SUKSES! Data klan & member terbaru berhasil dipush ke MongoDB Atlas!`);
    console.log(`   Top 3 member saat ini:`);
    mapped.memberList.slice(0, 3).forEach((m, i) => {
      console.log(`   ${i + 1}. ${m.name} (${m.role}) - ${m.trophies} Trofi - TH${m.townHallLevel}`);
    });
    return true;
  } catch (err) {
    console.error('❌ Terjadi kesalahan saat sync:', err.message);
    return false;
  }
}

async function main() {
  const isWatch = process.argv.includes('--watch');

  await runSync();

  if (isWatch) {
    console.log('\n⏳ Mode Watch aktif: Script akan otomatis update data klan setiap 5 menit...');
    setInterval(async () => {
      await runSync();
    }, 5 * 60 * 1000); // 5 menit
  } else {
    process.exit(0);
  }
}

main();


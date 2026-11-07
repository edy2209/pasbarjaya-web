import { ClanData, ClanMember } from './types';
import { mockClanData } from './mock-data';
import connectMongo from './mongodb';
import { ClanCache } from './models';

const COC_API_BASE = 'https://api.clashofclans.com/v1';

/**
 * Ambil data clan:
 * 1. SELALU panggil langsung ke Supercell API secara real-time (tanpa TTL/cache)!
 * 2. Simpan hasil terbaru ke MongoDB sebagai backup.
 * 3. Jika API gagal (misal server down), baru gunakan data terakhir di MongoDB.
 * 4. Jika MongoDB juga belum ada, fallback mockData.
 */
export async function fetchClanData(): Promise<ClanData> {
  const rawTag = process.env.COC_CLAN_TAG || '#2JVVR0LLL';
  const clanTag = rawTag.startsWith('#') ? rawTag : `#${rawTag}`;
  const token = process.env.COC_API_TOKEN;

  // --- 1. SELALU LANGSUNG COBA COC API REALTIME ---
  if (token) {
    try {
      const encodedTag = encodeURIComponent(clanTag);
      const res = await fetch(`${COC_API_BASE}/clans/${encodedTag}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        cache: 'no-store',
      });

      if (res.ok) {
        const data = await res.json();
        const clanData = mapApiResponse(data, rawTag);

        // Update MongoDB secara asynchronous di background sebagai backup
        connectMongo().then(() => {
          ClanCache.findOneAndUpdate(
            { clanTag },
            { data: clanData, cachedAt: new Date() },
            { upsert: true }
          ).catch((e) => console.warn('MongoDB backup write error:', e));
        }).catch(() => {});

        console.log('⚡ Serving LIVE real-time CoC data directly from Supercell API!');
        return clanData;
      } else {
        const errText = await res.text();
        console.warn(`⚠️ CoC API error (${res.status}): ${errText}`);
      }
    } catch (e) {
      console.warn('⚠️ CoC API fetch failed:', e);
    }
  }

  // --- 2. Fallback: Hanya jika Supercell API gagal, ambil data terakhir di MongoDB ---
  try {
    await connectMongo();
    const cachedEntry: any = await ClanCache.findOne({ clanTag }).lean();
    if (cachedEntry?.data) {
      console.warn('⚠️ CoC API down/error, serving fallback from MongoDB');
      return cachedEntry.data as ClanData;
    }
  } catch (e) {
    console.warn('MongoDB fallback read error:', e);
  }

  // --- 3. Terakhir: Mock Data jika DB juga kosong ---
  console.warn('⚠️ No data available, using mock data');
  return mockClanData;
}

/**
 * Paksa refresh data dari CoC API dan simpan ke MongoDB.
 * Dipanggil dari endpoint /api/clan/refresh (admin only atau local).
 */
export async function refreshClanCache(): Promise<{ success: boolean; message: string }> {
  const rawTag = process.env.COC_CLAN_TAG || '#2JVVR0LLL';
  const clanTag = rawTag.startsWith('#') ? rawTag : `#${rawTag}`;
  const token = process.env.COC_API_TOKEN;

  if (!token) return { success: false, message: 'COC_API_TOKEN not set' };

  try {
    const encodedTag = encodeURIComponent(clanTag);
    const res = await fetch(`${COC_API_BASE}/clans/${encodedTag}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      cache: 'no-store',
    });

    if (!res.ok) {
      const errText = await res.text();
      return { success: false, message: `CoC API error (${res.status}): ${errText}` };
    }

    const data = await res.json();
    const clanData = mapApiResponse(data, rawTag);

    await connectMongo();
    await ClanCache.findOneAndUpdate(
      { clanTag },
      { data: clanData, cachedAt: new Date() },
      { upsert: true, new: true }
    );

    return { success: true, message: `Clan "${clanData.name}" (${clanData.membersCount} anggota) berhasil di-refresh!` };
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}

function mapApiResponse(data: any, rawTag: string): ClanData {
  return {
    tag: data.tag || rawTag,
    name: data.name || 'PASBARJAYA',
    type: data.type || 'Invite Only',
    description: data.description || mockClanData.description,
    location: data.location || { id: 32000115, name: 'Indonesia', isCountry: true, countryCode: 'ID' },
    badgeUrl: data.badgeUrls?.large || data.badgeUrls?.medium || mockClanData.badgeUrl,
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
    memberList: (data.memberList || []).map((m: any, idx: number): ClanMember => ({
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

import { ClanData, ClanMember } from './types';
import { mockClanData } from './mock-data';
import connectMongo from './mongodb';
import { ClanCache } from './models';

const COC_API_BASE = 'https://api.clashofclans.com/v1';
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 jam

/**
 * Ambil data clan:
 * 1. Coba baca cache dari MongoDB (maks 6 jam)
 * 2. Jika cache expired atau tidak ada → coba CoC API
 * 3. Jika CoC API gagal (IP ban, dll) → gunakan cache lama
 * 4. Jika tidak ada sama sekali → fallback mockData
 */
export async function fetchClanData(): Promise<ClanData> {
  const rawTag = process.env.COC_CLAN_TAG || '#2JVVR0LLL';
  const clanTag = rawTag.startsWith('#') ? rawTag : `#${rawTag}`;

  // --- 1. Baca cache dari MongoDB ---
  let cachedEntry: any = null;
  try {
    await connectMongo();
    cachedEntry = await ClanCache.findOne({ clanTag }).lean();
  } catch (e) {
    console.warn('MongoDB cache read error:', e);
  }

  const now = Date.now();
  const cacheAge = cachedEntry ? now - new Date(cachedEntry.cachedAt).getTime() : Infinity;
  const cacheIsFresh = cacheAge < CACHE_TTL_MS;

  if (cacheIsFresh && cachedEntry?.data) {
    console.log('✅ Serving CoC data from MongoDB cache');
    return cachedEntry.data as ClanData;
  }

  // --- 2. Coba CoC API ---
  const token = process.env.COC_API_TOKEN;
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

        // Simpan ke MongoDB cache
        try {
          await ClanCache.findOneAndUpdate(
            { clanTag },
            { data: clanData, cachedAt: new Date() },
            { upsert: true, new: true }
          );
          console.log('✅ CoC data fetched from API & saved to MongoDB cache');
        } catch (e) {
          console.warn('MongoDB cache write error:', e);
        }

        return clanData;
      } else {
        const errText = await res.text();
        console.warn(`⚠️ CoC API error (${res.status}): ${errText}`);
      }
    } catch (e) {
      console.warn('⚠️ CoC API fetch failed:', e);
    }
  }

  // --- 3. API gagal → gunakan cache lama walau sudah expired ---
  if (cachedEntry?.data) {
    console.warn('⚠️ CoC API failed, serving STALE cache from MongoDB');
    return cachedEntry.data as ClanData;
  }

  // --- 4. Tidak ada sama sekali → mock data ---
  console.warn('⚠️ No cache available, using mock data');
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

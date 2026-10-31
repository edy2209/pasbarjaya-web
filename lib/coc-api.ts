import { ClanData, ClanMember } from './types';
import { mockClanData } from './mock-data';

const COC_API_BASE = 'https://api.clashofclans.com/v1';

export async function fetchClanData(): Promise<ClanData> {
  const token = process.env.COC_API_TOKEN;
  const rawTag = process.env.COC_CLAN_TAG || '#2JVVR0LLL';
  const encodedTag = encodeURIComponent(rawTag.startsWith('#') ? rawTag : `#${rawTag}`);

  if (!token) {
    console.warn('COC_API_TOKEN not set, using mock data.');
    return mockClanData;
  }

  try {
    const res = await fetch(`${COC_API_BASE}/clans/${encodedTag}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`Supercell API error (${res.status}):`, errText);
      return mockClanData;
    }

    const data = await res.json();

    // Map Supercell API response to our ClanData interface
    const clanData: ClanData = {
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

    return clanData;
  } catch (error) {
    console.error('Failed to fetch from Supercell API:', error);
    return mockClanData;
  }
}

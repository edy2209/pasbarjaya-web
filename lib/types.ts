export type ClanRole = 'leader' | 'coLeader' | 'admin' | 'member';

export interface ClanMember {
  tag: string;
  name: string;
  role: ClanRole;
  expLevel: number;
  league: {
    name: string;
    iconUrl: string;
  };
  builderBaseLeague?: {
    name: string;
    id?: number;
  };
  trophies: number;
  builderBaseTrophies: number;
  clanRank: number;
  previousClanRank: number;
  donations: number;
  donationsReceived: number;
  townHallLevel: number;
  warStars: number;
}

export interface ClanData {
  tag: string;
  name: string;
  type: string;
  description: string;
  location: {
    id: number;
    name: string;
    isCountry: boolean;
    countryCode: string;
  };
  badgeUrl: string;
  clanLevel: number;
  clanPoints: number;
  clanBuilderBasePoints: number;
  clanCapitalPoints: number;
  capitalHallLevel: number;
  requiredTrophies: number;
  warFrequency: string;
  warWinStreak: number;
  warWins: number;
  warTies: number;
  warLosses: number;
  warLeague: string;
  membersCount: number;
  memberList: ClanMember[];
}

export type HighlightCategory = 'cwl' | 'classic';

export interface WarHighlight {
  id: string;
  title: string;
  category: HighlightCategory;
  opponentClan: string;
  opponentTag: string;
  videoUrl: string; // Cloudflare R2 generated URL
  thumbnailUrl: string;
  stars: number;
  destructionPercentage: number;
  attackerName: string;
  attackerTag: string;
  attackerTownHall: number;
  defenderName: string;
  defenderTownHall: number;
  armyStrategy: string;
  armyIcons: string[];
  date: string;
  notes?: string;
}

export interface LeaderboardEntry {
  rank: number;
  playerName: string;
  playerTag: string;
  townHallLevel: number;
  score: number;
  starsEarned: number;
  attacksUsed: number;
}

export interface ClanEvent {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: 'active' | 'upcoming' | 'completed';
  startDate: string;
  endDate: string;
  bannerUrl: string;
  prizePool: string;
  description: string;
  rules: string[];
  leaderboard: LeaderboardEntry[];
}

export interface FeedbackSuggestion {
  id: string;
  senderName: string;
  playerTag?: string;
  category: 'war' | 'event' | 'donasi' | 'umum';
  message: string;
  createdAt: string;
  status: 'pending' | 'reviewed';
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'superadmin' | 'moderator';
  cocTag?: string;
  createdAt: string;
}

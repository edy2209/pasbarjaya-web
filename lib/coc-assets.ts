// Helper utility for Town Hall visual themes, images, and league data

export interface TownHallTheme {
  name: string;
  short: string;
  themeColor: string;
  borderColor: string;
  bgGradient: string;
  glowColor: string;
  imagePath: string;
}

export function getTownHallTheme(th: number): TownHallTheme {
  // Clamped between 8 and 18
  const validLevel = Math.max(8, Math.min(18, th || 14));
  const imagePath = `/images/townhalls/th${validLevel}.png`;

  switch (validLevel) {
    case 18:
      return {
        name: 'Town Hall 18 (Divine Core)',
        short: 'TH 18',
        themeColor: 'text-amber-300',
        borderColor: 'border-amber-400',
        bgGradient: 'from-amber-950/70 via-yellow-950/40 to-slate-950',
        glowColor: 'rgba(245, 158, 11, 0.5)',
        imagePath
      };
    case 17:
      return {
        name: 'Town Hall 17 (Eagle Crystal)',
        short: 'TH 17',
        themeColor: 'text-cyan-300',
        borderColor: 'border-cyan-400',
        bgGradient: 'from-cyan-950/70 via-teal-950/40 to-slate-950',
        glowColor: 'rgba(6, 182, 212, 0.5)',
        imagePath
      };
    case 16:
      return {
        name: 'Town Hall 16 (Nature Tree)',
        short: 'TH 16',
        themeColor: 'text-red-400',
        borderColor: 'border-red-500',
        bgGradient: 'from-red-950/70 via-amber-950/40 to-slate-950',
        glowColor: 'rgba(239, 68, 68, 0.5)',
        imagePath
      };
    case 15:
      return {
        name: 'Town Hall 15 (Astral Magic)',
        short: 'TH 15',
        themeColor: 'text-purple-300',
        borderColor: 'border-purple-500',
        bgGradient: 'from-purple-950/70 via-indigo-950/40 to-slate-950',
        glowColor: 'rgba(147, 51, 234, 0.5)',
        imagePath
      };
    case 14:
      return {
        name: 'Town Hall 14 (Jungle Temple)',
        short: 'TH 14',
        themeColor: 'text-emerald-300',
        borderColor: 'border-emerald-500',
        bgGradient: 'from-emerald-950/70 via-amber-950/40 to-slate-950',
        glowColor: 'rgba(16, 185, 129, 0.5)',
        imagePath
      };
    case 13:
      return {
        name: 'Town Hall 13 (Ice Inferno)',
        short: 'TH 13',
        themeColor: 'text-sky-300',
        borderColor: 'border-sky-500',
        bgGradient: 'from-sky-950/70 via-blue-950/40 to-slate-950',
        glowColor: 'rgba(14, 165, 233, 0.5)',
        imagePath
      };
    case 12:
      return {
        name: 'Town Hall 12 (Giga Tesla)',
        short: 'TH 12',
        themeColor: 'text-blue-400',
        borderColor: 'border-blue-500',
        bgGradient: 'from-blue-950/70 via-slate-900 to-slate-950',
        glowColor: 'rgba(59, 130, 246, 0.5)',
        imagePath
      };
    case 11:
      return {
        name: 'Town Hall 11 (White Marble)',
        short: 'TH 11',
        themeColor: 'text-slate-100',
        borderColor: 'border-amber-300',
        bgGradient: 'from-slate-800/80 via-slate-900 to-slate-950',
        glowColor: 'rgba(251, 191, 36, 0.4)',
        imagePath
      };
    case 10:
      return {
        name: 'Town Hall 10 (Lava Fortress)',
        short: 'TH 10',
        themeColor: 'text-rose-400',
        borderColor: 'border-rose-600',
        bgGradient: 'from-rose-950/70 via-slate-900 to-slate-950',
        glowColor: 'rgba(225, 29, 72, 0.5)',
        imagePath
      };
    case 9:
      return {
        name: 'Town Hall 9 (Dark Citadel)',
        short: 'TH 9',
        themeColor: 'text-slate-300',
        borderColor: 'border-slate-500',
        bgGradient: 'from-slate-900 via-slate-950 to-black',
        glowColor: 'rgba(148, 163, 184, 0.4)',
        imagePath
      };
    default:
      return {
        name: 'Town Hall 8 (Stone Keep)',
        short: 'TH 8',
        themeColor: 'text-amber-400',
        borderColor: 'border-amber-600',
        bgGradient: 'from-amber-950/60 via-slate-900 to-slate-950',
        glowColor: 'rgba(217, 119, 6, 0.4)',
        imagePath
      };
  }
}

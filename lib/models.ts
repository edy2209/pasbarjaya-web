import mongoose, { Schema, Document, Model } from 'mongoose';

// ============================================================
// 1. HIGHLIGHT MODEL
// ============================================================
export interface IHighlight extends Document {
  title: string;
  type: 'classic' | 'cwl';
  attackerName: string;
  attackerTownHall: number;
  defenderName: string;
  defenderTownHall: number;
  stars: number;
  destructionPercent: number;
  strategy: string;
  notes: string;
  opponentClan: string;
  warDate: string;
  videoUrl: string;       // R2 URL or YouTube URL
  thumbnailUrl: string;   // R2 URL
  isYoutube: boolean;
  views: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HighlightSchema = new Schema<IHighlight>(
  {
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ['classic', 'cwl'], default: 'classic' },
    attackerName: { type: String, required: true, trim: true },
    attackerTownHall: { type: Number, required: true, min: 1, max: 17 },
    defenderName: { type: String, required: true, trim: true },
    defenderTownHall: { type: Number, required: true, min: 1, max: 17 },
    stars: { type: Number, default: 3, min: 0, max: 3 },
    destructionPercent: { type: Number, default: 100, min: 0, max: 100 },
    strategy: { type: String, default: '', trim: true },
    notes: { type: String, default: '', trim: true },
    opponentClan: { type: String, default: '', trim: true },
    warDate: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    thumbnailUrl: { type: String, default: '' },
    isYoutube: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ============================================================
// 2. CLAN EVENT MODEL
// ============================================================
export interface IEventParticipant {
  rank: number;
  playerTag: string;
  playerName: string;
  score: number;
  starsEarned: number;
  attacksUsed: number;
  avatar: string;
}

export interface IClanEvent extends Document {
  title: string;
  description: string;
  type: string;
  status: 'upcoming' | 'active' | 'ended';
  startDate: string;
  endDate: string;
  prizePool: string;
  rules: string[];
  participants: IEventParticipant[];
  createdAt: Date;
  updatedAt: Date;
}

const EventParticipantSchema = new Schema<IEventParticipant>(
  {
    rank: { type: Number, required: true },
    playerTag: { type: String, default: '' },
    playerName: { type: String, required: true, trim: true },
    score: { type: Number, default: 0 },
    starsEarned: { type: Number, default: 0 },
    attacksUsed: { type: Number, default: 0 },
    avatar: { type: String, default: '' },
  },
  { _id: false }
);

const ClanEventSchema = new Schema<IClanEvent>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    type: {
      type: String,
      default: 'custom',
      trim: true,
    },
    status: {
      type: String,
      enum: ['upcoming', 'active', 'ended'],
      default: 'upcoming',
    },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    prizePool: { type: String, default: '' },
    rules: [{ type: String }],
    participants: [EventParticipantSchema],
  },
  { timestamps: true }
);

// ============================================================
// 3. FEEDBACK / SARAN MODEL
// ============================================================
export interface IFeedback extends Document {
  senderName: string;
  playerTag: string;
  category: string;
  message: string;
  status: 'pending' | 'reviewed' | 'implemented' | 'rejected';
  adminNote: string;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    senderName: { type: String, required: true, trim: true },
    playerTag: { type: String, default: '', trim: true },
    category: {
      type: String,
      default: 'general',
      trim: true,
    },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'implemented', 'rejected'],
      default: 'pending',
    },
    adminNote: { type: String, default: '' },
  },
  { timestamps: true }
);

// ============================================================
// 4. ADMIN USER MODEL
// ============================================================
export interface IAdminUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  role: 'superadmin' | 'admin';
  isActive: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const AdminUserSchema = new Schema<IAdminUser>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['superadmin', 'admin'], default: 'admin' },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date, default: null },
  },
  { timestamps: true }
);

// ============================================================
// EXPORT MODELS (force-reset cache so schema changes apply)
// ============================================================
if (mongoose.models.Highlight) delete mongoose.models.Highlight;
if (mongoose.models.ClanEvent) delete mongoose.models.ClanEvent;
if (mongoose.models.Feedback) delete mongoose.models.Feedback;
if (mongoose.models.AdminUser) delete mongoose.models.AdminUser;

export const Highlight: Model<IHighlight> =
  mongoose.model<IHighlight>('Highlight', HighlightSchema);

export const ClanEvent: Model<IClanEvent> =
  mongoose.model<IClanEvent>('ClanEvent', ClanEventSchema);

export const Feedback: Model<IFeedback> =
  mongoose.model<IFeedback>('Feedback', FeedbackSchema);

export const AdminUser: Model<IAdminUser> =
  mongoose.model<IAdminUser>('AdminUser', AdminUserSchema);

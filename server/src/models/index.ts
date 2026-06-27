import mongoose, { Schema } from "mongoose";
import type { ContentKey } from "../config.js";

export interface SectionContentDoc {
  key: ContentKey;
  data: unknown;
  updatedAt: Date;
}

const sectionContentSchema = new Schema<SectionContentDoc>(
  {
    key: { type: String, required: true, unique: true, index: true },
    data: { type: Schema.Types.Mixed, required: true },
    updatedAt: { type: Date, default: Date.now },
  },
  { versionKey: false },
);

export const SectionContent =
  mongoose.models.SectionContent ??
  mongoose.model<SectionContentDoc>("SectionContent", sectionContentSchema);

export interface VisitSessionDoc {
  sessionId: string;
  firstSeen: Date;
  lastSeen: Date;
}

const visitSessionSchema = new Schema<VisitSessionDoc>(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    firstSeen: { type: Date, required: true },
    lastSeen: { type: Date, required: true, index: true },
  },
  { versionKey: false },
);

export const VisitSession =
  mongoose.models.VisitSession ??
  mongoose.model<VisitSessionDoc>("VisitSession", visitSessionSchema);

export interface SiteStatsDoc {
  _id: "global";
  totalVisits: number;
}

const siteStatsSchema = new Schema<SiteStatsDoc>(
  {
    _id: { type: String, default: "global" },
    totalVisits: { type: Number, default: 0 },
  },
  { versionKey: false },
);

export const SiteStats =
  mongoose.models.SiteStats ??
  mongoose.model<SiteStatsDoc>("SiteStats", siteStatsSchema);

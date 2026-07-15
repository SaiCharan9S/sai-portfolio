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

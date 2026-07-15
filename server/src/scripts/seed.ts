import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CONTENT_KEYS, contentFileName } from "../config.js";
import { connectDb, disconnectDb } from "../db.js";
import { SectionContent } from "../models/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.resolve(__dirname, "../../../src/data/content");

async function seed() {
  await connectDb();

  for (const key of CONTENT_KEYS) {
    const filePath = path.join(contentDir, `${contentFileName(key)}.json`);
    const raw = await fs.readFile(filePath, "utf8");
    const data = JSON.parse(raw) as unknown;

    await SectionContent.findOneAndUpdate(
      { key },
      { data, updatedAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    console.log(`Seeded ${key}`);
  }

  console.log("Seed complete");
  await disconnectDb();
}

seed().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});

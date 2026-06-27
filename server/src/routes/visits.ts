import { Router } from "express";
import { config } from "../config.js";
import { SiteStats, VisitSession } from "../models/index.js";

export const visitsRouter = Router();

async function pruneStaleSessions() {
  const cutoff = new Date(Date.now() - config.liveVisitorWindowMs);
  await VisitSession.deleteMany({ lastSeen: { $lt: cutoff } });
}

visitsRouter.post("/ping", async (req, res) => {
  try {
    const sessionId =
      typeof req.body?.sessionId === "string" ? req.body.sessionId.trim() : "";

    if (!sessionId || sessionId.length > 128) {
      res.status(400).json({ error: "Invalid sessionId" });
      return;
    }

    const now = new Date();
    const result = await VisitSession.updateOne(
      { sessionId },
      {
        $set: { lastSeen: now },
        $setOnInsert: { firstSeen: now, sessionId },
      },
      { upsert: true },
    );

    if (result.upsertedCount > 0) {
      await SiteStats.findByIdAndUpdate(
        "global",
        { $inc: { totalVisits: 1 } },
        { upsert: true, setDefaultsOnInsert: true },
      );
    }

    await pruneStaleSessions();

    res.json({ ok: true });
  } catch (error) {
    console.error("POST /api/visits/ping", error);
    res.status(500).json({ error: "Failed to record visit" });
  }
});

visitsRouter.get("/stats", async (_req, res) => {
  try {
    await pruneStaleSessions();

    const cutoff = new Date(Date.now() - config.liveVisitorWindowMs);
    const [liveVisitors, stats] = await Promise.all([
      VisitSession.countDocuments({ lastSeen: { $gte: cutoff } }),
      SiteStats.findById("global").lean(),
    ]);

    res.json({
      liveVisitors,
      totalVisits: stats?.totalVisits ?? 0,
    });
  } catch (error) {
    console.error("GET /api/visits/stats", error);
    res.status(500).json({ error: "Failed to fetch visit stats" });
  }
});

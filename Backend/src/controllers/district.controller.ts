import { Request, Response } from "express";
import District from "../models/district.model";
import { fetchFromExternalAPI } from "../lib/externalAPI";
import sampleData from "../lib/data/mgnregaSample.json" ;

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; 

export const getDistrict = async (req: Request, res: Response) => {
  try {
    const name = (req.query.name as string)?.trim() || "Nalbari";

    // Find cached data (case-insensitive)
    const cached = await District.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });

    if (cached?.lastUpdated) {
      const last = new Date(cached.lastUpdated).getTime();
      if (Date.now() - last < CACHE_TTL_MS) {
        console.log(`📦 Using cached data for ${name}`);
        return res.json(cached);
      }
    }

    // Fetch from external API
    const external = await fetchFromExternalAPI(name);
    let finalData;

    if (external) {
      finalData = external;
    } else {
      console.warn(`⚠️ Falling back to sample data for ${name}`);
      const fallback = (sampleData as any[]).find(
        (d) => d.name.toLowerCase() === name.toLowerCase()
      );
      finalData =
        fallback ?? {
          name,
          state: "",
          year: "2024-25",
          month: "",
          approvedLabourBudget: 0,
          averageWageRate: 0,
          averageDaysEmployment: 0,
          scPersondays: 0,
          stPersondays: 0,
          totalHouseholdsWorked: 0,
          totalIndividualsWorked: 0,
          totalExpenditure: 0,
          womenPersondays: 0,
          completedWorks: 0,
          ongoingWorks: 0,
          remarks: "No data available",
          lastUpdated: new Date().toISOString(),
        };
    }

    await District.updateOne(
      { name: { $regex: `^${name}$`, $options: "i" } },
      { $set: finalData },
      { upsert: true }
    );

    console.log(`✅ Cached new data for ${name}`);
    res.json(finalData);
  } catch (err: any) {
    console.error("❌ district API error:", err);
    const fallback = (sampleData as any[])[0];
    res.status(500).json({
      ...(fallback ?? { name: "unknown", state: "", year: "", month: "" }),
      lastUpdated: new Date().toISOString(),
      error: err.message || String(err),
    });
  }
};

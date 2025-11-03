import { Request, Response } from "express";
import axios from "axios";

export const reverseGeocode = async (req: Request, res: Response) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Missing coordinates (lat, lon)" });
  }

  const latNum = Number(lat);
  const lonNum = Number(lon);

  if (Number.isNaN(latNum) || Number.isNaN(lonNum)) {
    return res.status(400).json({ error: "Invalid coordinates" });
  }

  const API_KEY = process.env.OPENCAGE_API_KEY;
  if (!API_KEY) {
    console.warn("OPENCAGE_API_KEY not set");
    return res.status(500).json({ error: "Server missing OPENCAGE_API_KEY" });
  }

  try {
    const q = encodeURIComponent(`${latNum},${lonNum}`);
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${q}&key=${API_KEY}&countrycode=in&no_annotations=1&language=en`;

    const { data } = await axios.get(url);

    const components = data?.results?.[0]?.components ?? null;
    const district =
      components?.state_district ||
      components?.county ||
      components?.city ||
      components?.town ||
      components?.village ||
      components?.state ||
      null;

    if (!district) {
      return res.status(404).json({ error: "District not found" });
    }

    return res.json({
      district,
      state: components?.state ?? null,
      formatted: data?.results?.[0]?.formatted ?? null,
    });
  } catch (err) {
    console.error("Reverse geocode error:", err);
    return res.status(500).json({ error: "Failed to fetch location" });
  }
};

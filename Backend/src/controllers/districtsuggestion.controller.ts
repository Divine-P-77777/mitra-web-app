import { Request, Response } from "express";
import axios from "axios";

export const getDistrictSuggestions = async (req: Request, res: Response) => {
  const query = req.query.query as string;
  if (!query) return res.status(400).json({ error: "Missing query" });

  const API_KEY = process.env.LOCATIONIQ_API_KEY;
  if (!API_KEY) {
    console.error("❌ Missing LOCATIONIQ_API_KEY in .env");
    return res.status(500).json({ error: "Server configuration error" });
  }

  const url = `https://us1.locationiq.com/v1/autocomplete?key=${API_KEY}&q=${encodeURIComponent(
    query
  )}&limit=10&countrycodes=in&normalizeaddress=1`;

  try {
    const { data } = await axios.get(url);

    const districts = data
      .filter(
        (item: any) =>
          item.address && (item.address.county || item.address.state_district)
      )
      .map((item: any) => item.address.county || item.address.state_district)
      .filter(
        (value: string, index: number, self: string[]) =>
          value && self.indexOf(value) === index
      );

    res.json(districts);
  } catch (error: any) {
    console.error("Error fetching district suggestions:", error.message);
    res.status(500).json({ error: "Failed to fetch district suggestions" });
  }
};

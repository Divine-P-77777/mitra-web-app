import { IDistrict } from "../models/district.model.js";

export const fetchFromExternalAPI = async (name: string): Promise<IDistrict | null> => {
  try {
    const API_KEY = process.env.DATA_GOV_API_KEY;
    if (!API_KEY) {
      console.warn("⚠️ DATA_GOV_API_KEY is not set — skipping external fetch");
      return null;
    }

    const RESOURCE_ID = "ee03643a-ee4c-48c2-ac30-9f2ff26ab722";
    const url = `https://api.data.gov.in/resource/${RESOURCE_ID}?format=json&limit=1&api-key=${API_KEY}&filters[district_name]=${encodeURIComponent(
      name.toUpperCase()
    )}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`External API request failed with status ${res.status}`);
    const data = await res.json();
    const record = data.records?.[0];
    if (!record) return null;

    return {
      name: record["district_name"] || name,
      state: record["state_name"] || "",
      year: record["fin_year"] || "",
      month: record["month"] || "",
      approvedLabourBudget: Number(record["Approved_Labour_Budget"] ?? 0),
      averageWageRate: Number(record["Average_Wage_rate_per_day_per_person"] ?? 0),
      averageDaysEmployment: Number(record["Average_days_of_employment_provided_per_Household"] ?? 0),
      scPersondays: Number(record["SC_persondays"] ?? 0),
      stPersondays: Number(record["ST_persondays"] ?? 0),
      totalHouseholdsWorked: Number(record["Total_Households_Worked"] ?? 0),
      totalIndividualsWorked: Number(record["Total_Individuals_Worked"] ?? 0),
      totalExpenditure: Number(record["Total_Exp"] ?? 0),
      womenPersondays: Number(record["Women_Persondays"] ?? 0),
      completedWorks: Number(record["Number_of_Completed_Works"] ?? 0),
      ongoingWorks: Number(record["Number_of_Ongoing_Works"] ?? 0),
      remarks: record["Remarks"] ?? "",
      lastUpdated: new Date().toISOString(),
    } as IDistrict;
  } catch (error) {
    console.error("❌ Failed to fetch external API:", error);
    return null;
  }
};

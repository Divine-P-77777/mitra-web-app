import mongoose, { Schema, Document } from "mongoose";

export interface IDistrict extends Document {
  name: string;
  state: string;
  year: string;
  month: string;
  approvedLabourBudget: number;
  averageWageRate: number;
  averageDaysEmployment: number;
  scPersondays: number;
  stPersondays: number;
  totalHouseholdsWorked: number;
  totalIndividualsWorked: number;
  totalExpenditure: number;
  womenPersondays: number;
  completedWorks: number;
  ongoingWorks: number;
  remarks?: string;
  lastUpdated?: string;
}

const DistrictSchema = new Schema<IDistrict>({
  name: { type: String, required: true },
  state: String,
  year: String,
  month: String,
  approvedLabourBudget: Number,
  averageWageRate: Number,
  averageDaysEmployment: Number,
  scPersondays: Number,
  stPersondays: Number,
  totalHouseholdsWorked: Number,
  totalIndividualsWorked: Number,
  totalExpenditure: Number,
  womenPersondays: Number,
  completedWorks: Number,
  ongoingWorks: Number,
  remarks: String,
  lastUpdated: String,
});

export default mongoose.model<IDistrict>("District", DistrictSchema);

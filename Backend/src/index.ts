import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import districtRoutes from "./routes/district.routes";
import geocodeRoutes from "./routes/geocode.routes";
import districtSuggestionRoutes from "./routes/districtsuggestion.routes";
import { connectDB } from "./config/db";



const app = express();
const PORT = process.env.PORT || 5000;

// Dynamic CORS setup
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_URL
    : "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

// Mount routes
app.use("/api", districtRoutes);

app.use("/api", geocodeRoutes);
app.use("/api", districtSuggestionRoutes);

app.get("/", (req, res) => {
  res.send(" Mitra Backend running with TypeScript + Express + MongoDB");
});

connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

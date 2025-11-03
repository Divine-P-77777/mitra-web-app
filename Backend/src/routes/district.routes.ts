import express from "express";
import { getDistrict } from "../controllers/district.controller";

const router = express.Router();

// Route: GET /api/district?name=Nalbari
router.get("/district", getDistrict);

export default router;

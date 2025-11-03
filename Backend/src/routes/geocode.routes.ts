import express from "express";
import { reverseGeocode } from "../controllers/geocode.controller";

const router = express.Router();

// GET /api/reverse-geocode?lat=xx&lon=yy
router.get("/reverse-geocode", reverseGeocode);

export default router;

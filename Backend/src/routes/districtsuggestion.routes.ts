import express from "express";
import { getDistrictSuggestions } from "../controllers/districtsuggestion.controller";

const router = express.Router();

router.get("/district-suggestions", getDistrictSuggestions);

export default router;

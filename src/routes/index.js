import express from "express";
import { getDetailsController } from "../controllers/index.js";
const router = express.Router();
router.get("/", getDetailsController);
router.post("/seed",seedProductsController)

export default router;

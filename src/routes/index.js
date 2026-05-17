import express from "express";
import {
	getProductsController,
	seedProductsController,
} from "../controllers/index.js";
const router = express.Router();
router.get("/", getProductsController);
router.post("/seed", seedProductsController);

export default router;

import express from "express";
import {
	getProductsController,
	seedProductsController,
	updateProductController,
} from "../controllers/index.js";
const router = express.Router();
router.get("/", getProductsController);
router.post("/seed", seedProductsController);
router.put("/update/:id",updateProductController)

export default router;

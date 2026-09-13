import { Router } from "express";
import {
  createInventoryItem,
  listInventoryItems,
} from "../controllers/inventoryController.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validationMiddleware.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(requireAuth);
router.get("/", asyncHandler(listInventoryItems));
router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("category").trim().notEmpty().withMessage("Category is required"),
    body("purchasingPrice")
      .isFloat({ min: 0 })
      .withMessage("Purchasing price must be non-negative"),
    body("sellingPrice")
      .isFloat({ min: 0 })
      .withMessage("Selling price must be non-negative"),
    body("minimumThreshold")
      .isInt({ min: 0 })
      .withMessage("Minimum threshold must be non-negative"),
    body("stock")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Stock must be non-negative"),
  ],
  validateRequest,
  asyncHandler(createInventoryItem),
);

export default router;

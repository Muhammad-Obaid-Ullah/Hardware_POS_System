import { Router } from "express";
import {
  adjustInventoryStock,
  createInventoryItem,
  deleteInventoryItem,
  listInventoryItems,
  updateInventoryItem,
} from "../controllers/inventoryController.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validationMiddleware.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(requireAuth);
router.get("/", asyncHandler(listInventoryItems));
router.patch("/:id/stock", asyncHandler(adjustInventoryStock));
router.patch("/:id", asyncHandler(updateInventoryItem));
router.delete("/:id", asyncHandler(deleteInventoryItem));
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
      .optional()
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

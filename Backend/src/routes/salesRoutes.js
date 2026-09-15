import { Router } from "express";
import { body } from "express-validator";
import {
  createSale,
  listSales,
  refundSale,
} from "../controllers/salesController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validationMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
router.use(requireAuth);

router.get("/", asyncHandler(listSales));
router.patch(
  "/:number/refund",
  body("items")
    .optional()
    .isArray()
    .withMessage("Refund items must be an array"),
  validateRequest,
  asyncHandler(refundSale),
);
router.post(
  "/",
  [
    body("items")
      .isArray({ min: 1 })
      .withMessage("At least one item is required"),
    body("paymentMethod")
      .isIn(["cash", "online"])
      .withMessage("Invalid payment method"),
    body("transactionNumber").optional().isString(),
  ],
  validateRequest,
  asyncHandler(createSale),
);

export default router;

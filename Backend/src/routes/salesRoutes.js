import { Router } from "express";
import { body, query } from "express-validator";
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

router.get(
  "/",
  [
    query("fromDate")
      .optional()
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage("fromDate must use YYYY-MM-DD format"),
    query("toDate")
      .optional()
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage("toDate must use YYYY-MM-DD format"),
  ],
  validateRequest,
  asyncHandler(listSales),
);
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

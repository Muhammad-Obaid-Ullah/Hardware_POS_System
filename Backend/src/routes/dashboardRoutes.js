import { Router } from "express";
import { query } from "express-validator";
import { getDashboardSummary } from "../controllers/dashboardController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validationMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
router.use(requireAuth);
router.get(
  "/summary",
  [
    query("fromDate")
      .optional({ values: "falsy" })
      .matches(/^\d{4}-\d{2}-\d{2}$/),
    query("toDate")
      .optional({ values: "falsy" })
      .matches(/^\d{4}-\d{2}-\d{2}$/),
  ],
  validateRequest,
  asyncHandler(getDashboardSummary),
);

export default router;

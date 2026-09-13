import { Router } from "express";
import { body } from "express-validator";
import { getSession, login, logout } from "../controllers/authController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validationMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("A valid email is required"),
    body("password").isString().notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  asyncHandler(login),
);

router.get("/session", requireAuth, asyncHandler(getSession));
router.post("/logout", logout);

export default router;

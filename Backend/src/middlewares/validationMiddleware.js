import { validationResult } from "express-validator";

export function validateRequest(request, response, next) {
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    return response.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  next();
}

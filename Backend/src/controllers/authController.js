import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function login(request, response) {
  const email = request.body.email.trim().toLowerCase();
  const { password } = request.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return response.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const token = jwt.sign(
    { email: user.email, role: user.role },
    getJwtSecret(),
    { subject: user.id, expiresIn: "24h" },
  );

  response.cookie("pos_token", token, {
    httpOnly: true,
    sameSite: "none",
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000,
  });

  response.json({
    success: true,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    user: { id: user.id, email: user.email, role: user.role },
  });
}

export function getSession(request, response) {
  response.json({
    success: true,
    user: {
      id: request.user.sub,
      email: request.user.email,
      role: request.user.role,
    },
    expiresAt: request.user.exp * 1000,
  });
}

export function logout(request, response) {
  response.clearCookie("pos_token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  response.status(204).end();
}

function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return process.env.JWT_SECRET;
}

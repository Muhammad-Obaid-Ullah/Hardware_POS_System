import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

function getMongoConnectionString() {
  const template = process.env.MONGODB_URI;
  const username = process.env.MONGODB_USERNAME;
  const password = process.env.MONGODB_PASSWORD;

  if (!template) {
    throw new Error("MONGODB_URI is not configured");
  }

  return template
    .replace(
      "<db_username>",
      username ? encodeURIComponent(username) : "<db_username>",
    )
    .replace(
      "<db_password>",
      password ? encodeURIComponent(password) : "<db_password>",
    );
}

export async function connectDatabase() {
  await mongoose.connect(getMongoConnectionString());
  await ensureAdminUser();
  console.log("MongoDB connected");
}

async function ensureAdminUser() {
  const email = process.env.ADMIN_EMAIL;
  const normalizedEmail = email?.toLowerCase();

  if (normalizedEmail && (await User.exists({ email: normalizedEmail }))) {
    return;
  }

  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are not configured");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await User.updateOne(
    { email: normalizedEmail },
    { $setOnInsert: { email: normalizedEmail, passwordHash, role: "admin" } },
    { upsert: true },
  );
}

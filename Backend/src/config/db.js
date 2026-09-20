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
  console.log("MongoDB connected");
}

import jwt from "jsonwebtoken";

export function requireAuth(request, response, next) {
  const authorization = request.get("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : request.cookies.pos_token;

  if (!token) {
    return response.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  try {
    request.user = jwt.verify(token, getJwtSecret());
    next();
  } catch {
    return response.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}

function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return process.env.JWT_SECRET;
}

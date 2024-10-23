import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../types/api";

export const auth: RequestHandler = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(400).json({
      success: false,
      message: "No token provided",
    } satisfies ApiResponse);
    return;
  }

  try {
    const payload = jwt.verify(token, "jwt_secret");
    (req as any).user = payload;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "Unauthorized" } satisfies ApiResponse);
    return;
  }
};

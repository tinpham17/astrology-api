import { RequestHandler } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { ApiResponse } from "../types/api";
import jwt from "jsonwebtoken";

const requestPasswordResetSchema = z.object({
  email: z.string(),
});

export const requestPasswordReset: RequestHandler = async (req, res) => {
  const validationResult = requestPasswordResetSchema.safeParse(req.body);

  if (!validationResult.success) {
    res.status(400).json({
      success: false,
      message: "Validation error",
      data: validationResult.error.errors,
    } satisfies ApiResponse<z.ZodIssue[]>);
    return;
  }

  const { email } = validationResult.data;

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    res.status(400).json({
      success: false,
      message: "User not found",
    } satisfies ApiResponse);
    return;
  }

  const resetToken = jwt.sign({ email: user.email }, "jwt_secret", {
    expiresIn: "1h",
  });

  res.status(200).json({
    success: true,
    message: "Password reset requested",
    data: {
      resetToken,
    },
  } satisfies ApiResponse<{ resetToken: string }>);
};

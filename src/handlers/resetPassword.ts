import { RequestHandler } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { ApiResponse } from "../types/api";
import jwt from "jsonwebtoken";

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, "Password must be at least 6 characters long"),
  resetToken: z.string(),
});

export const resetPassword: RequestHandler = async (req, res) => {
  const validationResult = resetPasswordSchema.safeParse(req.body);

  if (!validationResult.success) {
    res.status(400).json({
      success: false,
      message: "Validation error",
      data: validationResult.error.errors,
    } satisfies ApiResponse<z.ZodIssue[]>);
    return;
  }

  const { newPassword, resetToken } = validationResult.data;

  try {
    const payload: any = jwt.verify(resetToken, 'jwt_secret');
    const user = await prisma.user.findFirst({
      where: {
        email: payload.email,
      },
    });
  
    if (!user) {
      res.status(400).json({
        success: false,
        message: "User not found",
      } satisfies ApiResponse);
      return;
    }
  
    await prisma.user.update({
      data: {
        password: newPassword,
      },
      where: {
        email: user.email,
      }
    })
  
    res.status(200).json({
      success: true,
      message: "New password set",
    } satisfies ApiResponse);
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "Invalid reset token" } satisfies ApiResponse);
    return;
  }
};

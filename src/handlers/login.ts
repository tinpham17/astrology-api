import { RequestHandler } from "express";
import { z } from "zod";
import { prisma } from "../db";
import jwt from 'jsonwebtoken';
import { ApiResponse } from "../types/api";

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string(),
});

export const login: RequestHandler = async (req, res) => {
  const validationResult = loginSchema.safeParse(req.body);

  if (!validationResult.success) {
    res.status(400).json({
      success: false,
      message: "Validation error",
      data: validationResult.error.errors,
    } satisfies ApiResponse<z.ZodIssue[]>);
    return;
  }

  const { email, password } = validationResult.data;

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

  if (user.password !== password) {
    res.status(400).json({
      success: false,
      message: "Invalid password",
    } satisfies ApiResponse);
    return;
  }

  const token = jwt.sign({ id: user.id }, "jwt_secret");
  
  res.status(200).json({
    success: true,
    data: {
      token,
    },
  } satisfies ApiResponse<{ token: string }>);
};

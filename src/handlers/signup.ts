import { RequestHandler } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { getZodiacSigns } from "../utils/horoscopeApi";
import { ApiResponse } from "../types/api";

const signupSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  zodiac_sign: z.string(),
});

export const signup: RequestHandler = async (req, res) => {
  const validationResult = signupSchema.safeParse(req.body);

  if (!validationResult.success) {
    res.status(400).json({
      success: false,
      message: "Validation error",
      data: validationResult.error.errors,
    } satisfies ApiResponse<z.ZodIssue[]>);
    return;
  }

  const { email, password, zodiac_sign } = validationResult.data;

  const existingUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (existingUser) {
    res.status(400).json({
      success: false,
      message: "User already exists",
    } satisfies ApiResponse);
    return;
  }

  const validZodiacSigns = await getZodiacSigns();

  if (!validZodiacSigns.includes(zodiac_sign)) {
    res.status(400).json({
      success: false,
      message: "Invalid zodiac sign",
    } satisfies ApiResponse);
    return;
  }

  const user = await prisma.user.create({
    data: {
      email,
      password,
      zodiac_sign,
    },
  });

  res.status(200).json({
    success: true,
    data: user,
  } satisfies ApiResponse<typeof user>);
};

import { RequestHandler } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { ApiResponse } from "../types/api";
import { getZodiacSigns } from "../utils/horoscopeApi";

const updateUserZodiacSignSchema = z.object({
  zodiac_sign: z.string(),
});

export const updateUserZodiacSign: RequestHandler = async (req, res) => {
  const validationResult = updateUserZodiacSignSchema.safeParse(req.body);

  if (!validationResult.success) {
    res.status(400).json({
      success: false,
      message: "Validation error",
      data: validationResult.error.errors,
    } satisfies ApiResponse<z.ZodIssue[]>);
    return;
  }

  const { zodiac_sign } = validationResult.data;

  const validZodiacSigns = await getZodiacSigns();

  if (!validZodiacSigns.includes(zodiac_sign)) {
    res.status(400).json({
      success: false,
      message: "Invalid zodiac sign",
    } satisfies ApiResponse);
    return;
  }

  try {
    await prisma.user.update({
      data: {
        zodiac_sign,
      },
      where: {
        id: (req as any).user.id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Zodiac sign updated",
    } satisfies ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating sign",
    } satisfies ApiResponse);
    return;
  }
};

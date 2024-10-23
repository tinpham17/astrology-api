import { RequestHandler } from "express";
import { prisma } from "../db";
import { ApiResponse } from "../types/api";
import { getFortune as callApiToGetFortune } from "../utils/horoscopeApi";
import { cache } from "../cache";

export const getFortune: RequestHandler = async (req, res) => {
  const user = await prisma.user.findFirst({
    where: {
      id: (req as any).user.id,
    },
  });

  if (!user) {
    res.status(400).json({
      success: true,
      message: "User not found",
    } satisfies ApiResponse);
    return;
  }

  try {
    let fortune = cache.get<string>(user.zodiac_sign)
    if (!fortune) {
      fortune = await callApiToGetFortune(user.zodiac_sign);
      cache.set<string>(user.zodiac_sign, fortune, 60 * 60)
    }
    res.status(200).json({
      success: true,
      message: fortune,
    } satisfies ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting fortune",
    } satisfies ApiResponse);
    return;
  }
};

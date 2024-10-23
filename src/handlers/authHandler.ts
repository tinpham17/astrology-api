import { RequestHandler } from "express";
import { z } from "zod";
import { prisma } from "../db";

const signupSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  zodiac_sign: z.string(),
})

export const signup: RequestHandler = async (req, res) => {
  const validationResult = signupSchema.safeParse(req.body)
  if (!validationResult.success) {
    res.status(400).json({
      message: 'Validation error',
      errors: validationResult.error.errors,
    });
    return
  }
  const { email, password, zodiac_sign } = validationResult.data

  const user = await prisma.user.create({
    data: {
      email,
      password,
      zodiac_sign
    },
  })
  res.status(200).json({
    data: user
  })
}

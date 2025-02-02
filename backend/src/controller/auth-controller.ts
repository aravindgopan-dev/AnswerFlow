import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin",
};

// Generate JWT Token
const generateToken = (username: string): string => {
  return jwt.sign({ username }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
};

// ✅ Fix: Explicitly define return type as `void`
export const login = (req: Request, res: Response): void => {
  const { username, password } = req.body;

  if (username !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const token = generateToken(username);

  res.json({ message: "Login successful", token });
};

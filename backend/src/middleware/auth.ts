import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import dotenv from "dotenv";

dotenv.config();
const tokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token; 

  if (!token) {
    res.status(401).json({ message: 'Token is missing' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.cookies.token = decoded; 
    next(); 
  } catch (err) {
    res.status(403).json({ message: 'Token is invalid or expired' });
    return;
  }
};

export { tokenMiddleware };
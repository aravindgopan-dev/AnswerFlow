import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

const tokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token; // Get token from cookies

  if (!token) {
    res.status(401).json({ message: 'Token is missing' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.cookies.token = decoded; // Attach decoded token to req.token
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(403).json({ message: 'Token is invalid or expired' });
    return;
  }
};

export { tokenMiddleware };
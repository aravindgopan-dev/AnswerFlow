"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tokenMiddleware = (req, res, next) => {
    const token = req.cookies.token; // Get token from cookies
    if (!token) {
        res.status(401).json({ message: 'Token is missing' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.cookies.token = decoded; // Attach decoded token to req.token
        next(); // Proceed to the next middleware or route handler
    }
    catch (err) {
        res.status(403).json({ message: 'Token is invalid or expired' });
        return;
    }
};
exports.tokenMiddleware = tokenMiddleware;

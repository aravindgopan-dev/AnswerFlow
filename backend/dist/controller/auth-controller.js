"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ADMIN_CREDENTIALS = {
    username: "admin",
    password: "admin",
};
// Generate JWT Token
const generateToken = (username) => {
    return jsonwebtoken_1.default.sign({ username }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
};
const login = (req, res) => {
    const { username, password } = req.body;
    if (username !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
    }
    const token = generateToken(username);
    res.json({ message: "Login successful", token });
};
exports.login = login;

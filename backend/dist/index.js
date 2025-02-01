"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const faq_router_1 = __importDefault(require("./router/faq-router"));
dotenv_1.default.config();
const mongoURI = process.env.MONGO;
if (!mongoURI) {
    throw new Error('MONGO environment variable is not defined');
}
console.log(mongoURI);
mongoose_1.default.connect(mongoURI)
    .then(() => console.log('Connected!'))
    .catch((err) => console.error('MongoDB connection error:', err));
const port = process.env.PORT || 5000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/v1/faq", faq_router_1.default);
app.listen(port, () => {
    console.log(`on port :${port}`);
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const faq_controller_1 = require("../controller/faq-controller");
const router = (0, express_1.Router)();
router.get("/", faq_controller_1.getTask);
exports.default = router;

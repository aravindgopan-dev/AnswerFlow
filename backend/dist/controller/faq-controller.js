"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addFaq = exports.getFaq = void 0;
const google_translate_api_1 = require("@vitalets/google-translate-api");
const faq_modal_1 = __importDefault(require("../modals/faq-modal"));
const index_1 = require("../index");
const getFaq = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const lang = req.query.lang || "all";
    const cacheKey = `faqs_${lang}`;
    try {
        console.log(req.cookies);
        if (lang !== "all") {
            const cachedFaqs = yield index_1.redisClient.get(cacheKey);
            if (cachedFaqs) {
                res.json(JSON.parse(cachedFaqs));
                return;
            }
        }
        const all = yield faq_modal_1.default.find({});
        let filteredFaqs;
        if (lang === "mal" || lang === "hi" || lang === "en") {
            filteredFaqs = all.map((faq) => {
                const translations = faq.translations;
                if (translations) {
                    if (lang === "mal" && translations.mal) {
                        return {
                            question: translations.mal.question,
                            answer: translations.mal.answer,
                        };
                    }
                    else if (lang === "hi" && translations.hi) {
                        return {
                            question: translations.hi.question,
                            answer: translations.hi.answer,
                        };
                    }
                    else if (lang === "en") {
                        return {
                            question: faq.question,
                            answer: faq.answer,
                        };
                    }
                }
                return null;
            }).filter((faq) => faq !== null);
        }
        else {
            filteredFaqs = all;
        }
        if (lang !== "all") {
            yield index_1.redisClient.set(cacheKey, JSON.stringify(filteredFaqs), "EX", 3600);
        }
        res.json(filteredFaqs);
    }
    catch (error) {
        console.error("Error fetching FAQs:", error);
        res.status(500).json({
            error: "Failed to fetch FAQs",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.getFaq = getFaq;
const addFaq = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { question, answer } = req.body;
        const translateText = (text, targetLanguage, fallbackText) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const translated = yield (0, google_translate_api_1.translate)(text, { to: targetLanguage });
                return translated.text;
            }
            catch (error) {
                console.error(`Translation error for ${targetLanguage}:`, error);
                return fallbackText;
            }
        });
        const translatedQuestionML = yield translateText(question, "ml", question);
        const translatedAnswerML = yield translateText(answer, "ml", answer);
        const translatedQuestionHI = yield translateText(question, "hi", question);
        const translatedAnswerHI = yield translateText(answer, "hi", answer);
        const newFaq = new faq_modal_1.default({
            question,
            answer,
            translations: {
                mal: {
                    question: translatedQuestionML,
                    answer: translatedAnswerML,
                },
                hi: {
                    question: translatedQuestionHI,
                    answer: translatedAnswerHI,
                },
            },
        });
        yield newFaq.save();
        yield index_1.redisClient.del(["faqs_en", "faqs_hi", "faqs_mal", "faqs_all"]);
        res.json({
            message: "FAQ added successfully",
            faq: newFaq,
        });
    }
    catch (error) {
        console.error("Error adding FAQ:", error);
        res.status(500).json({
            error: "Failed to add FAQ",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.addFaq = addFaq;

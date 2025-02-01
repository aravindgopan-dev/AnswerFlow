import { NextFunction, Request, Response } from "express";
import { translate } from "@vitalets/google-translate-api";
import faqModel from "../modals/faq-modal";
import { redisClient } from "../index";

interface FAQ {
    question: string;
    answer: string;
    translations?: {
        mal?: {
            question: string;
            answer: string;
        } | null;
        hi?: {
            question: string;
            answer: string;
        } | null;
    } | null;
}

const getFaq = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    console.log(req.query.ln)
    const lang = req.query.lang as string;
    const cacheKey = `faqs_${lang}`;

    try {
        const cachedFaqs = await redisClient.get(cacheKey);
        if (cachedFaqs) {
            res.json(JSON.parse(cachedFaqs));
            return;
        }

        const all = await faqModel.find({});

        let filteredFaqs: FAQ[] = [];
        if (lang === "mal" || lang === "hi" || lang === "en") {
            console.log(lang)
            filteredFaqs = all.map((faq) => {
                const translations = faq.translations;

                if (translations) {
                    if (lang === "mal" && translations.mal) {
                        return {
                            question: translations.mal.question,
                            answer: translations.mal.answer,
                        };
                    } else if (lang === "hi" && translations.hi) {
                        return {
                            question: translations.hi.question,
                            answer: translations.hi.answer,
                        };
                    } else if (lang === "en") {
                        return {
                            question: faq.question,
                            answer: faq.answer,
                        };
                    }
                }
                return null;
            }).filter((faq): faq is FAQ => faq !== null);
        } else {
            filteredFaqs = all;
        }

        await redisClient.set(cacheKey, JSON.stringify(filteredFaqs), "EX", 3600);

        res.json(filteredFaqs);
    } catch (error) {
        console.error("Error fetching FAQs:", error);
        res.status(500).json({
            error: "Failed to fetch FAQs",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

const addFaq = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { question, answer } = req.body;

        const translateText = async (text: string, targetLanguage: string, fallbackText: string): Promise<string> => {
            try {
                const translated = await translate(text, { to: targetLanguage });
                return translated.text;
            } catch (error) {
                console.error(`Translation error for ${targetLanguage}:`, error);
                return fallbackText;
            }
        };

        const translatedQuestionML = await translateText(question, "ml", question);
        const translatedAnswerML = await translateText(answer, "ml", answer);
        const translatedQuestionHI = await translateText(question, "hi", question);
        const translatedAnswerHI = await translateText(answer, "hi", answer);

        const newFaq = new faqModel({
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

        await newFaq.save();

        await redisClient.del(["faqs_en", "faqs_hi", "faqs_mal"]);

        res.json({
            message: "FAQ added successfully",
            faq: newFaq,
        });
    } catch (error) {
        console.error("Error adding FAQ:", error);
        res.status(500).json({
            error: "Failed to add FAQ",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

export { getFaq, addFaq };
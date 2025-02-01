import { NextFunction, Request, Response } from "express";
import { translate } from "@vitalets/google-translate-api";
import faqModel from "../modals/faq-modal";

const getFaq = async (req: Request, res: Response, next: NextFunction) => {
    const lang = req.query.lang;
    const all = await faqModel.find({});

    if (lang === "mal" || lang === "hi" || lang === "en") {
        const filteredFaqs = all.map((faq) => {
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
        }).filter(faq => faq !== null); 

        res.json(filteredFaqs);
    } else {

        res.json(all);
    }
};





const addFaq = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { question, answer } = req.body;

        const translateText = async (text: string, targetLanguage: string, fallbackText: string) => {
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

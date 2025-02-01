import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  translations: {
    hi: {
      question: { type: String, default: null },
      answer: { type: String, default: null },
    },
    mal: {
      question: { type: String, default: null },
      answer: { type: String, default: null },
    },
  },
}, {
  timestamps: true, 
});

const faqModel = mongoose.model("FAQ", faqSchema);

export default faqModel;

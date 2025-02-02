"use client";
import { cookies } from "next/headers";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";
import axios from "axios";
import { marked } from "marked";
import { getCookie } from "cookies-next";

// Load SimpleMDE dynamically with SSR disabled
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false });

type Props = {};

const Page = (props: Props) => {
    const [question, setQuestion] = useState("");  
    const [markdown, setMarkdown] = useState("**Simple text**");
    const token=getCookie("token")
    console.log(token)
    // Function to handle form submission
    const handleSubmit = async () => {
        const data = {
            question,
            answer: markdown,  
        };

        try {
            const response = await axios.post("https://answerflow-gcze.onrender.com/api/v1/faq", data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log("FAQ added successfully:", response.data);
        } catch (error) {
            console.error("Error adding FAQ:", error);
        }
    };

    return (
        <div className="p-6 bg-base-200 min-h-screen">
            <div className="text-2xl font-bold mb-6 text-center">Add FAQ</div>
            <div className="flex justify-center mb-6">
                <textarea
                    className="textarea textarea-bordered w-full md:w-3/4 lg:w-1/2 bg-base-100 shadow-lg"
                    placeholder="Enter your question here..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />
            </div>
            <div className="flex justify-center">
                <div className="w-full md:w-3/4 lg:w-1/2 bg-base-100 rounded-lg shadow-lg p-4">
                    {/* Markdown Editor for Answer */}
                    <SimpleMDE value={markdown} onChange={setMarkdown} />

                    {/* Preview Section */}
                    <div className="mt-4 p-4 border bg-base-100 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold mb-2">
                            {question || "Your question will appear here..."}
                        </h3>
                        <div
                            className="markdown-preview"
                            dangerouslySetInnerHTML={{ __html: marked(markdown) }}  
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center mt-4">
                        <button className="btn btn-primary" onClick={handleSubmit}>
                            Submit FAQ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;

"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface FAQ {
  question: string;
  answer: string;
  translations?: {
    hi?: {
      question: string;
      answer: string;
    };
    mal?: {
      question: string;
      answer: string;
    };
  };
}

const Page = () => {
  const [data, setData] = useState<FAQ[] | null>(null);

  useEffect(() => {
    axios.get("https://answerflow-gcze.onrender.com/api/v1/faq")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error fetching FAQ data:", err));
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div>
      <div className='text-center p-4'>
        FAQ
      </div>
      <div className="overflow-x-auto p-4">
        <table className="table table-xs table-auto w-full">
          <thead>
            <tr>
              <th className="text-center">#</th>
              <th className="text-left">Question</th>
              <th className="text-left">Answer</th>
              <th className="text-left">Malayalam(Q)</th>
              <th className="text-left">Malayalam(A)</th>
              <th className="text-left">Hindi(Q)</th>
              <th className="text-left">Hindi(A)</th>
            </tr>
          </thead>
          <tbody>
            {data && data.map((item, index) => (
              <tr key={index}>
                <td className="text-center">{index + 1}</td>
                <td>{item.question}</td>
                <td>{item.answer}</td>
                <td>{item.translations?.mal?.question || "N/A"}</td>
                <td>{item.translations?.mal?.answer || "N/A"}</td>
                <td>{item.translations?.hi?.question || "N/A"}</td>
                <td>{item.translations?.hi?.answer || "N/A"}</td>
              </tr>
            ))}
          </tbody>
          
        </table>
      </div>
    </div>
  );
}

export default Page;

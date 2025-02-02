import React from "react";
import Link from "next/link";

const Page = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-base-200 space-y-6">
      <div className="p-10 bg-base-100 rounded-2xl shadow-xl text-center">
        <h1 className="text-6xl font-bold text-primary uppercase tracking-wide">
          Answer Flow
        </h1>
      </div>
      <div className="flex space-x-4">
        <Link href="/login" className="btn btn-primary">Login</Link>
        <Link href="/faq" className="btn btn-secondary">FAQ</Link>
      </div>
    </div>
  );
};

export default Page;

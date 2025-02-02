"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post("/api/v1/auth/login", { username, password });
      
      // Store the token in a cookie
      document.cookie = `token=${response.data.token}; path=/; max-age=3600`;

      console.log("Login successful:", response.data);

      // Redirect to /faq
      router.push("/faq");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="card w-96 shadow-xl p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <input 
            type="text" 
            placeholder="Enter your username" 
            className="input input-bordered" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input 
            type="password" 
            placeholder="Enter your password" 
            className="input input-bordered" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-control mt-6">
          <button className="btn btn-primary" onClick={handleLogin}>Login</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

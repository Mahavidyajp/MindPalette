
import { useState, useEffect } from "react";
import LoginForm from "@/components/LoginForm";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already logged in
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/");
    }
  }, [navigate]);

  const handleLoginSuccess = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gradient-bg">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md mx-auto mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">Reflect</h1>
        <p className="text-muted-foreground">
          Your personal space for reflection and growth
        </p>
      </div>
      <div className="flex justify-center">
        <LoginForm onSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
}

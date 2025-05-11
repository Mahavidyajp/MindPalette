
import { useState, useEffect } from "react";
import LoginForm from "@/components/LoginForm";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import { FadeIn } from "@/components/animations/FadeIn";

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if the user is already logged in
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/");
    }
    setIsLoading(false);
  }, [navigate]);

  const handleLoginSuccess = () => {
    navigate("/");
  };

  if (isLoading) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gradient-bg">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <FadeIn delay={0.1}>
        <div className="w-full max-w-md mx-auto mb-8 text-center">
          <h1 className="text-5xl font-bold text-primary mb-2">Reflect</h1>
          <p className="text-muted-foreground">
            Your personal space for reflection and growth
          </p>
        </div>
      </FadeIn>
      <FadeIn delay={0.2}>
        <div className="flex justify-center">
          <LoginForm onSuccess={handleLoginSuccess} />
        </div>
      </FadeIn>
    </div>
  );
}

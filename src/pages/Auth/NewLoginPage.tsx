import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function NewLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn(email, password);
      // Navigate to the dashboard after successful login
      navigate("/dashboard");
    } catch (error) {
      // Error is already handled in AuthContext with toast
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 mx-4">
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-md bg-sportnexus-green flex items-center justify-center text-white font-bold">
              SN
            </div>
            <span className="text-xl font-bold text-sportnexus-darkGray">SportNexus</span>
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-center text-sportnexus-darkGray mb-2">
          Sign In
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Enter your credentials to access your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sportnexus-green focus:border-sportnexus-green"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sportnexus-green focus:border-sportnexus-green"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-sportnexus-green hover:bg-sportnexus-darkGreen text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-sportnexus-green hover:text-sportnexus-darkGreen font-medium">
              Sign up
            </Link>
          </p>
          <Link to="/" className="block text-sm text-sportnexus-green hover:text-sportnexus-darkGreen font-medium">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
} 
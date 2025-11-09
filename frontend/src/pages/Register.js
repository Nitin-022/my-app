import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";
import { DollarSign, Mail, Lock, User } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Register({ setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      localStorage.setItem("token", response.data.access_token);
      setUser(response.data.user);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="glass-effect rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold gradient-text mb-2">Create Account</h2>
            <p className="text-gray-600">Start your journey to financial freedom</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" data-testid="register-form">
            <div>
              <Label htmlFor="name" className="text-gray-700 font-medium">Full Name</Label>
              <div className="relative mt-2">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="pl-10 h-12 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  data-testid="name-input"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="pl-10 h-12 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  data-testid="email-input"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  className="pl-10 h-12 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  data-testid="password-input"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  className="pl-10 h-12 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  data-testid="confirm-password-input"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-lg font-semibold btn-hover"
              disabled={loading}
              data-testid="register-submit-btn"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-cyan-600 font-semibold hover:text-cyan-700" data-testid="login-link">
                Login
              </Link>
            </p>
          </div>

          <div className="mt-6">
            <Link to="/">
              <Button variant="ghost" className="w-full text-gray-600 hover:text-cyan-600" data-testid="back-home-btn">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
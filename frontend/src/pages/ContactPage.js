import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";
import { DollarSign, Mail, MessageSquare, Send } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API}/contact`, formData);
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="glass-effect fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <DollarSign className="h-8 w-8 text-cyan-500" />
              <span className="ml-2 text-2xl font-bold gradient-text">Capital Core</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" className="text-gray-700 hover:text-cyan-600" data-testid="nav-home-btn">
                  Home
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="ghost" className="text-gray-700 hover:text-cyan-600" data-testid="nav-about-btn">
                  About
                </Button>
              </Link>
              <Link to="/login">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600" data-testid="nav-login-btn">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Contact Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center fade-in mb-12">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
              Get in <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-xl text-gray-600">
              Have questions or feedback? We'd love to hear from you!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="glass-effect p-8 card-hover" data-testid="contact-info-email">
              <div className="bg-gradient-to-br from-cyan-400 to-blue-500 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <Mail className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600">contact@capitalcore.com</p>
              <p className="text-sm text-gray-500 mt-2">We'll respond within 24 hours</p>
            </Card>

            <Card className="glass-effect p-8 card-hover" data-testid="contact-info-support">
              <div className="bg-gradient-to-br from-purple-400 to-indigo-500 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <MessageSquare className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Support</h3>
              <p className="text-gray-600">Need help? Our support team is here for you</p>
              <p className="text-sm text-gray-500 mt-2">Available 24/7</p>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="glass-effect p-8 fade-in" data-testid="contact-form-card">
            <div className="flex items-center mb-6">
              <Send className="h-6 w-6 text-cyan-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Send us a Message</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
              <div>
                <Label htmlFor="name" className="text-gray-700 font-medium">Your Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="mt-2 h-12 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  data-testid="contact-name-input"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-700 font-medium">Your Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="mt-2 h-12 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  data-testid="contact-email-input"
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-gray-700 font-medium">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us what's on your mind..."
                  className="mt-2 min-h-[150px] border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  data-testid="contact-message-input"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-lg font-semibold btn-hover"
                disabled={loading}
                data-testid="contact-submit-btn"
              >
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Card>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <Card className="glass-effect p-6" data-testid="faq-free">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Is Capital Core really free?</h3>
                <p className="text-gray-600">Yes! All features are completely free with no hidden costs or premium tiers.</p>
              </Card>

              <Card className="glass-effect p-6" data-testid="faq-data">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Is my financial data secure?</h3>
                <p className="text-gray-600">Absolutely. We use bank-level encryption and JWT authentication to protect your data.</p>
              </Card>

              <Card className="glass-effect p-6" data-testid="faq-started">
                <h3 className="text-lg font-bold text-gray-900 mb-2">How do I get started?</h3>
                <p className="text-gray-600">Simply create a free account and start tracking your finances right away!</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <DollarSign className="h-8 w-8 text-cyan-400" />
                <span className="ml-2 text-2xl font-bold">Capital Core</span>
              </div>
              <p className="text-gray-400">Your personal finance management companion</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link to="/" className="block text-gray-400 hover:text-cyan-400 transition-colors">Home</Link>
                <Link to="/about" className="block text-gray-400 hover:text-cyan-400 transition-colors">About Us</Link>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <p className="text-gray-400">contact@capitalcore.com</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Capital Core. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
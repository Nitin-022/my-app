import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DollarSign, Target, Shield, TrendingUp, Users, Heart } from "lucide-react";

export default function AboutPage() {
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
              <Link to="/contact">
                <Button variant="ghost" className="text-gray-700 hover:text-cyan-600" data-testid="nav-contact-btn">
                  Contact
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

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center fade-in mb-16">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
              About <span className="gradient-text">Capital Core</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're on a mission to make personal finance management accessible, simple, and effective for everyone
            </p>
          </div>

          {/* Mission Card */}
          <Card className="glass-effect p-12 mb-16 fade-in" data-testid="mission-card">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-br from-cyan-400 to-blue-500 w-20 h-20 rounded-2xl flex items-center justify-center">
                <Target className="h-10 w-10 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto leading-relaxed">
              Capital Core was created to empower individuals to take control of their financial future. We believe that everyone deserves access to powerful, easy-to-use tools that help track income, manage expenses, set budgets, and achieve savings goals. Our platform is designed to be intuitive, secure, and completely free.
            </p>
          </Card>

          {/* Values Grid */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="glass-effect p-8 card-hover" data-testid="value-simplicity">
                <div className="bg-gradient-to-br from-green-400 to-emerald-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Simplicity</h3>
                <p className="text-gray-600">
                  We make personal finance simple and accessible. No complex jargon, no confusing interfaces - just straightforward tools that work.
                </p>
              </Card>

              <Card className="glass-effect p-8 card-hover" data-testid="value-security">
                <div className="bg-gradient-to-br from-blue-400 to-cyan-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Security</h3>
                <p className="text-gray-600">
                  Your financial data is protected with bank-level security. We use JWT authentication and encryption to keep your information safe.
                </p>
              </Card>

              <Card className="glass-effect p-8 card-hover" data-testid="value-transparency">
                <div className="bg-gradient-to-br from-purple-400 to-indigo-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <Heart className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">User-Centric</h3>
                <p className="text-gray-600">
                  Everything we build is designed with you in mind. Your feedback drives our development, and your success is our success.
                </p>
              </Card>
            </div>
          </div>

          {/* Why Choose Us */}
          <Card className="glass-effect p-12 fade-in" data-testid="why-choose-card">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Why Choose Capital Core?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start">
                <div className="bg-cyan-100 w-10 h-10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-cyan-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Completely Free</h3>
                  <p className="text-gray-600">No hidden fees, no premium tiers. All features are available to everyone, always.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-cyan-100 w-10 h-10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-cyan-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Easy to Use</h3>
                  <p className="text-gray-600">Intuitive interface designed for everyone, from finance beginners to experts.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-cyan-100 w-10 h-10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-cyan-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Comprehensive Features</h3>
                  <p className="text-gray-600">Income tracking, expense management, budgets, and savings goals all in one place.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-cyan-100 w-10 h-10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-cyan-600 font-bold">4</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Secure & Private</h3>
                  <p className="text-gray-600">Your data is encrypted and secure. We never share your information with third parties.</p>
                </div>
              </div>
            </div>
          </Card>

          {/* CTA */}
          <div className="text-center mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-gray-600 mb-8">Join Capital Core today and take control of your financial future</p>
            <Link to="/register">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-lg px-10 py-6 btn-hover" data-testid="cta-register-btn">
                Create Free Account
              </Button>
            </Link>
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
                <Link to="/contact" className="block text-gray-400 hover:text-cyan-400 transition-colors">Contact</Link>
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
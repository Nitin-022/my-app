import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, PiggyBank, Target, DollarSign, Shield, BarChart3 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="glass-effect fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-cyan-500" />
              <span className="ml-2 text-2xl font-bold gradient-text">Capital Core</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-cyan-600 font-medium transition-colors">Features</a>
              <Link to="/about" className="text-gray-700 hover:text-cyan-600 font-medium transition-colors">About Us</Link>
              <Link to="/contact" className="text-gray-700 hover:text-cyan-600 font-medium transition-colors">Contact</Link>
              <Link to="/login">
                <Button variant="outline" className="border-cyan-500 text-cyan-600 hover:bg-cyan-50" data-testid="nav-login-btn">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 btn-hover" data-testid="nav-register-btn">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center fade-in">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
              Master Your Finances with
              <span className="block gradient-text mt-2">Capital Core</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Track income, manage expenses, set budgets, and achieve your savings goals all in one powerful platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-lg px-8 py-6 btn-hover" data-testid="hero-get-started-btn">
                  Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="border-2 border-cyan-500 text-cyan-600 hover:bg-cyan-50 text-lg px-8 py-6" data-testid="hero-learn-more-btn">
                  Learn More
                </Button>
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-effect rounded-2xl p-8 text-center card-hover">
              <div className="text-4xl font-bold gradient-text mb-2">100%</div>
              <div className="text-gray-600">Free to Use</div>
            </div>
            <div className="glass-effect rounded-2xl p-8 text-center card-hover">
              <div className="text-4xl font-bold gradient-text mb-2">Secure</div>
              <div className="text-gray-600">Bank-Level Security</div>
            </div>
            <div className="glass-effect rounded-2xl p-8 text-center card-hover">
              <div className="text-4xl font-bold gradient-text mb-2">Easy</div>
              <div className="text-gray-600">Simple & Intuitive</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">Everything you need to take control of your finances</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-effect rounded-2xl p-8 card-hover" data-testid="feature-income-tracker">
              <div className="bg-gradient-to-br from-green-400 to-emerald-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Income Tracker</h3>
              <p className="text-gray-600">Monitor all your income sources and track your earnings over time with detailed categorization</p>
            </div>

            {/* Feature 2 */}
            <div className="glass-effect rounded-2xl p-8 card-hover" data-testid="feature-expense-tracker">
              <div className="bg-gradient-to-br from-red-400 to-pink-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Expense Tracker</h3>
              <p className="text-gray-600">Keep track of every expense, categorize spending, and identify areas to save money</p>
            </div>

            {/* Feature 3 */}
            <div className="glass-effect rounded-2xl p-8 card-hover" data-testid="feature-budget-management">
              <div className="bg-gradient-to-br from-blue-400 to-cyan-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <DollarSign className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Budget Management</h3>
              <p className="text-gray-600">Set monthly budgets for different categories and stay on track with your spending goals</p>
            </div>

            {/* Feature 4 */}
            <div className="glass-effect rounded-2xl p-8 card-hover" data-testid="feature-savings-goals">
              <div className="bg-gradient-to-br from-purple-400 to-indigo-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Target className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Savings Goals</h3>
              <p className="text-gray-600">Set savings targets with deadlines and track your progress with visual indicators</p>
            </div>

            {/* Feature 5 */}
            <div className="glass-effect rounded-2xl p-8 card-hover" data-testid="feature-secure">
              <div className="bg-gradient-to-br from-orange-400 to-amber-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Secure & Private</h3>
              <p className="text-gray-600">Your financial data is encrypted and secure with JWT authentication</p>
            </div>

            {/* Feature 6 */}
            <div className="glass-effect rounded-2xl p-8 card-hover" data-testid="feature-dashboard">
              <div className="bg-gradient-to-br from-teal-400 to-cyan-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <PiggyBank className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Smart Dashboard</h3>
              <p className="text-gray-600">Get a comprehensive overview of your financial health at a glance</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-effect rounded-3xl p-12">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Ready to Take Control?</h2>
            <p className="text-xl text-gray-600 mb-8">Join Capital Core today and start your journey to financial freedom</p>
            <Link to="/register">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-lg px-10 py-6 btn-hover" data-testid="cta-get-started-btn">
                Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
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
                <Link to="/about" className="block text-gray-400 hover:text-cyan-400 transition-colors">About Us</Link>
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
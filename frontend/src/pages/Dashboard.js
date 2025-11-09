import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import { DollarSign, TrendingUp, TrendingDown, Wallet, Target } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Dashboard({ user }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/dashboard/stats`);
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
        </div>
      </div>
    );
  }

  const savingsProgress = stats?.total_savings_target > 0
    ? (stats.total_savings_current / stats.total_savings_target) * 100
    : 0;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600">Here's an overview of your financial status</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-effect p-6 card-hover" data-testid="stat-income">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-green-400 to-emerald-500 w-12 h-12 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">Total Income</p>
            <p className="text-3xl font-bold text-gray-900">${stats?.total_income?.toFixed(2) || "0.00"}</p>
          </Card>

          <Card className="glass-effect p-6 card-hover" data-testid="stat-expenses">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-red-400 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">Total Expenses</p>
            <p className="text-3xl font-bold text-gray-900">${stats?.total_expenses?.toFixed(2) || "0.00"}</p>
          </Card>

          <Card className="glass-effect p-6 card-hover" data-testid="stat-balance">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-blue-400 to-cyan-500 w-12 h-12 rounded-xl flex items-center justify-center">
                <Wallet className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">Balance</p>
            <p className="text-3xl font-bold text-gray-900">${stats?.balance?.toFixed(2) || "0.00"}</p>
          </Card>

          <Card className="glass-effect p-6 card-hover" data-testid="stat-monthly">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-purple-400 to-indigo-500 w-12 h-12 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">This Month</p>
            <p className="text-3xl font-bold text-gray-900">${stats?.monthly_expenses?.toFixed(2) || "0.00"}</p>
          </Card>
        </div>

        {/* Savings Goals Overview */}
        {stats?.savings_goals_count > 0 && (
          <Card className="glass-effect p-8 fade-in" data-testid="savings-overview">
            <div className="flex items-center mb-6">
              <Target className="h-6 w-6 text-cyan-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Savings Goals Progress</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-600 mb-1">Overall Progress</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${stats?.total_savings_current?.toFixed(2) || "0.00"} / ${stats?.total_savings_target?.toFixed(2) || "0.00"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold gradient-text">{savingsProgress.toFixed(0)}%</p>
                  <p className="text-sm text-gray-600">{stats?.savings_goals_count} goal(s)</p>
                </div>
              </div>
              <Progress value={savingsProgress} className="h-3" data-testid="savings-progress" />
            </div>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-effect p-8 card-hover" data-testid="quick-tips">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Financial Tips</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-cyan-500 mr-2">•</span>
                Track your expenses daily for better budget management
              </li>
              <li className="flex items-start">
                <span className="text-cyan-500 mr-2">•</span>
                Set realistic savings goals with achievable deadlines
              </li>
              <li className="flex items-start">
                <span className="text-cyan-500 mr-2">•</span>
                Review your budgets monthly and adjust as needed
              </li>
            </ul>
          </Card>

          <Card className="glass-effect p-8 card-hover" data-testid="quick-summary">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Net Worth</span>
                <span className="font-semibold text-gray-900">${stats?.balance?.toFixed(2) || "0.00"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Spending</span>
                <span className="font-semibold text-gray-900">${stats?.monthly_expenses?.toFixed(2) || "0.00"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Goals</span>
                <span className="font-semibold text-gray-900">{stats?.savings_goals_count || 0}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
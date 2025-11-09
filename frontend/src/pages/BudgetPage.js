import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import axios from "axios";
import { Plus, Trash2, Wallet, Edit } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const BUDGET_CATEGORIES = ["Food", "Transportation", "Housing", "Entertainment", "Healthcare", "Shopping", "Bills", "Other"];

export default function BudgetPage() {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const currentDate = new Date();
  const [formData, setFormData] = useState({
    category: "Food",
    monthly_limit: "",
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [budgetsRes, expensesRes] = await Promise.all([
        axios.get(`${API}/budgets?year=${formData.year}&month=${formData.month}`),
        axios.get(`${API}/expenses`)
      ]);
      setBudgets(budgetsRes.data);
      setExpenses(expensesRes.data);
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/budgets`, formData);
      toast.success("Budget added successfully!");
      setDialogOpen(false);
      setFormData({
        category: "Food",
        monthly_limit: "",
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1
      });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to add budget");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/budgets/${id}`);
      toast.success("Budget deleted successfully!");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete budget");
    }
  };

  const getSpentAmount = (category) => {
    const monthlyExpenses = expenses.filter(
      (expense) => expense.date.startsWith(`${formData.year}-${String(formData.month).padStart(2, '0')}`)
    );
    return monthlyExpenses
      .filter((expense) => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.monthly_limit, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + getSpentAmount(budget.category), 0);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8 fade-in">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Budget Management</h1>
            <p className="text-gray-600">Set and track monthly budgets</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 btn-hover" data-testid="add-budget-btn">
                <Plus className="h-4 w-4 mr-2" />
                Add Budget
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md" data-testid="add-budget-dialog">
              <DialogHeader>
                <DialogTitle>Add New Budget</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    data-testid="budget-category-select"
                  >
                    {BUDGET_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="monthly_limit">Monthly Limit</Label>
                  <Input
                    id="monthly_limit"
                    type="number"
                    step="0.01"
                    placeholder="500.00"
                    value={formData.monthly_limit}
                    onChange={(e) => setFormData({ ...formData, monthly_limit: e.target.value })}
                    required
                    data-testid="budget-limit-input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                      required
                      data-testid="budget-year-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="month">Month</Label>
                    <Input
                      id="month"
                      type="number"
                      min="1"
                      max="12"
                      value={formData.month}
                      onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
                      required
                      data-testid="budget-month-input"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600" data-testid="submit-budget-btn">
                  Add Budget
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Total Budget Overview */}
        <Card className="glass-effect p-6 mb-8 fade-in" data-testid="budget-overview-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-blue-400 to-cyan-500 w-14 h-14 rounded-xl flex items-center justify-center mr-4">
                <Wallet className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Total Monthly Budget</p>
                <p className="text-4xl font-bold text-gray-900">${totalBudget.toFixed(2)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-600 text-sm font-medium mb-1">Spent</p>
              <p className="text-3xl font-bold text-red-600">${totalSpent.toFixed(2)}</p>
            </div>
          </div>
          <Progress
            value={totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0}
            className="h-3"
            data-testid="budget-overall-progress"
          />
          <p className="text-sm text-gray-600 mt-2">
            {totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(0) : 0}% of budget used
          </p>
        </Card>

        {/* Budget List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
            </div>
          ) : budgets.length === 0 ? (
            <Card className="glass-effect p-12 text-center" data-testid="no-budgets-msg">
              <p className="text-gray-600 text-lg">No budgets set yet. Create your first budget!</p>
            </Card>
          ) : (
            budgets.map((budget) => {
              const spent = getSpentAmount(budget.category);
              const percentage = budget.monthly_limit > 0 ? (spent / budget.monthly_limit) * 100 : 0;
              const isOverBudget = spent > budget.monthly_limit;

              return (
                <Card key={budget.id} className="glass-effect p-6 card-hover" data-testid={`budget-item-${budget.id}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-xl font-bold text-gray-900 mr-3">{budget.category}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          isOverBudget ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {budget.month}/{budget.year}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Spent / Limit</p>
                        <p className={`text-xl font-bold ${
                          isOverBudget ? 'text-red-600' : 'text-gray-900'
                        }`}>
                          ${spent.toFixed(2)} / ${budget.monthly_limit.toFixed(2)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:bg-red-50"
                        onClick={() => handleDelete(budget.id)}
                        data-testid={`delete-budget-${budget.id}`}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  <Progress
                    value={Math.min(percentage, 100)}
                    className="h-3 mb-2"
                    data-testid={`budget-progress-${budget.id}`}
                  />
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{percentage.toFixed(0)}% used</span>
                    <span className={isOverBudget ? 'text-red-600 font-semibold' : 'text-green-600'}>
                      {isOverBudget
                        ? `$${(spent - budget.monthly_limit).toFixed(2)} over budget`
                        : `$${(budget.monthly_limit - spent).toFixed(2)} remaining`}
                    </span>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
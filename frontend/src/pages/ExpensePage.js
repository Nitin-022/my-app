import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import axios from "axios";
import { Plus, Trash2, TrendingDown } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const EXPENSE_CATEGORIES = ["Food", "Transportation", "Housing", "Entertainment", "Healthcare", "Shopping", "Bills", "Other"];

export default function ExpensePage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    category: "Food",
    date: new Date().toISOString().split('T')[0],
    description: ""
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`${API}/expenses`);
      setExpenses(response.data);
    } catch (error) {
      toast.error("Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/expenses`, formData);
      toast.success("Expense added successfully!");
      setDialogOpen(false);
      setFormData({
        amount: "",
        category: "Food",
        date: new Date().toISOString().split('T')[0],
        description: ""
      });
      fetchExpenses();
    } catch (error) {
      toast.error("Failed to add expense");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/expenses/${id}`);
      toast.success("Expense deleted successfully!");
      fetchExpenses();
    } catch (error) {
      toast.error("Failed to delete expense");
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8 fade-in">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Expense Tracker</h1>
            <p className="text-gray-600">Track and manage your expenses</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 btn-hover" data-testid="add-expense-btn">
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md" data-testid="add-expense-dialog">
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="50.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    data-testid="expense-amount-input"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    data-testid="expense-category-select"
                  >
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    data-testid="expense-date-input"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    placeholder="Add notes..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    data-testid="expense-description-input"
                  />
                </div>
                <Button type="submit" className="w-full bg-red-500 hover:bg-red-600" data-testid="submit-expense-btn">
                  Add Expense
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Total Expenses Card */}
        <Card className="glass-effect p-6 mb-8 fade-in" data-testid="total-expenses-card">
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-red-400 to-pink-500 w-14 h-14 rounded-xl flex items-center justify-center mr-4">
              <TrendingDown className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Total Expenses</p>
              <p className="text-4xl font-bold text-gray-900">${totalExpenses.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        {/* Expenses List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
            </div>
          ) : expenses.length === 0 ? (
            <Card className="glass-effect p-12 text-center" data-testid="no-expenses-msg">
              <p className="text-gray-600 text-lg">No expense records yet. Add your first expense!</p>
            </Card>
          ) : (
            expenses.map((expense) => (
              <Card key={expense.id} className="glass-effect p-6 card-hover" data-testid={`expense-item-${expense.id}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-bold text-gray-900 mr-3">{expense.category}</h3>
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                        Expense
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{expense.description}</p>
                    <p className="text-sm text-gray-500">{expense.date}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <p className="text-2xl font-bold text-red-600">-${expense.amount.toFixed(2)}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:bg-red-50"
                      onClick={() => handleDelete(expense.id)}
                      data-testid={`delete-expense-${expense.id}`}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
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
import { Plus, Trash2, TrendingUp } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const INCOME_CATEGORIES = ["Salary", "Freelance", "Investment", "Business", "Gift", "Other"];

export default function IncomePage() {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    source: "",
    category: "Salary",
    date: new Date().toISOString().split('T')[0],
    description: ""
  });

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      const response = await axios.get(`${API}/incomes`);
      setIncomes(response.data);
    } catch (error) {
      toast.error("Failed to fetch incomes");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/incomes`, formData);
      toast.success("Income added successfully!");
      setDialogOpen(false);
      setFormData({
        amount: "",
        source: "",
        category: "Salary",
        date: new Date().toISOString().split('T')[0],
        description: ""
      });
      fetchIncomes();
    } catch (error) {
      toast.error("Failed to add income");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/incomes/${id}`);
      toast.success("Income deleted successfully!");
      fetchIncomes();
    } catch (error) {
      toast.error("Failed to delete income");
    }
  };

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8 fade-in">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Income Tracker</h1>
            <p className="text-gray-600">Manage and track all your income sources</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 btn-hover" data-testid="add-income-btn">
                <Plus className="h-4 w-4 mr-2" />
                Add Income
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md" data-testid="add-income-dialog">
              <DialogHeader>
                <DialogTitle>Add New Income</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="1000.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    data-testid="income-amount-input"
                  />
                </div>
                <div>
                  <Label htmlFor="source">Source</Label>
                  <Input
                    id="source"
                    placeholder="Company Name, Client, etc."
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    required
                    data-testid="income-source-input"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    data-testid="income-category-select"
                  >
                    {INCOME_CATEGORIES.map((cat) => (
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
                    data-testid="income-date-input"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    placeholder="Add notes..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    data-testid="income-description-input"
                  />
                </div>
                <Button type="submit" className="w-full bg-green-500 hover:bg-green-600" data-testid="submit-income-btn">
                  Add Income
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Total Income Card */}
        <Card className="glass-effect p-6 mb-8 fade-in" data-testid="total-income-card">
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-green-400 to-emerald-500 w-14 h-14 rounded-xl flex items-center justify-center mr-4">
              <TrendingUp className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Total Income</p>
              <p className="text-4xl font-bold text-gray-900">${totalIncome.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        {/* Income List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
            </div>
          ) : incomes.length === 0 ? (
            <Card className="glass-effect p-12 text-center" data-testid="no-incomes-msg">
              <p className="text-gray-600 text-lg">No income records yet. Add your first income!</p>
            </Card>
          ) : (
            incomes.map((income) => (
              <Card key={income.id} className="glass-effect p-6 card-hover" data-testid={`income-item-${income.id}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-bold text-gray-900 mr-3">{income.source}</h3>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        {income.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{income.description}</p>
                    <p className="text-sm text-gray-500">{income.date}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <p className="text-2xl font-bold text-green-600">${income.amount.toFixed(2)}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:bg-red-50"
                      onClick={() => handleDelete(income.id)}
                      data-testid={`delete-income-${income.id}`}
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
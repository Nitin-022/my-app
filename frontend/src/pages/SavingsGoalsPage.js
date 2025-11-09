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
import { Plus, Trash2, Target, Edit } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function SavingsGoalsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    target_amount: "",
    current_amount: "0",
    deadline: ""
  });
  const [updateAmount, setUpdateAmount] = useState("");

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await axios.get(`${API}/savings-goals`);
      setGoals(response.data);
    } catch (error) {
      toast.error("Failed to fetch savings goals");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/savings-goals`, formData);
      toast.success("Savings goal created successfully!");
      setDialogOpen(false);
      setFormData({
        title: "",
        target_amount: "",
        current_amount: "0",
        deadline: ""
      });
      fetchGoals();
    } catch (error) {
      toast.error("Failed to create savings goal");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/savings-goals/${selectedGoal.id}`, {
        current_amount: parseFloat(updateAmount)
      });
      toast.success("Savings goal updated successfully!");
      setUpdateDialogOpen(false);
      setSelectedGoal(null);
      setUpdateAmount("");
      fetchGoals();
    } catch (error) {
      toast.error("Failed to update savings goal");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/savings-goals/${id}`);
      toast.success("Savings goal deleted successfully!");
      fetchGoals();
    } catch (error) {
      toast.error("Failed to delete savings goal");
    }
  };

  const openUpdateDialog = (goal) => {
    setSelectedGoal(goal);
    setUpdateAmount(goal.current_amount.toString());
    setUpdateDialogOpen(true);
  };

  const totalTarget = goals.reduce((sum, goal) => sum + goal.target_amount, 0);
  const totalCurrent = goals.reduce((sum, goal) => sum + goal.current_amount, 0);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8 fade-in">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Savings Goals</h1>
            <p className="text-gray-600">Set targets and track your progress</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 btn-hover" data-testid="add-goal-btn">
                <Plus className="h-4 w-4 mr-2" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md" data-testid="add-goal-dialog">
              <DialogHeader>
                <DialogTitle>Create Savings Goal</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Goal Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Emergency Fund, Vacation"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    data-testid="goal-title-input"
                  />
                </div>
                <div>
                  <Label htmlFor="target_amount">Target Amount</Label>
                  <Input
                    id="target_amount"
                    type="number"
                    step="0.01"
                    placeholder="5000.00"
                    value={formData.target_amount}
                    onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                    required
                    data-testid="goal-target-input"
                  />
                </div>
                <div>
                  <Label htmlFor="current_amount">Current Amount</Label>
                  <Input
                    id="current_amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.current_amount}
                    onChange={(e) => setFormData({ ...formData, current_amount: e.target.value })}
                    required
                    data-testid="goal-current-input"
                  />
                </div>
                <div>
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    required
                    data-testid="goal-deadline-input"
                  />
                </div>
                <Button type="submit" className="w-full bg-purple-500 hover:bg-purple-600" data-testid="submit-goal-btn">
                  Create Goal
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Update Goal Dialog */}
        <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
          <DialogContent className="sm:max-w-md" data-testid="update-goal-dialog">
            <DialogHeader>
              <DialogTitle>Update Progress</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <Label htmlFor="update_amount">Current Amount</Label>
                <Input
                  id="update_amount"
                  type="number"
                  step="0.01"
                  value={updateAmount}
                  onChange={(e) => setUpdateAmount(e.target.value)}
                  required
                  data-testid="update-amount-input"
                />
              </div>
              <Button type="submit" className="w-full bg-purple-500 hover:bg-purple-600" data-testid="submit-update-btn">
                Update Progress
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Total Progress Card */}
        <Card className="glass-effect p-6 mb-8 fade-in" data-testid="savings-overview-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-purple-400 to-indigo-500 w-14 h-14 rounded-xl flex items-center justify-center mr-4">
                <Target className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Total Savings Progress</p>
                <p className="text-4xl font-bold text-gray-900">${totalCurrent.toFixed(2)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-600 text-sm font-medium mb-1">Target</p>
              <p className="text-3xl font-bold gradient-text">${totalTarget.toFixed(2)}</p>
            </div>
          </div>
          <Progress
            value={totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0}
            className="h-3"
            data-testid="savings-overall-progress"
          />
          <p className="text-sm text-gray-600 mt-2">
            {totalTarget > 0 ? ((totalCurrent / totalTarget) * 100).toFixed(0) : 0}% of total goals achieved
          </p>
        </Card>

        {/* Goals List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
            </div>
          ) : goals.length === 0 ? (
            <Card className="glass-effect p-12 text-center" data-testid="no-goals-msg">
              <p className="text-gray-600 text-lg">No savings goals yet. Create your first goal!</p>
            </Card>
          ) : (
            goals.map((goal) => {
              const percentage = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;
              const isComplete = goal.current_amount >= goal.target_amount;
              const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));

              return (
                <Card key={goal.id} className="glass-effect p-6 card-hover" data-testid={`goal-item-${goal.id}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-2xl font-bold text-gray-900 mr-3">{goal.title}</h3>
                        {isComplete && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                            Completed!
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Deadline: {new Date(goal.deadline).toLocaleDateString()} {daysLeft > 0 ? `(${daysLeft} days left)` : '(Expired)'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-purple-500 hover:bg-purple-50"
                        onClick={() => openUpdateDialog(goal)}
                        data-testid={`update-goal-${goal.id}`}
                      >
                        <Edit className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:bg-red-50"
                        onClick={() => handleDelete(goal.id)}
                        data-testid={`delete-goal-${goal.id}`}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-gray-600 text-sm">Progress</span>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">
                          ${goal.current_amount.toFixed(2)} / ${goal.target_amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <Progress
                      value={Math.min(percentage, 100)}
                      className="h-3"
                      data-testid={`goal-progress-${goal.id}`}
                    />
                    <div className="flex justify-between mt-2">
                      <span className="text-sm font-semibold gradient-text">{percentage.toFixed(0)}% Complete</span>
                      <span className="text-sm text-gray-600">
                        ${(goal.target_amount - goal.current_amount).toFixed(2)} remaining
                      </span>
                    </div>
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
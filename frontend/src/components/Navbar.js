import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DollarSign, LayoutDashboard, TrendingUp, TrendingDown, Wallet, Target, LogOut } from "lucide-react";
import { toast } from "sonner";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass-effect border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center">
            <DollarSign className="h-8 w-8 text-cyan-500" />
            <span className="ml-2 text-2xl font-bold gradient-text">Capital Core</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <Link to="/dashboard">
              <Button
                variant={isActive("/dashboard") ? "default" : "ghost"}
                className={isActive("/dashboard") ? "bg-cyan-500 hover:bg-cyan-600" : "hover:bg-cyan-50 hover:text-cyan-600"}
                data-testid="nav-dashboard"
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link to="/income">
              <Button
                variant={isActive("/income") ? "default" : "ghost"}
                className={isActive("/income") ? "bg-cyan-500 hover:bg-cyan-600" : "hover:bg-cyan-50 hover:text-cyan-600"}
                data-testid="nav-income"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Income
              </Button>
            </Link>
            <Link to="/expenses">
              <Button
                variant={isActive("/expenses") ? "default" : "ghost"}
                className={isActive("/expenses") ? "bg-cyan-500 hover:bg-cyan-600" : "hover:bg-cyan-50 hover:text-cyan-600"}
                data-testid="nav-expenses"
              >
                <TrendingDown className="h-4 w-4 mr-2" />
                Expenses
              </Button>
            </Link>
            <Link to="/budget">
              <Button
                variant={isActive("/budget") ? "default" : "ghost"}
                className={isActive("/budget") ? "bg-cyan-500 hover:bg-cyan-600" : "hover:bg-cyan-50 hover:text-cyan-600"}
                data-testid="nav-budget"
              >
                <Wallet className="h-4 w-4 mr-2" />
                Budget
              </Button>
            </Link>
            <Link to="/savings-goals">
              <Button
                variant={isActive("/savings-goals") ? "default" : "ghost"}
                className={isActive("/savings-goals") ? "bg-cyan-500 hover:bg-cyan-600" : "hover:bg-cyan-50 hover:text-cyan-600"}
                data-testid="nav-savings"
              >
                <Target className="h-4 w-4 mr-2" />
                Savings
              </Button>
            </Link>
          </div>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50"
            data-testid="logout-btn"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Budget, TransactionCategory } from '@/types';
import { mockBudgets, formatCurrency, getCategoryIcon } from '@/lib/mock-data';
import { Plus, AlertTriangle, CheckCircle2, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useToast } from '@/hooks/use-toast';

const categories: TransactionCategory[] = [
  'food', 'education', 'travel', 'entertainment', 'shopping', 'bills', 'other'
];

const Budgets = () => {
  const { toast } = useToast();
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category: 'food' as TransactionCategory,
    limit: '',
    period: 'monthly' as 'weekly' | 'monthly',
  });

  // Calculate totals
  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const remaining = totalBudget - totalSpent;

  // Chart data
  const chartData = budgets.map((b) => ({
    name: b.category.charAt(0).toUpperCase() + b.category.slice(1),
    budget: b.limit,
    spent: b.spent,
  }));

  const getStatusInfo = (budget: Budget) => {
    const percentage = (budget.spent / budget.limit) * 100;
    if (percentage >= 100) {
      return { status: 'over', color: 'text-destructive', bg: 'bg-destructive', icon: AlertTriangle };
    }
    if (percentage >= 80) {
      return { status: 'warning', color: 'text-warning', bg: 'bg-warning', icon: AlertTriangle };
    }
    return { status: 'good', color: 'text-primary', bg: 'bg-primary', icon: CheckCircle2 };
  };

  const handleAddBudget = () => {
    if (!newBudget.limit) {
      toast({ title: 'Error', description: 'Please enter a budget limit', variant: 'destructive' });
      return;
    }

    // Check if budget for category already exists
    if (budgets.some((b) => b.category === newBudget.category)) {
      toast({ title: 'Error', description: 'Budget for this category already exists', variant: 'destructive' });
      return;
    }

    const budget: Budget = {
      id: `new-${Date.now()}`,
      userId: '1',
      category: newBudget.category,
      limit: parseFloat(newBudget.limit),
      spent: 0,
      period: newBudget.period,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    };

    setBudgets([...budgets, budget]);
    setNewBudget({ category: 'food', limit: '', period: 'monthly' });
    setIsDialogOpen(false);
    toast({ title: 'Success', description: 'Budget created successfully' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Budgets</h1>
            <p className="text-muted-foreground">Plan and track your spending limits</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Budget
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Budget</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={newBudget.category}
                    onValueChange={(v: TransactionCategory) =>
                      setNewBudget({ ...newBudget, category: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {getCategoryIcon(cat)} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Budget Limit (₹)</Label>
                  <Input
                    type="number"
                    placeholder="5000"
                    value={newBudget.limit}
                    onChange={(e) => setNewBudget({ ...newBudget, limit: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Period</Label>
                  <Select
                    value={newBudget.period}
                    onValueChange={(v: 'weekly' | 'monthly') =>
                      setNewBudget({ ...newBudget, period: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={handleAddBudget}>
                  Create Budget
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Budget</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(totalBudget)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-chart-1/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-chart-1" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(totalSpent)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${remaining >= 0 ? 'bg-primary/10' : 'bg-destructive/10'}`}>
                  <Target className={`h-6 w-6 ${remaining >= 0 ? 'text-primary' : 'text-destructive'}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Remaining</p>
                  <p className={`text-2xl font-bold ${remaining >= 0 ? 'text-foreground' : 'text-destructive'}`}>
                    {formatCurrency(Math.abs(remaining))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget vs Actual Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Budget vs Actual Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" className="text-muted-foreground text-xs" />
                  <YAxis className="text-muted-foreground text-xs" />
                  <Tooltip formatter={(value: number) => [`₹${value}`, '']} />
                  <Legend />
                  <Bar dataKey="budget" fill="hsl(var(--muted))" name="Budget" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="spent" fill="hsl(var(--primary))" name="Spent" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Budget List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgets.map((budget) => {
            const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
            const { status, color, bg, icon: StatusIcon } = getStatusInfo(budget);

            return (
              <Card key={budget.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-xl">
                        {getCategoryIcon(budget.category)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground capitalize">{budget.category}</h3>
                        <p className="text-sm text-muted-foreground capitalize">{budget.period}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 ${color}`}>
                      <StatusIcon className="h-4 w-4" />
                      <span className="text-sm font-medium capitalize">{status}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {formatCurrency(budget.spent)} spent
                      </span>
                      <span className="text-foreground font-medium">
                        {formatCurrency(budget.limit)} limit
                      </span>
                    </div>
                    <div className="relative">
                      <Progress value={0} className="h-3" />
                      <div
                        className={`absolute top-0 left-0 h-3 rounded-full ${bg} transition-all`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-right">
                      {formatCurrency(Math.max(budget.limit - budget.spent, 0))} remaining
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Budgets;

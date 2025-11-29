import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Budget } from '@/types';
import { formatCurrency, getCategoryIcon } from '@/lib/mock-data';
import { Link } from 'react-router-dom';

interface BudgetStatusWidgetProps {
  budgets: Budget[];
}

export const BudgetStatusWidget = ({ budgets }: BudgetStatusWidgetProps) => {
  const topBudgets = budgets.slice(0, 4);

  const getProgressColor = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 90) return 'bg-destructive';
    if (percentage >= 70) return 'bg-warning';
    return 'bg-primary';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Budget Status</CardTitle>
        <Link to="/budgets" className="text-sm text-primary hover:underline">
          Manage
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {topBudgets.map((budget) => {
          const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
          
          return (
            <div key={budget.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{getCategoryIcon(budget.category)}</span>
                  <span className="text-sm font-medium capitalize">
                    {budget.category}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                </span>
              </div>
              <div className="relative">
                <Progress value={percentage} className="h-2" />
                <div 
                  className={`absolute top-0 left-0 h-2 rounded-full transition-all ${getProgressColor(budget.spent, budget.limit)}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

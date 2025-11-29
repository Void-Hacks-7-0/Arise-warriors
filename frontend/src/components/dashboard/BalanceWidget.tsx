import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { formatCurrency } from '@/lib/mock-data';

interface BalanceWidgetProps {
  balance: number;
  income: number;
  expenses: number;
}

export const BalanceWidget = ({ balance, income, expenses }: BalanceWidgetProps) => {
  return (
    <Card className="bg-primary text-primary-foreground">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium opacity-90">
          <Wallet className="h-4 w-4" />
          Total Balance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-4">{formatCurrency(balance)}</div>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs opacity-75">Income</p>
              <p className="text-sm font-semibold">{formatCurrency(income)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <TrendingDown className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs opacity-75">Expenses</p>
              <p className="text-sm font-semibold">{formatCurrency(expenses)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

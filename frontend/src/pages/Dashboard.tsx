import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BalanceWidget } from '@/components/dashboard/BalanceWidget';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { BudgetStatusWidget } from '@/components/dashboard/BudgetStatusWidget';
import { FraudAlertsWidget } from '@/components/dashboard/FraudAlertsWidget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockTransactions, mockBudgets, mockFraudAlerts, mockWallet } from '@/lib/mock-data';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { Transaction } from '@/types';

const Dashboard = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState(mockFraudAlerts);

  // Calculate totals
  const income = mockTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenses = mockTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Expense breakdown data
  const expensesByCategory = mockTransactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  const COLORS = [
    'hsl(158, 64%, 51%)',
    'hsl(141, 69%, 58%)',
    'hsl(172, 66%, 50%)',
    'hsl(82, 77%, 55%)',
    'hsl(0, 0%, 45%)',
  ];

  const handleAcknowledgeAlert = (id: string) => {
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your finances today.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Balance Widget */}
          <div className="lg:col-span-2">
            <BalanceWidget
              balance={mockWallet.balance}
              income={income}
              expenses={expenses}
            />
          </div>

          {/* Fraud Alerts */}
          <div>
            <FraudAlertsWidget
              alerts={alerts}
              onAcknowledge={handleAcknowledgeAlert}
            />
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <div className="lg:col-span-2">
            <RecentTransactions transactions={mockTransactions} />
          </div>

          {/* Budget Status */}
          <div>
            <BudgetStatusWidget budgets={mockBudgets} />
          </div>
        </div>

        {/* Third Row - Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Expense Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [`₹${value}`, 'Amount']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-accent">
                <p className="text-sm text-muted-foreground">Transactions</p>
                <p className="text-2xl font-bold text-accent-foreground">
                  {mockTransactions.length}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-accent">
                <p className="text-sm text-muted-foreground">Active Budgets</p>
                <p className="text-2xl font-bold text-accent-foreground">
                  {mockBudgets.length}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-accent">
                <p className="text-sm text-muted-foreground">Wallet Balance</p>
                <p className="text-2xl font-bold text-accent-foreground">
                  ₹{mockWallet.balance.toLocaleString()}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-accent">
                <p className="text-sm text-muted-foreground">Security Score</p>
                <p className="text-2xl font-bold text-primary">95%</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

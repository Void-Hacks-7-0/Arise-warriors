import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/types';
import { formatCurrency, formatDate, getCategoryIcon } from '@/lib/mock-data';
import { ArrowUpRight, ArrowDownLeft, ShieldCheck, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export const RecentTransactions = ({ transactions }: RecentTransactionsProps) => {
  const recentTransactions = transactions.slice(0, 5);
  const { toast } = useToast();
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [verifiedIds, setVerifiedIds] = useState<Set<string>>(new Set());

  const verify = async (id: string) => {
    setVerifyingId(id);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/transactions/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId: id })
      });

      const data = await res.json();

      if (data.success) {
        setVerifiedIds(prev => new Set(prev).add(id));
        toast({
          title: "Verified on Blockchain",
          description: `Block #${data.blockNumber} | Hash: ${data.txHash.substring(0, 10)}...`,
          variant: "default",
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setVerifyingId(null);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Recent Transactions</CardTitle>
        <Link
          to="/expenses"
          className="text-sm text-primary hover:underline"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-3 rounded-lg bg-background hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-lg">
                {getCategoryIcon(transaction.category)}
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">
                  {transaction.description}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">
                    {formatDate(transaction.date)}
                  </p>
                  {verifiedIds.has(transaction.id) && (
                    <Badge variant="outline" className="text-[10px] h-5 px-1 border-green-500 text-green-600 bg-green-50">
                      <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span
                  className={`font-semibold text-sm ${transaction.type === 'income'
                      ? 'text-chart-1'
                      : 'text-foreground'
                    }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </span>
                {transaction.type === 'income' ? (
                  <ArrowDownLeft className="h-4 w-4 text-chart-1" />
                ) : (
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                )}
              </div>

              {!verifiedIds.has(transaction.id) && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => verify(transaction.id)}
                  disabled={verifyingId === transaction.id}
                >
                  {verifyingId === transaction.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    "Verify"
                  )}
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

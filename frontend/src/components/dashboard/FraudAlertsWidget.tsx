import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FraudAlert } from '@/types';
import { AlertTriangle, Shield, Check } from 'lucide-react';
import { formatDate } from '@/lib/mock-data';

interface FraudAlertsWidgetProps {
  alerts: FraudAlert[];
  onAcknowledge: (id: string) => void;
}

export const FraudAlertsWidget = ({ alerts, onAcknowledge }: FraudAlertsWidgetProps) => {
  const unacknowledgedAlerts = alerts.filter((a) => !a.acknowledged);
  const hasAlerts = unacknowledgedAlerts.length > 0;

  const getSeverityColor = (severity: FraudAlert['severity']) => {
    switch (severity) {
      case 'high':
        return 'bg-destructive text-destructive-foreground';
      case 'medium':
        return 'bg-warning text-warning-foreground';
      case 'low':
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className={hasAlerts ? 'border-destructive/50' : ''}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          {hasAlerts ? (
            <AlertTriangle className="h-5 w-5 text-destructive" />
          ) : (
            <Shield className="h-5 w-5 text-primary" />
          )}
          Security Alerts
        </CardTitle>
        {hasAlerts && (
          <Badge variant="destructive">{unacknowledgedAlerts.length}</Badge>
        )}
      </CardHeader>
      <CardContent>
        {hasAlerts ? (
          <div className="space-y-3">
            {unacknowledgedAlerts.slice(0, 2).map((alert) => (
              <div
                key={alert.id}
                className="p-3 rounded-lg bg-destructive/5 border border-destructive/20"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(alert.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{alert.message}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onAcknowledge(alert.id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <Shield className="h-12 w-12 text-primary mx-auto mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground">
              No security alerts. Your account is secure.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

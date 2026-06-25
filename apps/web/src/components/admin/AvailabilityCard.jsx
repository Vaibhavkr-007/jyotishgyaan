
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const AvailabilityCard = ({ title, value, icon: Icon, colorClass, isLoading }) => {
  return (
    <Card className="bg-admin-card border-admin-border shadow-sm">
      <CardContent className="p-5 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-admin-muted-foreground">{title}</p>
          {isLoading ? (
            <Skeleton className="h-7 w-16 mt-1" />
          ) : (
            <h3 className="text-2xl font-bold text-admin-foreground">{value}</h3>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-admin-muted shrink-0 ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
      </CardContent>
    </Card>
  );
};

export default AvailabilityCard;

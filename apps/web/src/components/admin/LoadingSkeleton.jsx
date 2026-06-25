
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const TableSkeleton = ({ rows = 5, columns = 5 }) => {
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px]">
        <div className="flex border-b border-admin-border pb-4 mb-4">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="flex-1 px-4">
              <Skeleton className="h-6 w-24" />
            </div>
          ))}
        </div>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex border-b border-admin-border/50 py-4 last:border-0">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={colIndex} className="flex-1 px-4">
                <Skeleton className="h-5 w-full max-w-[120px]" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <Card className="bg-admin-card border-admin-border shadow-sm">
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-32 mb-2" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
};

export const ChartSkeleton = () => {
  return (
    <Card className="bg-admin-card border-admin-border shadow-sm h-full">
      <CardHeader>
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent className="flex items-end gap-2 h-[300px] pt-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton 
            key={i} 
            className="flex-1 rounded-t-md rounded-b-none" 
            style={{ height: `${Math.max(20, Math.random() * 100)}%` }} 
          />
        ))}
      </CardContent>
    </Card>
  );
};

export const StatCardSkeleton = () => {
  return (
    <Card className="bg-admin-card border-admin-border shadow-sm">
      <CardContent className="p-6 flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton className="h-12 w-12 rounded-xl" />
      </CardContent>
    </Card>
  );
};

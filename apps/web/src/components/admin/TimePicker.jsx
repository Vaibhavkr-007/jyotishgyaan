
import React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

const TimePicker = ({ 
  value, 
  onChange, 
  className,
  disabled = false,
  required = false
}) => {
  return (
    <div className="relative">
      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-muted-foreground pointer-events-none" />
      <Input
        type="time"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
        className={cn(
          "pl-9 bg-admin-background border-admin-border text-admin-foreground h-10 w-full",
          "[&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:hover:opacity-100",
          className
        )}
      />
    </div>
  );
};

export default TimePicker;

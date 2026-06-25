
import React from 'react';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  eachDayOfInterval, isSameMonth, isSameDay, isToday, parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Calendar = ({ 
  currentDate, 
  setCurrentDate, 
  events = [], 
  onDateClick,
  selectedDate
}) => {
  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start, end });

  // Add empty cells for correct week day start (0 = Sunday)
  const startDayOfWeek = start.getDay();
  const emptyDays = Array.from({ length: startDayOfWeek }).map((_, i) => i);

  const getDayEvents = (date) => {
    return events.filter(e => isSameDay(parseISO(e.date), date));
  };

  const getCellClasses = (date) => {
    const dayEvents = getDayEvents(date);
    const classes = [];
    
    if (isSameDay(date, selectedDate)) classes.push('ring-2 ring-admin-primary ring-offset-1 bg-admin-muted');
    if (isToday(date)) classes.push('font-bold text-admin-primary');
    
    if (dayEvents.some(e => e.type === 'blocked')) {
      classes.push('cal-cell-blocked');
    } else if (dayEvents.some(e => e.type === 'available')) {
      classes.push('cal-cell-available');
    } else {
      classes.push('text-admin-foreground hover:bg-admin-muted');
    }

    return classes.join(' ');
  };

  return (
    <div className="w-full bg-admin-card rounded-xl border border-admin-border p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-admin-foreground">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-1">
          <Button variant="outline" size="icon" onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-center text-xs font-medium text-admin-muted-foreground pb-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {emptyDays.map(i => (
          <div key={`empty-${i}`} className="h-10 sm:h-12 rounded-md bg-transparent" />
        ))}
        {days.map((date, i) => {
          const dayEvents = getDayEvents(date);
          return (
            <button
              key={i}
              onClick={() => onDateClick && onDateClick(date)}
              className={cn(
                "h-10 sm:h-12 rounded-md text-sm relative transition-all border border-transparent flex items-center justify-center flex-col",
                getCellClasses(date)
              )}
            >
              <span>{format(date, 'd')}</span>
              {dayEvents.length > 0 && (
                <div className="absolute bottom-1 flex gap-0.5">
                  {dayEvents.slice(0, 3).map((e, idx) => (
                    <div 
                      key={idx} 
                      className={cn(
                        "w-1 h-1 rounded-full",
                        e.type === 'blocked' ? "bg-admin-danger" : "bg-admin-success"
                      )} 
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;

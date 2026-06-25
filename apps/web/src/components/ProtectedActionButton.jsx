
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuthGuard } from '@/hooks/useAuthGuard.js';
import { Loader2 } from 'lucide-react';

const ProtectedActionButton = React.forwardRef(({ onClick, children, disabled, ...props }, ref) => {
  const { checkAuthAndRedirect, isAuthenticated, isLoading } = useAuthGuard();

  const handleClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      e.stopPropagation();
      checkAuthAndRedirect();
      return;
    }
    if (onClick) {
      onClick(e);
    }
  };

  const buttonContent = isLoading ? (
    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Checking...</>
  ) : children;

  const button = (
    <Button 
      ref={ref} 
      onClick={handleClick} 
      disabled={disabled || isLoading} 
      {...props}
    >
      {buttonContent}
    </Button>
  );

  if (!isAuthenticated && !isLoading) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <div className="inline-block cursor-not-allowed">
              <Button 
                ref={ref} 
                onClick={handleClick} 
                disabled={disabled} 
                {...props}
              >
                {children}
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-popover text-popover-foreground border-border">
            <p className="text-sm font-medium">Please log in to perform this action</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
});

ProtectedActionButton.displayName = 'ProtectedActionButton';

export default ProtectedActionButton;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FilterX } from 'lucide-react';

const FilterBar = ({ 
  children, 
  activeFilterCount = 0, 
  onClearFilters,
  className = ""
}) => {
  return (
    <div className={`flex flex-col sm:flex-row gap-3 items-start sm:items-center w-full ${className}`}>
      <div className="flex-1 flex flex-wrap gap-3 items-center w-full">
        {children}
      </div>
      
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="secondary" className="bg-admin-primary/10 text-admin-primary hover:bg-admin-primary/20">
            {activeFilterCount} active
          </Badge>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
            className="text-admin-muted-foreground hover:text-admin-danger h-9 px-3"
          >
            <FilterX className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;

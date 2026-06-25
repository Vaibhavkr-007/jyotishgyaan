
import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X, Loader2 } from 'lucide-react';
import { debounce } from '@/utils/debounce';

const SearchInput = ({ 
  value, 
  onChange, 
  placeholder = "Search...", 
  className = "",
  isLoading = false,
  delay = 300
}) => {
  const [localValue, setLocalValue] = useState(value || '');

  // Update local value if external value changes
  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  // Create debounced callback
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedOnChange = useCallback(
    debounce((val) => {
      onChange(val);
    }, delay),
    [onChange, delay]
  );

  const handleChange = (e) => {
    const val = e.target.value;
    setLocalValue(val);
    debouncedOnChange(val);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-muted-foreground" />
      <Input 
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder} 
        className="pl-9 pr-10 bg-admin-background border-admin-border h-10"
      />
      {isLoading ? (
        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-muted-foreground animate-spin" />
      ) : localValue ? (
        <button 
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-admin-muted-foreground hover:text-admin-foreground focus:outline-none"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      ) : null}
    </div>
  );
};

export default SearchInput;

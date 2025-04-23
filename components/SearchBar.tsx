"use client";

import { useState, useRef, useEffect } from 'react';
import { Location } from '@/lib/types';
import { Search, CornerDownLeft, Clock, X } from 'lucide-react';

interface SearchBarProps {
  query: string;
  suggestions: Location[];
  history: Location[];
  isLoading: boolean;
  onQueryChange: (query: string) => void;
  onSelectLocation: (location: Location) => void;
}

export default function SearchBar({
  query,
  suggestions,
  history,
  isLoading,
  onQueryChange,
  onSelectLocation
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Close suggestions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const showSuggestions = isFocused && (suggestions.length > 0 || (showHistory && history.length > 0));
  
  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute left-3 top-2.5 text-muted-foreground">
          <Search size={18} />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            setShowHistory(query.trim().length === 0);
          }}
          placeholder="Search for a location..."
          className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
        />
        
        {query && (
          <button 
            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
            onClick={() => onQueryChange('')}
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>
      
      {showSuggestions && (
        <div 
          ref={suggestionsRef}
          className="absolute z-10 mt-1 w-full bg-card border border-border rounded-md shadow-md max-h-72 overflow-y-auto"
        >
          {isLoading && (
            <div className="p-3 text-center text-sm text-muted-foreground">
              Loading suggestions...
            </div>
          )}
          
          {!isLoading && showHistory && history.length > 0 && (
            <div className="p-2 border-b border-border">
              <div className="flex items-center px-2 py-1 text-xs text-muted-foreground">
                <Clock size={14} className="mr-1" />
                <span>Recent searches</span>
              </div>
              {history.map((item) => (
                <div 
                  key={`history-${item.place_id}`}
                  className="px-3 py-2 cursor-pointer hover:bg-secondary rounded-md flex items-start"
                  onClick={() => onSelectLocation(item)}
                >
                  <div>
                    <div className="text-sm font-medium truncate">{item.display_name.split(',')[0]}</div>
                    <div className="text-xs text-muted-foreground truncate">{item.display_name}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!isLoading && suggestions.length > 0 && (
            <div className="p-2">
              {!showHistory && suggestions.length > 0 && (
                <div className="flex items-center px-2 py-1 text-xs text-muted-foreground">
                  <span>Suggestions</span>
                </div>
              )}
              
              {suggestions.map((suggestion) => {
                // Split the name for highlighting
                const displayParts = suggestion.display_name.split(new RegExp(`(${query})`, 'gi'));
                
                return (
                  <div 
                    key={suggestion.place_id}
                    className="px-3 py-2 cursor-pointer hover:bg-secondary rounded-md"
                    onClick={() => onSelectLocation(suggestion)}
                  >
                    <div className="text-sm font-medium">
                      {displayParts.map((part, i) => 
                        part.toLowerCase() === query.toLowerCase() 
                          ? <span key={i} className="bg-primary/20 font-semibold">{part}</span> 
                          : part
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {suggestion.type}: {suggestion.lat}, {suggestion.lon}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {!isLoading && suggestions.length === 0 && !showHistory && (
            <div className="p-3 text-center text-sm text-muted-foreground">
              No results found
            </div>
          )}
        </div>
      )}
      
      <div className="mt-2 flex items-center justify-end text-xs text-muted-foreground">
        <CornerDownLeft size={14} className="mr-1" />
        <span>Press Enter to search</span>
      </div>
    </div>
  );
}
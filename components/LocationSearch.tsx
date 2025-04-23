"use client";

import { useState, useRef, useEffect } from 'react';
import LocationMap from './LocationMap';
import SearchBar from './SearchBar';
import { Location } from '@/lib/types';
import { searchLocations } from '@/lib/location-service';

export default function LocationSearch() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchHistory, setSearchHistory] = useState<Location[]>([]);
  
  // Load search history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse search history:', e);
      }
    }
  }, []);

  // Save search history to localStorage when it changes
  useEffect(() => {
    if (searchHistory.length > 0) {
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
  }, [searchHistory]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    
    setIsLoading(true);
    try {
      const results = await searchLocations(query);
      setSuggestions(results);
    } catch (error) {
      console.error('Error searching locations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectLocation = (location: Location) => {
    setSelectedLocation(location);
    setSearchQuery(location.display_name);
    setSuggestions([]);
    
    // Add to search history (avoid duplicates)
    if (!searchHistory.some(item => item.place_id === location.place_id)) {
      const updatedHistory = [location, ...searchHistory].slice(0, 5);
      setSearchHistory(updatedHistory);
    }
  };

  const handleMapClick = (location: Location) => {
    setSelectedLocation(location);
    setSearchQuery(location.display_name);
    
    // Add to search history (avoid duplicates)
    if (!searchHistory.some(item => item.place_id === location.place_id)) {
      const updatedHistory = [location, ...searchHistory].slice(0, 5);
      setSearchHistory(updatedHistory);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <div className="bg-card p-4 rounded-lg shadow-md">
          <SearchBar 
            query={searchQuery}
            suggestions={suggestions}
            history={searchHistory}
            isLoading={isLoading}
            onQueryChange={handleSearch}
            onSelectLocation={handleSelectLocation}
          />
          
          {selectedLocation && (
            <div className="mt-4 p-3 bg-muted rounded-md">
              <h3 className="font-medium mb-2">Selected Location</h3>
              <p className="text-sm mb-1">{selectedLocation.display_name}</p>
              <div className="text-xs text-muted-foreground">
                <p>Lat: {selectedLocation.lat}</p>
                <p>Lon: {selectedLocation.lon}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="lg:col-span-2 h-[500px] md:h-[600px] shadow-md rounded-lg overflow-hidden">
        <LocationMap 
          selectedLocation={selectedLocation}
          onLocationSelect={handleMapClick}
        />
      </div>
    </div>
  );
}
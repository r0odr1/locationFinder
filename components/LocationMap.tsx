"use client";

import { reverseGeocode } from '@/lib/location-service';
import { Location } from '@/lib/types';
import { MapPin } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface LocationMapProps {
  selectedLocation: Location | null;
  onLocationSelect: (location: Location) => void;
}

export default function LocationMap({ selectedLocation, onLocationSelect }: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize map on component mount
  useEffect(() => {
    async function initializeMap() {
      setIsLoading(true);
      setError(null);
      
      try {
        // Dynamically import Leaflet
        const L = (await import('leaflet')).default;
        await import('leaflet/dist/leaflet.css');
        
        // Create map if it doesn't exist
        if (!leafletMapRef.current && mapRef.current) {
          const defaultPosition: [number, number] = [51.505, -0.09]; // Default to London
          
          leafletMapRef.current = L.map(mapRef.current).setView(defaultPosition, 13);
          
          // Add tile layer (OpenStreetMap)
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(leafletMapRef.current);
          
          // Add default marker
          markerRef.current = L.marker(defaultPosition).addTo(leafletMapRef.current);
          
          // Add click handler for map
          leafletMapRef.current.on('click', async (e: any) => {
            const { lat, lng } = e.latlng;
            
            try {
              const location = await reverseGeocode(lat, lng);
              if (location) {
                onLocationSelect(location);
              }
            } catch (error) {
              console.error('Error reverse geocoding:', error);
            }
          });
        }
        
        // If we have a selected location, update the map and marker
        if (selectedLocation && leafletMapRef.current && markerRef.current) {
          const position = [parseFloat(selectedLocation.lat), parseFloat(selectedLocation.lon)];
          leafletMapRef.current.setView(position, 14);
          markerRef.current.setLatLng(position);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing map:', error);
        setError('Failed to load map. Please try again later.');
        setIsLoading(false);
      }
    }
    
    initializeMap();
    
    // Clean up on unmount
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [onLocationSelect]);
  
  // Update map when selected location changes
  useEffect(() => {
    if (selectedLocation && leafletMapRef.current && markerRef.current) {
      const position = [parseFloat(selectedLocation.lat), parseFloat(selectedLocation.lon)];
      leafletMapRef.current.setView(position, 14);
      markerRef.current.setLatLng(position);
      
      // Add a temporary animation to highlight the marker
      if (markerRef.current._icon) {
        markerRef.current._icon.classList.add('marker-bounce');
        setTimeout(() => {
          if (markerRef.current && markerRef.current._icon) {
            markerRef.current._icon.classList.remove('marker-bounce');
          }
        }, 800);
      }
    }
  }, [selectedLocation]);

  return (
    <div className="relative h-full w-full">
      {/* Map container */}
      <div ref={mapRef} className="h-full w-full" />
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
            </div>
            <p className="mt-2 text-sm">Loading map...</p>
          </div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
          <div className="text-center p-4 max-w-md">
            <div className="mb-2 text-destructive">
              <MapPin size={32} />
            </div>
            <h3 className="text-lg font-medium mb-2">Map Error</h3>
            <p>{error}</p>
          </div>
        </div>
      )}
      
      {/* Map instructions */}
      <div className="absolute bottom-3 right-3 bg-card/90 backdrop-blur-sm p-2 rounded-md shadow-md text-xs max-w-xs">
        <p>Click anywhere on the map to select a location</p>
      </div>
      
      {/* Leaflet styles */}
      <style jsx global>{`
        .leaflet-container {
          height: 100%;
          width: 100%;
          font-family: inherit;
        }
        
        .marker-bounce {
          animation: marker-bounce 0.5s ease-out;
        }
        
        @keyframes marker-bounce {
          0% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
import { Location, GeocodeResponse } from './types';

// Nominatim API base URL
const API_BASE_URL = 'https://nominatim.openstreetmap.org';

/**
 * Search for locations based on a query string
 */
export async function searchLocations(query: string): Promise<Location[]> {
  // Add a small delay to prevent too many requests while typing
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    const response = await fetch(
      `${API_BASE_URL}/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en-US,en',
          'User-Agent': 'LocationFinderApp/1.0'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Search request failed with status ${response.status}`);
    }
    
    const data: GeocodeResponse[] = await response.json();
    
    // Transform the response to our Location format
    return data.map(item => ({
      place_id: item.place_id,
      lat: item.lat,
      lon: item.lon,
      display_name: item.display_name,
      type: getLocationType(item),
      importance: item.place_id / 1000000, // Random importance for sorting
      address: item.address
    }));
  } catch (error) {
    console.error('Error searching for locations:', error);
    return [];
  }
}

/**
 * Get location information from coordinates (reverse geocoding)
 */
export async function reverseGeocode(lat: number, lon: number): Promise<Location | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en-US,en',
          'User-Agent': 'LocationFinderApp/1.0'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Reverse geocoding request failed with status ${response.status}`);
    }
    
    const data: GeocodeResponse = await response.json();
    
    return {
      place_id: data.place_id,
      lat: data.lat,
      lon: data.lon,
      display_name: data.display_name,
      type: getLocationType(data),
      importance: data.place_id / 1000000,
      address: data.address
    };
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return null;
  }
}

/**
 * Helper function to determine the type of location
 */
function getLocationType(item: GeocodeResponse): string {
  const address = item.address;
  
  if (!address) return 'Unknown';
  
  if (address.amenity) return 'Amenity';
  if (address.building) return 'Building';
  if (address.shop) return 'Shop';
  if (address.tourism) return 'Tourism';
  if (address.leisure) return 'Leisure';
  if (address.house_number) return 'Address';
  if (address.road) return 'Street';
  if (address.suburb) return 'Suburb';
  if (address.city || address.town || address.village) return 'City';
  if (address.county) return 'County';
  if (address.state) return 'State';
  if (address.country) return 'Country';
  
  return 'Location';
}
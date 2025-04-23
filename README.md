# Location Finder

A interactive location search application with map integration, built with Next.js, React, TypeScript, and Leaflet.js.

## Features

- Search for locations with real-time suggestions
- Interactive map display using Leaflet.js and OpenStreetMap
- Bidirectional interaction between search field and map
- Recent search history
- Responsive design for all device sizes
- Dark/light mode support

## Technical Decisions

### Map Integration: Leaflet.js with OpenStreetMap

I chose Leaflet.js with OpenStreetMap for the map integration for several reasons:

1. **Open-Source**: Leaflet is a fully open-source library, which makes it accessible for all users without requiring API keys or billing accounts.

2. **Simplicity**: Leaflet offers a straightforward API that is easy to implement and customize.

3. **Performance**: It's lightweight and performs well across devices.

4. **Community Support**: Being widely used, it has extensive documentation and community support.

5. **No API Key Required**: Using OpenStreetMap as the tile provider means no API key setup is necessary to get started.

### Geocoding API: Nominatim

For geocoding (converting addresses to coordinates and vice versa), I used Nominatim, which is the search engine for OpenStreetMap data. Key considerations:

1. **No API Key Required**: Nominatim can be used without an API key, making the setup process simpler.

2. **Integration with OpenStreetMap**: Since the map is using OpenStreetMap, using Nominatim provides consistency in data display.

3. **Usage Limitations**: Note that Nominatim has usage policies (maximum of 1 request per second) and should not be used in high-volume production applications without proper caching.

## Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/location-finder.git
   cd location-finder
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Keys

This project does not require any API keys as it uses:
- OpenStreetMap for map tiles
- Nominatim for geocoding

## Limitations and Areas for Improvement

1. **Rate Limiting**: Nominatim has strict usage limits (1 request per second). In a production app, implementing a caching layer or proxying requests through a backend would be necessary.

2. **Map Features**: Additional features could be added such as:
   - Custom map markers
   - Route planning
   - Area selection
   - Point of interest filtering

3. **Search Improvements**:
   - Add autocomplete functionality with better matching
   - Implement filters for search results (by country, type, etc.)
   - Add more detailed place information

4. **Performance Optimization**:
   - Implement better debouncing for search requests
   - Add server-side rendering for initial location data
   - Optimize map rendering for mobile devices

## Deployment

This Next.js application can be deployed to Vercel with zero configuration:

1. Push your code to a GitHub repository
2. Import the project to Vercel
3. Vercel will automatically build and deploy your application

## License


All rights reserved - This project was created by [r0odr1](https://github.com/r0odr1).

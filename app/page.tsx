import LocationSearch from '@/components/LocationSearch';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Find Any Location</h1>
          <p className="text-muted-foreground">
            Search for a location or select directly from the map
          </p>
        </div>
        <LocationSearch />
      </main>
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Location Finder App - Created with Next.js, Tailwind CSS, and Leaflet</p>
        </div>
      </footer>
    </div>
  );
}
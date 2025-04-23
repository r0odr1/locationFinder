"use client";

import { ThemeToggle } from '@/components/ui/theme-toggle';
import { MapPin } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Location Finder</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
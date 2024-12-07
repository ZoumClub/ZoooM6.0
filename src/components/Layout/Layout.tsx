import React from 'react';
import { Header } from '../Header';
import { Navigation } from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Navigation />
      <main className="container mx-auto px-4 py-16">
        {children}
      </main>
    </div>
  );
}
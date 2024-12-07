import React from 'react';
import { Hero } from '../components/home/Hero';
import { FeaturedCars } from '../components/home/FeaturedCars';
import { UsedCars } from '../components/home/UsedCars';
import { BrandLogos } from '../components/home/BrandLogos';
import { WhyChooseUs } from '../components/home/WhyChooseUs';

export function HomePage() {
  return (
    <main>
      <Hero />
      <FeaturedCars />
      <UsedCars />
      <BrandLogos />
      <WhyChooseUs />
    </main>
  );
}
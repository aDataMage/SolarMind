import { Hero } from '@/components/home/Hero';
import { Features } from '@/components/home/Features';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { CTASection } from '@/components/home/CTA';

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <Features />
      <FeaturedProducts />
      <CTASection />
    </main>
  );
}

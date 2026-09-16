import Hero from '../components/home/Hero';
import FeaturedProducts from '../components/home/FeaturedProducts';
import Categories from '../components/home/Categories';
import BestSellers from '../components/home/BestSellers';
import BrandStory from '../components/home/BrandStory';
import WhyChooseUs from '../components/home/WhyChooseUs';
import Reviews from '../components/home/Reviews';
import CTASection from '../components/home/CTASection';

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <Categories />
      <BestSellers />
      <BrandStory />
      <WhyChooseUs />
      <Reviews />
      <CTASection />
    </>
  );
}

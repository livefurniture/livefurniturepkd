import { HeroSlider } from '@/components/home/hero-slider'
import { Intro } from '@/components/home/intro'
import { Highlights } from '@/components/home/highlights'
import { FeaturedCategories } from '@/components/home/featured-categories'
import { GalleryPreview } from '@/components/home/gallery-preview'
import { WhyChoose } from '@/components/home/why-choose'
import { Testimonials } from '@/components/home/testimonials'
import { ContactCta } from '@/components/contact-cta'

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <Intro />
      <Highlights />
      <FeaturedCategories />
      <GalleryPreview />
      <WhyChoose />
      <Testimonials />
      <ContactCta />
    </>
  )
}

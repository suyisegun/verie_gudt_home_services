import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { TrustBar } from '@/components/trust-bar'
import { Scenes } from '@/components/scenes'
import { DayNightCompare } from '@/components/day-night-compare'
import { Features } from '@/components/features'
import { HowItWorks } from '@/components/how-it-works'
import { Testimonials } from '@/components/testimonials'
import { ServiceAreas } from '@/components/service-areas'
import { FAQs } from '@/components/faqs'
import { QuoteForm } from '@/components/quote-form'
import { SiteFooter } from '@/components/site-footer'

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <TrustBar />
        <Scenes />
        <DayNightCompare />
        <Features />
        <HowItWorks />
        <QuoteForm />
        <Testimonials />
        <ServiceAreas />
        <FAQs />
      </main>
      <SiteFooter />
    </>
  )
}

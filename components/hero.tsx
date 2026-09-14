import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { joinCitiesForDisplay, SERVICE_CITIES } from '@/lib/site'
import { MapPin, Star, ShieldCheck } from 'lucide-react'

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="flex flex-col items-start">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Permanent. Programmable. Practically invisible by day.
          </span>

          <h1 className="mt-5 text-balance font-heading text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Permanent <span className="text-primary">roofline LED lighting</span> for <span className="text-primary">every season</span>
          </h1>

          <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Verie Gudt Home Services installs beautiful, permanent roofline LED lighting installed
            once, and enjoyed for years. Warm white for everyday, millions of colors for holidays and
            game days.
          </p>

          <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            Proudly serving {joinCitiesForDisplay(SERVICE_CITIES)}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#quote" className={cn(buttonVariants({ size: 'lg' }), 'h-11 px-6 text-base')}>
              Get Your Free Quote
            </a>
            <a
              href="#scenes"
              className={cn(buttonVariants({ size: 'lg', variant: 'secondary' }), 'h-11 px-6 text-base')}
            >
              See the Scenes
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <span className="font-medium text-foreground">4.9/5</span>
              <span>· 350+ installs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Lifetime workmanship warranty</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-2xl border border-border shadow-2xl shadow-black/40">
            <img
              src="/images/hero-home-dusk.webp"
              alt="Modern two-story home at dusk with a continuous line of warm-white permanent LED lights glowing along the entire roofline"
              className="h-full w-full object-cover"
              width={720}
              height={720}
              loading="eager"
              fetchPriority="high"
            />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/70 to-transparent" />
          </div>
          <div className="absolute -bottom-5 left-5 rounded-xl border border-border bg-card/95 px-4 py-3 shadow-xl backdrop-blur sm:left-8">
            <p className="text-xs text-muted-foreground">Tonight&apos;s scene</p>
            <p className="font-heading text-sm font-semibold">Warm White · 40%</p>
          </div>
        </div>
      </div>
    </section>
  )
}

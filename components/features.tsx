import { Smartphone, CloudRain, EyeOff, CalendarClock, Palette, Wrench } from 'lucide-react'

const features = [
  {
    icon: Smartphone,
    title: 'Control from your phone',
    description:
      'Change colors, brightness, patterns, and schedules from the app — from the couch or across the country.',
  },
  {
    icon: EyeOff,
    title: 'Invisible by day',
    description:
      'Low-profile channel tucks the LEDs neatly under your eaves, color-matched to your trim so it disappears in daylight.',
  },
  {
    icon: CloudRain,
    title: 'Built for the weather',
    description:
      'Commercial-grade, fully weatherproof track and diodes engineered to shrug off rain, snow, heat, and UV.',
  },
  {
    icon: Palette,
    title: 'Millions of colors',
    description:
      'Individually addressable RGB diodes mean smooth gradients, chases, and true whites — not just a few presets.',
  },
  {
    icon: CalendarClock,
    title: 'Set-and-forget scheduling',
    description:
      'Auto on at dusk, off at midnight, holiday scenes queued weeks ahead. Your home always looks intentional.',
  },
  {
    icon: Wrench,
    title: 'Professionally installed',
    description:
      'Our trained local crews handle mounting, wiring, and setup in a day — cleanly, safely, and warrantied.',
  },
]

export function Features() {
  return (
    <section id="features" className="border-y border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <p className="font-heading text-sm font-semibold uppercase tracking-widest text-primary">
            Why homeowners choose us
          </p>
          <h2 className="mt-3 text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Premium hardware, done right the first time
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-border bg-background p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

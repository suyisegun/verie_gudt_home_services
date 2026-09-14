import { MapPin } from 'lucide-react'
import { SERVICE_AREAS, joinCitiesForDisplay, SERVICE_CITIES } from '@/lib/site'

export function ServiceAreas() {
  return (
    <section id="service-areas" className="border-t border-border bg-card/30 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Where we work
          </p>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Proudly lighting up homes across {joinCitiesForDisplay(SERVICE_CITIES)}
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            From established neighborhoods to new-build communities, our crews know these areas well.
            Don&apos;t see your community listed? Reach out — we&apos;re always expanding.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {SERVICE_AREAS.map((area) => (
            <div key={area.city} className="rounded-2xl border border-border bg-background p-6 sm:p-8">
              <h3 className="flex items-center gap-2 font-heading text-lg font-semibold">
                <MapPin className="h-4.5 w-4.5 shrink-0 text-primary" />
                {area.city}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {area.neighborhoods.map((neighborhood) => (
                  <li
                    key={neighborhood}
                    className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs text-muted-foreground"
                  >
                    {neighborhood}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

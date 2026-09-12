import { Star } from 'lucide-react'

const reviews = [
  {
    quote:
      "Best home upgrade we've made. Warm white every night, and the kids love picking colors for every holiday. Install was spotless.",
    name: 'Marcus & Dana R.',
    location: 'Maple Grove',
  },
  {
    quote:
      "I was worried it would look tacky in daylight — you genuinely cannot see it. At night it's stunning. The app is dead simple.",
    name: 'Priya S.',
    location: 'Riverside',
  },
  {
    quote:
      'No more climbing ladders in December. One tap and the house is ready for game day. Worth every penny.',
    name: 'Tom B.',
    location: 'Oakwood',
  },
]

export function Testimonials() {
  return (
    <section id="reviews" className="border-y border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <p className="font-heading text-sm font-semibold uppercase tracking-widest text-primary">
            Loved by neighbors
          </p>
          <h2 className="mt-3 text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            600+ homes and counting
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <figure
              key={review.name}
              className="flex flex-col rounded-2xl border border-border bg-background p-6"
            >
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-pretty leading-relaxed text-foreground">
                {`\u201C${review.quote}\u201D`}
              </blockquote>
              <figcaption className="mt-5 border-t border-border pt-4">
                <p className="font-medium text-foreground">{review.name}</p>
                <p className="text-sm text-muted-foreground">{review.location}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

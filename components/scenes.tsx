const scenes = [
  {
    title: 'Holidays',
    description:
      'Red and green in December, red-white-and-blue in July. Every holiday preset is one tap away.',
    image: '/images/scene-holiday.webp',
    alt: 'Home at night with roofline LED lights in festive alternating red and green holiday colors',
  },
  {
    title: 'Game Day',
    description: 'Fly your team colors the moment kickoff lands. Save presets for every team you love.',
    image: '/images/scene-gameday.webp',
    alt: 'Home at night with roofline LED lights in bold blue and orange team game-day colors',
  },
  {
    title: 'Everyday',
    description:
      'Tasteful warm-white accent lighting that makes your home look sharp on any ordinary night.',
    image: '/images/scene-everyday.webp',
    alt: 'Home at night with subtle elegant warm-white roofline accent lighting',
  },
]

export function Scenes() {
  return (
    <section id="scenes" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="max-w-2xl">
        <p className="font-heading text-sm font-semibold uppercase tracking-widest text-primary">
          One system, endless scenes
        </p>
        <h2 className="mt-3 text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          The only lights your home will ever need
        </h2>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
          Set it and forget it, or reprogram it in seconds. Schedule scenes to turn on at dusk and
          off at bedtime — automatically.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {scenes.map((scene) => (
          <article
            key={scene.title}
            className="group overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary/50"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={scene.image || '/placeholder.svg'}
                alt={scene.alt}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                width={480}
                height={360}
              />
            </div>
            <div className="p-6">
              <h3 className="font-heading text-xl font-semibold">{scene.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {scene.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

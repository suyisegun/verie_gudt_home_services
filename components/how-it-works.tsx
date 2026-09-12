const steps = [
  {
    step: '01',
    title: 'Free on-site quote',
    description:
      'We measure your rooflines, discuss the look you want, and give you a clear, no-pressure quote — usually same week.',
  },
  {
    step: '02',
    title: 'One-day professional install',
    description:
      'Our crew mounts the color-matched track, runs concealed wiring, and configures your controller and app.',
  },
  {
    step: '03',
    title: 'Light it up, forever',
    description:
      'Walk through the app with us, save your favorite scenes, and enjoy a fully warrantied system that lasts for years.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="max-w-2xl">
        <p className="font-heading text-sm font-semibold uppercase tracking-widest text-primary">
          How it works
        </p>
        <h2 className="mt-3 text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          From quote to glow in three simple steps
        </h2>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {steps.map((item) => (
          <div key={item.step} className="relative">
            <span className="font-heading text-5xl font-bold text-primary/25">{item.step}</span>
            <h3 className="mt-3 font-heading text-xl font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

const stats = [
  { value: '350+', label: 'Homes lit' },
  { value: '50k+', label: 'Colors & scenes' },
  { value: '10 yr', label: 'LED warranty' },
  { value: '1 day', label: 'Typical install' },
]

export function TrustBar() {
  return (
    <section className="border-y border-border bg-card/40">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-4 sm:px-6 md:grid-cols-4 lg:px-8">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center py-8 text-center">
            <span className="font-heading text-3xl font-bold text-primary sm:text-4xl">
              {stat.value}
            </span>
            <span className="mt-1 text-sm text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

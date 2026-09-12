import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: 'What are permanent roofline LED lights?',
    answer:
      'They are low-profile, commercial-grade LED lights installed discreetly under your fascia and around eaves and gables. The track blends into your home during the day and creates beautiful lighting scenes at night.',
  },
  {
    question: 'Can I control the lights from my phone?',
    answer:
      'Yes. Your system connects to an easy-to-use mobile app so you can change colors, brightness, patterns, and schedules from anywhere.',
  },
  {
    question: 'Will the lights be visible during the day?',
    answer:
      'The slim track is designed to sit neatly under the fascia and coordinate with your roofline. From the street, it stays subtle and low-profile when turned off.',
  },
  {
    question: 'How many colors and scenes can I choose from?',
    answer:
      'You can choose from millions of colors and create scenes for holidays, game days, celebrations, everyday accent lighting, and more.',
  },
  {
    question: 'How long does installation take?',
    answer:
      'Most residential installations are completed in one day. During your consultation, we will confirm the timeline based on your home’s size and roofline layout.',
  },
  {
    question: 'Are permanent LED lights weatherproof?',
    answer:
      'Yes. Our outdoor-rated lighting systems are built to handle rain, snow, heat, and seasonal weather while delivering reliable year-round performance.',
  },
  {
    question: 'Do you offer a warranty?',
    answer:
      'Yes. Your installation includes our workmanship coverage, and the lighting system is backed by the manufacturer’s product warranty. We will review the details with you before installation.',
  },
]

export function FAQs() {
  return (
    <section id="faqs" className="border-t border-border bg-card/30 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Good to know
          </p>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Questions, answered.
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Everything you need to know before bringing your roofline to life.
          </p>
        </div>

        <div className="mt-12 divide-y divide-border rounded-2xl border border-border bg-background px-5 sm:px-8">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-5 first:pt-6 last:pb-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-heading text-sm font-semibold leading-relaxed text-foreground marker:hidden [&::-webkit-details-marker]:hidden">
                {faq.question}
                <ChevronDown className="h-5 w-5 shrink-0 text-primary transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <p className="max-w-3xl pr-8 pt-3 text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

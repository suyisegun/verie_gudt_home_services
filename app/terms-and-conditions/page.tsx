import Link from 'next/link'

export const metadata = {
  title: 'Terms & Conditions | Verie Gudt Home Services',
  description: 'Terms and Conditions for Verie Gudt Home Services.',
}

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-16 text-foreground sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm text-primary hover:underline">← Back to home</Link>
        <p className="mt-12 font-heading text-sm font-semibold uppercase tracking-widest text-primary">Legal</p>
        <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight">Terms &amp; Conditions</h1>
        <p className="mt-4 text-sm text-muted-foreground">Last updated: September 10, 2026</p>
        <div className="mt-10 space-y-8 text-base leading-relaxed text-muted-foreground">
          <section><h2 className="font-heading text-xl font-semibold text-foreground">Using this website</h2><p className="mt-3">This website provides general information about Verie Gudt Home Services and allows visitors to request a quote. Website content is provided for informational purposes and may change without notice.</p></section>
          <section><h2 className="font-heading text-xl font-semibold text-foreground">Quotes and services</h2><p className="mt-3">Quote requests are not service contracts or guaranteed pricing. Final scope, pricing, scheduling, warranties, and availability are confirmed separately in writing after an estimate and review of project conditions.</p></section>
          <section><h2 className="font-heading text-xl font-semibold text-foreground">Acceptable use</h2><p className="mt-3">You agree not to misuse this website, submit false or misleading information, interfere with its operation, or use it for unlawful purposes.</p></section>
          <section><h2 className="font-heading text-xl font-semibold text-foreground">Limitation of liability</h2><p className="mt-3">To the extent permitted by law, Verie Gudt Home Services is not responsible for indirect, incidental, or consequential losses arising from use of this website or reliance on information provided here.</p></section>
          <section><h2 className="font-heading text-xl font-semibold text-foreground">Contact</h2><p className="mt-3">Questions about these terms can be directed to Verie Gudt Home Services at 639-560-4255.</p></section>
        </div>
      </article>
    </main>
  )
}

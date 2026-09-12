import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy | Verie Gudt Home Services',
  description: 'Privacy Policy for Verie Gudt Home Services.',
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-16 text-foreground sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm text-primary hover:underline">← Back to home</Link>
        <p className="mt-12 font-heading text-sm font-semibold uppercase tracking-widest text-primary">Legal</p>
        <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-4 text-sm text-muted-foreground">Last updated: September 10, 2026</p>
        <div className="mt-10 space-y-8 text-base leading-relaxed text-muted-foreground">
          <section><h2 className="font-heading text-xl font-semibold text-foreground">Information we collect</h2><p className="mt-3">When you request a quote, we may collect your name, phone number, email address, home address, project preferences, and information you choose to provide. We may also collect basic website usage information to improve our site.</p></section>
          <section><h2 className="font-heading text-xl font-semibold text-foreground">How we use information</h2><p className="mt-3">We use submitted information to respond to quote requests, schedule estimates, communicate about services, provide customer support, and improve our website and service experience.</p></section>
          <section><h2 className="font-heading text-xl font-semibold text-foreground">Sharing and security</h2><p className="mt-3">We do not sell your personal information. We may share information with service providers who help us operate the website or communicate with you, and when required by law. We use reasonable safeguards to protect information, but no online transmission is guaranteed to be completely secure.</p></section>
          <section><h2 className="font-heading text-xl font-semibold text-foreground">Your choices</h2><p className="mt-3">You may ask us to update or delete information you have provided, or opt out of non-essential communications, by contacting us at 639-560-4255.</p></section>
          <section><h2 className="font-heading text-xl font-semibold text-foreground">Contact</h2><p className="mt-3">Questions about this policy can be directed to Verie Gudt Home Services at 639-560-4255.</p></section>
        </div>
      </article>
    </main>
  )
}

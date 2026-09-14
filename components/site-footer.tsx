import { Phone, Mail, MapPin } from 'lucide-react'
import { joinCitiesForDisplay, SERVICE_CITIES, SITE_LOGO_URL } from '@/lib/site'

const logoUrl = SITE_LOGO_URL

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <img
                src={logoUrl}
                alt="Verie Gudt Home Services logo"
                className="h-9 w-9 rounded-lg object-cover"
                loading="lazy"
              />
              <span className="font-heading text-base font-semibold leading-tight">
                Verie Gudt
                <span className="block text-xs font-normal text-muted-foreground">
                  Home Services
                </span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Premium, permanent, app-controlled roofline LED lighting — professionally installed
              and built to last.
            </p>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold">Explore</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li><a href="#how-it-works" className="hover:text-foreground">How It Works</a></li>
              <li><a href="#scenes" className="hover:text-foreground">Scenes</a></li>
              <li><a href="#features" className="hover:text-foreground">Features</a></li>
              <li><a href="#reviews" className="hover:text-foreground">Reviews</a></li>
              <li><a href="#service-areas" className="hover:text-foreground">Service Areas</a></li>
              <li><a href="#faqs" className="hover:text-foreground">FAQs</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold">Contact</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <a href="tel:+16395604255" className="hover:text-foreground">639-560-4255</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <a href="mailto:hello@veriegudt.com" className="hover:text-foreground">
                  hello@veriegudt.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>Serving {joinCitiesForDisplay(SERVICE_CITIES)}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold">Hours</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>Mon–Fri · 8am – 6pm</li>
              <li>Saturday · 9am – 3pm</li>
              <li>Sunday · Closed</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Verie Gudt Home Services. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="/privacy-policy" className="hover:text-foreground">Privacy Policy</a>
            <a href="/terms-and-conditions" className="hover:text-foreground">Terms &amp; Conditions</a>
            <span>Licensed &amp; Insured</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

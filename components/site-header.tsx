'use client'

import { useState } from 'react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Scenes', href: '#scenes' },
  { label: 'Features', href: '#features' },
  { label: 'Reviews', href: '#reviews' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-2.5">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VGHMlogo-R3UA1mAtU9EJASOrjAHbjEKckfoXP9.png"
            alt="Verie Gudt Home Services logo"
            className="h-9 w-9 rounded-lg object-cover"
          />
          <span className="font-heading text-base font-semibold leading-tight">
            Verie Gudt
            <span className="block text-xs font-normal text-muted-foreground">Home Services</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a href="tel:+16395604255" className="text-sm font-medium text-foreground">
            639-560-4255
          </a>
          <a href="#quote" className={cn(buttonVariants(), 'h-9 px-4')}>
            Get a Free Quote
          </a>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-md px-2 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#quote"
              onClick={() => setOpen(false)}
              className={cn(buttonVariants(), 'mt-2 h-10 px-4')}
            >
              Get a Free Quote
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}

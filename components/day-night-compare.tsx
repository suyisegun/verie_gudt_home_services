'use client'

import { useState, useRef } from 'react' 

export function DayNightCompare() {
  const [position, setPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const clientX = e.clientX
    const newPosition = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))

    setPosition(newPosition)
  }

  const handleStart = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    handleMove(e)
  }

  const handleEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = false
    e.currentTarget.releasePointerCapture(e.pointerId)
  }

  return (
    <section id="compare" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="max-w-3xl">
        <p className="font-heading text-sm font-semibold uppercase tracking-widest text-primary">
          Day to night
        </p>
        <h2 className="mt-3 text-balance font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          Disappears by day, transforms by night
        </h2>
        <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
          The LED track stays hidden under your fascia during daylight. Invisible. Then when dusk falls,
          your home comes alive with warm-white accents that make every surface glow.
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative mt-10 aspect-video w-full cursor-col-resize overflow-hidden rounded-2xl bg-muted"
        onPointerDown={handleStart}
        onPointerMove={handleMove}
        onPointerUp={handleEnd}
        onPointerCancel={handleEnd}
        style={{ touchAction: 'none' }}
      >
        {/* Night image (background) */}
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/compare-night.png-oAKxSYIqWepa2BAHioiIXoNIIa4H50.jpeg"
          alt="Home at night with warm-white roofline LED lighting"
          className="absolute inset-0 h-full w-full object-cover"
          width={1600}
          height={900}
        />

        {/* Day image (overlay, clipped by position) */}
        <div
          className="absolute inset-0 h-full overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/compare-day.png-rwdqlMt3WlX7NJafKtVRDAWHMT9wph.jpeg"
            alt="Home during daytime with LED track hidden"
            className="h-full w-full object-cover"
            width={1600}
            height={900}
          />
        </div>

        {/* Drag handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-primary transition-opacity duration-200"
          style={{ left: `${position}%`, opacity: isDragging.current ? 1 : 0.6 }}
        >
          {/* Handle circle */}
          <div className="absolute top-1/2 left-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-background/90 shadow-lg flex items-center justify-center">
            <svg
              className="h-5 w-5 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <svg
              className="h-5 w-5 text-primary -ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 rounded bg-background/80 px-3 py-1.5 backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-widest text-foreground">Day</p>
        </div>
        <div className="absolute top-4 right-4 rounded bg-background/80 px-3 py-1.5 backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-widest text-foreground">Night</p>
        </div>
      </div>
    </section>
  )
}

'use client'

import { useRef, useState } from 'react'

const MIN_POSITION = 0
const MAX_POSITION = 100
const KEYBOARD_STEP = 2

export function DayNightCompare() {
  const [position, setPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  function positionFromClientX(clientX: number) {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return position
    return Math.max(MIN_POSITION, Math.min(MAX_POSITION, ((clientX - rect.left) / rect.width) * 100))
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    setIsDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
    setPosition(positionFromClientX(event.clientX))
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging) return
    setPosition(positionFromClientX(event.clientX))
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    setIsDragging(false)
    event.currentTarget.releasePointerCapture(event.pointerId)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault()
      setPosition((current) => Math.max(MIN_POSITION, current - KEYBOARD_STEP))
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault()
      setPosition((current) => Math.min(MAX_POSITION, current + KEYBOARD_STEP))
    } else if (event.key === 'Home') {
      event.preventDefault()
      setPosition(MIN_POSITION)
    } else if (event.key === 'End') {
      event.preventDefault()
      setPosition(MAX_POSITION)
    }
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
          your home comes alive with warm-white accents that make every surface glow. Drag the divider —
          or use the arrow keys once it's focused — to compare the two.
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative mt-10 aspect-video w-full select-none overflow-hidden rounded-2xl bg-muted"
        style={{ touchAction: 'none' }}
      >
        {/* Night image (base layer, fully visible) */}
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/compare-night.png-oAKxSYIqWepa2BAHioiIXoNIIa4H50.jpeg"
          alt="Home at night with warm-white roofline LED lighting"
          className="absolute inset-0 h-full w-full object-cover"
          width={1600}
          height={900}
          draggable={false}
        />

        {/* Day image — same full-container size as the night image behind it, just visually
            clipped to the left of the divider with clip-path. Clipping this way (rather than
            shrinking a wrapper div's width) keeps object-cover's fit/crop identical to the night
            image at every divider position, so dragging reveals a fixed photo instead of one that
            re-scales and re-centers as its box narrows. */}
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/compare-day.png-rwdqlMt3WlX7NJafKtVRDAWHMT9wph.jpeg"
          alt="Home during daytime with LED track hidden"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          width={1600}
          height={900}
          draggable={false}
        />

        {/* Full-area pointer target for dragging anywhere in the frame */}
        <div
          className="absolute inset-0 cursor-col-resize"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />

        {/* Divider + handle — the focusable, keyboard-operable slider control */}
        <div
          role="slider"
          tabIndex={0}
          aria-label="Day to night comparison"
          aria-valuemin={MIN_POSITION}
          aria-valuemax={MAX_POSITION}
          aria-valuenow={Math.round(position)}
          aria-valuetext={`${Math.round(position)}% day`}
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="absolute top-0 bottom-0 flex w-6 -translate-x-1/2 cursor-col-resize items-center justify-center outline-none"
          style={{ left: `${position}%` }}
        >
          <div className={`absolute top-0 bottom-0 w-1 bg-primary transition-opacity duration-150 ${isDragging ? 'opacity-100' : 'opacity-60'}`} />
          <div
            className={`relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-background/90 shadow-lg transition-shadow duration-150 ${isDragging ? 'ring-4 ring-primary/30' : ''}`}
          >
            <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <svg className="-ml-2 h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        </div>

        {/* Labels */}
        <div className="pointer-events-none absolute top-4 left-4 rounded bg-background/80 px-3 py-1.5 backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-widest text-foreground">Day</p>
        </div>
        <div className="pointer-events-none absolute top-4 right-4 rounded bg-background/80 px-3 py-1.5 backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-widest text-foreground">Night</p>
        </div>
      </div>
    </section>
  )
}

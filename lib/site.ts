export const SITE_URL = 'https://veriegudt.homes'
export const SITE_NAME = 'Verie Gudt Home Services'
export const SITE_PHONE = '+16395604255'
export const SITE_EMAIL = 'hello@veriegudt.com'
export const SITE_LOGO_URL =
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VGHMlogo-R3UA1mAtU9EJASOrjAHbjEKckfoXP9.png'

// Service area, city level (used in structured data, meta description, and page copy) and
// neighborhood level (kept here for future location-specific content — not surfaced everywhere).
export const SERVICE_CITIES = ['Edmonton', 'Sherwood Park', 'Leduc', 'St. Albert'] as const

/** "Edmonton, Sherwood Park, Leduc & St. Albert" — for prose, not structured data. */
export function joinCitiesForDisplay(cities: readonly string[]): string {
  if (cities.length <= 1) return cities.join('')
  return `${cities.slice(0, -1).join(', ')} & ${cities[cities.length - 1]}`
}

export const SERVICE_AREAS: { city: (typeof SERVICE_CITIES)[number]; neighborhoods: string[] }[] = [
  {
    city: 'Edmonton',
    neighborhoods: [
      'Westbrook Estates',
      'Windsor Park',
      'Glenora',
      'Windermere',
      'Laurier Heights',
      'Crestwood',
      'Oleskiw',
      'Grandview Heights',
      'Quesnell Heights',
      'Cameron Heights',
    ],
  },
  {
    city: 'Sherwood Park',
    neighborhoods: [
      'Estates of Sherwood Park',
      'Broadmoor Estates',
      'Foxhaven / Foxboro',
      'Salisbury Village',
      'Heritage Hills',
      'Nottingham',
      'Woodbridge Farms',
      'Aspen Trails',
      'Regency Park',
      'Glen Allan',
    ],
  },
  {
    city: 'Leduc',
    neighborhoods: ['Lakeside Estates', 'Black Stone', 'Windrose', 'Meadowview', 'Robinson'],
  },
  {
    city: 'St. Albert',
    neighborhoods: [
      'Kingswood',
      'Jensen Lakes',
      'Oakmont',
      'Riverside',
      'Erin Ridge North',
      'Erin Ridge',
      'Lacombe Park',
    ],
  },
]

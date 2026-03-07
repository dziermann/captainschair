export type Category = 'person' | 'cargo' | 'ship' | 'ally' | 'location' | 'encounter' | 'incident'

export interface CategoryStyle {
  bg: string
  hoverBg: string
  darkBg: string
  darkHoverBg: string
  icon?: string
}

export const categoryStyles: Record<string, CategoryStyle> = {
  person: {
    bg: 'bg-[#F8991D]', // Orange
    hoverBg: 'hover:bg-[#e68a12]',
    darkBg: 'dark:bg-[#e68a12]',
    darkHoverBg: 'dark:hover:bg-[#F8991D]',
    icon: '/captainschair/icons/person.svg',
  },
  cargo: {
    bg: 'bg-[#3499CC]', // Blue
    hoverBg: 'hover:bg-[#2A7AA3]',
    darkBg: 'dark:bg-[#2A7AA3]',
    darkHoverBg: 'dark:hover:bg-[#3499CC]',
    icon: '/captainschair/icons/cargo.svg',
  },
  ship: {
    bg: 'bg-[#4a4a4a]', // Dark Grey/Charcoal
    hoverBg: 'hover:bg-[#3a3a3a]',
    darkBg: 'dark:bg-[#3a3a3a]',
    darkHoverBg: 'dark:hover:bg-[#4a4a4a]',
    icon: '/captainschair/icons/ship.svg',
  },
  ally: {
    bg: 'bg-[#8e24aa]', // Purple
    hoverBg: 'hover:bg-[#7b1fa2]',
    darkBg: 'dark:bg-[#7b1fa2]',
    darkHoverBg: 'dark:hover:bg-[#8e24aa]',
    icon: '/captainschair/icons/ally.svg',
  },
  location: {
    bg: 'bg-[#00897b]', // Green/Teal (as Ort in image)
    hoverBg: 'hover:bg-[#00796b]',
    darkBg: 'dark:bg-[#00796b]',
    darkHoverBg: 'dark:hover:bg-[#00897b]',
    icon: '/captainschair/icons/location.svg',
  },
  encounter: {
    bg: 'bg-[#d1a4cc]', // Pinkish/Lavender
    hoverBg: 'hover:bg-[#c094bb]',
    darkBg: 'dark:bg-[#c094bb]',
    darkHoverBg: 'dark:hover:bg-[#d1a4cc]',
    icon: '/captainschair/icons/encounter.svg',
  },
  incident: {
    bg: 'bg-[#C53526]', // Base red
    hoverBg: 'hover:bg-[#A52A1E]',
    darkBg: 'dark:bg-[#A52A1E]',
    darkHoverBg: 'dark:hover:bg-[#C53526]',
    icon: '/captainschair/icons/incident.svg',
  },
}

const categoryMapping: Record<string, string> = {
  // German -> English
  'person': 'person',
  'fracht': 'cargo',
  'schiff': 'ship',
  'verbündeter': 'ally',
  'begegnung': 'encounter',
  'zwischenfall': 'incident',
  'ort': 'location',
  // English -> English (for completeness)
  'cargo': 'cargo',
  'ally': 'ally',
  'location': 'location',
  'encounter': 'encounter',
  'incident': 'incident',
}

export function getCategoryStyle(category: string): CategoryStyle {
  const normalized = category.toLowerCase()
  const mappedKey = categoryMapping[normalized] || normalized
  
  return (
    categoryStyles[mappedKey] || {
      bg: 'bg-zinc-600',
      hoverBg: 'hover:bg-zinc-700',
      darkBg: 'dark:bg-zinc-700',
      darkHoverBg: 'dark:hover:bg-zinc-600',
    }
  )
}

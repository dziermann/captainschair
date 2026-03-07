import React from 'react'
import { TraitBadge } from './TraitBadge'
import { CardCategoryBadge } from './CardCategoryBadge'
import { isSpecies } from './utils/species'
import { isOtherTrait } from './utils/otherTraits'

export interface Card {
  id: string
  set?: string
  category: string
  translations: Record<string, {
    name: string
    traits: string[]
  }>
}

interface CardItemProps {
  card: Card
  lang: string
  columns: 1 | 3
  toggleCategory: (category: string) => void
  toggleSpecies: (species: string) => void
  toggleOtherTrait: (trait: string) => void
  toggleTrait: (trait: string) => void
}

export function CardItem({ 
  card, 
  lang, 
  columns, 
  toggleCategory, 
  toggleSpecies, 
  toggleOtherTrait, 
  toggleTrait 
}: CardItemProps) {
  const translation = card.translations[lang] || card.translations['en'] || (card as any)
  
  if (columns === 1) {
    return (
      <div className="group bg-zinc-900 px-4 py-2 rounded-xl border border-zinc-800 hover:border-indigo-500/50 hover:bg-zinc-800/80 transition-all duration-300 shadow-sm hover:shadow-indigo-500/10 flex items-center gap-4 w-full">
        <div className="flex items-center gap-3 flex-grow min-w-0">
          <div className="flex-shrink-0">
            <CardCategoryBadge 
              onClick={() => toggleCategory(card.category)}
              className="text-center"
            >
              {card.category}
            </CardCategoryBadge>
          </div>
          
          <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors leading-tight truncate">
            {translation.name}
          </h4>
        </div>

        <div className="flex flex-wrap justify-end gap-1.5 flex-shrink-0 max-w-[50%]">
          {translation.traits?.map((trait: string) => (
            <TraitBadge 
              key={trait} 
              onClick={() => {
                if (isSpecies(trait)) toggleSpecies(trait)
                else if (isOtherTrait(trait)) toggleOtherTrait(trait)
                else toggleTrait(trait)
              }}
            >
              {trait}
            </TraitBadge>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="group bg-zinc-900 p-4 rounded-xl border border-zinc-800 hover:border-indigo-500/50 hover:bg-zinc-800/80 transition-all duration-300 shadow-md hover:shadow-indigo-500/10 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3 min-w-0">
        <h4 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors leading-tight min-w-0">
          {translation.name}
        </h4>
        <div className="flex-shrink-0">
          <CardCategoryBadge 
            onClick={() => toggleCategory(card.category)}
          >
            {card.category}
          </CardCategoryBadge>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-zinc-800/50">
        {translation.traits?.map((trait: string) => (
          <TraitBadge 
            key={trait} 
            onClick={() => {
              if (isSpecies(trait)) toggleSpecies(trait)
              else if (isOtherTrait(trait)) toggleOtherTrait(trait)
              else toggleTrait(trait)
            }}
          >
            {trait}
          </TraitBadge>
        ))}
      </div>
    </div>
  )
}

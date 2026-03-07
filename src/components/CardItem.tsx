import React from 'react'
import { TraitBadge } from './TraitBadge'
import { CardCategoryBadge } from './CardCategoryBadge'
import { isSpecies } from './utils/species'
import { isOtherTrait } from './utils/otherTraits'
import { getCategoryLabel } from './utils/category'
import { getTraitLabel } from './utils/i18n'

export interface Card {
  id: string
  set?: string
  category: string
  traits?: string[]
  focus?: ('science' | 'influence' | 'attack')[]
  competence?: ('science' | 'influence' | 'attack')[]
  translations: Record<string, {
    name: string
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
  const traits = card.traits || []
  const focus = card.focus || []
  const competence = card.competence || []

  const FocusIcons = () => (
    <>
      {focus.map((f, index) => (
        <img 
          key={`${f}-${index}`}
          src={`/captainschair/icons/focus/${f}.png`} 
          alt={f} 
          className="inline-block size-5 w-auto ml-1 align-text-top"
        />
      ))}
    </>
  )

  const CompetenceIcons = () => (
    <>
      {competence.map((c, index) => (
        <img 
          key={`${c}-${index}`}
          src={`/captainschair/icons/competence/${c}.png`} 
          alt={c} 
          className="inline-block size-5 w-auto ml-1 align-text-top"
        />
      ))}
    </>
  )
  
  if (columns === 1) {
    return (
      <div className="group bg-zinc-900 px-4 py-2 rounded-xl border border-zinc-800 hover:border-indigo-500/50 hover:bg-zinc-800/80 transition-all duration-300 shadow-sm hover:shadow-indigo-500/10 flex items-center gap-4 w-full">
        <div className="flex items-center gap-3 grow min-w-0">
          <div className="shrink-0">
            <CardCategoryBadge 
              category={card.category}
              onClick={() => toggleCategory(card.category)}
              className="text-center"
            >
              {getCategoryLabel(card.category, lang)}
            </CardCategoryBadge>
          </div>
          
          <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors leading-tight truncate">
            {translation.name}
            <FocusIcons />
            <CompetenceIcons />
          </h4>
        </div>

        <div className="flex flex-wrap justify-end gap-1.5 shrink-0 max-w-[50%]">
          {traits.map((trait: string) => (
            <TraitBadge 
              key={trait} 
              trait={trait}
              onClick={() => {
                if (isSpecies(trait)) toggleSpecies(trait)
                else if (isOtherTrait(trait)) toggleOtherTrait(trait)
                else toggleTrait(trait)
              }}
            >
              {getTraitLabel(trait, lang)}
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
          <FocusIcons />
          <CompetenceIcons />
        </h4>
        <div className="shrink-0">
          <CardCategoryBadge 
            category={card.category}
            onClick={() => toggleCategory(card.category)}
          >
            {getCategoryLabel(card.category, lang)}
          </CardCategoryBadge>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-zinc-800/50">
        {traits.map((trait: string) => (
          <TraitBadge 
            key={trait} 
            trait={trait}
            onClick={() => {
              if (isSpecies(trait)) toggleSpecies(trait)
              else if (isOtherTrait(trait)) toggleOtherTrait(trait)
              else toggleTrait(trait)
            }}
          >
            {getTraitLabel(trait, lang)}
          </TraitBadge>
        ))}
      </div>
    </div>
  )
}

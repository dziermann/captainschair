import React, { useState, useMemo } from 'react'
import { Filter, X, LayoutGrid, List, Search } from 'lucide-react'
import { TraitBadge } from './TraitBadge'
import { CategoryBadge } from './CategoryBadge'
import { isSpecies } from './utils/species'
import { isOtherTrait } from './utils/otherTraits'
import { Combobox, ComboboxOption } from './catalyst/combobox'
import { CardItem, type Card } from './CardItem'
import {Badge, BadgeButton} from './catalyst/badge'
import { Input, InputGroup } from './catalyst/input'

interface Props {
  cards: Card[]
  lang: string
}

export default function CardFilterReact({ cards, lang }: Props) {
  const [selectedTraits, setSelectedTraits] = useState<string[]>([])
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([])
  const [selectedOtherTraits, setSelectedOtherTraits] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string | null>(null)
  const [selectedSets, setSelectedSets] = useState<string[]>(['Core Set'])
  const [columns, setColumns] = useState<1 | 3>(1)
  const [searchQuery, setSearchQuery] = useState('')

  const { allSpecies, allOtherTraits, allRegularTraits, speciesCounts, otherCounts, traitCounts } = useMemo(() => {
    const speciesSet = new Set<string>()
    const otherSet = new Set<string>()
    const regularSet = new Set<string>()
    const sCounts: Record<string, number> = {}
    const oCounts: Record<string, number> = {}
    const tCounts: Record<string, number> = {}

    cards.forEach(card => {
      const trans = card.translations[lang] || card.translations['en'] || (card as any)
      const traits = trans.traits || []
      traits.forEach((t: string) => {
        if (isSpecies(t)) {
          speciesSet.add(t)
          sCounts[t] = (sCounts[t] || 0) + 1
        } else if (isOtherTrait(t)) {
          otherSet.add(t)
          oCounts[t] = (oCounts[t] || 0) + 1
        } else {
          regularSet.add(t)
          tCounts[t] = (tCounts[t] || 0) + 1
        }
      })
    })
    return {
      allSpecies: Array.from(speciesSet).sort(),
      allOtherTraits: Array.from(otherSet).sort(),
      allRegularTraits: Array.from(regularSet).sort(),
      speciesCounts: sCounts,
      otherCounts: oCounts,
      traitCounts: tCounts
    }
  }, [cards, lang])

  const { allCategories, categoryCounts } = useMemo(() => {
    const categories = new Set<string>()
    const counts: Record<string, number> = {}
    cards.forEach(card => {
      if (card.category) {
        categories.add(card.category)
        counts[card.category] = (counts[card.category] || 0) + 1
      }
    })
    return {
      allCategories: Array.from(categories).sort(),
      categoryCounts: counts
    }
  }, [cards])

  const { allSets, setCounts } = useMemo(() => {
    const sets = new Set<string>()
    const counts: Record<string, number> = {}
    cards.forEach(card => {
      if (card.set) {
        sets.add(card.set)
        counts[card.set] = (counts[card.set] || 0) + 1
      }
    })
    return {
      allSets: Array.from(sets).sort(),
      setCounts: counts
    }
  }, [cards])

  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      const translation = card?.translations?.[lang] || card?.translations?.['en'] || (card as any)
      
      if (!translation) return false
      
      const matchesSearch = searchQuery === '' || 
        (translation.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (translation.traits || []).some((t: string) => typeof t === 'string' && t.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesSpecies = selectedSpecies.length === 0 || 
        selectedSpecies.some(f => (translation.traits || []).includes(f))

      const matchesOtherTraits = selectedOtherTraits.length === 0 || 
        selectedOtherTraits.some(trait => (translation.traits || []).includes(trait))

      const matchesTraits = selectedTraits.length === 0 || 
        selectedTraits.some(trait => (translation.traits || []).includes(trait))
      
      const matchesCategory = !selectedCategories || 
        card.category === selectedCategories

      const matchesSet = selectedSets.length === 0 || 
        (card.set && selectedSets.includes(card.set))

      return matchesSearch && matchesSpecies && matchesOtherTraits && matchesTraits && matchesCategory && matchesSet
    })
  }, [cards, lang, selectedSpecies, selectedOtherTraits, selectedTraits, selectedCategories, selectedSets, searchQuery])

  const clearFilters = () => {
    setSelectedTraits([])
    setSelectedSpecies([])
    setSelectedOtherTraits([])
    setSelectedCategories(null)
    setSelectedSets([])
    setSearchQuery('')
  }

  const toggleSet = (set: string) => {
    setSelectedSets(prev =>
      prev.includes(set) ? prev.filter(s => s !== set) : [...prev, set]
    )
  }

  const toggleSpecies = (speciesName: string) => {
    setSelectedSpecies(prev =>
      prev.includes(speciesName) ? prev.filter(s => s !== speciesName) : [...prev, speciesName]
    )
  }

  const toggleOtherTrait = (trait: string) => {
    setSelectedOtherTraits(prev =>
      prev.includes(trait) ? prev.filter(t => t !== trait) : [...prev, trait]
    )
  }

  const toggleTrait = (trait: string) => {
    setSelectedTraits(prev =>
      prev.includes(trait) ? prev.filter(t => t !== trait) : [...prev, trait]
    )
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev === category ? null : category
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md pt-4 pb-6 -mt-4 mb-2 flex flex-col gap-6 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Database Explorer</h2>
            <p className="text-zinc-500 text-xs">
              <span className="text-indigo-400 font-semibold">{filteredCards.length}</span> / {cards.length} cards
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-zinc-100 dark:bg-zinc-900/80 rounded-lg p-0.5 border border-zinc-200 dark:border-zinc-800">
              <button
                onClick={() => setColumns(1)}
                className={`p-1.5 rounded-md transition-all ${columns === 1 ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800'}`}
                title="1 per row"
              >
                <List className="size-3.5" />
              </button>
              <button
                onClick={() => setColumns(3)}
                className={`p-1.5 rounded-md transition-all ${columns === 3 ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800'}`}
                title="3 per row"
              >
                <LayoutGrid className="size-3.5" />
              </button>
            </div>

            {(selectedTraits.length > 0 || selectedSpecies.length > 0 || selectedOtherTraits.length > 0 || selectedCategories || selectedSets.length > 0 || searchQuery !== '') && (
              <button 
                onClick={clearFilters}
                className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900/80 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all border border-zinc-200 dark:border-zinc-800 cursor-pointer"
              >
                <X className="size-3" />
                Clear
              </button>
            )}

            <div className="w-48 sm:w-64 sm:[&_input]:!py-1 sm:[&_input]:!text-sm sm:[&_[data-slot=icon]]:!top-2 sm:[&_[data-slot=icon]]:!size-3.5">
              <InputGroup>
                <Search data-slot="icon" />
                <Input 
                  type="search" 
                  placeholder="Search..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search cards"
                  className="!bg-zinc-100/50 dark:!bg-zinc-900/50 backdrop-blur-sm"
                />
              </InputGroup>
            </div>
          </div>
        </div>

        <div className="bg-zinc-100 dark:bg-zinc-900/50 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm backdrop-blur-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative z-40">
          <div>
            <h3 className="text-lg font-bold mb-4 text-zinc-900 dark:text-white flex items-center gap-2">
              <Filter className="size-4 text-indigo-400" />
              Set
            </h3>
            <div className="flex flex-col gap-3">
              <Combobox
                options={allSets}
                multiple
                value={selectedSets}
                onChange={(val) => setSelectedSets(val as string[])}
                displayValue={(val) => (val as unknown as string) || ''}
                placeholder="Select sets..."
              >
                {(set) => (
                  <ComboboxOption key={set} value={set} className="!p-0 !grid-cols-1">
                    <Badge className="w-full text-left !shadow-none py-1.5 px-3 rounded-none flex items-center justify-between">
                      <span>{set}</span>
                      <span className="ml-2 rounded-full bg-black/10 dark:bg-white/10 px-1.5 py-0.5 text-[10px] font-sans font-bold leading-none text-zinc-500 dark:text-zinc-400">
                        {setCounts[set]}
                      </span>
                    </Badge>
                  </ComboboxOption>
                )}
              </Combobox>
              <div className="flex flex-wrap gap-2">
                {selectedSets.map(set => (
                  <BadgeButton key={set} onClick={() => toggleSet(set)}>
                    {set}
                    <X className="size-3 ml-1" />
                  </BadgeButton>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-zinc-900 dark:text-white flex items-center gap-2">
              <Filter className="size-4 text-indigo-400" />
              Category
            </h3>
            <div className="flex flex-col gap-3">
              <Combobox
                options={allCategories}
                value={selectedCategories}
                onChange={(val) => setSelectedCategories(val as string | null)}
                displayValue={(val) => (val as unknown as string) || ''}
                placeholder="Select category..."
              >
                {(category) => (
                  <ComboboxOption key={category} value={category} className="!p-0 !grid-cols-1">
                    <CategoryBadge className="w-full text-left !shadow-none" count={categoryCounts[category]}>
                      {category}
                    </CategoryBadge>
                  </ComboboxOption>
                )}
              </Combobox>
              <div className="flex flex-wrap gap-2">
                {selectedCategories && (
                  <CategoryBadge key={selectedCategories} onClick={() => toggleCategory(selectedCategories)} showX>
                    {selectedCategories}
                  </CategoryBadge>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-zinc-900 dark:text-white flex items-center gap-2">
              <Filter className="size-4 text-indigo-400" />
              Species
            </h3>
            <div className="flex flex-col gap-3">
              <Combobox
                options={allSpecies}
                multiple
                value={selectedSpecies}
                onChange={(val) => setSelectedSpecies(val as string[])}
                displayValue={(val) => (val as unknown as string) || ''}
                placeholder="Select species..."
              >
                {(speciesName) => (
                  <ComboboxOption key={speciesName} value={speciesName} className="!p-0 !grid-cols-1">
                    <TraitBadge className="w-full text-left !shadow-none" count={speciesCounts[speciesName]}>
                      {speciesName}
                    </TraitBadge>
                  </ComboboxOption>
                )}
              </Combobox>
              <div className="flex flex-wrap gap-2">
                {selectedSpecies.map(species => (
                  <TraitBadge key={species} onClick={() => toggleSpecies(species)} showX>
                    {species}
                  </TraitBadge>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-zinc-900 dark:text-white flex items-center gap-2">
              <Filter className="size-4 text-indigo-400" />
              Regular Traits
            </h3>
            <div className="flex flex-col gap-3">
              <Combobox
                options={allRegularTraits}
                multiple
                value={selectedTraits}
                onChange={(val) => setSelectedTraits(val as string[])}
                displayValue={(val) => (val as unknown as string) || ''}
                placeholder="Select regular traits..."
              >
                {(trait) => (
                  <ComboboxOption key={trait} value={trait} className="!p-0 !grid-cols-1">
                    <TraitBadge className="w-full text-left !shadow-none" count={traitCounts[trait]}>
                      {trait}
                    </TraitBadge>
                  </ComboboxOption>
                )}
              </Combobox>
              <div className="flex flex-wrap gap-2">
                {selectedTraits.map(trait => (
                  <TraitBadge key={trait} onClick={() => toggleTrait(trait)} showX>
                    {trait}
                  </TraitBadge>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-zinc-900 dark:text-white flex items-center gap-2">
              <Filter className="size-4 text-indigo-400" />
              Other Traits
            </h3>
            <div className="flex flex-col gap-3">
              <Combobox
                options={allOtherTraits}
                multiple
                value={selectedOtherTraits}
                onChange={(val) => setSelectedOtherTraits(val as string[])}
                displayValue={(val) => (val as unknown as string) || ''}
                placeholder="Select other traits..."
              >
                {(trait) => (
                  <ComboboxOption key={trait} value={trait} className="!p-0 !grid-cols-1">
                    <TraitBadge className="w-full text-left !shadow-none" count={otherCounts[trait]}>
                      {trait}
                    </TraitBadge>
                  </ComboboxOption>
                )}
              </Combobox>
              <div className="flex flex-wrap gap-2">
                {selectedOtherTraits.map(trait => (
                  <TraitBadge key={trait} onClick={() => toggleOtherTrait(trait)} showX>
                    {trait}
                  </TraitBadge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`grid ${columns === 1 ? 'grid-cols-1 gap-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
        {filteredCards.map((card) => (
          <CardItem
            key={card.id}
            card={card}
            lang={lang}
            columns={columns}
            toggleCategory={toggleCategory}
            toggleSpecies={toggleSpecies}
            toggleOtherTrait={toggleOtherTrait}
            toggleTrait={toggleTrait}
          />
        ))}
      </div>
    </div>
  )
}

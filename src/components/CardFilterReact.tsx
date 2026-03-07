import React, { useState, useMemo, useEffect } from 'react'
import { Filter, X, LayoutGrid, List, Search, SlidersHorizontal, ChevronDownIcon, Languages, Github } from 'lucide-react'
import { TraitBadge } from './TraitBadge'
import { CategoryBadge } from './CategoryBadge'
import { isSpecies } from './utils/species'
import { isOtherTrait } from './utils/otherTraits'
import { getCategoryLabel } from './utils/category'
import { getTraitLabel } from './utils/i18n'
import { Combobox, ComboboxOption } from './catalyst/combobox'
import { CardItem, type Card } from './CardItem'
import {Badge, BadgeButton} from './catalyst/badge'
import { Input, InputGroup } from './catalyst/input'
import { Dialog, DialogBody, DialogTitle, DialogActions } from './catalyst/dialog'
import { Button } from './catalyst/button'
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from './catalyst/dropdown'
import { useTranslations } from './utils/i18n'

interface Props {
  cards: Card[]
  lang: string
}

export default function CardFilterReact({ cards, lang }: Props) {
  const t = useTranslations(lang);
  const [selectedTraits, setSelectedTraits] = useState<string[]>([])
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([])
  const [selectedOtherTraits, setSelectedOtherTraits] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string | null>(null)
  const [selectedSets, setSelectedSets] = useState<string[]>(['Core Set'])
  const [columns, setColumns] = useState<1 | 3>(3)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      setColumns(3)
    } else {
      setColumns(1)
    }
  }, [])
  const [searchQuery, setSearchQuery] = useState('')
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)

  const { allSpecies, allOtherTraits, allRegularTraits, speciesCounts, otherCounts, traitCounts } = useMemo(() => {
    const speciesSet = new Set<string>()
    const otherSet = new Set<string>()
    const regularSet = new Set<string>()
    const sCounts: Record<string, number> = {}
    const oCounts: Record<string, number> = {}
    const tCounts: Record<string, number> = {}

    cards.forEach(card => {
      const traits = card.traits || []
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
      
      const traits = card.traits || []
      
      const matchesSearch = searchQuery === '' || 
        (translation.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        traits.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesSpecies = selectedSpecies.length === 0 || 
        selectedSpecies.some(f => traits.includes(f))

      const matchesOtherTraits = selectedOtherTraits.length === 0 || 
        selectedOtherTraits.some(trait => traits.includes(trait))

      const matchesTraits = selectedTraits.length === 0 || 
        selectedTraits.some(trait => traits.includes(trait))
      
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

  const FilterControls = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={mobile ? "flex flex-col gap-8" : "bg-zinc-100 dark:bg-zinc-900/50 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm backdrop-blur-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative z-40"}>
      <div>
        <h3 className="text-lg font-bold mb-4 text-zinc-900 dark:text-white flex items-center gap-2">
          <Filter className="size-4 text-indigo-400" />
          {t.sets}
        </h3>
        <div className="flex flex-col gap-3">
          <Combobox
            options={allSets}
            multiple
            value={selectedSets}
            onChange={(val) => setSelectedSets(val as string[])}
            displayValue={(val) => (val as unknown as string) || ''}
            placeholder={t.allSets}
          >
            {(set) => (
              <ComboboxOption key={set} value={set} className="p-0! grid-cols-1!">
                <Badge className="w-full text-left shadow-none! py-1.5 px-3 rounded-none flex items-center justify-between">
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
          {t.categories}
        </h3>
        <div className="flex flex-col gap-3">
          <Combobox
            options={allCategories}
            value={selectedCategories}
            onChange={(val) => setSelectedCategories(val as string | null)}
            displayValue={(val) => (val as unknown as string) || ''}
            placeholder={t.allCategories}
          >
            {(category) => (
              <ComboboxOption key={category} value={category} className="p-0! grid-cols-1!">
                <CategoryBadge 
                  category={category}
                  className="w-full text-left shadow-none!" 
                  count={categoryCounts[category]}
                >
                  {getCategoryLabel(category, lang)}
                </CategoryBadge>
              </ComboboxOption>
            )}
          </Combobox>
          <div className="flex flex-wrap gap-2">
            {selectedCategories && (
              <CategoryBadge 
                key={selectedCategories} 
                category={selectedCategories}
                onClick={() => toggleCategory(selectedCategories)} 
                showX
              >
                {getCategoryLabel(selectedCategories, lang)}
              </CategoryBadge>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4 text-zinc-900 dark:text-white flex items-center gap-2">
          <Filter className="size-4 text-indigo-400" />
          {t.species}
        </h3>
        <div className="flex flex-col gap-3">
          <Combobox
            options={allSpecies}
            multiple
            value={selectedSpecies}
            onChange={(val) => setSelectedSpecies(val as string[])}
            displayValue={(val) => getTraitLabel(val as unknown as string, lang) || ''}
            placeholder={t.allSpecies}
          >
            {(speciesName) => (
              <ComboboxOption key={speciesName} value={speciesName} className="p-0! grid-cols-1!">
                <TraitBadge trait={speciesName} className="w-full text-left shadow-none!" count={speciesCounts[speciesName]}>
                  {getTraitLabel(speciesName, lang)}
                </TraitBadge>
              </ComboboxOption>
            )}
          </Combobox>
          <div className="flex flex-wrap gap-2">
            {selectedSpecies.map(species => (
              <TraitBadge key={species} trait={species} onClick={() => toggleSpecies(species)} showX>
                {getTraitLabel(species, lang)}
              </TraitBadge>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4 text-zinc-900 dark:text-white flex items-center gap-2">
          <Filter className="size-4 text-indigo-400" />
          {t.traits}
        </h3>
        <div className="flex flex-col gap-3">
          <Combobox
            options={allRegularTraits}
            multiple
            value={selectedTraits}
            onChange={(val) => setSelectedTraits(val as string[])}
            displayValue={(val) => getTraitLabel(val as unknown as string, lang) || ''}
            placeholder={t.selectTraits}
          >
            {(trait) => (
              <ComboboxOption key={trait} value={trait} className="p-0! grid-cols-1!">
                <TraitBadge trait={trait} className="w-full text-left shadow-none!" count={traitCounts[trait]}>
                  {getTraitLabel(trait, lang)}
                </TraitBadge>
              </ComboboxOption>
            )}
          </Combobox>
          <div className="flex flex-wrap gap-2">
            {selectedTraits.map(trait => (
              <TraitBadge key={trait} trait={trait} onClick={() => toggleTrait(trait)} showX>
                {getTraitLabel(trait, lang)}
              </TraitBadge>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4 text-zinc-900 dark:text-white flex items-center gap-2">
          <Filter className="size-4 text-indigo-400" />
          {t.otherTraits}
        </h3>
        <div className="flex flex-col gap-3">
          <Combobox
            options={allOtherTraits}
            multiple
            value={selectedOtherTraits}
            onChange={(val) => setSelectedOtherTraits(val as string[])}
            displayValue={(val) => getTraitLabel(val as unknown as string, lang) || ''}
            placeholder={t.allOtherTraits}
          >
            {(trait) => (
              <ComboboxOption key={trait} value={trait} className="p-0! grid-cols-1!">
                <TraitBadge trait={trait} className="w-full text-left shadow-none!" count={otherCounts[trait]}>
                  {getTraitLabel(trait, lang)}
                </TraitBadge>
              </ComboboxOption>
            )}
          </Combobox>
          <div className="flex flex-wrap gap-2">
            {selectedOtherTraits.map(trait => (
              <TraitBadge key={trait} trait={trait} onClick={() => toggleOtherTrait(trait)} showX>
                {getTraitLabel(trait, lang)}
              </TraitBadge>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md pt-4 pb-4 sm:pb-6 -mt-4 mb-2 flex flex-col gap-4 sm:gap-6 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Dropdown>
              <DropdownButton as={Button} outline className="px-2! py-1! text-xs! h-7! flex items-center gap-1">
                <Languages className="size-3.5" />
                {lang.toUpperCase()}
                <ChevronDownIcon className="size-3" />
              </DropdownButton>
              <DropdownMenu className="z-99">
                <DropdownItem href="/captainschair/en/">
                  EN - English
                </DropdownItem>
                <DropdownItem href="/captainschair/de/">
                  DE - Deutsch
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Button
              href="https://github.com/dziermann/captainschair/issues/new"
              target="_blank"
              outline
              className="px-2! py-1! text-[10px]! h-7! flex items-center gap-1 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              <Github className="size-3" />
              <span className="hidden sm:inline">{t.reportIssue}</span>
            </Button>
            <p className="text-zinc-500 text-[10px] sm:text-xs">
              <span className="text-indigo-400 font-semibold">{filteredCards.length}</span> / {t.traitCounts(cards.length)}
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900/80 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all"
            >
              <SlidersHorizontal className="size-3.5" />
              {t.filter}
            </button>

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
                <span className="hidden sm:inline">{t.clearFilters}</span>
              </button>
            )}

            <div className="flex-1 min-w-30 sm:w-64 sm:[&_input]:py-1! sm:[&_input]:text-sm! sm:**:data-[slot=icon]:top-2! sm:**:data-[slot=icon]:size-3.5!">
              <InputGroup>
                <Search data-slot="icon" />
                <Input 
                  type="search" 
                  placeholder={t.search} 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label={t.search}
                  className="bg-zinc-100/50! dark:bg-zinc-900/50! backdrop-blur-sm"
                />
              </InputGroup>
            </div>
          </div>
        </div>

        <div className="hidden lg:block">
          <FilterControls />
        </div>
      </div>

      <Dialog open={isFilterDrawerOpen} onClose={setIsFilterDrawerOpen} size="xl">
        <DialogTitle>{t.filter}</DialogTitle>
        <DialogBody className="pb-8">
          <FilterControls mobile />
        </DialogBody>
        <DialogActions>
          <Button onClick={() => setIsFilterDrawerOpen(false)} color="indigo">
            Show Results
          </Button>
        </DialogActions>
      </Dialog>

      <div className={`grid ${columns === 1 ? 'grid-cols-1 gap-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
        {filteredCards.length === 0 ? (
           <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
             <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{t.noCardsFound}</h3>
             <p className="text-zinc-500 mt-2">{t.noCardsDescription}</p>
           </div>
        ) : filteredCards.map((card) => (
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

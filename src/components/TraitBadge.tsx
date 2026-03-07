import React from 'react'
import clsx from 'clsx'
import { X, Shield, Tag, Zap } from 'lucide-react'
import { isSpecies } from './utils/species'
import { isOtherTrait } from './utils/otherTraits'

interface TraitBadgeProps {
  children: string
  className?: string
  onClick?: () => void
  showX?: boolean
  count?: number
}

export function TraitBadge({ children, className, onClick, showX, count }: TraitBadgeProps) {
  const label = children
  const isSpeciesTrait = isSpecies(label)
  const isOther = isOtherTrait(label)
  const isWildcard = label.toLowerCase() === 'wildcard'
  const Icon = isSpeciesTrait ? Shield : isOther ? Zap : isWildcard ? Zap : Tag

  return (
    <button
      type="button"
      onClick={onClick}
      onPointerDown={(e) => onClick && e.preventDefault()}
      className={clsx(
        'inline-flex items-center rounded-full border border-black/10 px-3 py-1 text-[14px] font-bebas uppercase tracking-wide shadow-sm transition-all',
        onClick ? 'cursor-pointer active:scale-95' : 'cursor-default',
        isSpeciesTrait
          ? 'bg-[#F8991D] hover:bg-[#e68a12] text-white'
          : isWildcard
                ? 'bg-[#FABAAA] hover:bg-[#f0a090] text-black/80'
                : isOther
            ? 'bg-[#C53526] hover:bg-[#A52A1E] text-white'
            :  'bg-[#3499CC] hover:bg-[#2A7AA3] text-white',
        className
      )}
    >
      <Icon className={clsx('mr-1.5 size-3.5', isWildcard ? 'text-black/70' : 'text-white/90')} aria-hidden="true" />
      {label}
      {count !== undefined && (
        <span className="ml-2 rounded-full bg-black/20 px-1.5 py-0.5 text-[10px] font-sans font-bold leading-none text-white/90">
          {count}
        </span>
      )}
      {showX && <X className="ml-1.5 size-3 text-white/80" />}
    </button>
  )
}

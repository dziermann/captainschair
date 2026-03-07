import React from 'react'
import clsx from 'clsx'
import { X } from 'lucide-react'
import { getCategoryStyle } from './utils/category'

interface CategoryBadgeProps {
  children: string
  category?: string
  className?: string
  onClick?: () => void
  showX?: boolean
  count?: number
}

export function CategoryBadge({ children, category, className, onClick, showX, count }: CategoryBadgeProps) {
  const styles = getCategoryStyle(category || children)

  return (
    <button
      type="button"
      onClick={onClick}
      onPointerDown={(e) => onClick && e.preventDefault()}
      className={clsx(
        'relative inline-flex items-center rounded-r-full pl-3 pr-4 py-1.5 text-[14px] font-bebas uppercase tracking-wide text-white shadow-sm transition-all',
        styles.bg,
        styles.hoverBg,
        styles.darkBg,
        styles.darkHoverBg,
        onClick ? 'cursor-pointer active:scale-95' : 'cursor-default',
        className
      )}
    >
      <div className="absolute inset-y-0 left-0 w-0.5 bg-white/40" />
      {styles.icon && (
        <img
          src={styles.icon}
          alt=""
          className="mr-1.5 size-4 brightness-0 invert"
          aria-hidden="true"
        />
      )}
      {children}
      {count !== undefined && (
        <span className="ml-2 rounded-full bg-black/20 px-1.5 py-0.5 text-[10px] font-sans font-bold leading-none text-white/90">
          {count}
        </span>
      )}
      {showX && <X className="ml-2 size-4 text-white/80" />}
    </button>
  )
}

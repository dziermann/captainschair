import React from 'react'
import clsx from 'clsx'
import { getCategoryStyle } from './utils/category'

interface CardCategoryBadgeProps {
  children: string
  className?: string
  onClick?: () => void
}

export function CardCategoryBadge({ children, className, onClick }: CardCategoryBadgeProps) {
  const label = typeof children === 'string' ? children : String(children || '')
  const styles = getCategoryStyle(label)

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'inline-flex items-center rounded-full px-3 py-1 text-[13px] font-bebas uppercase tracking-wide text-white shadow-sm transition-all',
        styles.bg,
        styles.hoverBg,
        styles.darkBg,
        styles.darkHoverBg,
        onClick ? 'cursor-pointer active:scale-95' : 'cursor-default',
        className
      )}
    >
      {styles.icon && (
        <img
          src={styles.icon}
          alt=""
          className="mr-1.5 size-3.5 brightness-0 invert"
          aria-hidden="true"
        />
      )}
      {label}
    </button>
  )
}

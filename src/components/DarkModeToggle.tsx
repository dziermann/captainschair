'use client'

import { useState, useEffect } from 'react'
import { Switch, SwitchField } from './catalyst/switch'
import { Label } from './catalyst/fieldset'
import { SunIcon, MoonIcon } from '@heroicons/react/20/solid'

export function DarkModeToggle() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    // Check initial state
    const isDark = document.documentElement.classList.contains('dark')
    setEnabled(isDark)
  }, [])

  const toggleDarkMode = (checked: boolean) => {
    setEnabled(checked)
    if (checked) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <div className="flex items-center gap-3">
      <SunIcon className="size-4 text-zinc-500 dark:text-zinc-400" />
      <Switch
        checked={enabled}
        onChange={toggleDarkMode}
        aria-label="Toggle dark mode"
        color="dark/white"
      />
      <MoonIcon className="size-4 text-zinc-500 dark:text-zinc-400" />
    </div>
  )
}

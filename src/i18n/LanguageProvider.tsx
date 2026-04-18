import { useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import { LanguageContext } from './language-context'
import type { AppLanguage } from './types'

const STORAGE_KEY = 'eventise-language'

export function LanguageProvider({ children }: PropsWithChildren) {
  const [language, setLanguage] = useState<AppLanguage>(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored === 'en' ? 'en' : 'de'
  })

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language)
    document.documentElement.lang = language
  }, [language])

  const value = useMemo(
    () => ({
      language,
      setLanguage,
    }),
    [language],
  )

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  )
}

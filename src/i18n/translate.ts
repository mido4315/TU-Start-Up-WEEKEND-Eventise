import translations from './translations.json'
import type { AppLanguage } from './types'

interface TranslationTree {
  [key: string]: TranslationValue
}

type TranslationValue = string | string[] | TranslationTree
type TranslationParams = Record<string, string | number>

function resolvePath(language: AppLanguage, key: string): TranslationValue | undefined {
  const parts = key.split('.')
  let current: TranslationValue | undefined = translations[language]

  for (const part of parts) {
    if (!current || typeof current !== 'object' || Array.isArray(current)) {
      return undefined
    }

    current = current[part]
  }

  return current
}

function interpolate(value: string, params?: TranslationParams) {
  if (!params) {
    return value
  }

  return Object.entries(params).reduce(
    (result, [key, replacement]) =>
      result.replaceAll(`{{${key}}}`, String(replacement)),
    value,
  )
}

export function translate(
  language: AppLanguage,
  key: string,
  params?: TranslationParams,
) {
  const value = resolvePath(language, key) ?? resolvePath('de', key)

  if (typeof value !== 'string') {
    return key
  }

  return interpolate(value, params)
}

export function translateList(language: AppLanguage, key: string) {
  const value = resolvePath(language, key) ?? resolvePath('de', key)
  return Array.isArray(value) ? value : []
}

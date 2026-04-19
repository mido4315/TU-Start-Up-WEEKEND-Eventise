import { translate, translateList } from './translate'
import { useLanguage } from './useLanguage'

export function useTranslation() {
  const { language, setLanguage } = useLanguage()

  return {
    language,
    setLanguage,
    t: (key: string, params?: Record<string, string | number>) =>
      translate(language, key, params),
    tList: (key: string) => translateList(language, key),
  }
}

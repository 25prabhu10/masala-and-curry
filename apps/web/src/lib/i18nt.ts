import { i18n } from '@lingui/core'

export type SupportedLocale = 'en-US' | 'hi-IN'
export const SUPPORTED_LOCALES: SupportedLocale[] = ['en-US', 'hi-IN']

export function getDefaultLocale(): SupportedLocale {
  return 'en-US'
}

export async function loadTranslations(locale: SupportedLocale) {
  try {
    const { messages } = await import(`../locales/${locale}/messages.po`)
    i18n.loadAndActivate({ locale, messages })
  } catch {
    throw new Error(`Failed to load messages for locale: ${locale}`)
  }
}

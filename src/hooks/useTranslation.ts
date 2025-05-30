import { useMemo } from 'react'
import { useLanguageStore } from '../store/language'
import type { LocaleMessages } from '../types/locale'

export function useTranslation<T extends LocaleMessages>(localization: T) {
    const store = useLanguageStore()

    const messages = useMemo(() =>
        localization[store.currentLocale],
        [localization, store.currentLocale]
    )

    const t = (key: string, params?: Record<string, string | number>): string => {
        const keys = key.split('.')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let message: any = messages

        for (const part of keys) {
            if (message[part] === undefined) {
                return key
            }
            message = message[part]
        }

        if (typeof message === 'string' && params) {
            // Handle {{param}} syntax
            message = message.replace(/\{\{(\w+)\}\}/g, (_, match) => {
                return params[match] !== undefined ? String(params[match]) : `{{${match}}}`
            })

            // Handle {param} syntax  
            message = message.replace(/\{(\w+)\}/g, (_: unknown, match: string | number) => {
                return params[match] !== undefined ? String(params[match]) : `{${match}}`
            })
        }

        return typeof message === 'string' ? message : key
    }

    return { t, messages }
}
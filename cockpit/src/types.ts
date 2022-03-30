import type { ViteSSGContext } from 'vite-ssg'

export type UserModule = (ctx: ViteSSGContext) => void

export interface SetSettingsDto {
  apiKey?: string
  currencyCode?: string
}

import type { UseMemoizedFn } from '@vueuse/core'
import axios from 'axios'
import type { Ref } from 'vue'

import type { HttpClient, HttpMethods, HttpResponse } from '~/composables'
import type { SetSettingsDto } from '~/types'

const client = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
  },
})

let interceptorApplied = false

export async function useHttpInterceptor(client: HttpClient) {
  if (interceptorApplied) {
    return
  }
  const { t } = useI18n()
  const toast = useToast()
  client.interceptors.response.use(
    (res) => res,
    async (error) => {
      toast.error(t('toasts.backend-error'))
      return error
    }
  )
  interceptorApplied = true
}

export function useBackend(): HttpMethods {
  if (import.meta.env.VITE_SSG) {
    return {
      get: () => undefined as unknown as any,
      post: () => undefined as unknown as any,
      delete: () => undefined as unknown as any,
      put: () => undefined as unknown as any,
    }
  }

  useHttpInterceptor(client)

  // "delete" is a keyword
  const del = <T>(path: string) => client.delete<T, HttpResponse<T>>(path)

  const get = <T>(path: string) => client.get<T, HttpResponse<T>>(path)

  const post = <T, U>(path: string, body: T) =>
    client.post<T, HttpResponse<U>>(path, body)

  const put = <T, U>(path: string, body: T) =>
    client.put<T, HttpResponse<U>>(path, body)

  return { delete: del, get, post, put }
}

export interface UseApiKey {
  getKeyIsPresent: UseMemoizedFn<Promise<boolean>, []>
  keyIsPresent: Ref<boolean>
  storeApiKey: (apiKey?: string) => Promise<void>
}

let useApiKeySingleton: Omit<UseApiKey, 'keyIsPresent'>

export function useApiKey(): UseApiKey {
  if (useApiKeySingleton) {
    return {
      ...useApiKeySingleton,
      keyIsPresent: asyncComputed(
        () => useApiKeySingleton.getKeyIsPresent(),
        true
      ),
    }
  }

  const { get, post } = useBackend()
  const { t } = useI18n()
  const toast = useToast()

  const getKeyIsPresent = useMemoize(
    async (): Promise<boolean> =>
      (await get<boolean>('/user-settings/key-present')).data
  )

  async function storeApiKey(apiKey?: string) {
    if (!apiKey) {
      return
    }
    const res = await post<SetSettingsDto, boolean>('/user-settings', {
      apiKey,
    })
    if (res.status === 201) {
      toast.success(t('toasts.settings.api-key-saved'))
      await getKeyIsPresent.load()
    }
  }

  useApiKeySingleton = {
    getKeyIsPresent,
    storeApiKey,
  }

  return {
    ...useApiKeySingleton,
    keyIsPresent: asyncComputed(() => getKeyIsPresent(), true),
  }
}

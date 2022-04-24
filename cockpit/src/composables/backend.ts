import axios from 'axios'
import type { Ref } from 'vue'

import type {
  HttpClient,
  HttpMethods,
  HttpRequestConfig,
  HttpResponse,
} from '~/composables'

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
      if (!error?.config?.silent) {
        const message = t('toasts.backend-error')
        toast.error(message, { id: message })
      }
      return error
    }
  )
  interceptorApplied = true
}

export function useBackend(): HttpMethods & {
  isReady: Ref<boolean>
  getIsReady: () => Promise<boolean>
} {
  if (import.meta.env.VITE_SSG) {
    return {
      get: () => undefined as unknown as any,
      post: () => undefined as unknown as any,
      delete: () => undefined as unknown as any,
      put: () => undefined as unknown as any,
      isReady: computed(() => false),
      getIsReady: () => Promise.resolve(false),
    }
  }

  useHttpInterceptor(client)

  // "delete" is a keyword
  const del = <T>(path: string, config?: HttpRequestConfig) =>
    client.delete<T, HttpResponse<T>>(path, config)

  const get = <T>(path: string, config?: HttpRequestConfig) =>
    client.get<T, HttpResponse<T>>(path, config)

  const post = <T, U>(path: string, body: T, config?: HttpRequestConfig) =>
    client.post<T, HttpResponse<U>>(path, body, config)

  const put = <T, U>(path: string, body: T, config?: HttpRequestConfig) =>
    client.put<T, HttpResponse<U>>(path, body, config)

  const getIsReady = useMemoize(async () => {
    const services = (
      await get<{ up: boolean }[] | undefined>('/services', { silent: true })
    ).data
    return services?.every((service) => service.up) ?? false
  })
  const isReady = asyncComputed(async () => await getIsReady())

  return {
    delete: del,
    get,
    post,
    put,
    isReady,
    getIsReady: async () => await getIsReady.load(),
  }
}

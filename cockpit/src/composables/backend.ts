import axios from 'axios'

import type { HttpClient, HttpMethods, HttpResponse } from '~/composables'

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

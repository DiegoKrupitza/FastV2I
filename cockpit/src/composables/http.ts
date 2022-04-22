import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

export type HttpClient = AxiosInstance

export type HttpRequestConfig<T = any> = AxiosRequestConfig<T> & {
  silent?: boolean
}

export type HttpResponse<T> = AxiosResponse<T>

export interface HttpMethods {
  delete: <T>(
    path: string,
    config?: HttpRequestConfig
  ) => Promise<HttpResponse<T>>
  get: <T>(path: string, config?: HttpRequestConfig) => Promise<HttpResponse<T>>
  post: <T, U>(
    path: string,
    body: T,
    config?: HttpRequestConfig
  ) => Promise<HttpResponse<U>>
  put: <T, U>(
    path: string,
    body: T,
    config?: HttpRequestConfig
  ) => Promise<HttpResponse<U>>
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

export type HttpClient = AxiosInstance

export type HttpRequestConfig<T = any> = AxiosRequestConfig<T>

export type HttpResponse<T> = AxiosResponse<T>

export interface HttpMethods {
  delete: <T>(path: string) => Promise<HttpResponse<T>>
  get: <T>(path: string) => Promise<HttpResponse<T>>
  post: <T, U>(path: string, body: T) => Promise<HttpResponse<U>>
  put: <T, U>(path: string, body: T) => Promise<HttpResponse<U>>
}

import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import type { requestAPI } from "@dto/core";

export type HexaRequestConfig<T> =  AxiosRequestConfig<T>

export class Http {
  private baseURL: string;
  private host:AxiosInstance;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.host = axios.create({
      baseURL: baseURL,
    })
  }

  getBaseURL(): string {
    return this.baseURL;
  }
  
  getHost(): AxiosInstance {
    return this.host;
  }

  get = ({ url, config }: requestAPI) => {
    return this.host.get(url, config);
  }

  post = ({ url, data, config }: requestAPI) => {
    return this.host.post(url, data, config);
  }

  put = ({ url, data, config }: requestAPI) => {
    return this.host.put(url, data, config);
  }

  delete = ({ url, config }: requestAPI) => {
    return this.host.delete(url, config);
  }
}
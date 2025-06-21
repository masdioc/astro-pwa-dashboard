import type { HexaRequestConfig } from "@vendor/http";

export type requestAPI = {
  url: string;
  data?: {} | undefined;
  config?: HexaRequestConfig<any> | undefined;
};

interface Roles {
  peremajaan?: boolean;
  pemberhentian?: boolean;
  skk?: boolean;
  kp?: boolean;
  pindah_instansi?: boolean;
  pengadaan?: boolean;
}

export interface UserDto {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  nip?: string;
  email?: string;
  roles?: Roles;
}

export interface ResponApi<T> {
  code?: number;
  data?: T;
  count?: number;
}

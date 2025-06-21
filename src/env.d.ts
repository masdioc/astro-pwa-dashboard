/// <reference path="../.astro/types.d.ts" />
/// <reference types="vite/client" />
declare namespace NodeJS {
  export interface ProcessEnv {
    VITE_API_BASE_URL: string;
    SESSION_TOKEN: string;
    ENVRIONMENT: "development" | "production";
  }
}
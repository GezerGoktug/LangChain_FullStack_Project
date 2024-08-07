/// <reference types="vite/client" />

declare namespace NodeJS {
  interface ProcessEnv {
    VITE_BASE_URL: string;
  }
}

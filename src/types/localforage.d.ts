// localforage.d.ts

declare module 'localforage' {
  interface LocalForageDbMethodsCore {
    setItem<T>(key: string, value: T): Promise<T>;
    getItem<T>(key: string): Promise<T | null>;
  }

  const localforage: LocalForageDbMethodsCore;
  export default localforage;
}

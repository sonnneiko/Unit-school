import '@testing-library/jest-dom'

// Node 25 intercepts localStorage before jsdom can set it up when
// --localstorage-file is passed without a valid path, leaving an object
// without the standard Storage methods. Restore a fully-functional
// in-memory implementation so tests run correctly.
if (typeof localStorage === 'undefined' || typeof localStorage.clear !== 'function') {
  const store: Record<string, string> = {}
  const mockStorage: Storage = {
    get length() { return Object.keys(store).length },
    key(index: number) { return Object.keys(store)[index] ?? null },
    getItem(key: string) { return store[key] ?? null },
    setItem(key: string, value: string) { store[key] = String(value) },
    removeItem(key: string) { delete store[key] },
    clear() { for (const k in store) delete store[k] },
  }
  Object.defineProperty(globalThis, 'localStorage', { value: mockStorage, writable: true })
}

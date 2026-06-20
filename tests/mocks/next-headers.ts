export const mockCookieStore = {
  get: (_name: string) => undefined as any
}

export const cookies = () => mockCookieStore

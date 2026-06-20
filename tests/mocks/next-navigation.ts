export const mockNavigation = {
  redirect: (path: string) => {
    throw new Error(`Redirected to ${path}`)
  },
  useRouter: () => ({
    push: (_path: string) => {},
    replace: (_path: string) => {},
    prefetch: (_path: string) => {},
    back: () => {},
    forward: () => {},
  })
}

export const redirect = (path: string) => mockNavigation.redirect(path)
export const useRouter = () => mockNavigation.useRouter()

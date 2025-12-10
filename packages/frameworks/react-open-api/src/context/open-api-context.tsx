import {
  createContext,
  type HTMLAttributes,
  type ReactNode,
  useContext,
} from "react"

/**
 * Function used to render client-side navigation links.
 * Allows consumers to provide their own router link component
 * (e.g., Next.js Link, React Router Link, etc.)
 */
export type RenderLink = (
  props: HTMLAttributes<HTMLAnchorElement> & {href: string},
) => ReactNode

export interface OpenApiContextValue {
  /**
   * Base path for internal links.
   */
  basePath?: string

  /**
   * Callback fired when navigating to a section.
   */
  onNavigate?: (id: string) => void

  /**
   * Current pathname for navigation highlighting.
   */
  pathname?: string

  /**
   * SPA Link renderer for clientside routing.
   * If not provided, a default anchor tag will be used.
   */
  renderLink: RenderLink
}

const defaultRenderLink: RenderLink = (props) => <a {...props} />

const OpenApiContext = createContext<OpenApiContextValue>({
  renderLink: defaultRenderLink,
})

export interface OpenApiProviderProps extends Partial<OpenApiContextValue> {
  children: ReactNode
}

export function OpenApiProvider({
  basePath,
  children,
  onNavigate,
  pathname,
  renderLink = defaultRenderLink,
}: OpenApiProviderProps) {
  return (
    <OpenApiContext.Provider
      value={{basePath, onNavigate, pathname, renderLink}}
    >
      {children}
    </OpenApiContext.Provider>
  )
}

export function useOpenApiContext(): OpenApiContextValue {
  return useContext(OpenApiContext)
}

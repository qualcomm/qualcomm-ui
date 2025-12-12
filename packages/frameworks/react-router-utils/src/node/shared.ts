export type DefineRouteChildren = () => void

export interface DefineRouteOptions {
  caseSensitive?: boolean
  index?: boolean
}

export interface DefineRouteFunction {
  (
    /**
     * The path this route uses to match the URL pathname.
     */
    path: string | undefined,
    /**
     * The path to the file that exports the React component rendered by this
     * route as its default export, relative to the `app` directory.
     */
    file: string,
    /**
     * Options for defining routes, or a function for defining child routes.
     */
    optionsOrChildren?: DefineRouteOptions | DefineRouteChildren,
    /**
     * A function for defining child routes.
     */
    children?: DefineRouteChildren,
  ): void
}

export type DefineRoutesFunction = (
  callback: (route: DefineRouteFunction) => void,
) => any

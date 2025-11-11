export type Brand = "qualcomm" | "snapdragon" | "dragonwing"
export type Theme = "light" | "dark"

export interface QdsThemeProviderOptions {
  /**
   * The forced QDS Brand for the application. This setting, if supplied, overrides
   * the value from the cookie.
   *
   * @default 'qualcomm'
   */
  brandOverride?: Brand

  /**
   * A root node to apply the theme/brand attributes to. Used for CSS scoping.
   *
   * @default `document.documentElement`
   */
  rootElement?: HTMLElement | (() => HTMLElement)

  /**
   * If `true`, skip writing the theme and brand attributes to data attributes on
   * the {@link rootElement}. This will not prevent the value of the brand/theme
   * from being updated in storage. Useful if you want to scope a subsection of your
   * application to a specific brand/theme without changing the global attributes.
   *
   * @default false
   */
  skipAttributes?:
    | boolean
    | {
        brand?: boolean | undefined
        theme?: boolean | undefined
      }

  /**
   * The forced QDS theme for the application. This setting, if supplied, overrides
   * the value from the cookie.
   *
   * @default 'dark'
   */
  themeOverride?: Theme
}

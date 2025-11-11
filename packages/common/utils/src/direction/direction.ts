export type Direction = "ltr" | "rtl"

export interface DirectionProperty {
  /**
   * The document's text/writing direction.
   *
   * @default 'ltr'
   */
  dir?: Direction | undefined
}

export interface LocaleProperty {
  /**
   * The current locale. Based on the BCP 47 definition.
   *
   * @default 'en-US'
   */
  locale?: string | undefined
}

export interface Locale {
  /**
   * The document's text/writing direction.
   */
  dir: Direction

  /**
   * The current locale. Based on the BCP 47 definition.
   */
  locale: string
}

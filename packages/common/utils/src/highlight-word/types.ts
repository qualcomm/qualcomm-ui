export interface HighlightRegexOptions {
  /**
   * Whether to match whole words only
   */
  exactMatch?: boolean | undefined
  /**
   * Whether to ignore case while matching
   */
  ignoreCase?: boolean | undefined
  /**
   * Whether to match multiple instances of the query
   */
  matchAll?: boolean | undefined
}

export interface HighlightWordProps extends HighlightRegexOptions {
  /**
   * The query to highlight in the text
   */
  query: string | string[]
  /**
   * The text to highlight
   */
  text: string
}

export interface HighlightChunk {
  /**
   * Whether the text is a match
   */
  match: boolean
  /**
   * The text to highlight
   */
  text: string
}

export interface HighlightSpan {
  /**
   * The end index of the span
   */
  end: number
  /**
   * Whether the span is a match
   */
  match?: boolean | undefined
  /**
   * The start index of the span
   */
  start: number
}

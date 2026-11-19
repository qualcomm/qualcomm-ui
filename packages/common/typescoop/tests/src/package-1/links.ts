/**
 * Has a docs page.
 *
 * @docLink /components/linked#api
 */
export interface LinkedType {
  /**
   * A value.
   */
  a: string
}

/**
 * @public
 */
export interface LinkHost {
  /**
   * Linked reference.
   */
  linked: LinkedType

  /**
   * Linked reference kept by name.
   *
   * @inheritDoc
   */
  named: LinkedType

  /**
   * Old prop.
   *
   * @deprecated use linked
   */
  old?: string
}

export class CalendarA {
  a = ""
}

export class CalendarB {
  b = ""
}

type AnyCalendar = CalendarA | CalendarB

/**
 * @public
 */
export interface DateHost {
  /**
   * The lower bound.
   */
  min?: AnyCalendar

  /**
   * The selected values.
   */
  value?: (AnyCalendar | null)[]
}

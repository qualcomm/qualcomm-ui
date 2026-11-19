/**
 * @public
 */
export const ConstEnumExample = {
  /**
   * There are conflicting tasks in the tasks.json or launch.json that will need to
   * be overwritten to run our SDKs.
   */
  CONFLICTS: "conflicts",

  /**
   * The dependency will need to be added to support our SDK. This will be the
   * status if a .vscode JSON file is not present in the user's project folder.
   */
  FILE_MISSING: "file-missing",

  /**
   * Easy resolution: all custom commands or entries that we add are missing from
   * the dependency.
   */
  INCOMPLETE: "incomplete",

  /**
   * The dependency is already configured as expected.
   */
  VALID: "valid",
} as const

/**
 * @public
 */
export type ConstEnumExample =
  (typeof ConstEnumExample)[keyof typeof ConstEnumExample]

/**
 * @public
 */
export enum RegularEnum {
  ONE = "one",
  TWO = "two",
}

/**
 * @public
 */
export interface EnumInterface {
  /**
   * enum
   */
  constEnum: ConstEnumExample
}

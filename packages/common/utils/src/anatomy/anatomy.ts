// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {kebabCase} from "@qualcomm-ui/utils/change-case"

/**
 * Type-level camelCase → kebab-case. Assumes simple camelCase input
 * (lowercase-leading, capital letters separate words, no acronyms or digits).
 */
type KebabCase<
  S extends string,
  Acc extends string = "",
> = S extends `${infer Head}${infer Rest}`
  ? Head extends Lowercase<Head>
    ? KebabCase<Rest, `${Acc}${Head}`>
    : KebabCase<Rest, `${Acc}${Acc extends "" ? "" : "-"}${Lowercase<Head>}`>
  : Acc

/**
 * The data attribute emitted for a single component part.
 * Shape: `{[\`data-<kebab-name>-part\`]: <kebab-part>}`.
 *
 * `Name` and `Part` are expected to be camelCase identifiers (e.g. `"menu"`,
 * `"itemTrigger"`); they are kebab-cased at the value level so the attribute
 * reads `data-menu-part="item-trigger"`.
 *
 * Exported so that per-component `types.ts` files can bind the scope once and
 * extend it with just the part name — see the `Part<P>` helper convention in
 * each component's types file.
 */
export type AnatomyPart<Name extends string, Part extends string> = {
  [K in `data-${KebabCase<Name>}-part`]: KebabCase<Part>
}

export interface Anatomy<Name extends string, Part extends string> {
  keys: Part[]
  name: Name
  parts: {[P in Part]: AnatomyPart<Name, P>}
}

export type AnatomyPartName<A> =
  A extends Anatomy<string, infer Part> ? Part : never

interface AnatomyBuilder<Name extends string> {
  parts<Part extends string>(...parts: Part[]): Anatomy<Name, Part>
}

/**
 * Declares a component's anatomy. Supply `name` and `parts` as camelCase
 * identifiers; they are kebab-cased at runtime when the attribute is emitted
 * so that e.g. `parts.itemTrigger` renders as `data-menu-part="item-trigger"`.
 *
 * @example
 * const menuAnatomy = createAnatomy("menu").parts(
 *   "trigger",
 *   "itemTrigger",
 *   "content",
 * )
 * menuAnatomy.parts.itemTrigger // {"data-menu-part": "item-trigger"}
 */
export const createAnatomy = <Name extends string>(
  name: Name,
): AnatomyBuilder<Name> => ({
  parts<Part extends string>(...parts: Part[]): Anatomy<Name, Part> {
    const attrKey = `data-${kebabCase(name)}-part` as const
    const built = {} as {[P in Part]: AnatomyPart<Name, P>}
    for (const part of parts) {
      built[part] = {[attrKey]: kebabCase(part)} as AnatomyPart<Name, Part>
    }
    return {keys: [...parts], name, parts: built}
  },
})

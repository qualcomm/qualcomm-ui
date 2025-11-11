// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

type HtmlAttributes = {
  [key: string]: string | number
}
type LucideIconNode = readonly [string, HtmlAttributes]
type LucideIconData = readonly LucideIconNode[]

type SvgAttributes = {[key: string]: string | number}

export type LucideIconArrayData = readonly [string, SvgAttributes]

// https://github.com/lucide-icons/lucide/issues/1735
export type LucideIconCompat = readonly [
  string,
  SvgAttributes,
  LucideIconNode[]?,
]

export type LucideIconPart = LucideIconNode
export type LucideIcon = LucideIconData

/**
 * The imported LucideIcon or a string. The string form of the icon works with the
 * provider approach:
 *
 * @example
 * ```ts
 * import {IconDirective} from '@qualcomm-ui/angular/icon'
 * import {provideIcons} from '@qualcomm-ui/angular-core/lucide'
 * import {Search} from 'lucide-angular'
 * ```
 *
 * @Component({
 *   imports: [IconDirective],
 *   providers: [provideIcons({Search})],
 *   template: `
 *     <svg qIcon="Search"></svg>
 *   `
 * })
 * class ExampleComponent {}
 * ```
 */
export type LucideIconOrString = LucideIcon | string

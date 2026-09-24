// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {LucideIcon, LucideIconData} from "@lucide/angular"

/**
 * re-export for backwards compat
 */
export type {LucideIcon}

/**
 * The imported LucideIcon or a string. The string form of the icon works with the
 * provider approach:
 *
 * @example
 * ```ts
 * import {IconDirective} from '@qualcomm-ui/angular/icon'
 * import {provideIcons} from '@qualcomm-ui/angular-core/lucide'
 * import {LucideSearch} from '@lucide/angular'
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
export type LucideIconOrString = LucideIcon | LucideIconData | string

// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  computed,
  effect,
  ElementRef,
  inject,
  Renderer2,
  type Signal,
} from "@angular/core"
import {
  type LucideIcon,
  type LucideIconNode,
  type LucideIcons,
  LUCIDE_ICONS as LUCIDE_ICONS_FROM_LUCIDE,
  type LucideIconData,
  isLucideIconComponent,
  isLucideIconData,
} from "@lucide/angular"

import {useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {
  LUCIDE_ICONS,
  type LucideIconOrString,
  type LucideIconProviderValue,
} from "@qualcomm-ui/angular-core/lucide"
import {applyBindings, normalizeProps} from "@qualcomm-ui/angular-core/machine"
import {accessSignal, type MaybeSignal} from "@qualcomm-ui/angular-core/signals"
import {getQdsIconBindings, type QdsIconSize} from "@qualcomm-ui/qds-core/icon"
import {kebabCase, pascalCase} from "@qualcomm-ui/utils/change-case"
import type {Dict} from "@qualcomm-ui/utils/machine"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {ICON_CONTEXT_TOKEN} from "./icon.tokens"

export interface UseLucideIconOptions<
  ThrowOnUnresolvedStringIcon extends boolean | undefined = false,
> {
  elementRef?: ElementRef<HTMLElement>
  icon?: MaybeSignal<LucideIconOrString | undefined> | undefined
  iconProps?: {
    height?: MaybeSignal<string | number | undefined>
    size?: MaybeSignal<QdsIconSize | undefined>
    viewBox?: MaybeSignal<string | undefined>
    width?: MaybeSignal<string | number | undefined>
    xmlns?: MaybeSignal<string | undefined>
  }
  icons?: LucideIconProviderValue | null
  /**
   * If true, the QDS data-size attribute will not be applied to the icon. This is
   * useful if you want to use the icon in a context where the size binding is
   * already applied.
   */
  renderer2?: Renderer2
  /**
   * Throws an error if the provided icon is undefined or not found (when passed as
   * a string it is resolved against the nearest provider returned from the
   * provideIcons utility function).
   */
  throwOnUnresolvedStringIcon?: ThrowOnUnresolvedStringIcon
}

export interface UseLucideIconReturn<
  ThrowOnUnresolvedStringIcon extends boolean = false,
> {
  getIconBindings: Signal<Dict>
  icon: ThrowOnUnresolvedStringIcon extends true
    ? Signal<LucideIconData>
    : Signal<LucideIconData | undefined>
  icons: LucideIconProviderValue | null
  xmlns: string
}

export function useLucideIcon<
  ThrowOnUnresolvedStringIcon extends boolean | undefined = false,
>(
  options: UseLucideIconOptions<ThrowOnUnresolvedStringIcon> = {},
): UseLucideIconReturn {
  const elementRef: ElementRef<HTMLElement> =
    options.elementRef || inject(ElementRef)
  const renderer = options.renderer2 || inject(Renderer2)
  const onDestroy = useOnDestroy()
  let createdElements: HTMLElement[] = []
  const iconProps = options.iconProps || {}
  const injectedContext = inject(ICON_CONTEXT_TOKEN, {optional: true})

  const providedIcons =
    options.icons ||
    inject<LucideIconProviderValue | null>(LUCIDE_ICONS, {
      optional: true,
    })
  const providedIconsFromLucide = inject<LucideIcons>(
    LUCIDE_ICONS_FROM_LUCIDE,
    {optional: true},
  )

  const xmlns = accessSignal(iconProps.xmlns) || "http://www.w3.org/2000/svg"
  const resolvedIcon = computed(() => {
    return getIconData(accessSignal(options.icon))
  })

  function isSvgHostElement(): boolean {
    return elementRef.nativeElement.tagName === "svg"
  }

  const getIconBindings = computed(() => {
    const sizeProp = accessSignal(iconProps?.size)
    const injectionBindings = injectedContext?.getBindings?.()

    return mergeProps(
      injectionBindings,
      getQdsIconBindings(
        {
          height: accessSignal(iconProps?.height),
          // size prop, if supplied, always overrides context
          size: sizeProp || injectionBindings?.["data-size"],
          viewBox: accessSignal(iconProps?.viewBox),
          width: accessSignal(iconProps?.width),
          xmlns,
        },
        normalizeProps,
      ),
    )
  })

  function getSvgElement() {
    if (isSvgHostElement()) {
      return elementRef.nativeElement
    }
    return createIconPart(["svg", getIconBindings()], elementRef.nativeElement)
  }

  function createIconPart(
    [tag, attrs]: LucideIconNode,
    appendTarget: HTMLElement,
  ): HTMLElement {
    const element: HTMLElement = renderer.createElement(tag, xmlns)

    applyBindings(element, attrs, renderer)

    renderer.appendChild(appendTarget, element)
    createdElements.push(element)
    return element
  }

  function clearIconParts(): void {
    for (const element of createdElements) {
      if (element.parentNode) {
        renderer.removeChild(element.parentNode, element)
      }
    }
    createdElements = []
  }

  function getIconData(
    iconOrName: LucideIcon | LucideIconData | string | undefined,
  ): LucideIconData | undefined {
    if (typeof iconOrName !== "string") {
      if (isLucideIconComponent(iconOrName)) {
        return iconOrName.icon
      }
      return iconOrName
    }
    const icons = providedIcons || {}
    const iconsFromLucide = providedIconsFromLucide || {}
    const iconName = pascalCase(iconOrName)
    // Starting in @lucide/angular v1, Lucide icons are prefixed with Lucide. But we
    // still support the legacy name without the prefix for DX and backwards
    // compatibility.
    const lucidePrefixIconName = `Lucide${iconName}`
    const icon =
      icons[iconName] ||
      icons[`${iconName}Icon`] ||
      icons[iconOrName] ||
      icons[lucidePrefixIconName]

    if (icon) {
      if (isLucideIconComponent(icon)) {
        return icon.icon
      }
      if (isLucideIconData(icon)) {
        return icon
      }
    }

    const kebabIconName = kebabCase(iconOrName)

    const iconFromLucideProvider =
      iconsFromLucide[kebabIconName] || kebabIconName.startsWith("lucide-")
        ? iconsFromLucide[kebabIconName.replace("lucide-", "")]
        : undefined

    if (iconFromLucideProvider) {
      return iconFromLucideProvider
    }

    if (
      options.throwOnUnresolvedStringIcon &&
      !icon &&
      !iconFromLucideProvider
    ) {
      throw new Error(
        `Expected to find an icon named "${iconName}" but none was provided. Refer to the provider documentation at https://angular.qui.qualcomm.com/components/icon#provider`,
      )
    }
    return undefined
  }

  effect(() => {
    clearIconParts()
    const icon = resolvedIcon()
    if (!icon) {
      clearIconParts()
      return
    }
    const svgElement = getSvgElement()
    if (isSvgHostElement()) {
      applyBindings(svgElement, getIconBindings(), renderer)
    }
    if (icon) {
      for (const part of icon.node) {
        createIconPart(part, svgElement)
      }
    }
  })

  onDestroy(() => clearIconParts())

  return {
    getIconBindings,
    icon: resolvedIcon,
    icons: providedIcons,
    xmlns,
  }
}

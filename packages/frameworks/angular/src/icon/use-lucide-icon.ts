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

import {useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {
  LUCIDE_ICONS,
  type LucideIcon,
  type LucideIconOrString,
  type LucideIconPart,
  type LucideIconProviderValue,
} from "@qualcomm-ui/angular-core/lucide"
import {applyBindings, normalizeProps} from "@qualcomm-ui/angular-core/machine"
import {accessSignal, type MaybeSignal} from "@qualcomm-ui/angular-core/signals"
import {
  getQdsIconBindings,
  type QdsIconBindings,
  type QdsIconSize,
} from "@qualcomm-ui/qds-core/icon"
import {pascalCase} from "@qualcomm-ui/utils/change-case"
import type {Dict} from "@qualcomm-ui/utils/machine"

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
  getIconBindings: Signal<QdsIconBindings>
  icon: ThrowOnUnresolvedStringIcon extends true
    ? Signal<LucideIcon>
    : Signal<LucideIcon | undefined>
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

  const providedIcons =
    options.icons ||
    inject<LucideIconProviderValue | null>(LUCIDE_ICONS, {
      optional: true,
    })

  const xmlns = accessSignal(iconProps.xmlns) || "http://www.w3.org/2000/svg"
  const resolvedIcon = computed(() => {
    return getIcon(accessSignal(options.icon))
  })

  function isSvgHostElement(): boolean {
    return elementRef.nativeElement.tagName === "svg"
  }

  const getIconBindings = computed(() => {
    return getQdsIconBindings(
      {
        height: accessSignal(iconProps?.height),
        size: accessSignal(iconProps?.size),
        viewBox: accessSignal(iconProps?.viewBox),
        width: accessSignal(iconProps?.width),
        xmlns,
      },
      normalizeProps,
    )
  })

  function getSvgElement() {
    if (isSvgHostElement()) {
      return elementRef.nativeElement
    }
    return createIconPart(
      ["svg", getIconBindings() as Dict],
      elementRef.nativeElement,
    )
  }

  function createIconPart(
    [tag, attrs]: LucideIconPart,
    appendTarget: HTMLElement,
  ): HTMLElement {
    const element: HTMLElement = renderer.createElement(tag, xmlns)

    applyBindings(element, attrs, renderer)

    renderer.appendChild(appendTarget, element)
    createdElements.push(element)
    return element
  }

  function clearIconParts(): void {
    createdElements.forEach((element) => {
      if (element.parentNode) {
        renderer.removeChild(element.parentNode, element)
      }
    })
    createdElements = []
  }

  function getIcon(
    iconOrName: LucideIcon | string | undefined,
  ): LucideIcon | undefined {
    if (typeof iconOrName !== "string") {
      return iconOrName
    }
    const icons = providedIcons || {}
    const iconName = pascalCase(iconOrName)
    const icon =
      icons[iconName] || icons[`${iconName}Icon`] || icons[iconOrName]
    if (options.throwOnUnresolvedStringIcon && !icon) {
      throw new Error(
        `Expected to find an icon named "${iconName}" but none was provided. Refer to the provider documentation at https://angular-next.qui.qualcomm.com/components/icon#provider`,
      )
    }
    return icon
  }

  effect(() => {
    clearIconParts()
    const data = resolvedIcon()
    if (!data) {
      clearIconParts()
      return
    }
    const svgElement = getSvgElement()
    if (isSvgHostElement()) {
      applyBindings(svgElement, getIconBindings(), renderer)
    }
    if (data) {
      data.forEach((part) => {
        createIconPart(part, svgElement)
      })
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

// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  type OnDestroy,
  Renderer2,
  RendererStyleFlags2,
  runInInjectionContext,
} from "@angular/core"

import {isEqual} from "@qualcomm-ui/utils/equal"
import {isNumber, isString} from "@qualcomm-ui/utils/guard"

import type {Dict, StyleObject} from "./normalize-props"

export interface NgBindOptions {
  /**
   * This list of properties will not be spread onto the target element.
   */
  omittedProps?: string[]
}

/**
 * A directive similar to Vue's `v-bind` that spreads an object's properties onto
 * the host element. For the best performance, use a stable reference to a signal
 * instead of an object literal in the template. Converts callbacks from `on*`
 * syntax to their corresponding Angular event callbacks. Does not account for
 * input/output properties due to Angular limitations.
 *
 * @example
 * <!-- bad: new object every time -->
 * <div [q-bind]="{class: 'a', onClick: click}"></div>
 *
 * <!-- good: stable reference -->
 * <div [q-bind]="buttonProps"></div>
 */
@Directive({
  selector: "[q-bind]",
})
export class QBindDirective implements OnDestroy {
  readonly bind = input.required<Dict | undefined>({alias: "q-bind"})

  readonly bindOptions = input<NgBindOptions>({}, {alias: "q-bind-options"})

  private readonly elementRef = inject(ElementRef<HTMLElement>)
  private readonly renderer = inject(Renderer2)
  private readonly injector = inject(Injector)
  private readonly listeners = new Map<string, VoidFunction>()
  private prev: Dict = {}

  readonly omittedProps = computed(() => {
    const opts = this.bindOptions()
    return new Set(Array.from(opts.omittedProps || []))
  })

  constructor() {
    runInInjectionContext(this.injector, () => {
      effect(() => {
        const next = this.bind()
        if (!isEqual(next, this.prev)) {
          this.handleAttrs(this.prev, next || {})
          this.prev = {...next}
        }
      })
    })
  }

  ngOnDestroy(): void {
    this.listeners.forEach((unlisten) => unlisten())
    this.listeners.clear()
  }

  private removeClass(names?: string): void {
    if (!names) {
      return
    }

    const el = this.elementRef.nativeElement
    for (const name of names.split(",")) {
      this.renderer.removeClass(el, name)
    }
  }

  private addClass(names: string): void {
    const el = this.elementRef.nativeElement
    for (const className of names.split(" ")) {
      for (const name of className.split(",")) {
        this.renderer.addClass(el, name)
      }
    }
  }

  private removeStyle(style?: StyleObject): void {
    if (!style) {
      return
    }

    const el = this.elementRef.nativeElement
    for (const name of Object.keys(style)) {
      this.renderer.removeStyle(el, name, RendererStyleFlags2.DashCase)
    }
  }

  private addStyle(style: StyleObject): void {
    const el = this.elementRef.nativeElement
    for (const [name, value] of Object.entries(style)) {
      this.renderer.setStyle(el, name, value, RendererStyleFlags2.DashCase)
    }
  }

  private addEventListener(name: string, callback: EventListener): void {
    const eventName = name.substring(2)

    this.listeners.get(name)?.()
    const unlisten = this.renderer.listen(
      this.elementRef.nativeElement,
      eventName,
      callback,
    )
    this.listeners.set(name, unlisten)
  }

  private handleAttrs(prevProps: Dict, nextProps: Dict): void {
    const el = this.elementRef.nativeElement

    for (const [name, value] of Object.entries(prevProps)) {
      if (name in nextProps || this.omittedProps().has(name)) {
        continue
      }

      if (name.startsWith("on")) {
        this.listeners.get(name)?.()
        this.listeners.delete(name)
        continue
      }

      switch (name) {
        case "class":
          this.removeClass(value as string)
          continue
        case "style":
          this.removeStyle(value as StyleObject)
          continue
        case "value":
          this.renderer.setProperty(el, "value", undefined)
          continue
        case "textContent":
          this.renderer.setProperty(el, "textContent", "")
          continue
        case "checked":
          this.renderer.setProperty(el, "checked", false)
          continue
      }
      this.renderer.removeAttribute(el, name)
    }

    for (const [name, value] of Object.entries(nextProps)) {
      if (name in prevProps && isEqual(value, prevProps[name])) {
        continue
      }

      if (name.startsWith("on")) {
        const prevHandler = prevProps[name]
        if (isEqual(prevHandler, value)) {
          continue
        }

        this.addEventListener(name, value as EventListener)
        continue
      }

      switch (name) {
        case "class":
          this.removeClass(prevProps[name] as string)
          this.addClass(value as string)
          continue
        case "style":
          this.removeStyle(prevProps[name] as StyleObject)
          this.addStyle(value as StyleObject)
          continue
        case "value":
        case "checked":
        case "textContent":
          this.renderer.setProperty(el, name, value)
          continue
      }

      if (isString(value) || isNumber(value)) {
        this.renderer.setAttribute(el, name, `${value}`)
        continue
      }

      if (value === true) {
        this.renderer.setAttribute(el, name, "")
      } else {
        this.renderer.removeAttribute(el, name)
      }
    }
  }
}

// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {getWindow} from "./node"
import type {HTMLElementWithValue} from "./types"

interface DescriptorOptions {
  property?: "value" | "checked" | undefined
  type?:
    | "HTMLInputElement"
    | "HTMLTextAreaElement"
    | "HTMLSelectElement"
    | undefined
}

function getDescriptor(el: HTMLElement, options: DescriptorOptions) {
  const {property = "value", type = "HTMLInputElement"} = options
  const proto = getWindow(el)[type].prototype
  return Object.getOwnPropertyDescriptor(proto, property) ?? {}
}

function getElementType(
  el: HTMLElementWithValue,
):
  | "HTMLInputElement"
  | "HTMLTextAreaElement"
  | "HTMLSelectElement"
  | undefined {
  if (el.localName === "input") {
    return "HTMLInputElement"
  }
  if (el.localName === "textarea") {
    return "HTMLTextAreaElement"
  }
  if (el.localName === "select") {
    return "HTMLSelectElement"
  }
  return undefined
}

export function setElementValue(
  el: HTMLElementWithValue | null,
  value: string,
  property: "value" | "checked" = "value",
): void {
  if (!el) {
    return
  }
  const type = getElementType(el)
  if (type) {
    const descriptor = getDescriptor(el, {property, type})
    descriptor.set?.call(el, value)
  }
  el.setAttribute(property, value)
}

export function setElementChecked(
  el: HTMLInputElement | null,
  checked: boolean,
): void {
  if (!el) {
    return
  }
  const descriptor = getDescriptor(el, {
    property: "checked",
    type: "HTMLInputElement",
  })
  descriptor.set?.call(el, checked)
  // react applies the `checked` automatically when we call the descriptor
  // but for consistency with vanilla JS, we need to do it manually as well
  if (checked) {
    el.setAttribute("checked", "")
  } else {
    el.removeAttribute("checked")
  }
}

export interface InputValueEventOptions {
  bubbles?: boolean
  value: string | number
}

export function dispatchInputValueEvent(
  el: HTMLElementWithValue | null,
  options: InputValueEventOptions,
): void {
  const {bubbles = true, value} = options

  if (!el) {
    return
  }

  const win = getWindow(el)
  if (!(el instanceof win.HTMLInputElement)) {
    return
  }

  setElementValue(el, `${value}`)
  el.dispatchEvent(new win.Event("input", {bubbles}))
}

export interface CheckedEventOptions {
  bubbles?: boolean
  checked: boolean
}

export function dispatchInputCheckedEvent(
  el: HTMLInputElement | null,
  options: CheckedEventOptions,
): void {
  const {bubbles = true, checked} = options
  if (!el) {
    return
  }
  const win = getWindow(el)
  if (!(el instanceof win.HTMLInputElement)) {
    return
  }
  setElementChecked(el, checked)
  el.dispatchEvent(new win.Event("click", {bubbles}))
}

function getClosestForm(el: HTMLElement) {
  return isFormElement(el) ? el.form : el.closest("form")
}

function isFormElement(el: HTMLElement): el is HTMLElementWithValue {
  return el.matches("textarea, input, select, button")
}

function trackFormReset(
  el: HTMLElement | null | undefined,
  callback: VoidFunction,
) {
  if (!el) {
    return
  }
  const form = getClosestForm(el)
  const onReset = (e: Event) => {
    if (e.defaultPrevented) {
      return
    }
    callback()
  }
  form?.addEventListener("reset", onReset, {passive: true})
  return () => form?.removeEventListener("reset", onReset)
}

function trackFieldsetDisabled(
  el: HTMLElement | null | undefined,
  callback: (disabled: boolean) => void,
) {
  const fieldset = el?.closest("fieldset")
  if (!fieldset) {
    return
  }
  callback(fieldset.disabled)
  const win = getWindow(fieldset)
  const obs = new win.MutationObserver(() => callback(fieldset.disabled))
  obs.observe(fieldset, {
    attributeFilter: ["disabled"],
    attributes: true,
  })
  return () => obs.disconnect()
}

export interface TrackFormControlOptions {
  onFieldsetDisabledChange: (disabled: boolean) => void
  onFormReset: VoidFunction
}

export function trackFormControl(
  el: HTMLElement | null,
  options: TrackFormControlOptions,
): VoidFunction | undefined {
  if (!el) {
    return
  }
  const {onFieldsetDisabledChange, onFormReset} = options
  const cleanups = [
    trackFormReset(el, onFormReset),
    trackFieldsetDisabled(el, onFieldsetDisabledChange),
  ]
  return (): void => cleanups.forEach((cleanup) => cleanup?.())
}

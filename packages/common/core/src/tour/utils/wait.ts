// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {getDocument, getWindow} from "@qualcomm-ui/dom/query"

export interface TourWaitOptions {
  rootNode?: Document | ShadowRoot | undefined
  timeout: number
}

export type TourWaitReturn<T> = [Promise<T>, VoidFunction]

export function waitForPromise<T>(
  promise: Promise<T>,
  controller: AbortController,
  timeout: number,
): TourWaitReturn<T> {
  const wrappedPromise = new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Timeout of ${timeout}ms exceeded`))
    }, timeout)
    controller.signal.addEventListener("abort", () => {
      clearTimeout(timeoutId)
      reject(new DOMException("Promise aborted", "AbortError"))
    })
    void promise.then(
      (result) => {
        if (!controller.signal.aborted) {
          clearTimeout(timeoutId)
          resolve(result)
        }
      },
      (error: unknown) => {
        if (!controller.signal.aborted) {
          clearTimeout(timeoutId)
          reject(error)
        }
      },
    )
  })
  return [wrappedPromise, () => controller.abort()]
}

export function waitForElement(
  target: () => HTMLElement | null,
  options: TourWaitOptions,
): TourWaitReturn<HTMLElement> {
  const win = getWindow(options.rootNode)
  const doc = getDocument(options.rootNode)
  const controller = new win.AbortController()
  return waitForPromise(
    new Promise<HTMLElement>((resolve) => {
      const current = target()
      if (current) {
        resolve(current)
        return
      }
      const observer = new win.MutationObserver(() => {
        const element = target()
        if (element?.isConnected) {
          observer.disconnect()
          resolve(element)
        }
      })
      observer.observe(doc.body, {childList: true, subtree: true})
      controller.signal.addEventListener("abort", () => observer.disconnect())
    }),
    controller,
    options.timeout,
  )
}

type EditableElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

export function waitForElementValue(
  target: () => EditableElement | null,
  value: string,
  options: TourWaitOptions,
): TourWaitReturn<void> {
  const win = getWindow(options.rootNode)
  const controller = new win.AbortController()
  return waitForPromise(
    new Promise<void>((resolve) => {
      const element = target()
      if (!element) {
        return
      }
      const checkValue = () => {
        if (element.value === value) {
          element.removeEventListener("input", checkValue)
          resolve()
        }
      }
      checkValue()
      element.addEventListener("input", checkValue, {signal: controller.signal})
    }),
    controller,
    options.timeout,
  )
}

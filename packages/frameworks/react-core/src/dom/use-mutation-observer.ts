// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type RefObject, useEffect} from "react"

const defaultOptions: MutationObserverInit = {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true,
}

/**
 * Watch for changes being made to the DOM tree.
 *
 * @param ref - React ref
 * @param callback - callback to execute when mutations are observed
 * @param options - Options passed to mutation observer
 *
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver MutationObserver MDN}
 */
export function useMutationObserver<TElement extends HTMLElement>(
  ref: RefObject<TElement>,
  callback: MutationCallback,
  options: MutationObserverInit = defaultOptions,
) {
  // @ts-ignore
  useEffect(() => {
    if (ref.current) {
      const observer = new MutationObserver(callback)
      observer.observe(ref.current, options)

      return () => {
        observer.disconnect()
      }
    }
  }, [callback, options, ref])
}

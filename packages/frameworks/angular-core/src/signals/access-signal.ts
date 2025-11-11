// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {isSignal} from "@angular/core"

import type {MaybeSignal} from "./signals.types"

/**
 * Accesses the value of a signal if the provided input is a signal; otherwise,
 * returns the input directly.
 *
 * @param {T | Signal<T>} maybeSignal - The input which can either be a signal or a direct value of type T.
 * @return {T} The resolved value of the signal if the input is a signal, or the input value itself if it is not a signal.
 */
export function accessSignal<T>(maybeSignal: MaybeSignal<T>): T {
  if (!maybeSignal) {
    return maybeSignal as unknown as T
  }
  return isSignal(maybeSignal) ? maybeSignal() : maybeSignal
}

// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {isPlatformServer} from "@angular/common"
import {
  computed,
  inject,
  Injectable,
  type OnDestroy,
  PLATFORM_ID,
  type Signal,
  signal,
} from "@angular/core"
import {Check, Copy} from "lucide-angular"

import type {LucideIcon} from "@qualcomm-ui/angular-core/lucide"

import {NAVIGATOR} from "./tokens"

/**
 * A simple helper service for copying text to the user's clipboard. SSR-safe,
 * debounce support, and optional icon support.
 */
@Injectable()
export class ClipboardService implements OnDestroy {
  get copied() {
    return this._copied.asReadonly()
  }
  private readonly _copied = signal<boolean>(false)

  readonly icon: Signal<LucideIcon> = computed(() =>
    this.copied() ? Check : Copy,
  )

  private copyTimeout: ReturnType<typeof setTimeout>

  private navigator = inject(NAVIGATOR)
  private platformId = inject(PLATFORM_ID)

  ngOnDestroy() {
    clearTimeout(this.copyTimeout)
  }

  async copy(text: string, timeout = 1200) {
    // debounce
    if (this.copied() || isPlatformServer(this.platformId)) {
      return undefined
    }
    // show an indicator that the copy action succeeded
    this._copied.set(true)
    this.copyTimeout = setTimeout(() => {
      this._copied.set(false)
    }, timeout)

    return this.navigator.clipboard.writeText(text).then(() => text)
  }
}

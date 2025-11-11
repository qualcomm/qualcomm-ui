// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable, signal, untracked} from "@angular/core"

import {
  type DescendantOptions,
  DescendantsManager,
} from "@qualcomm-ui/utils/descendants"

@Injectable()
export class DescendantsManagerService<
  T extends HTMLElement,
  K extends Record<string, any> = object,
> extends DescendantsManager<T, K> {
  // simple signal for consumers to subscribe to changes.
  get subscribe() {
    return this._subscribe.asReadonly()
  }

  private readonly _subscribe = signal<number>(0)

  emit() {
    this._subscribe.update((prev) => prev + 1)
  }

  override register(nodeOrOptions: T | null | DescendantOptions<K>) {
    super.register(nodeOrOptions)
    untracked(() => this.emit())
  }

  override unregister(node: T) {
    super.unregister(node)
    untracked(() => this.emit())
  }
}

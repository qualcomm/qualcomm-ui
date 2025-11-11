// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

/**
 * Simple service that can persist IDs across from SSR to CSR.
 */
@Injectable({providedIn: "root"})
export class IdService {
  private ids: Record<string, number> = {}

  useId(
    componentName: string,
    idProp: string | undefined | null,
    idAttr: string | null,
  ) {
    // only use the supplied id if it does not also map to an attribute. This is a
    // workaround because we are using the `id` prop. If supplied as `[id]`, it
    // will work as expected. If supplied as `[attr.id]` or `id`, it will be treated
    // as an attribute. When this happens, we do not use the supplied id and instead
    // generate one. Otherwise, we'd get two ID's in the DOM (one on the host
    // element and one on the internal element that we bind the id to).
    const id = idProp || idAttr
    if (id) {
      return id
    }
    if (!this.ids[componentName]) {
      this.ids[componentName] = 1
    }
    return `${componentName}::auto-id::${this.ids[componentName]++}`
  }
}

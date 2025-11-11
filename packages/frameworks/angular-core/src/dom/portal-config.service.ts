// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

@Injectable({providedIn: "root"})
export class PortalConfigService {
  private _portalNodeId = "q-portal-root"

  get portalNodeId() {
    return this._portalNodeId
  }
}

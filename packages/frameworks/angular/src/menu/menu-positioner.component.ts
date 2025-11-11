// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component} from "@angular/core"

import {CoreMenuPositionerDirective} from "@qualcomm-ui/angular-core/menu"

@Component({
  selector: "[q-menu-positioner]",
  standalone: false,
  template: `
    @if (!presenceService.unmounted()) {
      <ng-content />
    }
  `,
})
export class MenuPositionerComponent extends CoreMenuPositionerDirective {}

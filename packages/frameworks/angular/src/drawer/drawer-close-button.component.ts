// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component} from "@angular/core"
import {X} from "lucide-angular"

import {DialogCloseButtonComponent} from "@qualcomm-ui/angular/dialog"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

/**
 * A button that closes the drawer.
 */
@Component({
  providers: [provideIcons({X})],
  selector: "[q-drawer-close-button]",
  standalone: false,
  template: `
    <svg qIcon="X" [q-bind]="buttonApi().getIconBindings()"></svg>
  `,
})
export class DrawerCloseButtonComponent extends DialogCloseButtonComponent {}

// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive} from "@angular/core"

import {
  CoreCollapsibleRootDirective,
  provideCollapsibleContext,
} from "@qualcomm-ui/angular-core/collapsible"

@Directive({
  providers: [provideCollapsibleContext()],
  selector: "[q-collapsible-root]",
  standalone: false,
})
export class CollapsibleRootComponent extends CoreCollapsibleRootDirective {}

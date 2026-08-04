// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"
import {X} from "lucide-angular"

import {CoreFileUploadClearTriggerDirective} from "@qualcomm-ui/angular-core/file-upload"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {useInputClearTrigger} from "@qualcomm-ui/angular/input"
import {QuiPreloadDirective} from "@qualcomm-ui/angular/transitions"

@Component({
  hostDirectives: [QuiPreloadDirective],
  providers: [provideIcons({X})],
  selector: "[q-file-input-clear-trigger]",
  standalone: false,
  template: `
    <svg qIcon="X" [q-bind]="clearTriggerContext.getIconBindings()"></svg>
  `,
})
export class FileInputClearTriggerDirective extends CoreFileUploadClearTriggerDirective {
  protected readonly clearTriggerContext = useInputClearTrigger()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.clearTriggerContext.getRootBindings()),
    )
  }
}

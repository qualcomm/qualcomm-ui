// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"
import {LucideAsterisk} from "@lucide/angular"

import {CoreFileUploadLabelDirective} from "@qualcomm-ui/angular-core/file-upload"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {useQdsInputContext} from "@qualcomm-ui/angular/input"

@Component({
  providers: [provideIcons({LucideAsterisk})],
  selector: "[q-file-input-label]",
  standalone: false,
  template: `
    <ng-content />
    @if (fileUploadContext().required) {
      <svg
        qIcon="LucideAsterisk"
        size="xs"
        [q-bind]="qdsInputContext().getRequiredIndicatorBindings()"
      ></svg>
    }
  `,
})
export class FileInputLabelDirective extends CoreFileUploadLabelDirective {
  protected readonly qdsInputContext = useQdsInputContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsInputContext().getLabelBindings()),
    )
  }
}

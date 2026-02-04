// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"
import {Asterisk} from "lucide-angular"

import {CoreFileUploadLabelDirective} from "@qualcomm-ui/angular-core/file-upload"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

import {useQdsFileUploadContext} from "./qds-file-upload-context.service"

@Component({
  providers: [provideIcons({Asterisk})],
  selector: "[q-file-upload-label]",
  standalone: false,
  template: `
    <ng-content />
    @if (fileUploadContext().required) {
      <svg
        qIcon="Asterisk"
        size="xs"
        [q-bind]="qdsFileUploadContext().getRequiredIndicatorBindings()"
      ></svg>
    }
  `,
})
export class FileUploadLabelDirective extends CoreFileUploadLabelDirective {
  protected readonly qdsFileUploadContext = useQdsFileUploadContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsFileUploadContext().getLabelBindings()),
    )
  }
}

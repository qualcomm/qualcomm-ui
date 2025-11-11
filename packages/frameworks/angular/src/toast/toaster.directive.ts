// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, contentChild, TemplateRef} from "@angular/core"

import {
  CoreToasterDirective,
  provideToastGroupContext,
} from "@qualcomm-ui/angular-core/toast"

@Component({
  providers: [provideToastGroupContext()],
  selector: "[q-toaster]",
  standalone: false,
  template: `
    @for (
      toast of toastGroupService.context().getToasts();
      track toast.id;
      let idx = $index
    ) {
      <ng-container
        #providerRef="toastProvider"
        toastProvider
        [index]="idx"
        [parent]="machine"
        [value]="toast"
      >
        <!-- Need injection context from the toast provider -->
        <ng-container
          [ngTemplateOutlet]="template() ?? defaultToast"
          [ngTemplateOutletContext]="{$implicit: toast}"
          [ngTemplateOutletInjector]="providerRef.injector"
        >
          <ng-content />
        </ng-container>
      </ng-container>
    }

    <ng-template #defaultToast let-toast q-toast-context>
      <div q-toast-root>
        <span q-toast-icon></span>
        @if (toast.label) {
          <div q-toast-label>
            {{ toast.label }}
          </div>
        }
        @if (toast.description) {
          <div q-toast-description>
            {{ toast.description }}
          </div>
        }
        @if (toast.action) {
          <button q-button q-toast-action size="sm" variant="outline">
            {{ toast.action.label }}
          </button>
        }
        @if (toast.closable) {
          <button q-toast-close-button></button>
        }
      </div>
    </ng-template>
  `,
})
export class ToasterDirective extends CoreToasterDirective {
  readonly template = contentChild(TemplateRef)
}

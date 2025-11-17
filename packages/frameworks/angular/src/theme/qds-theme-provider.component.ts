// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, inject, viewChild} from "@angular/core"

import {
  PORTAL_CONTAINER,
  PortalContextService,
} from "@qualcomm-ui/angular-core/portal"

import {QdsThemeService} from "./qds-theme.service"

@Component({
  host: {
    "[attr.data-brand]": "themeService.brand()",
    "[attr.data-theme]": "themeService.theme()",
    style: "display: contents;",
  },
  providers: [
    {
      provide: PORTAL_CONTAINER,
      useFactory: () => {
        const component = inject(QdsThemeProviderComponent)
        return component.portalContainer()
      },
    },
    PortalContextService,
  ],
  selector: "qds-theme-provider",
  template: `
    <ng-content />
    <div #portalContainer></div>
  `,
})
export class QdsThemeProviderComponent {
  protected readonly themeService = inject(QdsThemeService)

  readonly portalContainer =
    viewChild.required<HTMLDivElement>("portalContainer")
}

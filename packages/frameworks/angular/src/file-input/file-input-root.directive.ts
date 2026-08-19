// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, inject, input, type OnInit} from "@angular/core"
import type {LucideIcon} from "@lucide/angular"

import {
  CoreFileUploadRootDirective,
  FileUploadContextService,
  provideFileUploadContext,
} from "@qualcomm-ui/angular-core/file-upload"
import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {
  normalizeProps,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  provideQdsFileUploadContext,
  QdsFileUploadContextService,
} from "@qualcomm-ui/angular/file-upload"
import {
  provideQdsInputContext,
  type QdsAngularInputApiProps,
  QdsInputContextService,
} from "@qualcomm-ui/angular/input"
import {createQdsFileUploadApi} from "@qualcomm-ui/qds-core/file-upload"
import {createQdsInputApi, type QdsInputSize} from "@qualcomm-ui/qds-core/input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

@Directive({
  providers: [
    provideFileUploadContext(),
    provideQdsInputContext(),
    provideQdsFileUploadContext(),
  ],
  selector: "[q-file-input-root]",
  standalone: false,
})
export class FileInputRootDirective
  extends CoreFileUploadRootDirective
  implements SignalifyInput<QdsAngularInputApiProps>, OnInit
{
  /**
   * {@link https://lucide.dev lucide-angular} icon, positioned after
   * the input.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   *
   * ```angular-html
   * <div q-file-input-control>
   *   <div q-input-end-icon [icon]="..."></div>
   * </div>
   * ```
   */
  readonly endIcon = input<LucideIconOrString | undefined>()

  /**
   * The size of the input field and its elements. Governs properties like font
   * size, item padding, and icon sizes.
   *
   * @default 'md'
   */
  readonly size = input<QdsInputSize>()

  /**
   * {@link https://lucide.dev lucide-angular} icon, positioned before
   * the input.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   *
   * ```angular-html
   * <div q-file-input-control>
   *   <div q-input-start-icon [icon]="..."></div>
   * </div>
   * ```
   */
  readonly startIcon = input<LucideIcon | string | undefined>()

  protected readonly coreFileUploadContext = inject(FileUploadContextService)
  protected readonly qdsInputService = inject(QdsInputContextService)
  protected readonly qdsFileUploadService = inject(QdsFileUploadContextService)

  protected override readonly trackBindings = useTrackBindings(() =>
    mergeProps(
      this.coreFileUploadContext.context().getRootBindings({
        id: this.hostId(),
      }),
      this.qdsInputService.context().getRootBindings(),
    ),
  )

  override ngOnInit() {
    super.ngOnInit()

    this.qdsInputService.init(
      computed(() =>
        createQdsInputApi(
          {
            endIcon: this.endIcon(),
            size: this.size(),
            startIcon: this.startIcon(),
          },
          normalizeProps,
        ),
      ),
    )

    this.qdsFileUploadService.init(
      computed(() =>
        createQdsFileUploadApi(
          {
            size: this.size(),
          },
          normalizeProps,
        ),
      ),
    )

    this.trackBindings()
  }
}

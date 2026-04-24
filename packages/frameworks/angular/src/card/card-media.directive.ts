// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, input, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {QdsCardMediaPadding} from "@qualcomm-ui/qds-core/card"

import {useQdsCardContext} from "./qds-card-context.service"

@Directive({
  selector: "[q-card-media]",
  standalone: false,
})
export class CardMediaDirective implements OnInit {
  /**
   * The padding around the media content.
   *
   * @default 'sm'
   */
  readonly padding = input<QdsCardMediaPadding>()

  protected readonly qdsCardContext = useQdsCardContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.qdsCardContext().getMediaBindings({padding: this.padding()}),
  )

  ngOnInit() {
    this.trackBindings()
  }
}

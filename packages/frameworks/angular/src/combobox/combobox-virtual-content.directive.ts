// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  type OnInit,
  Renderer2,
  signal,
} from "@angular/core"

import {CoreComboboxContentDirective} from "@qualcomm-ui/angular-core/combobox"
import {useIsMounted} from "@qualcomm-ui/angular-core/common"
import {
  ANGULAR_VIRTUALIZER_INSTANCE_TOKEN,
  type AngularVirtualizerOptions,
  injectVirtualizer,
  type ScrollToOptions,
} from "@qualcomm-ui/angular-core/virtual"
import type {ComboboxScrollToIndexDetails} from "@qualcomm-ui/core/combobox"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsComboboxContext} from "./qds-combobox-context.service"

@Directive({
  host: {
    "[style.--scrollbar-width]": "scrollbarWidth()",
    "[style.height.px]": "virtualizer.getTotalSize()",
  },
  providers: [
    {
      provide: ANGULAR_VIRTUALIZER_INSTANCE_TOKEN,
      useFactory: () => {
        const directive = inject(ComboboxVirtualContentDirective)
        return directive.virtualizer
      },
    },
  ],
  selector: "[q-combobox-virtual-content]",
  standalone: false,
})
export class ComboboxVirtualContentDirective
  extends CoreComboboxContentDirective
  implements OnInit
{
  /**
   * {@link https://tanstack.com/virtual/v3/docs/api/virtualizer @tanstack/angular-virtual options},
   * forwarded to the virtualizer.
   *
   * @inheritDoc
   */
  readonly virtualOptions =
    input<Partial<AngularVirtualizerOptions<any, any>>>()

  protected readonly qdsComboboxContext = useQdsComboboxContext()

  protected readonly elementRef = inject<ElementRef<HTMLDivElement>>(ElementRef)

  protected readonly positionerRef = () =>
    this.elementRef.nativeElement?.parentElement

  readonly virtualizer = injectVirtualizer(() => ({
    count: this.comboboxContext().collection.items.length,
    estimateSize: () => (this.qdsComboboxContext().size === "sm" ? 32 : 40),
    getItemKey: (index) =>
      this.comboboxContext().collection.getItemValue(
        this.comboboxContext().collection.items.at(index),
      ) || "",
    overscan: 5,
    // account for 2px border
    paddingEnd: 2,
    scrollElement: this.positionerRef() || undefined,
    scrollPaddingEnd: 2,
    ...this.virtualOptions(),
  }))

  protected readonly isMounted = useIsMounted()
  protected timeout: ReturnType<typeof setTimeout> | undefined = undefined
  protected scrollFnInitialized = false
  protected readonly renderer = inject(Renderer2)

  readonly scrollbarWidth = signal("0px")

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() =>
        mergeProps(this.qdsComboboxContext().getContentBindings(), {
          "data-virtual": "",
        }),
      ),
    )
    effect(() => {
      const context = this.comboboxContext()
      if (this.scrollFnInitialized || !context) {
        return
      }
      this.scrollFnInitialized = true
      this.comboboxContext().setScrollToIndexFn(this.scrollToVirtualIndex)
    })
    effect(() => {
      // recompute on context change
      this.comboboxContext()
      requestAnimationFrame(() => {
        const positioner = this.positionerRef()
        if (!positioner) {
          this.scrollbarWidth.set(`0px`)
          return
        }
        this.scrollbarWidth.set(
          `${positioner.offsetWidth - positioner.clientWidth}px`,
        )
      })
    })
  }

  protected readonly scrollToVirtualIndex = (
    details: ComboboxScrollToIndexDetails,
  ) => {
    const scrollOptions: ScrollToOptions = {
      align: "auto",
      behavior: "auto",
    }
    if (!details) {
      return
    }
    if (details.immediate) {
      this.virtualizer.scrollToIndex(details.index, scrollOptions)
    } else {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        if (this.isMounted()) {
          this.virtualizer.scrollToIndex(details.index, scrollOptions)
        }
      })
    }
  }
}

import {Directive, ElementRef, inject, input, type OnInit} from "@angular/core"

import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {END_ICON_CONTEXT_TOKEN} from "./icon.tokens"
import {useLucideIcon} from "./use-lucide-icon"

/**
 * A utility component that renders a Lucide icon or template content. This is used
 * by components that need a leading icon. If this directive is attached to an svg
 * element, the qds icon bindings will be applied to the svg element. Otherwise, an
 * svg element will be created as a child of the element and the icon bindings will
 * be applied to it instead.
 */
@Directive({
  selector: "div[q-end-icon],span[q-end-icon],svg[q-end-icon]",
})
export class EndIconDirective implements OnInit {
  /**
   * Lucide Icon or string.
   */
  readonly icon = input<LucideIconOrString>()

  protected readonly context = inject(END_ICON_CONTEXT_TOKEN, {
    optional: true,
  })

  protected readonly elementRef = inject(ElementRef)

  protected readonly iconData = useLucideIcon({
    icon: this.icon,
  })

  protected readonly trackBindings = useTrackBindings(
    () => this.context?.getBindings?.() ?? {},
  )

  ngOnInit(): void {
    this.trackBindings()
  }
}

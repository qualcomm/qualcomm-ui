import {Directive, ElementRef, inject, input, type OnInit} from "@angular/core"

import {type LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {type QdsIconApiProps, type QdsIconSize} from "@qualcomm-ui/qds-core/icon"

import {useLucideIcon} from "./use-lucide-icon"

@Directive({
  host: {
    // even though the machine provides this, we still need it here for some reason.
    "[attr.xmlns]": "xmlns()",
  },
  selector: "svg[qIcon]",
})
export class IconDirective implements SignalifyInput<QdsIconApiProps>, OnInit {
  /**
   * Lucide Icon or string.
   */
  readonly icon = input.required<LucideIconOrString>({
    alias: "qIcon",
  })

  /**
   * @default 'md'
   */
  readonly size = input<QdsIconSize | undefined>()

  /**
   * HTML {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/viewBox viewbox} attribute
   *
   * @default '0 0 24 24'
   */
  readonly viewBox = input<string>()

  /**
   * HTML {@link https://www.w3schools.com/tags/att_html_xmlns.asp xmlns} attribute
   *
   * @default 'http://www.w3.org/2000/svg'
   */
  readonly xmlns = input<string>("http://www.w3.org/2000/svg")

  /**
   * Force the height of the icon. This typically isn't required. You should prefer
   * the {@link size} property for customization instead.
   */
  readonly height = input<string | number | undefined>()

  /**
   * Force the width of the icon. This typically isn't required. You should prefer
   * the {@link size} property for customization instead.
   */
  readonly width = input<string | number | undefined>()

  readonly elementRef = inject(ElementRef)

  protected readonly iconData = useLucideIcon({
    icon: this.icon,
    iconProps: {
      height: this.height,
      size: this.size,
      viewBox: this.viewBox,
      width: this.width,
      xmlns: this.xmlns,
    },
    throwOnUnresolvedStringIcon: true,
  })

  protected readonly trackBindings = useTrackBindings(() =>
    this.iconData.getIconBindings(),
  )

  ngOnInit(): void {
    this.trackBindings()
  }
}

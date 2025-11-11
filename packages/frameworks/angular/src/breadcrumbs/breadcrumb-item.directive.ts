import {booleanAttribute, Component, input, type OnInit} from "@angular/core"
import {ChevronRight} from "lucide-angular"

import {
  type LucideIconOrString,
  provideIcons,
} from "@qualcomm-ui/angular-core/lucide"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

import {useQdsBreadcrumbsContext} from "./qds-breadcrumbs-context.service"

@Component({
  providers: [provideIcons({ChevronRight})],
  selector: "[q-breadcrumb-item]",
  standalone: false,
  template: `
    <ng-content select="[q-breadcrumb-item-trigger]">
      <button q-breadcrumb-item-trigger>
        <ng-content />
      </button>
    </ng-content>

    <ng-content select="[q-breadcrumb-item-separator]">
      <svg q-breadcrumb-item-separator [qIcon]="separator()"></svg>
    </ng-content>
  `,
})
export class BreadcrumbItemDirective implements OnInit {
  /**
   * Controls the component's interactivity. If `true`, the component becomes
   * unresponsive to input and is visually dimmed to indicate its disabled state.
   */
  readonly disabled = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * The separator element to render between items.
   *
   * @default ChevronRight
   */
  readonly separator = input<LucideIconOrString>("ChevronRight")

  protected readonly qdsContext = useQdsBreadcrumbsContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.qdsContext().getItemBindings({disabled: this.disabled()}),
  )

  ngOnInit() {
    this.trackBindings()
  }
}

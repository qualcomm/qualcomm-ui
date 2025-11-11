import {Component, input} from "@angular/core"

import {CoreAccordionItemTriggerDirective} from "@qualcomm-ui/angular-core/accordion"
import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {accordionClasses} from "@qualcomm-ui/qds-core/accordion"

@Component({
  host: {
    "[class]": "accordionClasses.itemTrigger",
  },
  selector: "[q-accordion-item-trigger]",
  standalone: false,
  template: `
    <ng-content select="[q-accordion-item-icon]">
      @if (icon()) {
        <svg
          q-accordion-item-icon
          [class]="accordionClasses.icon"
          [qIcon]="icon()!"
        ></svg>
      }
    </ng-content>

    <ng-content />
  `,
})
export class AccordionItemTriggerComponent extends CoreAccordionItemTriggerDirective {
  /**
   * {@link https://lucide.dev/icons lucide-angular} icon, positioned before the trigger title.
   *
   * @remarks
   * You can use the directive for additional customization:
   * ```angular-html
   * <button q-accordion-item-trigger>
   *   <svg q-accordion-item-icon [qIcon]="..."></svg>
   * </button>
   * ```
   */
  readonly icon = input<LucideIconOrString>()

  protected readonly accordionClasses = accordionClasses
}

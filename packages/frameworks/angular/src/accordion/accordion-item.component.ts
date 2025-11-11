import {Component, input} from "@angular/core"

import {provideAccordionItemContext} from "@qualcomm-ui/angular-core/accordion"
import {provideCollapsibleContext} from "@qualcomm-ui/angular-core/collapsible"
import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"

import {AccordionItemRootComponent} from "./accordion-item-root.component"

/**
 * The simple form of the Accordion Item component. Use properties for
 * customization like the {@link text} and {@link icon}. The content of the panel is
 * provided via the default slot. Refer to the {@link https://angular-next.qui.qualcomm.com/components/accordion documentation} to learn more.
 *
 * @example
 * ```angular-html
 * <div q-accordion-item text="...">
 *   Panel contents...
 * </div>
 * ```
 */
@Component({
  host: {
    "[class]": "accordionClasses.item",
  },
  providers: [provideAccordionItemContext(), provideCollapsibleContext()],
  selector: "[q-accordion-item]",
  standalone: false,
  template: `
    <button q-accordion-item-trigger [icon]="icon()">
      <ng-content select="[q-accordion-item-text]">
        <div q-accordion-item-text>
          {{ text() }}
        </div>
      </ng-content>
      <ng-content select="[q-accordion-item-secondary-text]">
        @if (secondaryText()) {
          <div q-accordion-item-secondary-text>{{ secondaryText() }}</div>
        }
      </ng-content>
      <ng-content select="q-accordion-item-indicator">
        <q-accordion-item-indicator />
      </ng-content>
    </button>
    <ng-content select="[q-accordion-item-content]">
      <div q-accordion-item-content>
        <ng-content />
      </div>
    </ng-content>
  `,
})
export class AccordionItemComponent extends AccordionItemRootComponent {
  /**
   * Optional icon for the item.
   */
  readonly icon = input<LucideIconOrString>()

  /**
   * The secondary text label for the item.
   *
   * @remarks
   * This can also be provided using the directive:
   * ```angular-html
   * <div q-accordion-item>
   *   <div q-accordion-item-secondary-text>...</div>
   * </div>
   * ```
   */
  readonly secondaryText = input<string>()

  /**
   * The primary text label for the item.
   *
   * @remarks
   * This can also be provided using the directive:
   * ```angular-html
   * <div q-accordion-item>
   *   <div q-accordion-item-text>...</div>
   * </div>
   * ```
   */
  readonly text = input<string>()
}

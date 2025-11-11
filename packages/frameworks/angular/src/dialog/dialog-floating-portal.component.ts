import {
  booleanAttribute,
  Component,
  type ElementRef,
  input,
} from "@angular/core"

import type {Booleanish} from "@qualcomm-ui/utils/coercion"

/**
 * A helper component that combines the portal, positioner, and content
 * components.
 */
@Component({
  selector: "q-dialog-floating-portal",
  standalone: false,
  template: `
    <ng-template qPortal [container]="container()" [disabled]="disabled()">
      <div q-dialog-backdrop></div>
      <div q-dialog-positioner>
        <section q-dialog-content>
          <ng-content />
        </section>
      </div>
    </ng-template>
  `,
})
export class DialogFloatingPortalComponent {
  /**
   * Set this to true to disable portalling behavior, causing the children to be
   * rendered as-is.
   */
  readonly disabled = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Override the element that the portal is attached to.
   */
  readonly container = input<ElementRef<HTMLElement> | HTMLElement | null>(null)
}

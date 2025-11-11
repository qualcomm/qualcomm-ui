import {Component, computed, inject, input} from "@angular/core"

import {
  END_ICON_CONTEXT_TOKEN,
  type IconTokenContext,
  START_ICON_CONTEXT_TOKEN,
} from "@qualcomm-ui/angular/icon"
import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {CoreTabButtonDirective} from "@qualcomm-ui/angular-core/tabs"

import {useQdsTabsContext} from "./qds-tabs-context.service"

@Component({
  providers: [
    {
      provide: START_ICON_CONTEXT_TOKEN,
      useFactory: (): IconTokenContext => {
        const button = inject(TabButtonDirective)
        return {
          getBindings: computed(() =>
            button.qdsContext().getTabStartIconBindings(),
          ),
        }
      },
    },
    {
      provide: END_ICON_CONTEXT_TOKEN,
      useFactory: (): IconTokenContext => {
        const button = inject(TabButtonDirective)
        return {
          getBindings: computed(() =>
            button.qdsContext().getTabEndIconBindings(),
          ),
        }
      },
    },
  ],
  selector: "[q-tab-button]",
  standalone: false,
  template: `
    <ng-content select="[q-start-icon]">
      @if (startIcon()) {
        <svg
          [q-bind]="qdsContext().getTabStartIconBindings()"
          [qIcon]="startIcon()!"
        />
      }
    </ng-content>

    <ng-content />

    <ng-content select="[q-end-icon]">
      @if (endIcon()) {
        <svg
          [q-bind]="qdsContext().getTabEndIconBindings()"
          [qIcon]="endIcon()!"
        />
      }
    </ng-content>
  `,
})
export class TabButtonDirective extends CoreTabButtonDirective {
  /**
   * {@link https://lucide.dev/icons lucide-angular} icon, positioned after the label.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   * ```angular-html
   * <button q-tab-button>
   *   <svg q-end-icon icon="..."></svg>
   * </button>
   * ```
   */
  readonly endIcon = input<LucideIconOrString>()

  /**
   * {@link https://lucide.dev/icons lucide-angular} icon, positioned before the label.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   * ```angular-html
   * <button q-tab-button>
   *   <svg q-start-icon icon="..."></svg>
   * </button>
   * ```
   */
  readonly startIcon = input<LucideIconOrString>()

  protected readonly qdsContext = useQdsTabsContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getTabButtonBindings()),
    )
  }
}

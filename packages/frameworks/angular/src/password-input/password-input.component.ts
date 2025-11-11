import {
  booleanAttribute,
  Component,
  computed,
  inject,
  input,
} from "@angular/core"

import {provideQdsInputContext} from "@qualcomm-ui/angular/input"
import {INPUT_FORM_CONTROL_CONTEXT} from "@qualcomm-ui/angular-core/input"
import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {providePasswordInputContext} from "@qualcomm-ui/angular-core/password-input"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

import {PasswordInputRootDirective} from "./password-input-root.directive"

@Component({
  providers: [
    provideQdsInputContext(),
    providePasswordInputContext(),
    {
      provide: INPUT_FORM_CONTROL_CONTEXT,
      useFactory: () => {
        const passwordInputComponent = inject(PasswordInputComponent, {
          self: true,
        })
        return passwordInputComponent.formControlContext
      },
    },
  ],
  selector: "q-password-input",
  standalone: false,
  template: `
    <ng-content select="[q-password-input-label]">
      @if (label()) {
        <label q-password-input-label>{{ label() }}</label>
      }
    </ng-content>
    <div q-password-input-input-group>
      <input q-password-input-input [placeholder]="placeholder()" />

      <ng-content select="[q-password-input-clear-trigger]">
        @if (clearable()) {
          <button q-password-input-clear-trigger></button>
        }
      </ng-content>

      <ng-content select="[q-password-input-visibility-trigger]">
        <button q-password-input-visibility-trigger></button>
      </ng-content>

      <ng-content select="[q-password-input-error-indicator]">
        <span q-password-input-error-indicator></span>
      </ng-content>
    </div>
    <ng-content select="[q-password-input-hint]">
      @if (hint()) {
        <span q-password-input-hint>
          {{ hint() }}
        </span>
      }
    </ng-content>

    <ng-content select="[q-password-input-error-text]">
      @if (computedErrorText()) {
        <div q-password-input-error-text>
          {{ computedErrorText() }}
        </div>
      }
    </ng-content>
  `,
})
export class PasswordInputComponent extends PasswordInputRootDirective {
  /**
   * When `true`, renders a clear button that resets the input value on click.
   * The button only appears when the input has a value.
   *
   * @default true
   */
  readonly clearable = input<boolean | undefined, Booleanish>(true, {
    transform: booleanAttribute,
  })

  /**
   * Optional error that describes the element when {@link invalid} is true.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   *
   * ```angular-html
   * <div q-text-input-error-text>...</div>
   * ```
   */
  readonly errorText = input<string | undefined | null>()

  /**
   * Optional hint describing the element. This element is automatically
   * associated with the component's input element for accessibility.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   *
   * ```angular-html
   * <div q-text-input-hint>...</div>
   * ```
   */
  readonly hint = input<string | undefined | null>()

  /**
   * Optional label describing the element. Recommended. This element is
   * automatically associated with the component's input element for
   * accessibility.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   *
   * ```angular-html
   * <div q-text-input-label>...</div>
   * ```
   */
  readonly label = input<string | undefined>()

  /**
   * HTML {@link https://www.w3schools.com/tags/att_input_placeholder.asp placeholder} attribute,
   * passed to the internal input element.
   */
  readonly placeholder = input<string>("")

  /**
   * {@link https://lucide.dev lucide-angular} icon, positioned before
   * the input.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   *
   * ```angular-html
   * <q-password-input>
   *   <div q-input-start-icon [icon]="..."></div>
   * </q-password-input>
   * ```
   */
  override readonly startIcon = input<LucideIconOrString | undefined>()

  readonly computedErrorText = computed(() => {
    const errorTextInput = this.errorText()
    const errorTextFromControl = this.formControlContext.errorText()
    return errorTextInput ?? errorTextFromControl ?? null
  })
}

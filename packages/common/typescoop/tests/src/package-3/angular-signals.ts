import {
  booleanAttribute,
  Component,
  Directive,
  Input,
  input,
  model,
  output,
} from "@angular/core"

/**
 * @public
 */
@Component({selector: "test-signal-host", template: ""})
export class SignalHostComponent {
  /**
   * Input with a public alias.
   */
  readonly internalName = input<string>("", {alias: "publicName"})

  /**
   * Required input signal.
   */
  readonly requiredInput = input.required<number>()

  /**
   * Input with a transform.
   *
   * @default false
   */
  readonly disabled = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  })

  /**
   * Two-way binding.
   */
  readonly value = model<string>()

  /**
   * Required two-way binding.
   */
  readonly checked = model.required<boolean>()

  /**
   * Required decorator input.
   */
  @Input({required: true}) label!: string

  /**
   * Emits the value.
   */
  readonly valueChanged = output<string>()

  /**
   * Resets the value.
   *
   * @deprecated use something else.
   */
  reset(): void {}
}

/**
 * @public
 */
@Directive({selector: "[renderItem]"})
export class RenderItemDirective {
  /**
   * The item.
   */
  readonly renderItem = input.required<string>()

  /**
   * Extra item inputs.
   */
  readonly renderItemComponentInput = input<Record<string, any>>()
}

/**
 * @public
 */
export type ItemDirection = "ltr" | "rtl"

/**
 * @public
 */
export interface ItemApiProps {
  /**
   * The reading direction of the item.
   */
  dir?: ItemDirection

  /**
   * Whether the item is disabled.
   */
  disabled?: boolean
}

/**
 * @public
 */
@Directive({selector: "[testItem]"})
export class ItemDirective implements Pick<ItemApiProps, "dir" | "disabled"> {
  // @ts-expect-error
  readonly dir = input<ItemDirection | undefined>()

  // @ts-expect-error
  readonly disabled = input<boolean | undefined>()
}

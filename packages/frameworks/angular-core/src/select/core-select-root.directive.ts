// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {DOCUMENT} from "@angular/common"
import {
  booleanAttribute,
  computed,
  Directive,
  inject,
  input,
  type OnInit,
  output,
} from "@angular/core"

import {useId, useIsMounted} from "@qualcomm-ui/angular-core/common"
import {AbstractListCollectionFormControlDirective} from "@qualcomm-ui/angular-core/input"
import {
  normalizeProps,
  useMachine,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  createSelectApi,
  type HighlightChangeDetails,
  type ScrollToIndexDetails,
  type SelectApiProps,
  selectMachine,
} from "@qualcomm-ui/core/select"
import type {PositioningOptions} from "@qualcomm-ui/dom/floating-ui"
import type {
  FocusOutsideEvent,
  InteractOutsideEvent,
  PointerDownOutsideEvent,
} from "@qualcomm-ui/dom/interact-outside"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"
import type {CollectionItem} from "@qualcomm-ui/utils/collection"
import type {Direction} from "@qualcomm-ui/utils/direction"
import type {Explicit} from "@qualcomm-ui/utils/guard"

import {
  SelectContextService,
  type SelectValueChangeEvent,
} from "./select-context.service"

@Directive()
export class CoreSelectRootDirective<T extends CollectionItem = CollectionItem>
  extends AbstractListCollectionFormControlDirective<T>
  implements
    Omit<
      SignalifyInput<SelectApiProps>,
      "defaultValue" | "form" | "ids" | "value"
    >,
    OnInit
{
  /**
   * Whether the select should close after an item is selected
   *
   * @default true
   */
  readonly closeOnSelect = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * The initial value of the highlighted item when opened.
   * Use when you don't need to control the highlighted value of the select.
   */
  readonly defaultHighlightedValue = input<string | null | undefined>()

  /**
   * Whether the select's open state is controlled by the user
   */
  readonly defaultOpen = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Whether the value can be cleared by clicking the selected item.
   *
   * This is only applicable for single selection.
   */
  readonly deselectable = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * The document's text/writing direction.
   *
   * @default "ltr"
   */
  readonly dir = input<Direction | undefined>()

  /**
   * A root node to correctly resolve the Document in custom environments. i.e.,
   * Iframes, Electron.
   */
  readonly getRootNode = input<() => ShadowRoot | Document | Node>()

  /**
   * The controlled key of the highlighted item
   */
  readonly highlightedValue = input<string | null>()

  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be generated for accessibility.)
   */
  readonly id = input<string>()

  /**
   * Whether to loop the keyboard navigation through the options
   *
   * @default false
   */
  readonly loopFocus = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Whether to allow multiple selection
   *
   * @default false
   */
  readonly multiple = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Whether the select menu is open
   */
  readonly open = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Placeholder text to display when no value is selected.
   *
   * @default "Select option"
   */
  readonly placeholder = input<string | undefined>()

  /**
   * The positioning options of the menu.
   *
   * @inheritDoc
   */
  readonly positioning = input<PositioningOptions | undefined>()

  /**
   * Function to scroll to a specific index
   */
  readonly scrollToIndexFn = input<
    ((details: ScrollToIndexDetails) => void) | undefined
  >()

  /**
   * Function called when the focus is moved outside the component
   */
  readonly focusOutside = output<FocusOutsideEvent>()

  /**
   * The callback fired when the highlighted item changes.
   */
  readonly highlightChanged = output<
    {value: string | null} & HighlightChangeDetails<T>
  >()

  /**
   * Function called when an interaction happens outside the component
   */
  readonly interactOutside = output<InteractOutsideEvent>()

  /**
   * Function invoked when the popup opens or closes
   */
  readonly openChanged = output<boolean>()

  /**
   * Function called when the pointer is pressed down outside the component
   */
  readonly pointerDownOutside = output<PointerDownOutsideEvent>()

  /**
   * Function called when an item is selected
   */
  readonly selected = output<{value: string | undefined}>()

  /**
   * The callback fired when the selected item changes.
   */
  readonly valueChanged = output<SelectValueChangeEvent<T>>()

  protected readonly document = inject(DOCUMENT)
  protected readonly isMounted = useIsMounted()
  protected readonly hostId = computed(() => useId(this, this.id()))
  protected readonly selectContext = inject(SelectContextService)

  protected readonly trackBindings = useTrackBindings(() =>
    this.selectContext.context().getRootBindings({
      id: this.hostId(),
      onDestroy: this.onDestroy,
    }),
  )

  override ngOnInit() {
    super.ngOnInit()

    const initialDefaultValue = this.collection().getValues(this.defaultValue())
    const machine = useMachine(
      selectMachine,
      computed<Explicit<SelectApiProps>>(() => {
        return {
          closeOnSelect: this.closeOnSelect(),
          collection: this.collection(),
          defaultHighlightedValue: this.defaultHighlightedValue(),
          defaultOpen: this.defaultOpen(),
          defaultValue: initialDefaultValue,
          deselectable: this.deselectable(),
          dir: this.dir(),
          disabled: this.isDisabled(),
          // handled by Angular forms
          form: undefined,
          getRootNode: this.getRootNode() || (() => this.document),
          highlightedValue: this.highlightedValue(),
          id: this.id(),
          ids: undefined,
          invalid: this.isInvalid(),
          loopFocus: this.loopFocus(),
          multiple: this.multiple(),
          name: this.name(),
          onFocusOutside: (event) => {
            if (this.isMounted()) {
              this.focusOutside.emit(event)
              this.onTouched()
            }
          },
          onHighlightChange: (value, details) => {
            if (this.isMounted()) {
              this.highlightChanged.emit({value, ...details})
            }
          },
          onInteractOutside: (event) => {
            if (this.isMounted()) {
              this.interactOutside.emit(event)
            }
          },
          onOpenChange: (open) => {
            if (this.isMounted()) {
              this.openChanged.emit(open)
              // TODO: create dedicated blur event
              if (!open) {
                this.onTouched()
              }
            }
          },
          onPointerDownOutside: (event) => {
            if (this.isMounted()) {
              this.pointerDownOutside.emit(event)
            }
          },
          onSelect: (value) => {
            if (this.isMounted()) {
              this.selected.emit({value})
            }
          },
          onValueChange: (value, details) => {
            if (!this.control) {
              if (this.isMounted()) {
                this.valueChanged.emit({value, ...details})
              }
              this.value.set(details.items)
              return
            }
            // ngModel is bound to the root, but change events happen from internal
            // elements and are passed to the machine.  So we need to fire the
            // form's value change event to keep it in sync.
            this.onChange(details.items)
            // angular handles touched/dirty internally when ngModel is bound to an
            // <input> element, but we don't have that luxury here. We fire these
            // manually.
            if (!this.control?.touched) {
              this.control.markAsTouched?.()
            }
            if (!this.control?.dirty) {
              this.control.markAsDirty?.()
            }
          },
          open: this.open(),
          placeholder: this.placeholder(),
          positioning: this.positioning(),
          readOnly: this.readOnly(),
          required: this.isRequired(),
          scrollToIndexFn: this.scrollToIndexFn(),
          value: this.collection().getValues(this.value()),
        }
      }),
      this.injector,
    )

    this.selectContext.init(
      computed(() => createSelectApi(machine, normalizeProps)),
    )

    this.trackBindings()
  }
}

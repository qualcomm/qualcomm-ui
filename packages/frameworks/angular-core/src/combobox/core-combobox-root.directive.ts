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
  untracked,
} from "@angular/core"

import {useId, useIsMounted} from "@qualcomm-ui/angular-core/common"
import {AbstractListCollectionFormControlDirective} from "@qualcomm-ui/angular-core/input"
import {
  normalizeProps,
  useMachine,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import {PresenceContextService} from "@qualcomm-ui/angular-core/presence"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  type ComboboxApiProps,
  type ComboboxHighlightChangeDetails,
  type ComboboxInputValueChangeDetails,
  comboboxMachine,
  type ComboboxOpenChangeDetails,
  type ComboboxScrollToIndexDetails,
  createComboboxApi,
} from "@qualcomm-ui/core/combobox"
import {
  createPresenceApi,
  type PresenceApiProps,
  presenceMachine,
} from "@qualcomm-ui/core/presence"
import type {PositioningOptions} from "@qualcomm-ui/dom/floating-ui"
import type {
  FocusOutsideEvent,
  InteractOutsideEvent,
  PointerDownOutsideEvent,
} from "@qualcomm-ui/dom/interact-outside"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"
import type {CollectionItem} from "@qualcomm-ui/utils/collection"
import type {Direction} from "@qualcomm-ui/utils/direction"
import {type Explicit, isDefined} from "@qualcomm-ui/utils/guard"

import {
  ComboboxContextService,
  type ComboboxValueChangeEvent,
} from "./combobox-context.service"

@Directive()
export class CoreComboboxRootDirective<
    T extends CollectionItem = CollectionItem,
  >
  extends AbstractListCollectionFormControlDirective<T>
  implements
    Omit<
      SignalifyInput<ComboboxApiProps>,
      "defaultValue" | "form" | "ids" | "value"
    >,
    SignalifyInput<PresenceApiProps>,
    OnInit
{
  /**
   * Whether to allow custom values that are not in the collection
   *
   * @default false
   */
  readonly allowCustomValue = input<boolean | undefined, Booleanish>(
    undefined,
    {
      transform: booleanAttribute,
    },
  )

  /**
   * Whether to always submit on Enter key press, even if popup is open
   *
   * @default false
   */
  readonly alwaysSubmitOnEnter = input<boolean | undefined, Booleanish>(
    undefined,
    {
      transform: booleanAttribute,
    },
  )

  /**
   * Whether to autofocus the input on mount
   */
  readonly autoFocus = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Whether the combobox should close after an item is selected
   *
   * @default false
   */
  readonly closeOnSelect = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Whether the combobox is a composed with other composite widgets
   *
   * @default true
   */
  readonly composite = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * The initial value of the highlighted item when opened.
   * Use when you don't need to control the highlighted value of the combobox.
   */
  readonly defaultHighlightedValue = input<string | null | undefined>()

  /**
   * The initial value of the input when opened.
   */
  readonly defaultInputValue = input<string | undefined>()

  /**
   * Whether the combobox's open state is controlled by the user
   */
  readonly defaultOpen = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * The document's text/writing direction.
   *
   * @default "ltr"
   */
  readonly dir = input<Direction | undefined>()

  /**
   * Whether to disable registering this as a dismissable layer
   */
  readonly disableLayer = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

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
   * Defines the auto-completion behavior of the combobox
   *
   * @default "none"
   */
  readonly inputBehavior = input<
    "autohighlight" | "autocomplete" | "none" | undefined
  >()

  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be generated for accessibility.)
   */
  readonly id = input<string>()

  /**
   * Whether to synchronize the present change immediately or defer it to the next
   * frame.
   *
   * @default false
   */
  readonly immediate = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * The value of the input
   */
  readonly inputValue = input<string | undefined>()

  /**
   * When true, the component will not be rendered in the DOM until it becomes
   * visible or active.
   *
   * @default false
   */
  readonly lazyMount = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

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
   * Whether the combobox menu is open
   */
  readonly open = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Whether to show the combobox when the input value changes
   *
   * @default true
   */
  readonly openOnChange = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Whether to open the combobox popup on click
   *
   * @default true
   */
  readonly openOnClick = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Whether to open the combobox on arrow key press
   *
   * @default true
   */
  readonly openOnKeyPress = input<boolean | undefined, Booleanish>(undefined, {
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
   * The controlled presence of the node.
   */
  readonly present = input<boolean | undefined>(undefined)

  /**
   * Function to scroll to a specific index
   */
  readonly scrollToIndexFn = input<
    ((details: ComboboxScrollToIndexDetails) => void) | undefined
  >()

  /**
   * The behavior of the combobox input when an item is selected
   * - `replace`: The selected item string is set as the input value
   * - `clear`: The input value is cleared
   * - `preserve`: The input value is preserved
   *
   * @default "replace"
   */
  readonly selectionBehavior = input<
    "clear" | "replace" | "preserve" | undefined
  >()

  /**
   * Whether to allow the initial presence animation.
   *
   * @default false
   */
  readonly skipAnimationOnMount = input<boolean | undefined, Booleanish>(
    undefined,
    {transform: booleanAttribute},
  )

  /**
   * Specifies the localized strings
   */
  readonly translations = input<
    {clearTriggerLabel?: string; triggerLabel?: string} | undefined
  >()

  /**
   * When true, the component will be completely removed from the DOM when it
   * becomes inactive or hidden, rather than just being hidden with CSS.
   *
   * @default false
   */
  readonly unmountOnExit = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Function called when the animation ends in the closed state
   */
  exitCompleted = output<void>()

  /**
   * Function called when the focus is moved outside the component
   */
  readonly focusOutside = output<FocusOutsideEvent>()

  /**
   * The callback fired when the highlighted item changes.
   */
  readonly highlightChanged = output<
    {value: string | null} & ComboboxHighlightChangeDetails<T>
  >()

  /**
   * The callback fired when the input value changes
   */
  readonly inputValueChanged = output<ComboboxInputValueChangeDetails>()

  /**
   * Function called when an interaction happens outside the component
   */
  readonly interactOutside = output<InteractOutsideEvent>()

  /**
   * Function invoked when the popup opens or closes
   */
  readonly openChanged = output<ComboboxOpenChangeDetails>()

  /**
   * Function called when the pointer is pressed down outside the component
   */
  readonly pointerDownOutside = output<PointerDownOutsideEvent>()

  /**
   * The callback fired when the selected item changes.
   */
  readonly valueChanged = output<ComboboxValueChangeEvent<T>>()

  protected readonly document = inject(DOCUMENT)
  protected readonly isMounted = useIsMounted()
  protected readonly hostId = computed(() => useId(this, this.id()))
  protected readonly comboboxContext = inject(ComboboxContextService)
  protected readonly presenceService = inject(PresenceContextService)

  protected readonly trackBindings = useTrackBindings(() =>
    this.comboboxContext.context().getRootBindings({
      id: this.hostId(),
      onDestroy: this.onDestroy,
    }),
  )

  override ngOnInit() {
    super.ngOnInit()

    const initialDefaultValue = this.collection().getValues(this.defaultValue())
    const machine = useMachine(
      comboboxMachine,
      computed<Explicit<ComboboxApiProps>>(() => {
        return {
          allowCustomValue: this.allowCustomValue(),
          alwaysSubmitOnEnter: this.alwaysSubmitOnEnter(),
          autoFocus: this.autoFocus(),
          closeOnSelect: this.closeOnSelect(),
          collection: this.collection(),
          composite: this.composite(),
          defaultHighlightedValue: this.defaultHighlightedValue(),
          defaultInputValue: this.defaultInputValue(),
          defaultOpen: this.defaultOpen(),
          defaultValue: initialDefaultValue,
          dir: this.dir(),
          disabled: this.isDisabled(),
          disableLayer: this.disableLayer(),
          form: undefined,
          getRootNode: this.getRootNode() || (() => this.document),
          highlightedValue: this.highlightedValue(),
          id: this.id(),
          ids: undefined,
          inputBehavior: this.inputBehavior(),
          inputValue: this.inputValue(),
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
          onHighlightChange: (details) => {
            if (this.isMounted()) {
              this.highlightChanged.emit({
                value: details.highlightedValue,
                ...details,
              })
            }
          },
          onInputValueChange: (details) => {
            if (this.isMounted()) {
              this.inputValueChanged.emit(details)
            }
          },
          onInteractOutside: (event) => {
            if (this.isMounted()) {
              this.interactOutside.emit(event)
            }
          },
          onOpenChange: (details) => {
            if (this.isMounted()) {
              this.openChanged.emit(details)
              if (!details.open) {
                this.onTouched()
              }
            }
          },
          onPointerDownOutside: (event) => {
            if (this.isMounted()) {
              this.pointerDownOutside.emit(event)
            }
          },
          onSelect: undefined,
          onValueChange: (details) => {
            if (!this.control) {
              if (this.isMounted()) {
                this.valueChanged.emit({...details, value: details.value})
              }
              this.value.set(details.items)
              return
            }
            this.onChange(details.items)
            if (!this.control?.touched) {
              this.control.markAsTouched?.()
            }
            if (!this.control?.dirty) {
              this.control.markAsDirty?.()
            }
          },
          open: this.open(),
          openOnChange: this.openOnChange(),
          openOnClick: this.openOnClick(),
          openOnKeyPress: this.openOnKeyPress(),
          placeholder: this.placeholder(),
          positioning: this.positioning(),
          readOnly: this.readOnly(),
          required: this.isRequired(),
          scrollToIndexFn: this.scrollToIndexFn(),
          selectionBehavior: this.selectionBehavior(),
          translations: this.translations(),
          value: this.collection().getValues(this.value()),
        }
      }),
      this.injector,
    )

    const comboboxApi = computed(() =>
      createComboboxApi(machine, normalizeProps),
    )

    this.comboboxContext.init(comboboxApi)

    const presence = useMachine(
      presenceMachine,
      computed<Explicit<PresenceApiProps>>(() => {
        const present = this.present()
        const api = comboboxApi()
        const showing = isDefined(present) ? present : api.open
        untracked(() => {
          if (this.presenceService.initialized()) {
            this.presenceService.immediatePresent = showing
          }
        })
        return {
          immediate: this.immediate(),
          lazyMount: this.lazyMount(),
          onExitComplete: () => {
            if (this.isMounted()) {
              this.exitCompleted.emit()
            }
          },
          present: showing,
          skipAnimationOnMount: this.skipAnimationOnMount(),
          unmountOnExit: this.unmountOnExit(),
        }
      }),
      this.injector,
    )

    this.presenceService.init(
      computed(() => createPresenceApi(presence, normalizeProps)),
    )

    this.trackBindings()
  }
}

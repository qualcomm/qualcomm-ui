// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  booleanAttribute,
  computed,
  Directive,
  effect,
  inject,
  input,
  numberAttribute,
  type OnInit,
  output,
  untracked,
} from "@angular/core"

import {useIsMounted} from "@qualcomm-ui/angular-core/common"
import {AbstractBaseListCollectionFormControlDirective} from "@qualcomm-ui/angular-core/input"
import {
  normalizeProps,
  useMachine,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import {PresenceContextService} from "@qualcomm-ui/angular-core/presence"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  createDatePickerApi,
  type DatePickerApiProps,
  datePickerMachine,
  type DateValue,
  type DatePickerDateView,
  type DatePickerFocusChangeDetails,
  type DatePickerIntlTranslations,
  type DatePickerLocaleDetails,
  type DatePickerOpenChangeDetails,
  type DatePickerPositioningOptions,
  type DatePickerSelectionMode,
  type DatePickerValueChangeDetails,
  type DatePickerViewChangeDetails,
  type DatePickerViewOnSelect,
  type DatePickerVisibleRangeChangeDetails,
} from "@qualcomm-ui/core/date-picker"
import {
  createPresenceApi,
  type PresenceApiProps,
  presenceMachine,
} from "@qualcomm-ui/core/presence"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"
import type {Direction} from "@qualcomm-ui/utils/direction"
import {type Explicit, isDefined} from "@qualcomm-ui/utils/guard"

import {
  DatePickerContextService,
  DatePickerViewContextService,
} from "./date-picker-context.service"
import {completeRangeValidator} from "./date-picker.validators"

@Directive()
export class CoreDatePickerRootDirective
  extends AbstractBaseListCollectionFormControlDirective<DateValue | null>
  implements
    Omit<
      SignalifyInput<DatePickerApiProps>,
      "defaultValue" | "numOfMonths" | "value"
    >,
    SignalifyInput<PresenceApiProps>,
    OnInit
{
  /**
   * Whether the calendar should close after the date selection is complete.
   * This is ignored when the selection mode is `multiple`.
   *
   * @default true
   */
  readonly closeOnSelect = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * A function that creates a Calendar object for a given calendar identifier.
   * Enables non-Gregorian calendar support (Persian, Buddhist, Islamic, etc.)
   * without bundling all calendars by default.
   */
  readonly createCalendar = input<DatePickerApiProps["createCalendar"]>()

  /**
   * The initial focused date when rendered. Use when you don't need to control
   * the focused date of the date picker.
   */
  readonly defaultFocusedValue = input<DateValue | undefined>()

  /**
   * The initial open state of the date picker when rendered. Use when you don't
   * need to control the open state of the date picker.
   */
  readonly defaultOpen = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * The default view of the calendar.
   *
   * @default 'day'
   */
  readonly defaultView = input<DatePickerDateView | undefined>()

  /**
   * The document's text/writing direction.
   *
   * @default 'ltr'
   */
  readonly dir = input<Direction | undefined>()

  /**
   * Whether the calendar should have a fixed number of weeks. This renders the
   * calendar with 6 weeks instead of 5 or 6.
   */
  readonly fixedWeeks = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * The controlled focused date.
   */
  readonly focusedValue = input<DateValue | undefined>()

  /**
   * The format of the date to display in the input.
   */
  readonly format = input<
    ((date: DateValue, details: DatePickerLocaleDetails) => string) | undefined
  >()

  /**
   * Whether to synchronize the present change immediately or defer it to the
   * next frame.
   *
   * @default false
   */
  readonly immediate = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Whether to render the date picker inline.
   */
  readonly inline = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Returns whether a date of the calendar is available.
   */
  readonly isDateUnavailable = input<
    ((date: DateValue, locale: string) => boolean) | undefined
  >()

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
   * The locale (BCP 47 language tag) to use when formatting the date.
   *
   * @default 'en-US'
   */
  readonly locale = input<string | undefined>()

  /**
   * The maximum date that can be selected.
   */
  readonly max = input<DateValue | undefined>()

  /**
   * The maximum number of dates that can be selected. This is only applicable
   * when {@link selectionMode} is `multiple`.
   */
  readonly maxSelectedDates = input<number | undefined, unknown>(undefined, {
    transform: numberAttribute,
  })

  /**
   * The maximum view of the calendar.
   *
   * @default 'year'
   */
  readonly maxView = input<DatePickerDateView | undefined>()

  /**
   * The minimum date that can be selected.
   */
  readonly min = input<DateValue | undefined>()

  /**
   * The minimum view of the calendar.
   *
   * @default 'day'
   */
  readonly minView = input<DatePickerDateView | undefined>()

  /**
   * The controlled open state of the date picker.
   */
  readonly open = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Whether to open the calendar when the input is clicked.
   *
   * @default false
   */
  readonly openOnClick = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Whether days outside the visible range can be selected.
   *
   * @default false
   */
  readonly outsideDaySelectable = input<boolean | undefined, Booleanish>(
    undefined,
    {transform: booleanAttribute},
  )

  /**
   * Function to parse the date from the input back to a `DateValue`.
   */
  readonly parse = input<
    | ((
        value: string,
        details: DatePickerLocaleDetails,
      ) => DateValue | undefined)
    | undefined
  >()

  /**
   * The placeholder text to display in the input.
   */
  readonly placeholder = input<string | undefined>()

  /**
   * The user provided options used to position the date picker content.
   *
   * @inheritDoc
   */
  readonly positioning = input<DatePickerPositioningOptions | undefined>()

  /**
   * The controlled presence of the node.
   */
  readonly present = input<boolean | undefined>(undefined)

  /**
   * The selection mode of the calendar.
   * - `single` - only one date can be selected
   * - `multiple` - multiple dates can be selected
   * - `range` - a range of dates can be selected
   *
   * @default 'single'
   */
  readonly selectionMode = input<DatePickerSelectionMode | undefined>()

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
   * The first day of the week. `0` is Sunday, `6` is Saturday.
   */
  readonly startOfWeek = input<number | undefined, unknown>(undefined, {
    transform: numberAttribute,
  })

  /**
   * The time zone to use.
   *
   * @default 'UTC'
   */
  readonly timeZone = input<string | undefined>()

  /**
   * The localized messages to use.
   */
  readonly translations = input<DatePickerIntlTranslations | undefined>()

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
   * The controlled view of the calendar.
   */
  readonly view = input<DatePickerDateView | undefined>()

  /**
   * The view to show after a selection.
   * - `previous` - year to month to day
   * - `min` - the current view to the minimum view
   *
   * @default 'min'
   */
  readonly viewOnSelect = input<DatePickerViewOnSelect | undefined>()

  /**
   * Function called when the animation ends in the closed state.
   */
  readonly exitCompleted = output<void>()

  /**
   * Function called when the focused date changes.
   */
  readonly focusChanged = output<DatePickerFocusChangeDetails>()

  /**
   * Function called when the calendar opens or closes.
   */
  readonly openChanged = output<DatePickerOpenChangeDetails>()

  /**
   * Function called when the selected date(s) change.
   */
  readonly valueChanged = output<DatePickerValueChangeDetails>()

  /**
   * Function called when the view changes.
   */
  readonly viewChanged = output<DatePickerViewChangeDetails>()

  /**
   * Function called when the visible range changes.
   */
  readonly visibleRangeChanged = output<DatePickerVisibleRangeChangeDetails>()

  protected readonly isMounted = useIsMounted()
  protected readonly datePickerContext = inject(DatePickerContextService)
  protected readonly presenceService = inject(PresenceContextService)

  /**
   * Parts rendered outside a `View` still need a view to resolve against. The
   * `View` directive provides its own instance, which shadows this one.
   */
  protected readonly viewContext = inject(DatePickerViewContextService)

  protected readonly resolvedInline = computed(() => this.inline())

  protected readonly resolvedCloseOnSelect = computed(() =>
    this.closeOnSelect(),
  )

  protected readonly trackBindings = useTrackBindings(() =>
    this.datePickerContext.context().getRootBindings(),
  )

  constructor() {
    super()

    effect(() => {
      const control = this.control
      if (!control) {
        return
      }
      const needsValidator =
        this.selectionMode() === "range" && !!this.isRequired()
      const hasValidator = control.hasValidator(completeRangeValidator)
      if (needsValidator === hasValidator) {
        return
      }
      if (needsValidator) {
        control.addValidators(completeRangeValidator)
      } else {
        control.removeValidators(completeRangeValidator)
      }
    })

    this.onDestroy(() => {
      this.control?.removeValidators(completeRangeValidator)
    })
  }

  override ngOnInit() {
    super.ngOnInit()

    this.viewContext.init(computed(() => ({view: "day"})))

    const machine = useMachine(
      datePickerMachine,
      computed<Explicit<DatePickerApiProps>>(() => ({
        closeOnSelect: this.resolvedCloseOnSelect(),
        createCalendar: this.createCalendar(),
        defaultFocusedValue: this.defaultFocusedValue(),
        defaultOpen: this.defaultOpen(),
        defaultValue: this.defaultValue(),
        defaultView: this.defaultView(),
        dir: this.dir(),
        disabled: this.isDisabled(),
        fixedWeeks: this.fixedWeeks(),
        focusedValue: this.focusedValue(),
        format: this.format(),
        inline: this.resolvedInline(),
        invalid: this.isInvalid(),
        isDateUnavailable: this.isDateUnavailable(),
        locale: this.locale(),
        max: this.max(),
        maxSelectedDates: this.maxSelectedDates(),
        maxView: this.maxView(),
        min: this.min(),
        minView: this.minView(),
        name: this.name(),
        numOfMonths: undefined,
        onFocusChange: (details) => {
          if (this.isMounted()) {
            this.focusChanged.emit(details)
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
        onValueChange: (details) => {
          if (!this.control) {
            if (this.isMounted()) {
              this.valueChanged.emit(details)
            }
            this.value.set(details.value)
            return
          }
          this.onChange(details.value)
          if (!this.control?.touched) {
            this.control.markAsTouched?.()
          }
          if (!this.control?.dirty) {
            this.control.markAsDirty?.()
          }
        },
        onViewChange: (details) => {
          if (this.isMounted()) {
            this.viewChanged.emit(details)
          }
        },
        onVisibleRangeChange: (details) => {
          if (this.isMounted()) {
            this.visibleRangeChanged.emit(details)
          }
        },
        open: this.open(),
        openOnClick: this.openOnClick(),
        outsideDaySelectable: this.outsideDaySelectable(),
        parse: this.parse(),
        placeholder: this.placeholder(),
        positioning: this.positioning(),
        readOnly: this.readOnly(),
        required: this.isRequired(),
        selectionMode: this.selectionMode(),
        startOfWeek: this.startOfWeek(),
        timeZone: this.timeZone(),
        translations: this.translations(),
        value: this.control ? this.value() : undefined,
        view: this.view(),
        viewOnSelect: this.viewOnSelect(),
      })),
      this.injector,
    )

    const datePickerApi = computed(() =>
      createDatePickerApi(machine, normalizeProps),
    )

    this.datePickerContext.init(datePickerApi)

    const presence = useMachine(
      presenceMachine,
      computed<Explicit<PresenceApiProps>>(() => {
        const present = this.present()
        const api = datePickerApi()
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

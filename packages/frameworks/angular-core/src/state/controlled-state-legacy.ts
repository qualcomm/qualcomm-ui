// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  computed,
  type OutputEmitterRef,
  signal,
  type SimpleChange,
  untracked,
} from "@angular/core"

import {defined} from "@qualcomm-ui/utils/guard"

export class ControlledStateLegacy<
  T,
  OnChangeParams extends Record<string, any> | null = null,
> {
  get controlled() {
    return this._controlled.asReadonly()
  }
  protected readonly value = signal<T | undefined>(undefined)
  protected readonly controlledValue = signal<T | undefined>(undefined)
  private readonly _controlled = signal<boolean>(false)

  constructor(
    /**
     * The controlled value.
     */
    controlledValue: T | undefined,
    /**
     * The default value.
     */
    defaultValue: T | undefined,
    /**
     * onChange function fired when the state is modified internally. If the
     * controlled state is modified from outside of this service, this function will
     * not be called.
     */
    private onChange: OutputEmitterRef<any>,
    /**
     * The name of this instance. Used in error logging.
     */
    private name: string,
    /**
     * The name of the tracked property. Used in error logging.
     */
    private state: string,
  ) {
    this._controlled.set(defined(controlledValue))
    this.controlledValue.set(controlledValue)
    this.value.set(defaultValue)
  }

  set(value: T, options?: OnChangeParams) {
    if (!this._controlled()) {
      // if not controlled, we use the internal value.
      untracked(() => this.value.set(value))
    }
    this.onChange.emit({...options, index: value})
  }

  readonly get = computed(() => {
    const controlledValue = this.controlledValue()
    const value = this.value()
    return controlledValue ?? value
  })

  private emitWarning() {
    console.error(
      [
        `QUI: A component is changing the ${
          this.controlled() ? "" : "un"
        }controlled ${this.state} state of ${this.name} to be ${
          this.controlled() ? "un" : ""
        }controlled.`,
        "Elements should not switch from uncontrolled to controlled (or vice versa).",
        `Decide between using a controlled or uncontrolled ${this.name} ` +
          "element for the lifetime of the component.",
        "The nature of the state is determined during the first render. It's considered controlled if the value is not `undefined`.",
      ].join("\n"),
    )
  }

  handleOnChange(change?: SimpleChange) {
    if (!change) {
      return
    }
    if (
      !this.controlled() &&
      defined(change.currentValue) &&
      !change.isFirstChange()
    ) {
      this.emitWarning()
    }
    const value = change.currentValue
    this.controlledValue.set(value)
    this.value.set(value)
  }
}

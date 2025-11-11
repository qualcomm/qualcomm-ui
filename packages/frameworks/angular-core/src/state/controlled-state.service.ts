// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {SimpleChange} from "@angular/core"
import {Subject} from "rxjs"

import {defined} from "@qualcomm-ui/utils/guard"

export class ControlledStateService<T, OnChangeArg = Event> {
  readonly valueChanged = new Subject<T | undefined>()

  protected onChange?: (value: T, event?: OnChangeArg) => void
  protected value: T | undefined
  protected initialized = false
  protected name: string
  protected state: string
  protected controlledValue: T | undefined

  get controlled() {
    return this._controlled
  }
  protected _controlled: boolean = false

  init(
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
    onChange: (value: T, event?: OnChangeArg) => void,
    /**
     * The name of this instance. Used in error logging.
     */
    name: string,
    /**
     * The name of the tracked property. Used in error logging.
     */
    state: string,
  ) {
    if (this.initialized) {
      throw new Error("Cannot initialize controlled state more than once.")
    }
    this._controlled = defined(controlledValue)
    this.onChange = onChange
    this.controlledValue = controlledValue
    this.value = defaultValue
    this.name = name
    this.state = state
    this.initialized = true
  }

  set(value: T, event?: OnChangeArg) {
    if (!this._controlled) {
      this.value = value
      this.valueChanged.next(value)
    }
    this.onChange?.(value, event)
  }

  get() {
    return this.controlledValue ?? this.value
  }

  private emitWarning() {
    console.error(
      [
        `QUI: A component is changing the ${
          this.controlled ? "" : "un"
        }controlled ${this.state} state of ${this.name} to be ${
          this.controlled ? "un" : ""
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
      !this.controlled &&
      defined(change.currentValue) &&
      !change.isFirstChange()
    ) {
      this.emitWarning()
    }
    const value = change.currentValue
    this.controlledValue = value
    this.valueChanged.next(value)
  }
}

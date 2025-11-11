// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/*
 * Form + Signals interop.
 * https://www.angularspace.com/brewing-bootleg-reactive-forms-signals-from-rxjs/
 */
import type {Signal} from "@angular/core"
import {toSignal} from "@angular/core/rxjs-interop"
import {
  type AbstractControl,
  type ControlEvent,
  type FormControlStatus,
  PristineChangeEvent,
  StatusChangeEvent,
  TouchedChangeEvent,
  ValueChangeEvent,
} from "@angular/forms"
import {
  combineLatest,
  defer,
  distinctUntilChanged,
  filter,
  map,
  type Observable,
  startWith,
} from "rxjs"

function valueEvents$<T>(form: AbstractControl<T>) {
  return form.events.pipe(
    filter(
      (event: ControlEvent): event is ValueChangeEvent<typeof form.value> =>
        event instanceof ValueChangeEvent,
    ),
  )
}

function statusEvents$<T>(form: AbstractControl<T>) {
  return form.events.pipe(
    filter(
      (event: ControlEvent): event is StatusChangeEvent =>
        event instanceof StatusChangeEvent,
    ),
  )
}

function touchedEvents$<T>(form: AbstractControl<T>) {
  return form.events.pipe(
    filter(
      (event: ControlEvent): event is TouchedChangeEvent =>
        event instanceof TouchedChangeEvent,
    ),
  )
}

function pristineEvents$<T>(form: AbstractControl<T>) {
  return form.events.pipe(
    filter(
      (event: ControlEvent): event is PristineChangeEvent =>
        event instanceof PristineChangeEvent,
    ),
  )
}

function isValueEvent<T>(
  event: ControlEvent | T,
): event is ValueChangeEvent<T> {
  return event instanceof ValueChangeEvent
}
function isStatusEvent<T>(event: ControlEvent | T): event is StatusChangeEvent {
  return event instanceof StatusChangeEvent
}
function isPristineEvent<T>(
  event: ControlEvent | T,
): event is PristineChangeEvent {
  return event instanceof PristineChangeEvent
}
function isTouchedEvent<T>(
  event: ControlEvent | T,
): event is TouchedChangeEvent {
  return event instanceof TouchedChangeEvent
}

export type FormEventData<T> = {
  dirty: boolean
  invalid: boolean
  pending: boolean
  pristine: boolean
  status: FormControlStatus
  touched: boolean
  untouched: boolean
  valid: boolean
  value: T
}

export function allEventsObservable<T>(
  form: AbstractControl<T>,
): Observable<FormEventData<T>> {
  return defer(() =>
    combineLatest([
      valueEvents$(form).pipe(
        startWith(form.value),
        map((value) => (isValueEvent(value) ? value.value : value)),
        distinctUntilChanged(
          (previous, current) =>
            JSON.stringify(previous) === JSON.stringify(current),
        ),
      ),
      statusEvents$(form).pipe(startWith(form.status)),
      touchedEvents$(form).pipe(startWith(form.touched)),
      pristineEvents$(form).pipe(startWith(form.pristine)),
    ]).pipe(
      map(([valueParam, statusParam, touchedParam, pristineParam]) => {
        // Original values (plus value)
        const stat: FormControlStatus | StatusChangeEvent = isStatusEvent(
          statusParam,
        )
          ? statusParam.status
          : statusParam
        const touch: boolean | TouchedChangeEvent = isTouchedEvent(touchedParam)
          ? touchedParam.touched
          : touchedParam
        const prist: boolean | PristineChangeEvent = isPristineEvent(
          pristineParam,
        )
          ? pristineParam.pristine
          : pristineParam

        const validDerived = stat === "VALID"
        const invalidDerived = stat === "INVALID"
        const pendingDerived = stat === "PENDING"
        const dirtyDerived = !prist
        const untouchedDerived = !touch

        return {
          dirty: dirtyDerived,
          invalid: invalidDerived,
          pending: pendingDerived,
          pristine: prist,
          status: stat,
          touched: touch,
          untouched: untouchedDerived,
          valid: validDerived,
          value: valueParam,
        } satisfies FormEventData<T>
      }),
    ),
  ) as Observable<FormEventData<T>>
}

export function allEventsSignal<T>(
  form: AbstractControl<T>,
): Signal<FormEventData<T>> {
  return toSignal(allEventsObservable(form), {
    initialValue: {
      dirty: form.dirty,
      invalid: form.invalid,
      pending: form.pending,
      pristine: form.pristine,
      status: form.status,
      touched: form.touched,
      untouched: form.untouched,
      valid: form.valid,
      value: form.value,
    },
  })
}

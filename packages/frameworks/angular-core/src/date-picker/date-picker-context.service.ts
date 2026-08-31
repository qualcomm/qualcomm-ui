// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {
  DatePickerApi,
  DatePickerApiDayTableCellProps,
  DatePickerApiTableCellProps,
  DatePickerApiTableProps,
  DatePickerApiViewProps,
} from "@qualcomm-ui/core/date-picker"

@Injectable()
export class DatePickerContextService extends BaseApiContextService<DatePickerApi> {}

export const [
  DATE_PICKER_CONTEXT,
  useDatePickerContext,
  provideDatePickerContext,
]: ApiContext<DatePickerApi> = createApiContext<DatePickerApi>(
  "DatePickerContext",
  DatePickerContextService,
)

@Injectable()
export class DatePickerViewContextService extends BaseApiContextService<DatePickerApiViewProps> {}

export const [
  DATE_PICKER_VIEW_CONTEXT,
  useDatePickerViewContext,
  provideDatePickerViewContext,
]: ApiContext<DatePickerApiViewProps> =
  createApiContext<DatePickerApiViewProps>(
    "DatePickerViewContext",
    DatePickerViewContextService,
  )

@Injectable()
export class DatePickerTableContextService extends BaseApiContextService<DatePickerApiTableProps> {}

export const [
  DATE_PICKER_TABLE_CONTEXT,
  useDatePickerTableContext,
  provideDatePickerTableContext,
]: ApiContext<DatePickerApiTableProps> =
  createApiContext<DatePickerApiTableProps>(
    "DatePickerTableContext",
    DatePickerTableContextService,
  )

export type DatePickerTableCellContext =
  | DatePickerApiDayTableCellProps
  | DatePickerApiTableCellProps

@Injectable()
export class DatePickerTableCellContextService extends BaseApiContextService<DatePickerTableCellContext> {}

export const [
  DATE_PICKER_TABLE_CELL_CONTEXT,
  useDatePickerTableCellContext,
  provideDatePickerTableCellContext,
]: ApiContext<DatePickerTableCellContext> =
  createApiContext<DatePickerTableCellContext>(
    "DatePickerTableCellContext",
    DatePickerTableCellContextService,
  )

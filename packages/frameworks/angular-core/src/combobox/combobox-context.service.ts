// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {
  ComboboxApi,
  ComboboxValueChangeDetails,
} from "@qualcomm-ui/core/combobox"

export interface ComboboxValueChangeEvent<T>
  extends ComboboxValueChangeDetails<T> {
  value: string[]
}

@Injectable()
export class ComboboxContextService extends BaseApiContextService<ComboboxApi> {}

export const [
  COMBOBOX_CONTEXT,
  useComboboxContext,
  provideComboboxContext,
]: ApiContext<ComboboxApi> = createApiContext<ComboboxApi>(
  "ComboboxContext",
  ComboboxContextService,
)

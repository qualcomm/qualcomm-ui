// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, inject, type Signal} from "@angular/core"

import {
  createFilter,
  type FilterOptions,
  type FilterReturn,
} from "@qualcomm-ui/utils/i18n"

import {LocaleContextService} from "./locale-context.service"

export interface UseFilterProps extends FilterOptions {}
export interface UseFilterReturn extends FilterReturn {}

export function useFilter(props: UseFilterProps): Signal<UseFilterReturn> {
  const env = inject(LocaleContextService, {optional: true})
  return computed(() => {
    const localeContext = env?.context?.()
    return createFilter({
      ...props,
      locale: props.locale ?? localeContext?.locale ?? "en-US",
    })
  })
}

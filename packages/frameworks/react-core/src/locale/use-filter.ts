// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {useMemo} from "react"

import {
  createFilter,
  type FilterOptions,
  type FilterReturn,
} from "@qualcomm-ui/utils/i18n"

import {useLocaleContext} from "./locale-context"

export interface UseFilterProps extends FilterOptions {}

export interface UseFilterReturn extends FilterReturn {}

export function useFilter(props: UseFilterProps): UseFilterReturn {
  const env = useLocaleContext()
  const locale = props.locale ?? env.locale
  return useMemo(() => createFilter({...props, locale}), [locale, props])
}

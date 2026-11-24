// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  BaseApiContextService,
  createApiContext,
  normalizeProps,
} from "@qualcomm-ui/angular-core/machine"
import {
  createQdsFilterControlApi,
  type QdsFilterControlApi,
} from "@qualcomm-ui/qds-core/filter-control"

/**
 * Sizes and styles filter controls. The filter panel provides it from its own
 * size. Outside a panel, controls use the `sm` size unless a provider sets one.
 */
@Injectable()
export class QdsFilterControlContextService extends BaseApiContextService<QdsFilterControlApi> {}

const [
  QDS_FILTER_CONTROL_CONTEXT,
  useQdsFilterControlContextValue,
  provideQdsFilterControlContext,
] = createApiContext<QdsFilterControlApi>(
  "QdsFilterControlContext",
  QdsFilterControlContextService,
)

export {QDS_FILTER_CONTROL_CONTEXT, provideQdsFilterControlContext}

const defaultFilterControlApi = createQdsFilterControlApi(
  {size: "sm"},
  normalizeProps,
)

/**
 * Returns the surrounding filter control context, or the `sm` defaults when
 * there is none. Must be called in an injection context, such as a field
 * initializer.
 */
export function useQdsFilterControlContext(): () => QdsFilterControlApi {
  return (
    useQdsFilterControlContextValue({optional: true}) ??
    (() => defaultFilterControlApi)
  )
}

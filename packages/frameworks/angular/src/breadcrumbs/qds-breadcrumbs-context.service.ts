// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {QdsBreadcrumbsApi} from "@qualcomm-ui/qds-core/breadcrumbs"

@Injectable()
export class QdsBreadcrumbsContextService extends BaseApiContextService<QdsBreadcrumbsApi> {}

export const [
  QDS_BREADCRUMBS_CONTEXT,
  useQdsBreadcrumbsContext,
  provideQdsBreadcrumbsContext,
]: ApiContext<QdsBreadcrumbsApi> = createApiContext<QdsBreadcrumbsApi>(
  "QdsBreadcrumbsContext",
  QdsBreadcrumbsContextService,
)

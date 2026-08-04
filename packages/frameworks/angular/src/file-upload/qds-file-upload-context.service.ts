// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {QdsFileUploadApi} from "@qualcomm-ui/qds-core/file-upload"

@Injectable()
export class QdsFileUploadContextService extends BaseApiContextService<QdsFileUploadApi> {}

export const [
  QDS_FILE_UPLOAD_CONTEXT,
  useQdsFileUploadContext,
  provideQdsFileUploadContext,
]: ApiContext<QdsFileUploadApi> = createApiContext<QdsFileUploadApi>(
  "QdsFileUploadContext",
  QdsFileUploadContextService,
)

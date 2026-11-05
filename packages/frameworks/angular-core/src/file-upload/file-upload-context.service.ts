// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {FileUploadApi} from "@qualcomm-ui/core/file-upload"

@Injectable()
export class FileUploadContextService extends BaseApiContextService<FileUploadApi> {}

export const [
  FILE_UPLOAD_CONTEXT,
  useFileUploadContext,
  provideFileUploadContext,
]: ApiContext<FileUploadApi> = createApiContext<FileUploadApi>(
  "FileUploadContext",
  FileUploadContextService,
)

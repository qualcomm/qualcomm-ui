// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {ItemProps} from "@qualcomm-ui/core/file-upload"

@Injectable()
export class FileUploadItemContextService extends BaseApiContextService<ItemProps> {}

export const [
  FILE_UPLOAD_ITEM_CONTEXT,
  useFileUploadItemContext,
  provideFileUploadItemContext,
]: ApiContext<ItemProps> = createApiContext<ItemProps>(
  "FileUploadItemContext",
  FileUploadItemContextService,
)

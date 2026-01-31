// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  FileUploadClearTrigger,
  type FileUploadClearTriggerProps,
} from "./file-upload-clear-trigger"
import {
  FileUploadDropzone,
  type FileUploadDropzoneProps,
} from "./file-upload-dropzone"
import {
  FileUploadHiddenInput,
  type FileUploadHiddenInputProps,
} from "./file-upload-hidden-input"
import {FileUploadItem, type FileUploadItemProps} from "./file-upload-item"
import {
  FileUploadItemDeleteTrigger,
  type FileUploadItemDeleteTriggerProps,
} from "./file-upload-item-delete-trigger"
import {
  FileUploadItemGroup,
  type FileUploadItemGroupProps,
} from "./file-upload-item-group"
import {
  FileUploadItemName,
  type FileUploadItemNameProps,
} from "./file-upload-item-name"
import {
  FileUploadItemPreview,
  type FileUploadItemPreviewProps,
} from "./file-upload-item-preview"
import {
  FileUploadItemPreviewImage,
  type FileUploadItemPreviewImageProps,
} from "./file-upload-item-preview-image"
import {
  FileUploadItemSizeText,
  type FileUploadItemSizeTextProps,
} from "./file-upload-item-size-text"
import {FileUploadLabel, type FileUploadLabelProps} from "./file-upload-label"
import {FileUploadRoot, type FileUploadRootProps} from "./file-upload-root"
import {
  FileUploadTrigger,
  type FileUploadTriggerProps,
} from "./file-upload-trigger"

export * from "./qds-file-upload-context"

export type {
  FileUploadRootProps,
  FileUploadClearTriggerProps,
  FileUploadDropzoneProps,
  FileUploadTriggerProps,
  FileUploadLabelProps,
  FileUploadHiddenInputProps,
  FileUploadItemProps,
  FileUploadItemGroupProps,
  FileUploadItemNameProps,
  FileUploadItemPreviewProps,
  FileUploadItemPreviewImageProps,
  FileUploadItemSizeTextProps,
  FileUploadItemDeleteTriggerProps,
}

type FileUploadComponent = {
  Root: typeof FileUploadRoot
  ClearTrigger: typeof FileUploadClearTrigger
  Dropzone: typeof FileUploadDropzone
  Trigger: typeof FileUploadTrigger
  Label: typeof FileUploadLabel
  HiddenInput: typeof FileUploadHiddenInput
  Item: typeof FileUploadItem
  ItemGroup: typeof FileUploadItemGroup
  ItemName: typeof FileUploadItemName
  ItemPreview: typeof FileUploadItemPreview
  ItemPreviewImage: typeof FileUploadItemPreviewImage
  ItemSizeText: typeof FileUploadItemSizeText
  ItemDeleteTrigger: typeof FileUploadItemDeleteTrigger
}

export const FileUpload: FileUploadComponent = {
  Root: FileUploadRoot,
  ClearTrigger: FileUploadClearTrigger,
  Dropzone: FileUploadDropzone,
  Trigger: FileUploadTrigger,
  Label: FileUploadLabel,
  HiddenInput: FileUploadHiddenInput,
  Item: FileUploadItem,
  ItemGroup: FileUploadItemGroup,
  ItemName: FileUploadItemName,
  ItemPreview: FileUploadItemPreview,
  ItemPreviewImage: FileUploadItemPreviewImage,
  ItemSizeText: FileUploadItemSizeText,
  ItemDeleteTrigger: FileUploadItemDeleteTrigger,
}

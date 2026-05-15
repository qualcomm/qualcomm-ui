// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  CoreFileUploadClearTrigger,
  type CoreFileUploadClearTriggerProps,
  CoreFileUploadDropzone,
  type CoreFileUploadDropzoneProps,
  CoreFileUploadErrorText,
  type CoreFileUploadErrorTextProps,
  CoreFileUploadHiddenInput,
  type CoreFileUploadHiddenInputProps,
  CoreFileUploadItem,
  CoreFileUploadItemDeleteTrigger,
  type CoreFileUploadItemDeleteTriggerProps,
  CoreFileUploadItemGroup,
  type CoreFileUploadItemGroupProps,
  CoreFileUploadItemName,
  type CoreFileUploadItemNameProps,
  CoreFileUploadItemPreview,
  CoreFileUploadItemPreviewImage,
  type CoreFileUploadItemPreviewImageProps,
  type CoreFileUploadItemPreviewProps,
  type CoreFileUploadItemProps,
  CoreFileUploadItemSizeText,
  type CoreFileUploadItemSizeTextProps,
  CoreFileUploadLabel,
  type CoreFileUploadLabelProps,
  CoreFileUploadRoot,
  type CoreFileUploadRootProps,
  CoreFileUploadTrigger,
  type CoreFileUploadTriggerProps,
} from "./core-file-upload"

export * from "./file-upload-context"
export * from "./use-file-upload"

export type {
  CoreFileUploadRootProps,
  CoreFileUploadClearTriggerProps,
  CoreFileUploadDropzoneProps,
  CoreFileUploadErrorTextProps,
  CoreFileUploadTriggerProps,
  CoreFileUploadLabelProps,
  CoreFileUploadHiddenInputProps,
  CoreFileUploadItemProps,
  CoreFileUploadItemGroupProps,
  CoreFileUploadItemNameProps,
  CoreFileUploadItemPreviewProps,
  CoreFileUploadItemPreviewImageProps,
  CoreFileUploadItemSizeTextProps,
  CoreFileUploadItemDeleteTriggerProps,
}

type CoreFileUploadComponent = {
  ClearTrigger: typeof CoreFileUploadClearTrigger
  Dropzone: typeof CoreFileUploadDropzone
  ErrorText: typeof CoreFileUploadErrorText
  HiddenInput: typeof CoreFileUploadHiddenInput
  Item: typeof CoreFileUploadItem
  ItemDeleteTrigger: typeof CoreFileUploadItemDeleteTrigger
  ItemGroup: typeof CoreFileUploadItemGroup
  ItemName: typeof CoreFileUploadItemName
  ItemPreview: typeof CoreFileUploadItemPreview
  ItemPreviewImage: typeof CoreFileUploadItemPreviewImage
  ItemSizeText: typeof CoreFileUploadItemSizeText
  Label: typeof CoreFileUploadLabel
  Root: typeof CoreFileUploadRoot
  Trigger: typeof CoreFileUploadTrigger
}

export const CoreFileUpload: CoreFileUploadComponent = {
  ClearTrigger: CoreFileUploadClearTrigger,
  Dropzone: CoreFileUploadDropzone,
  ErrorText: CoreFileUploadErrorText,
  HiddenInput: CoreFileUploadHiddenInput,
  Item: CoreFileUploadItem,
  ItemDeleteTrigger: CoreFileUploadItemDeleteTrigger,
  ItemGroup: CoreFileUploadItemGroup,
  ItemName: CoreFileUploadItemName,
  ItemPreview: CoreFileUploadItemPreview,
  ItemPreviewImage: CoreFileUploadItemPreviewImage,
  ItemSizeText: CoreFileUploadItemSizeText,
  Label: CoreFileUploadLabel,
  Root: CoreFileUploadRoot,
  Trigger: CoreFileUploadTrigger,
}

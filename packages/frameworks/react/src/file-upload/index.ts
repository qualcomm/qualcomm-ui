// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {FileUpload as SimpleFileUpload} from "./file-upload"
import {
  FileUploadClearTrigger,
  type FileUploadClearTriggerProps,
} from "./file-upload-clear-trigger"
import {
  FileUploadDropzone,
  type FileUploadDropzoneProps,
} from "./file-upload-dropzone"
import {
  FileUploadDropzoneHint,
  type FileUploadDropzoneHintProps,
} from "./file-upload-dropzone-hint"
import {
  FileUploadDropzoneText,
  type FileUploadDropzoneTextProps,
} from "./file-upload-dropzone-text"
import {
  FileUploadDropzoneTextGroup,
  type FileUploadDropzoneTextGroupProps,
} from "./file-upload-dropzone-text-group"
import {
  FileUploadDropzoneTextLine,
  type FileUploadDropzoneTextLineProps,
} from "./file-upload-dropzone-text-line"
import {
  FileUploadErrorText,
  type FileUploadErrorTextProps,
} from "./file-upload-error-text"
import {
  FileUploadHiddenInput,
  type FileUploadHiddenInputProps,
} from "./file-upload-hidden-input"
import {FileUploadItem, type FileUploadItemProps} from "./file-upload-item"
import {
  FileUploadItemContent,
  type FileUploadItemContentProps,
} from "./file-upload-item-content"
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
  FileUploadDropzoneHintProps,
  FileUploadDropzoneTextProps,
  FileUploadDropzoneTextGroupProps,
  FileUploadDropzoneTextLineProps,
  FileUploadErrorTextProps,
  FileUploadTriggerProps,
  FileUploadLabelProps,
  FileUploadHiddenInputProps,
  FileUploadItemProps,
  FileUploadItemContentProps,
  FileUploadItemGroupProps,
  FileUploadItemNameProps,
  FileUploadItemPreviewProps,
  FileUploadItemPreviewImageProps,
  FileUploadItemSizeTextProps,
  FileUploadItemDeleteTriggerProps,
}

type FileUploadComponent = typeof SimpleFileUpload & {
  ClearTrigger: typeof FileUploadClearTrigger
  Dropzone: typeof FileUploadDropzone
  DropzoneHint: typeof FileUploadDropzoneHint
  DropzoneText: typeof FileUploadDropzoneText
  DropzoneTextGroup: typeof FileUploadDropzoneTextGroup
  DropzoneTextLine: typeof FileUploadDropzoneTextLine
  ErrorText: typeof FileUploadErrorText
  HiddenInput: typeof FileUploadHiddenInput
  Item: typeof FileUploadItem
  ItemContent: typeof FileUploadItemContent
  ItemDeleteTrigger: typeof FileUploadItemDeleteTrigger
  ItemGroup: typeof FileUploadItemGroup
  ItemName: typeof FileUploadItemName
  ItemPreview: typeof FileUploadItemPreview
  ItemPreviewImage: typeof FileUploadItemPreviewImage
  ItemSizeText: typeof FileUploadItemSizeText
  Label: typeof FileUploadLabel
  Root: typeof FileUploadRoot
  Trigger: typeof FileUploadTrigger
}

export const FileUpload: FileUploadComponent =
  SimpleFileUpload as FileUploadComponent

FileUpload.Root = FileUploadRoot
FileUpload.ClearTrigger = FileUploadClearTrigger
FileUpload.Dropzone = FileUploadDropzone
FileUpload.DropzoneHint = FileUploadDropzoneHint
FileUpload.DropzoneText = FileUploadDropzoneText
FileUpload.DropzoneTextGroup = FileUploadDropzoneTextGroup
FileUpload.DropzoneTextLine = FileUploadDropzoneTextLine
FileUpload.ErrorText = FileUploadErrorText
FileUpload.Trigger = FileUploadTrigger
FileUpload.Label = FileUploadLabel
FileUpload.HiddenInput = FileUploadHiddenInput
FileUpload.Item = FileUploadItem
FileUpload.ItemContent = FileUploadItemContent
FileUpload.ItemGroup = FileUploadItemGroup
FileUpload.ItemName = FileUploadItemName
FileUpload.ItemPreview = FileUploadItemPreview
FileUpload.ItemPreviewImage = FileUploadItemPreviewImage
FileUpload.ItemSizeText = FileUploadItemSizeText
FileUpload.ItemDeleteTrigger = FileUploadItemDeleteTrigger

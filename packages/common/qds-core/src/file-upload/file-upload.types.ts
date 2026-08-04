// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  QdsButtonApiProps,
  QdsButtonSize,
} from "@qualcomm-ui/qds-core/button"

import type {fileUploadClasses} from "./file-upload.classes.js"

export type QdsFileUploadSize = "sm" | "md" | "lg"

export interface QdsFileUploadApiProps {
  /**
   * Governs the size and padding of file upload elements.
   *
   * @default 'md'
   */
  size?: QdsFileUploadSize
}

type FileUploadClasses = typeof fileUploadClasses

export interface QdsFileUploadAddMoreButtonBindings {
  className: FileUploadClasses["addMoreButton"]
  "data-size": QdsButtonSize
}

export interface QdsFileUploadRootBindings {
  className: FileUploadClasses["root"]
  "data-size": QdsFileUploadSize
}

export interface QdsFileUploadClearTriggerBindings {
  className: FileUploadClasses["clearTrigger"]
  "data-size": QdsFileUploadSize
}

export interface QdsFileUploadDropzoneBindings {
  className: FileUploadClasses["dropzone"]
  "data-size": QdsFileUploadSize
}

export interface QdsFileUploadDropzoneTextBindings {
  className: FileUploadClasses["dropzoneText"]
}

export interface QdsFileUploadDropzoneTextGroupBindings {
  className: FileUploadClasses["dropzoneTextGroup"]
}

export interface QdsFileUploadDropzoneTextLineBindings {
  className: FileUploadClasses["dropzoneTextLine"]
}

export interface QdsFileUploadDropzoneHintBindings {
  className: FileUploadClasses["dropzoneHint"]
}

export interface QdsFileUploadErrorTextBindings {
  className: FileUploadClasses["errorText"]
}

export interface QdsFileUploadItemBindings {
  className: FileUploadClasses["item"]
  "data-size": QdsFileUploadSize
}

export interface QdsFileUploadItemContentBindings {
  className: FileUploadClasses["itemContent"]
}

export interface QdsFileUploadItemDeleteTriggerBindings {
  className: FileUploadClasses["itemDeleteTrigger"]
  "data-size": QdsFileUploadSize
}

export interface QdsFileUploadItemGroupBindings {
  className: FileUploadClasses["itemGroup"]
  "data-size": QdsFileUploadSize
}

export interface QdsFileUploadItemNameBindings {
  className: FileUploadClasses["itemName"]
  "data-size": QdsFileUploadSize
}

export interface QdsFileUploadItemPreviewBindings {
  className: FileUploadClasses["itemPreview"]
  "data-size": QdsFileUploadSize
}

export interface QdsFileUploadItemPreviewImageBindings {
  className: FileUploadClasses["itemPreviewImage"]
  "data-size": QdsFileUploadSize
}

export interface QdsFileUploadItemSizeTextBindings {
  className: FileUploadClasses["itemSizeText"]
  "data-size": QdsFileUploadSize
}

export interface QdsFileUploadLabelBindings {
  className: FileUploadClasses["label"]
  "data-size": QdsFileUploadSize
}

export interface QdsFileUploadRequiredIndicatorBindings {
  className: FileUploadClasses["requiredIndicator"]
}

export interface QdsFileUploadDropzoneIconBindings {
  className: FileUploadClasses["dropzoneIcon"]
  "data-size": QdsFileUploadSize
}

export interface QdsFileUploadInputDisplayBindings {
  className: FileUploadClasses["inputDisplay"]
  "data-size": QdsFileUploadSize
}

export interface QdsFileUploadTriggerBindings {
  className: FileUploadClasses["trigger"]
}

export interface QdsFileUploadApi {
  size: QdsFileUploadSize

  // group: prop translations
  getAddMoreButtonProps(): QdsButtonApiProps

  // group: bindings
  getAddMoreButtonBindings(): QdsFileUploadAddMoreButtonBindings
  getClearTriggerBindings(): QdsFileUploadClearTriggerBindings
  getDropzoneBindings(): QdsFileUploadDropzoneBindings
  getDropzoneHintBindings(): QdsFileUploadDropzoneHintBindings
  getDropzoneIconBindings(): QdsFileUploadDropzoneIconBindings
  getDropzoneTextBindings(): QdsFileUploadDropzoneTextBindings
  getDropzoneTextGroupBindings(): QdsFileUploadDropzoneTextGroupBindings
  getDropzoneTextLineBindings(): QdsFileUploadDropzoneTextLineBindings
  getErrorTextBindings(): QdsFileUploadErrorTextBindings
  getInputDisplayBindings(): QdsFileUploadInputDisplayBindings
  getItemBindings(): QdsFileUploadItemBindings
  getItemContentBindings(): QdsFileUploadItemContentBindings
  getItemDeleteTriggerBindings(): QdsFileUploadItemDeleteTriggerBindings
  getItemGroupBindings(): QdsFileUploadItemGroupBindings
  getItemNameBindings(): QdsFileUploadItemNameBindings
  getItemPreviewBindings(): QdsFileUploadItemPreviewBindings
  getItemPreviewImageBindings(): QdsFileUploadItemPreviewImageBindings
  getItemSizeTextBindings(): QdsFileUploadItemSizeTextBindings
  getLabelBindings(): QdsFileUploadLabelBindings
  getRequiredIndicatorBindings(): QdsFileUploadRequiredIndicatorBindings
  getRootBindings(): QdsFileUploadRootBindings
  getTriggerBindings(): QdsFileUploadTriggerBindings
}

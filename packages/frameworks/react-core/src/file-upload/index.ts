import type {FunctionComponent} from "react"

import {
  CoreFileUploadClearTrigger,
  type CoreFileUploadClearTriggerProps,
  CoreFileUploadContext,
  type CoreFileUploadContextProps,
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
} from "./core-file-upload.js"

export * from "./file-upload-context.js"
export type {
  CoreFileUploadRootProps,
  CoreFileUploadClearTriggerProps,
  CoreFileUploadDropzoneProps,
  CoreFileUploadLabelProps,
  CoreFileUploadHiddenInputProps,
  CoreFileUploadItemGroupProps,
  CoreFileUploadItemNameProps,
  CoreFileUploadItemSizeTextProps,
  CoreFileUploadItemProps,
  CoreFileUploadItemDeleteTriggerProps,
  CoreFileUploadTriggerProps,
  CoreFileUploadItemPreviewImageProps,
  CoreFileUploadItemPreviewProps,
  CoreFileUploadErrorTextProps,
  CoreFileUploadContextProps,
}

interface CoreFileUploadComponent {
  ClearTrigger: FunctionComponent<CoreFileUploadClearTriggerProps>
  Context: FunctionComponent<CoreFileUploadContextProps>
  Dropzone: FunctionComponent<CoreFileUploadDropzoneProps>
  ErrorText: FunctionComponent<CoreFileUploadErrorTextProps>
  HiddenInput: FunctionComponent<CoreFileUploadHiddenInputProps>
  Item: FunctionComponent<CoreFileUploadItemProps>
  ItemDeleteTrigger: FunctionComponent<CoreFileUploadItemDeleteTriggerProps>
  ItemGroup: FunctionComponent<CoreFileUploadItemGroupProps>
  ItemName: FunctionComponent<CoreFileUploadItemNameProps>
  ItemPreview: FunctionComponent<CoreFileUploadItemPreviewProps>
  ItemPreviewImage: FunctionComponent<CoreFileUploadItemPreviewImageProps>
  ItemSizeText: FunctionComponent<CoreFileUploadItemSizeTextProps>
  Label: FunctionComponent<CoreFileUploadLabelProps>
  Root: FunctionComponent<CoreFileUploadRootProps>
  Trigger: FunctionComponent<CoreFileUploadTriggerProps>
}

export const CoreFileUpload: CoreFileUploadComponent = {
  ClearTrigger: CoreFileUploadClearTrigger,
  Context: CoreFileUploadContext,
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

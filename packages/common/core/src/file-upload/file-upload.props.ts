import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {FileUploadApiProps, ItemProps} from "./file-upload.types"

export const fileUploadProps: (keyof FileUploadApiProps)[] =
  createProps<FileUploadApiProps>()(
    "accept",
    "acceptedFiles",
    "allowDrop",
    "capture",
    "defaultAcceptedFiles",
    "dir",
    "directory",
    "disabled",
    "getRootNode",
    "ids",
    "invalid",
    "locale",
    "maxFiles",
    "maxFileSize",
    "minFileSize",
    "name",
    "onFileAccept",
    "onFileChange",
    "onFileReject",
    "preventDocumentDrop",
    "required",
    "transformFiles",
    "translations",
    "validate",
  )
export const splitFileUploadProps: <Props extends FileUploadApiProps>(
  props: Props,
) => [FileUploadApiProps, Omit<Props, keyof FileUploadApiProps>] =
  createSplitProps<FileUploadApiProps>(fileUploadProps)

export const itemProps: (keyof ItemProps)[] = createProps<ItemProps>()(
  "file",
  "type",
)
export const splitItemProps: <Props extends ItemProps>(
  props: Props,
) => [ItemProps, Omit<Props, keyof ItemProps>] =
  createSplitProps<ItemProps>(itemProps)

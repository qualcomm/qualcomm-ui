// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  createFileUploadApi,
  type DropzoneProps,
  type FileUploadApi,
  type FileUploadApiProps,
  type FileUploadClearTriggerBindings,
  type FileUploadDropzoneBindings,
  type FileUploadHiddenInputBindings,
  type FileUploadLabelBindings,
  fileUploadMachine,
  type FileUploadTriggerBindings,
  type ItemPreviewImageProps,
  type ItemProps,
} from "@qualcomm-ui/core/file-upload"
import {normalizeProps, useMachine} from "@qualcomm-ui/react-core/machine"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import type {IdProp} from "@qualcomm-ui/react-core/system"

import {useFileUploadContext} from "./file-upload-context"

export interface UseFileUploadProps extends FileUploadApiProps {}

export function useFileUpload(props: UseFileUploadProps): FileUploadApi {
  const config = useMachine(fileUploadMachine, props)
  return createFileUploadApi(config, normalizeProps)
}

export function useFileUploadClearTrigger(): FileUploadClearTriggerBindings {
  const context = useFileUploadContext()
  return context.getClearTriggerBindings()
}

export function useFileUploadDropzone(
  props: DropzoneProps & IdProp = {},
): FileUploadDropzoneBindings {
  const context = useFileUploadContext()
  const id = useControlledId(props.id)
  return context.getDropzoneBindings({...props, id})
}

export function useFileUploadHiddenInput(
  props: IdProp,
): FileUploadHiddenInputBindings {
  const context = useFileUploadContext()
  return context.getHiddenInputBindings({
    id: useControlledId(props.id),
  })
}

export function useFileUploadLabel(props: IdProp): FileUploadLabelBindings {
  const context = useFileUploadContext()
  return context.getLabelBindings({
    id: useControlledId(props.id),
  })
}

export function useFileUploadTrigger(props: IdProp): FileUploadTriggerBindings {
  const context = useFileUploadContext()
  return context.getTriggerBindings({
    id: useControlledId(props.id),
  })
}

export function useFileUploadItem(props: ItemProps) {
  const context = useFileUploadContext()
  return context.getItemBindings(props)
}

export function useFileUploadItemDeleteTrigger(props: ItemProps) {
  const context = useFileUploadContext()
  return context.getItemDeleteTriggerBindings(props)
}

export function useFileUploadItemGroup(props: ItemProps) {
  const context = useFileUploadContext()
  return context.getItemGroupBindings(props)
}

export function useFileUploadItemName(props: ItemProps) {
  const context = useFileUploadContext()
  return context.getItemNameBindings(props)
}

export function useFileUploadItemPreview(props: ItemProps) {
  const context = useFileUploadContext()
  return context.getItemPreviewBindings(props)
}

export function useFileUploadItemPreviewImage(props: ItemPreviewImageProps) {
  const context = useFileUploadContext()
  return context.getItemPreviewImageBindings(props)
}

export function useFileUploadItemSizeText(props: ItemProps) {
  const context = useFileUploadContext()
  return context.getItemSizeTextBindings(props)
}

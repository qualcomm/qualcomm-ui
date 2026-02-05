// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  createFileUploadApi,
  type FileUploadApiProps,
  fileUploadMachine,
  type FileUploadTriggerBindings,
  type ItemProps,
  splitFileUploadProps,
} from "@qualcomm-ui/core/file-upload"
import {normalizeProps, useMachine} from "@qualcomm-ui/react-core/machine"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import {
  bindingRenderProp,
  type BindingRenderProp,
  type ElementRenderProp,
  type IdProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {
  FileUploadContextProvider,
  FileUploadItemContextProvider,
  useFileUploadContext,
  useFileUploadItemContext,
} from "./file-upload-context"

export interface CoreFileUploadRootProps
  extends FileUploadApiProps,
    Omit<ElementRenderProp<"div">, "defaultValue" | "dir">,
    IdProp {}

export function CoreFileUploadRoot({
  children,
  id,
  ...props
}: CoreFileUploadRootProps): ReactElement {
  const [fileUploadProps, localProps] =
    splitFileUploadProps<FileUploadApiProps>(props)
  const config = useMachine(fileUploadMachine, fileUploadProps)
  const context = createFileUploadApi(config, normalizeProps)

  const mergedProps = mergeProps(
    context.getRootBindings({id: useControlledId(id)}),
    localProps,
  )

  return (
    <FileUploadContextProvider value={context}>
      <PolymorphicElement as="div" {...mergedProps}>
        {children}
      </PolymorphicElement>
    </FileUploadContextProvider>
  )
}

export interface CoreFileUploadClearTriggerProps
  extends ElementRenderProp<"button"> {}

export function CoreFileUploadClearTrigger({
  ...props
}: CoreFileUploadClearTriggerProps): ReactElement {
  const fileUploadContext = useFileUploadContext()
  const mergedProps = mergeProps(
    fileUploadContext.getClearTriggerBindings(),
    props,
  )

  return <PolymorphicElement as="button" {...mergedProps} />
}

export interface CoreFileUploadDropzoneProps
  extends ElementRenderProp<"div">,
    IdProp {
  children?: ReactNode
}

export function CoreFileUploadDropzone(
  props: CoreFileUploadDropzoneProps,
): ReactElement {
  const context = useFileUploadContext()
  const mergedProps = mergeProps(
    context.getDropzoneBindings({id: useControlledId(props.id)}),
    props,
  )
  return <PolymorphicElement as="div" {...mergedProps} />
}

export interface CoreFileUploadLabelProps
  extends ElementRenderProp<"label">,
    IdProp {
  children?: ReactNode
}

export function CoreFileUploadLabel(
  props: CoreFileUploadLabelProps,
): ReactElement {
  const context = useFileUploadContext()
  const mergedProps = mergeProps(
    context.getLabelBindings({id: useControlledId(props.id)}),
    props,
  )
  return <PolymorphicElement as="label" {...mergedProps} />
}

export interface CoreFileUploadHiddenInputProps
  extends Omit<ElementRenderProp<"input">, "type">,
    IdProp {}

export function CoreFileUploadHiddenInput(
  props: CoreFileUploadHiddenInputProps,
): ReactElement {
  const context = useFileUploadContext()
  const mergedProps = mergeProps(
    context.getHiddenInputBindings({id: useControlledId(props.id)}),
    props,
  )
  return <PolymorphicElement as="input" {...mergedProps} />
}

export interface CoreFileUploadItemGroupProps extends ElementRenderProp<"div"> {
  children?: ReactNode
  type?: "accepted" | "rejected"
}

export function CoreFileUploadItemGroup({
  type,
  ...props
}: CoreFileUploadItemGroupProps): ReactElement {
  const context = useFileUploadContext()
  const mergedProps = mergeProps(context.getItemGroupBindings({type}), props)
  return <PolymorphicElement as="div" {...mergedProps} />
}

export interface CoreFileUploadItemNameProps extends ElementRenderProp<"span"> {
  children?: ReactNode
}

export function CoreFileUploadItemName(
  props: CoreFileUploadItemNameProps,
): ReactElement {
  const fileUploadContext = useFileUploadContext()
  const itemContext = useFileUploadItemContext()
  const mergedProps = mergeProps(
    fileUploadContext.getItemNameBindings(itemContext),
    props,
  )
  return <PolymorphicElement as="span" {...mergedProps} />
}

export interface CoreFileUploadItemSizeTextProps
  extends ElementRenderProp<"span"> {
  children?: ReactNode
}

export function CoreFileUploadItemSizeText(
  props: CoreFileUploadItemSizeTextProps,
): ReactElement {
  const fileUploadContext = useFileUploadContext()
  const itemContext = useFileUploadItemContext()
  const mergedProps = mergeProps(
    fileUploadContext.getItemSizeTextBindings(itemContext),
    props,
  )
  return <PolymorphicElement as="span" {...mergedProps} />
}

export interface CoreFileUploadItemProps
  extends ItemProps,
    ElementRenderProp<"div"> {
  children?: ReactNode
}

export function CoreFileUploadItem({
  children,
  file,
  type,
  ...props
}: CoreFileUploadItemProps): ReactElement {
  const context = useFileUploadContext()
  const itemContext: ItemProps = {file, type}
  const mergedProps = mergeProps(context.getItemBindings(itemContext), props)

  return (
    <FileUploadItemContextProvider value={itemContext}>
      <PolymorphicElement as="div" {...mergedProps}>
        {children}
      </PolymorphicElement>
    </FileUploadItemContextProvider>
  )
}

export interface CoreFileUploadItemDeleteTriggerProps
  extends ElementRenderProp<"button"> {}

export function CoreFileUploadItemDeleteTrigger(
  props: CoreFileUploadItemDeleteTriggerProps,
): ReactElement {
  const fileUploadContext = useFileUploadContext()
  const itemContext = useFileUploadItemContext()
  const mergedProps = mergeProps(
    fileUploadContext.getItemDeleteTriggerBindings(itemContext),
    props,
  )
  return <PolymorphicElement as="button" {...mergedProps} />
}

export interface CoreFileUploadTriggerProps extends IdProp {
  children: BindingRenderProp<FileUploadTriggerBindings>
}

export function CoreFileUploadTrigger({
  children,
  id,
}: CoreFileUploadTriggerProps): ReactElement {
  const context = useFileUploadContext()
  return bindingRenderProp(
    children,
    context.getTriggerBindings({
      id: useControlledId(id),
    }),
  )
}

export interface CoreFileUploadItemPreviewImageProps
  extends Omit<ElementRenderProp<"img">, "src">,
    IdProp {
  url: string // Pre-created object URL from consumer
}

export function CoreFileUploadItemPreviewImage({
  url,
  ...props
}: CoreFileUploadItemPreviewImageProps): ReactElement {
  const fileUploadContext = useFileUploadContext()
  const itemContext = useFileUploadItemContext()

  const mergedProps = mergeProps(
    fileUploadContext.getItemPreviewImageBindings({...itemContext, url}),
    {src: url},
    props,
  )

  return <PolymorphicElement as="img" {...mergedProps} />
}

export interface CoreFileUploadItemPreviewProps
  extends ElementRenderProp<"div"> {
  children?: ReactNode
}

export function CoreFileUploadItemPreview(
  props: CoreFileUploadItemPreviewProps,
): ReactElement {
  const fileUploadContext = useFileUploadContext()
  const itemContext = useFileUploadItemContext()
  const mergedProps = mergeProps(
    fileUploadContext.getItemPreviewBindings(itemContext),
    props,
  )
  return <PolymorphicElement as="div" {...mergedProps} />
}

export interface CoreFileUploadErrorTextProps
  extends ElementRenderProp<"div">,
    IdProp {
  children?: ReactNode
}

export function CoreFileUploadErrorText(
  props: CoreFileUploadErrorTextProps,
): ReactElement {
  const context = useFileUploadContext()
  const mergedProps = mergeProps(
    context.getErrorTextBindings({id: useControlledId(props.id)}),
    props,
  )
  return <PolymorphicElement as="div" {...mergedProps} />
}

// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, type ReactNode, useState} from "react"

import {
  createFileUploadApi,
  type FileUploadApi,
  type FileUploadApiProps,
  fileUploadMachine,
  type FileUploadTriggerBindings,
  type ItemProps,
  splitFileUploadProps,
} from "@qualcomm-ui/core/file-upload"
import {useSafeLayoutEffect} from "@qualcomm-ui/react-core/effects"
import {normalizeProps, useMachine} from "@qualcomm-ui/react-core/machine"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import {
  bindingRenderProp,
  type BindingRenderProp,
  type ElementRenderProp,
  type IdProp,
  PolymorphicElement,
  type RenderProp,
  renderProp,
} from "@qualcomm-ui/react-core/system"
import type {FileError} from "@qualcomm-ui/utils/files"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {
  FileUploadContextProvider,
  FileUploadItemContextProvider,
  useFileUploadContext,
  useFileUploadItemContext,
} from "./file-upload-context.js"

export interface CoreFileUploadRootProps
  extends
    FileUploadApiProps,
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

export interface CoreFileUploadClearTriggerProps extends ElementRenderProp<"button"> {}

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
  extends ElementRenderProp<"div">, IdProp {}

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
  extends ElementRenderProp<"label">, IdProp {}

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
  extends Omit<ElementRenderProp<"input">, "type">, IdProp {}

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

export interface CoreFileUploadItemNameProps extends ElementRenderProp<"span"> {}

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

export interface CoreFileUploadItemSizeTextProps extends ElementRenderProp<"span"> {}

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
  extends ItemProps, ElementRenderProp<"div"> {
  fileErrors?: FileError[]
}

export function CoreFileUploadItem({
  children,
  file,
  fileErrors,
  type,
  ...props
}: CoreFileUploadItemProps): ReactElement {
  const context = useFileUploadContext()
  const itemContext: ItemProps = {file, fileErrors, type}
  const mergedProps = mergeProps(context.getItemBindings(itemContext), props)

  return (
    <FileUploadItemContextProvider value={itemContext}>
      <PolymorphicElement as="div" {...mergedProps}>
        {children}
      </PolymorphicElement>
    </FileUploadItemContextProvider>
  )
}

export interface CoreFileUploadItemDeleteTriggerProps extends ElementRenderProp<"button"> {}

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
  extends Omit<ElementRenderProp<"img">, "src">, IdProp {}

export function CoreFileUploadItemPreviewImage(
  props: CoreFileUploadItemPreviewImageProps,
): ReactElement | null {
  const [url, setUrl] = useState<string>("")
  const fileUploadContext = useFileUploadContext()
  const itemProps = useFileUploadItemContext()

  const mergedProps = mergeProps(
    fileUploadContext.getItemPreviewImageBindings({...itemProps, url}),
    props,
  )

  useSafeLayoutEffect(() => {
    return fileUploadContext.createFileUrl(itemProps.file, (url) => setUrl(url))
  }, [fileUploadContext, itemProps.file])

  if (!url) {
    return null
  }

  return <PolymorphicElement as="img" {...mergedProps} />
}

export interface CoreFileUploadItemPreviewProps extends ElementRenderProp<"div"> {}

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
  extends ElementRenderProp<"div">, IdProp {}

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

export interface CoreFileUploadContextProps {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children: RenderProp<FileUploadApi>
}

export function CoreFileUploadContext({
  children,
}: CoreFileUploadContextProps): ReactNode {
  const context = useFileUploadContext()
  return renderProp(children, context)
}

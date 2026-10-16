// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  type ImageViewerApi,
  type ImageViewerApiProps,
  splitImageViewerProps,
} from "@qualcomm-ui/core/image-viewer"
import {useOnDestroy} from "@qualcomm-ui/react-core/effects"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {
  ImageViewerContextProvider,
  useImageViewerContext,
} from "./image-viewer-context.js"
import {useImageViewer} from "./use-image-viewer.js"

export interface CoreImageViewerRootProviderProps extends ElementRenderProp<"div"> {
  /**
   * An image viewer API created with useImageViewer.
   */
  value: ImageViewerApi
}

export function CoreImageViewerRootProvider({
  children,
  id,
  value,
  ...props
}: CoreImageViewerRootProviderProps): ReactElement {
  const mergedProps = mergeProps(
    value.getRootBindings({id: useControlledId(id), onDestroy: useOnDestroy()}),
    props,
  )
  return (
    <ImageViewerContextProvider value={value}>
      <PolymorphicElement as="div" {...mergedProps}>
        {children}
      </PolymorphicElement>
    </ImageViewerContextProvider>
  )
}

export interface CoreImageViewerRootProps
  extends
    ImageViewerApiProps,
    Omit<ElementRenderProp<"div">, "defaultValue" | "dir"> {}

export function CoreImageViewerRoot(
  props: CoreImageViewerRootProps,
): ReactElement {
  const [machineProps, localProps] = splitImageViewerProps(props)
  const api = useImageViewer(machineProps)
  return <CoreImageViewerRootProvider {...localProps} value={api} />
}

export interface CoreImageViewerContextProps {
  /**
   * Renders content using the current image viewer API.
   */
  children: (api: ImageViewerApi) => ReactNode
}

export function CoreImageViewerContext({
  children,
}: CoreImageViewerContextProps): ReactElement {
  const api = useImageViewerContext()
  return <>{children(api)}</>
}

export interface CoreImageViewerViewportProps extends ElementRenderProp<"div"> {}

export function CoreImageViewerViewport({
  id,
  ...props
}: CoreImageViewerViewportProps): ReactElement {
  const api = useImageViewerContext()
  const mergedProps = mergeProps(
    api.getViewportBindings({
      id: useControlledId(id),
      onDestroy: useOnDestroy(),
    }),
    props,
  )
  return <PolymorphicElement as="div" {...mergedProps} />
}

export interface CoreImageViewerImageProps extends ElementRenderProp<"img"> {}

export function CoreImageViewerImage({
  id,
  ...props
}: CoreImageViewerImageProps): ReactElement {
  const api = useImageViewerContext()
  const mergedProps = mergeProps(
    api.getImageBindings({id: useControlledId(id), onDestroy: useOnDestroy()}),
    props,
  )
  return <PolymorphicElement as="img" {...mergedProps} />
}

export interface CoreImageViewerZoomInTriggerProps extends ElementRenderProp<"button"> {}

export function CoreImageViewerZoomInTrigger(
  props: CoreImageViewerZoomInTriggerProps,
): ReactElement {
  const api = useImageViewerContext()
  const mergedProps = mergeProps(api.getZoomInTriggerBindings(), props)
  return <PolymorphicElement as="button" {...mergedProps} />
}

export interface CoreImageViewerZoomOutTriggerProps extends ElementRenderProp<"button"> {}

export function CoreImageViewerZoomOutTrigger(
  props: CoreImageViewerZoomOutTriggerProps,
): ReactElement {
  const api = useImageViewerContext()
  const mergedProps = mergeProps(api.getZoomOutTriggerBindings(), props)
  return <PolymorphicElement as="button" {...mergedProps} />
}

export interface CoreImageViewerResetTriggerProps extends ElementRenderProp<"button"> {}

export function CoreImageViewerResetTrigger(
  props: CoreImageViewerResetTriggerProps,
): ReactElement {
  const api = useImageViewerContext()
  const mergedProps = mergeProps(api.getResetTriggerBindings(), props)
  return <PolymorphicElement as="button" {...mergedProps} />
}

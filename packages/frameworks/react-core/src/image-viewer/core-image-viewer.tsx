// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useMemo} from "react"

import {
  type ImageViewerApi,
  type ImageViewerApiProps,
  splitImageViewerProps,
} from "@qualcomm-ui/core/image-viewer"
import {CoreDialog} from "@qualcomm-ui/react-core/dialog"
import {
  useEventCallback,
  useOnDestroy,
  useSafeLayoutEffect,
} from "@qualcomm-ui/react-core/effects"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import {
  type ElementRenderProp,
  PolymorphicElement,
  type RenderProp,
  renderProp,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {
  ImageViewerContextProvider,
  useImageViewerContext,
} from "./image-viewer-context.js"
import {ImageViewerImageContextProvider} from "./image-viewer-image-context.js"
import {useImageViewer} from "./use-image-viewer.js"

export interface CoreImageViewerRootProviderProps extends ElementRenderProp<"div"> {
  /** Default alternative text for StaticImage and ViewportImage. */
  alt?: string
  /** Default image source for StaticImage and ViewportImage. */
  src?: string
  /**
   * An image viewer API created with useImageViewer.
   *
   * @inheritDoc
   */
  value: ImageViewerApi
}

export function CoreImageViewerRootProvider({
  alt,
  children,
  id,
  src,
  value,
  ...props
}: CoreImageViewerRootProviderProps): ReactElement {
  const imageContext = useMemo(() => ({alt, src}), [alt, src])
  const mergedProps = mergeProps(
    value.getRootBindings({id: useControlledId(id), onDestroy: useOnDestroy()}),
    props,
  )
  return (
    <ImageViewerContextProvider value={value}>
      <ImageViewerImageContextProvider value={imageContext}>
        <CoreDialog.Root
          aria-label={value.translations.rootLabel}
          getRootNode={value.getRootNode}
          initialFocusEl={value.getViewportElement}
          lazyMount
          onOpenChange={value.setOpen}
          open={value.open}
          unmountOnExit
        >
          <PolymorphicElement as="div" {...mergedProps}>
            {children}
          </PolymorphicElement>
        </CoreDialog.Root>
      </ImageViewerImageContextProvider>
    </ImageViewerContextProvider>
  )
}

export interface CoreImageViewerRootProps
  extends
    ImageViewerApiProps,
    Omit<CoreImageViewerRootProviderProps, "defaultValue" | "dir" | "value"> {}

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
   *
   * @inheritDoc
   */
  children: RenderProp<ImageViewerApi>
}

export function CoreImageViewerContext({
  children,
}: CoreImageViewerContextProps): ReactElement {
  const api = useImageViewerContext()
  return <>{renderProp(children, api)}</>
}

export interface CoreImageViewerViewportProps extends ElementRenderProp<"div"> {}

export function CoreImageViewerViewport({
  id,
  ...props
}: CoreImageViewerViewportProps): ReactElement {
  const api = useImageViewerContext()
  const measureViewport = useEventCallback(api.measureViewport)
  useSafeLayoutEffect(() => {
    if (api.open) {
      measureViewport()
    }
  }, [
    api.open,
    api.naturalSize.width,
    api.naturalSize.height,
    api.viewportRect.width,
    api.viewportRect.height,
    measureViewport,
  ])
  const mergedProps = mergeProps(
    api.getViewportBindings({
      id: useControlledId(id),
      onDestroy: useOnDestroy(),
    }),
    props,
  )
  return <PolymorphicElement as="div" {...mergedProps} />
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

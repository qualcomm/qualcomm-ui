// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, type SyntheticEvent, useMemo, useRef} from "react"

import {
  useEventCallback,
  useOnDestroy,
  useSafeLayoutEffect,
} from "@qualcomm-ui/react-core/effects"
import {composeRefs} from "@qualcomm-ui/react-core/refs"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useImageViewerContext} from "./image-viewer-context.js"
import {useImageViewerImageContext} from "./image-viewer-image-context.js"

export interface CoreImageViewerViewportImageProps extends ElementRenderProp<"img"> {}

/** The image whose dimensions and transforms are managed by the viewport. */
export function CoreImageViewerViewportImage({
  id,
  ref,
  ...props
}: CoreImageViewerViewportImageProps): ReactElement {
  const api = useImageViewerContext()
  const defaults = useImageViewerImageContext()
  const src = props.src ?? defaults.src
  const alt = props.alt ?? defaults.alt
  const imageRef = useRef<HTMLImageElement | null>(null)
  const mergedRef = useMemo(() => composeRefs(ref, imageRef), [ref])
  const syncImage = useEventCallback((element: HTMLImageElement | null) => {
    if (!element?.complete || !element.naturalWidth || !element.naturalHeight) {
      api.setImageStatus({ready: false, size: {height: 0, width: 0}})
      return
    }
    api.setImageStatus({
      ready: true,
      size: {height: element.naturalHeight, width: element.naturalWidth},
    })
  })
  useSafeLayoutEffect(() => {
    syncImage(imageRef.current)
  }, [src, props.srcSet, props.sizes, syncImage])

  const mergedProps = mergeProps(
    api.getViewportImageBindings({
      id: useControlledId(id),
      onDestroy: useOnDestroy(),
    }),
    {
      decoding: "sync",
      loading: "eager",
      onError: () => syncImage(null),
      onLoad: (event: SyntheticEvent<HTMLImageElement>) =>
        syncImage(event.currentTarget),
    },
    props,
    {alt, src},
  )
  return <PolymorphicElement as="img" {...mergedProps} ref={mergedRef} />
}

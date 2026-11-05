// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComponentProps, ReactElement} from "react"

import {
  ImageViewer,
  type ImageViewerRootProps,
} from "@qualcomm-ui/react/image-viewer"

export interface ImageProps extends Omit<ImageViewerRootProps, "children"> {
  imgProps: Omit<ComponentProps<"img">, "slot" | "title">
}

export function Image({imgProps, ...props}: ImageProps): ReactElement {
  const {alt = "Image", src, ...imageProps} = imgProps
  return (
    <ImageViewer
      {...props}
      alt={alt}
      src={src}
      staticImageProps={imageProps}
      style={{
        maxWidth: "100%",
        width: "100%",
        ...props.style,
      }}
    />
  )
}

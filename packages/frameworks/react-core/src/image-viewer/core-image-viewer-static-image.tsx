// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {imageViewerAnatomy} from "@qualcomm-ui/core/image-viewer"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"

import {useImageViewerImageContext} from "./image-viewer-image-context.js"

export interface CoreImageViewerStaticImageProps extends ElementRenderProp<"img"> {}

/** The inline image, with optional overrides for the root's src and alt. */
export function CoreImageViewerStaticImage(
  props: CoreImageViewerStaticImageProps,
): ReactElement {
  const defaults = useImageViewerImageContext()
  return (
    <PolymorphicElement
      as="img"
      {...imageViewerAnatomy.parts.staticImage}
      {...props}
      alt={props.alt ?? defaults.alt}
      src={props.src ?? defaults.src}
    />
  )
}

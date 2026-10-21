// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreImageViewer,
  type CoreImageViewerStaticImageProps,
} from "@qualcomm-ui/react-core/image-viewer"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsImageViewerContext} from "./qds-image-viewer-context.js"

export interface ImageViewerStaticImageProps extends CoreImageViewerStaticImageProps {}

/** The inline image. Its src and alt default to the root values. */
export function ImageViewerStaticImage(
  props: ImageViewerStaticImageProps,
): ReactElement {
  const qds = useQdsImageViewerContext()
  return (
    <CoreImageViewer.StaticImage
      {...mergeProps(qds.getStaticImageBindings(), props)}
    />
  )
}

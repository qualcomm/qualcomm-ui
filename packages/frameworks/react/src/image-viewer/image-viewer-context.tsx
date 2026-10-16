// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreImageViewer,
  type CoreImageViewerContextProps,
} from "@qualcomm-ui/react-core/image-viewer"

export interface ImageViewerContextProps extends CoreImageViewerContextProps {}

export function ImageViewerContext(
  props: ImageViewerContextProps,
): ReactElement {
  return <CoreImageViewer.Context {...props} />
}

// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  createImageViewerApi,
  imageViewerMachine,
  type ImageViewerApi,
  type ImageViewerApiProps,
} from "@qualcomm-ui/core/image-viewer"
import {normalizeProps, useMachine} from "@qualcomm-ui/react-core/machine"

/**
 * Creates an image viewer API for use with CoreImageViewer.RootProvider.
 */
export function useImageViewer(
  props: ImageViewerApiProps = {},
): ImageViewerApi {
  const machine = useMachine(imageViewerMachine, props)
  return createImageViewerApi(machine, normalizeProps)
}

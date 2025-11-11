// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {TrackBindingsConfig} from "./use-track-bindings"

/**
 * @deprecated, migrate to the useTrackBindingsInitOptions
 */
export interface MachineInitOptions extends TrackBindingsConfig {
  disabled?: never
}

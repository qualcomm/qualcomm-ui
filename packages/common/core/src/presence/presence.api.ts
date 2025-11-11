// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Machine, PropNormalizer} from "@qualcomm-ui/utils/machine"

import type {PresenceApi, PresenceSchema} from "./presence.types"

export function createPresenceApi(
  machine: Machine<PresenceSchema>,
  _normalize?: PropNormalizer,
): PresenceApi {
  const {context, prop, send, state} = machine
  const present = state.matches("mounted", "unmountSuspended")
  return {
    lazyMount: prop("lazyMount"),
    present,
    setNode(node) {
      if (!node) {
        return
      }
      send({node, type: "NODE.SET"})
    },
    skip: !context.get("initial"),
    skipAnimationOnMount: prop("skipAnimationOnMount"),
    unmount() {
      send({type: "UNMOUNT"})
    },
    unmountOnExit: prop("unmountOnExit"),
  }
}

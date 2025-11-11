// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ActionFunctionArgs, Cookie} from "react-router"

export function updateDemoState(
  stateAction: string,
  state: Record<string, unknown>,
) {
  return fetch(stateAction, {body: JSON.stringify(state), method: "POST"})
}

// a simple cookie used to store arbitrary state for the SSR request
export function createDemoStateUpdateAction(cookie: Cookie) {
  return async ({request}: ActionFunctionArgs) => {
    const state = await request.json()

    return Response.json(
      {success: true},
      {
        headers: {"Set-Cookie": await cookie.serialize(state)},
      },
    )
  }
}

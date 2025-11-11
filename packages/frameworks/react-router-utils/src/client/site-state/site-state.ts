// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ActionFunctionArgs, Cookie} from "react-router"

export interface SiteState {
  packageManager: "npm" | "yarn" | "pnpm"
}

export function updateSiteState<
  T extends NonNullable<unknown> = NonNullable<unknown>,
>(stateAction: string, state: T) {
  return fetch(stateAction, {body: JSON.stringify(state), method: "POST"})
}

// a simple cookie used to store arbitrary state for the SSR request
export function createUpdateAction(cookie: Cookie) {
  return async ({request}: ActionFunctionArgs) => {
    const currentState = await cookie.parse(request.headers.get("cookie"))
    const state = await request.json()

    return Response.json(
      {success: true},
      {
        headers: {
          "Set-Cookie": await cookie.serialize({...currentState, ...state}),
        },
      },
    )
  }
}

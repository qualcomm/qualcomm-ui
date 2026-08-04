// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ActionFunctionArgs, Cookie} from "react-router"

import {isTheme} from "./theme-provider.js"

export function createThemeAction(
  themeCookie: Cookie,
): ({request}: ActionFunctionArgs) => Promise<Response> {
  return async ({request}: ActionFunctionArgs): Promise<Response> => {
    const {theme} = await request.json()

    if (!isTheme(theme)) {
      return Response.json({
        message: theme
          ? `Theme value of ${theme} is not a valid theme.`
          : `Empty theme provided`,
        success: false,
      })
    }

    return Response.json(
      {success: true},
      {
        headers: {"Set-Cookie": await themeCookie.serialize(theme)},
      },
    )
  }
}

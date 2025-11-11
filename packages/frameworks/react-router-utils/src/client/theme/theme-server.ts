// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {SessionStorage} from "react-router"

import {isTheme, type Theme} from "./theme-provider"

type ThemeSession = {
  commit: () => Promise<string>
  destroy: () => Promise<string>
  getTheme: () => Theme | null
  setTheme: (theme: Theme) => void
}

export type ThemeSessionResolver = (request: Request) => Promise<ThemeSession>

export const createThemeSessionResolver = (
  cookieThemeSession: SessionStorage,
): ThemeSessionResolver => {
  const resolver = async (request: Request): Promise<ThemeSession> => {
    const session = await cookieThemeSession.getSession(
      request.headers.get("Cookie"),
    )

    return {
      commit: () => cookieThemeSession.commitSession(session),
      destroy: () => cookieThemeSession.destroySession(session),
      getTheme: () => {
        const themeValue = session.get("theme")
        return isTheme(themeValue) ? themeValue : null
      },
      setTheme: (theme: Theme) => session.set("theme", theme),
    }
  }

  return resolver
}

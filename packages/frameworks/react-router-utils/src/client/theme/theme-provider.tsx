// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  createContext,
  type MouseEvent,
  type ReactNode,
  type SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

import {useBroadcastChannel} from "./use-broadcast-channel"
import {useCorrectCssTransition} from "./use-correct-css-transition"

export const Theme = {
  DARK: "dark",
  LIGHT: "light",
} as const

export type Theme = (typeof Theme)[keyof typeof Theme]

export const themes: Array<Theme> = Object.values(Theme)

export type ThemeMetadata = {
  definedBy: "USER" | "SYSTEM"
}

type ThemeContextType = [
  Theme | null,
  (value: SetStateAction<Theme | null>, event?: MouseEvent) => void,
  ThemeMetadata,
]

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)
ThemeContext.displayName = "ThemeContext"

const prefersLightMediaQuery = "(prefers-color-scheme: light)"

const getPreferredTheme = () =>
  window.matchMedia(prefersLightMediaQuery).matches ? Theme.LIGHT : Theme.DARK

export const mediaQuery =
  typeof window !== "undefined"
    ? window.matchMedia(prefersLightMediaQuery)
    : null

export interface ThemeProviderProps {
  children: ReactNode
  /**
   * Disable the brief transition animation when changing themes.
   */
  disableTransitionOnThemeChange?: boolean
  /**
   * @deprecated migrate to the {@link theme} prop
   */
  specifiedTheme: Theme | null
  /**
   * The theme to use for the application.
   */
  theme: Theme | null
  /**
   * The route used to change the theme in the
   */
  themeAction: string
}

export function ThemeProvider({
  children,
  disableTransitionOnThemeChange = false,
  specifiedTheme,
  theme: themeProp,
  themeAction,
}: ThemeProviderProps) {
  const ensureCorrectTransition = useCorrectCssTransition({
    disableTransitions: disableTransitionOnThemeChange,
  })

  const resolvedTheme = themeProp || specifiedTheme

  const [theme, setTheme] = useState<Theme | null>(() => {
    // On the server, if we don't have a specified theme then we should
    // return null and the clientThemeCode will set the theme for us
    // before hydration. Then (during hydration), this code will get the same
    // value that clientThemeCode got so hydration is happy.
    if (resolvedTheme) {
      return themes.includes(resolvedTheme) ? resolvedTheme : null
    }

    // there's no way for us to know what the theme should be in this context
    // the client will have to figure it out before hydration.
    if (typeof window !== "object") {
      return null
    }

    return getPreferredTheme()
  })

  const [themeDefinedBy, setThemeDefinedBy] = useState<
    ThemeMetadata["definedBy"]
  >(resolvedTheme ? "USER" : "SYSTEM")

  const broadcastThemeChange = useBroadcastChannel<{
    definedBy: ThemeMetadata["definedBy"]
    theme: Theme
  }>("qui-react-router-themes", (e) => {
    ensureCorrectTransition(() => {
      setTheme(e.data.theme)
      setThemeDefinedBy(e.data.definedBy)
    })
  })

  useEffect(() => {
    if (themeDefinedBy === "USER") {
      return () => {}
    }

    const handleChange = (ev: MediaQueryListEvent) => {
      ensureCorrectTransition(() => {
        setTheme(ev.matches ? Theme.LIGHT : Theme.DARK)
      })
    }
    mediaQuery?.addEventListener("change", handleChange)
    return () => mediaQuery?.removeEventListener("change", handleChange)
  }, [ensureCorrectTransition, setTheme, themeDefinedBy])

  const handleThemeChange = useCallback(
    (value: SetStateAction<Theme | null>, event?: MouseEvent) => {
      const nextTheme = typeof value === "function" ? value(theme) : value

      if (nextTheme === null) {
        const preferredTheme = getPreferredTheme()

        ensureCorrectTransition(() => {
          setTheme(preferredTheme)
          setThemeDefinedBy("SYSTEM")
          broadcastThemeChange({definedBy: "SYSTEM", theme: preferredTheme})
        }, event)

        fetch(`${themeAction}`, {
          body: JSON.stringify({theme: null}),
          method: "POST",
        })
      } else {
        ensureCorrectTransition(() => {
          setTheme(nextTheme)
          setThemeDefinedBy("USER")
          broadcastThemeChange({definedBy: "USER", theme: nextTheme})
        }, event)

        fetch(`${themeAction}`, {
          body: JSON.stringify({theme: nextTheme}),
          method: "POST",
        })
      }
    },
    [
      broadcastThemeChange,
      ensureCorrectTransition,
      setTheme,
      theme,
      themeAction,
    ],
  )

  const value = useMemo<ThemeContextType>(
    () => [theme, handleThemeChange, {definedBy: themeDefinedBy}],
    [theme, handleThemeChange, themeDefinedBy],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

const clientThemeCode = String.raw`
(() => {
  const theme = window.matchMedia(${JSON.stringify(prefersLightMediaQuery)}).matches
    ? 'light'
    : 'dark';
  
  const cl = document.documentElement.classList;
  const dataAttr = document.documentElement.dataset.theme;

  if (dataAttr != null) {
    const themeAlreadyApplied = dataAttr === 'light' || dataAttr === 'dark';
    if (!themeAlreadyApplied) {
      document.documentElement.dataset.theme = theme;
    }
  } else {
    const themeAlreadyApplied = cl.contains('light') || cl.contains('dark');
    if (!themeAlreadyApplied) {
      cl.add(theme);
    }
  }
  
  const meta = document.querySelector('meta[name=color-scheme]');
  if (meta) {
    if (theme === 'dark') {
      meta.content = 'dark light';
    } else if (theme === 'light') {
      meta.content = 'light dark';
    }
  }
})();
`

type PreventFlashOnWrongThemeProps = {
  nonce?: string
  ssrTheme: boolean
}

export function PreventFlashOnWrongTheme({
  nonce,
  ssrTheme,
}: PreventFlashOnWrongThemeProps) {
  const [theme] = useTheme()

  return (
    <>
      {/*
        On the server, "theme" might be `null`, so clientThemeCode ensures that
        this is correct before hydration.
      */}
      <meta
        content={theme === Theme.LIGHT ? "light dark" : "dark light"}
        name="color-scheme"
      />
      {/*
        If we know what the theme is from the server then we don't need
        to do fancy tricks prior to hydration to make things match.
      */}
      {ssrTheme ? null : (
        <script
          // NOTE: we cannot use type="module" because that automatically makes
          // the script "defer". That doesn't work for us because we need
          // this script to run synchronously before the rest of the document
          // is finished loading.
          dangerouslySetInnerHTML={{__html: clientThemeCode}}
          nonce={nonce}
          suppressHydrationWarning
        />
      )}
    </>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

export function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && themes.includes(value as Theme)
}

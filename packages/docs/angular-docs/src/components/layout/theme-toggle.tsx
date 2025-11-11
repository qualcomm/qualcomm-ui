import {type ReactNode, useCallback, useEffect, useRef} from "react"

import {MoonIcon, SunIcon} from "lucide-react"

import {HeaderBar} from "@qualcomm-ui/react/header-bar"
import {Theme, useTheme} from "@qualcomm-ui/react-router-utils/client"

export function ThemeToggle(): ReactNode {
  const [theme, setTheme] = useTheme()

  const themeRef = useRef(theme)

  const toggle = useCallback(() => {
    setTheme((prevState) =>
      prevState === Theme.DARK ? Theme.LIGHT : Theme.DARK,
    )
  }, [setTheme])

  useEffect(() => {
    themeRef.current = theme
  }, [theme])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (
        event.code === "KeyD" &&
        (event.ctrlKey || event.metaKey) &&
        event.altKey &&
        event.shiftKey
      ) {
        toggle()
      }
    }

    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [setTheme, toggle])

  return (
    <HeaderBar.ActionIconButton
      aria-label="Toggle Theme"
      icon={theme === Theme.LIGHT ? SunIcon : MoonIcon}
      onClick={toggle}
    />
  )
}

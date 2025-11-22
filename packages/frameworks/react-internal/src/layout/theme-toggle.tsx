import {
  type MouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react"

import {MoonIcon, SunIcon} from "lucide-react"

import {HeaderBar} from "@qualcomm-ui/react/header-bar"
import {Theme, useTheme} from "@qualcomm-ui/react-router-utils/client"

export function ThemeToggle(): ReactNode {
  const [theme, setTheme] = useTheme()

  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleThemeSwitch = useCallback(
    (event?: MouseEvent) => {
      const nextTheme = theme === Theme.DARK ? Theme.LIGHT : Theme.DARK
      setTheme(nextTheme, event)
    },
    [setTheme, theme],
  )

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (
        event.code === "KeyD" &&
        (event.ctrlKey || event.metaKey) &&
        event.altKey &&
        event.shiftKey
      ) {
        handleThemeSwitch()
      }
    }

    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [handleThemeSwitch, setTheme])

  return (
    <HeaderBar.ActionIconButton
      ref={buttonRef}
      aria-label="Toggle Theme"
      icon={theme === Theme.LIGHT ? SunIcon : MoonIcon}
      onClick={handleThemeSwitch}
    />
  )
}

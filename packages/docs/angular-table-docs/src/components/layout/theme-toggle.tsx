import {type ReactNode, useCallback, useEffect, useRef} from "react"

import {MoonIcon, SunIcon} from "lucide-react"

import {IconButton} from "@qualcomm-ui/react/button"
import {Icon} from "@qualcomm-ui/react/icon"
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
    <IconButton
      aria-label="Toggle Theme"
      icon={
        <Icon icon={theme === Theme.LIGHT ? SunIcon : MoonIcon} size={14} />
      }
      onClick={toggle}
      size="sm"
      variant="ghost"
    />
  )
}

/* eslint-disable no-restricted-globals */
import {useEffect} from "react"

import {useTheme} from "@qualcomm-ui/react-router-utils/client"

/**
 * Intercepts the click event on the qds-theme-switcher button demo, and toggles the
 * theme from the react-router side.
 */
export function useThemeSwitchInterceptor() {
  const [theme, setTheme] = useTheme()

  useEffect(() => {
    function listener(event: MouseEvent) {
      const target = event.target
      if (
        target instanceof HTMLElement &&
        target.id &&
        target.id.startsWith("qds-theme-switcher")
      ) {
        setTheme(theme === "light" ? "dark" : "light")
      }
    }

    document.documentElement.addEventListener("click", listener)

    return () => {
      document.documentElement.removeEventListener("click", listener)
    }
  }, [theme])
}

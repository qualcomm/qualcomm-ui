import {type MouseEvent, type ReactElement, useCallback} from "react"

import {MoonIcon, SunIcon} from "lucide-react"
import {Link} from "react-router"

import {Theme, useTheme} from "@qualcomm-ui/react-router-utils/client"
import {HeaderBar} from "@qualcomm-ui/react/header-bar"

export function AppHeader(): ReactElement {
  const [theme, setTheme] = useTheme()

  const handleThemeSwitch = useCallback(
    (event?: MouseEvent) => {
      const nextTheme = theme === Theme.DARK ? Theme.LIGHT : Theme.DARK
      setTheme(nextTheme, event)
    },
    [setTheme, theme],
  )

  return (
    <HeaderBar.Root>
      <HeaderBar.Logo>
        <HeaderBar.AppTitle render={<Link to="/" />}>
          QUI React SSR Debug
        </HeaderBar.AppTitle>
      </HeaderBar.Logo>
      <HeaderBar.ActionBar>
        <HeaderBar.ActionIconButton
          aria-label="Toggle Theme"
          icon={theme === Theme.LIGHT ? SunIcon : MoonIcon}
          onClick={handleThemeSwitch}
        />
      </HeaderBar.ActionBar>
    </HeaderBar.Root>
  )
}

import {type ReactElement, useCallback} from "react"

import {Menu} from "@qualcomm-ui/react/menu"
import {Portal} from "@qualcomm-ui/react-core/portal"

import {useVscodeThemeContext, type VscodeTheme} from "./vscode-theme-context"

interface ThemeOption {
  id: VscodeTheme
  label: string
}

const themeOptions: ThemeOption[] = [
  {id: "dark-modern", label: "Dark Modern"},
  {id: "dark-plus", label: "Dark+"},
  {id: "dark-high-contrast", label: "Dark High Contrast"},
  {id: "light-modern", label: "Light Modern"},
  {id: "light-plus", label: "Light+"},
  {id: "light-high-contrast", label: "Light High Contrast"},
  {id: "monokai", label: "Monokai"},
  {id: "quiet-light", label: "Quiet Light"},
  {id: "solarized-dark", label: "Solarized Dark"},
  {id: "solarized-light", label: "Solarized Light"},
]

export function VscodeThemeMenu(): ReactElement {
  const {setTheme, theme} = useVscodeThemeContext()

  const currentLabel =
    themeOptions.find((opt) => opt.id === theme)?.label ?? "Select Theme"

  const onThemeChange = useCallback(
    (localTheme: VscodeTheme) => {
      setTheme(localTheme)
      void fetch("/action/set-vscode-theme", {
        body: localTheme,
        headers: {
          "Content-Type": "text/plain",
        },
        method: "POST",
      }).catch(() => {
        console.debug("failed to update theme")
      })
    },
    [setTheme],
  )

  return (
    <Menu.Root onSelect={(value) => setTheme(value as VscodeTheme)}>
      <Menu.Trigger>
        <Menu.Button size="sm" variant="ghost">
          {currentLabel}
        </Menu.Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.ItemGroup>
              <Menu.ItemGroupLabel>VSCode Theme</Menu.ItemGroupLabel>
              {themeOptions.map((item) => (
                <Menu.CheckboxItem
                  key={item.id}
                  checked={theme === item.id}
                  onCheckedChange={() => onThemeChange(item.id)}
                  value={item.id}
                >
                  <Menu.ItemLabel>{item.label}</Menu.ItemLabel>
                  <Menu.ItemIndicator />
                </Menu.CheckboxItem>
              ))}
            </Menu.ItemGroup>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}

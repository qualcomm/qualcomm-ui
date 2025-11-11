import type {ReactElement} from "react"

import {AlertCircle, Settings} from "lucide-react"

import {HeaderBar} from "@qualcomm-ui/react/header-bar"
import {Icon} from "@qualcomm-ui/react/icon"
import {Popover} from "@qualcomm-ui/react/popover"
import {type QdsBrand, useQdsThemeContext} from "@qualcomm-ui/react/qds-theme"
import {Select} from "@qualcomm-ui/react/select"
import {Switch} from "@qualcomm-ui/react/switch"
import {Tooltip} from "@qualcomm-ui/react/tooltip"
import {ListCollection} from "@qualcomm-ui/utils/collection"

import {useGlobalConfigContext} from "./global-config-context"

const themeOptCollection = new ListCollection<{id: QdsBrand; label: string}>({
  itemLabel: (item) => item.label,
  items: [
    {id: "qualcomm", label: "Qualcomm"},
    {id: "snapdragon", label: "Snapdragon"},
    {id: "dragonwing", label: "Dragonwing"},
  ],
  itemValue: (item) => item.id,
})

export function GlobalConfig(): ReactElement {
  const {hideDemoBrandSwitcher, setHideDemoBrandSwitcher} =
    useGlobalConfigContext()
  const {brand, setBrand} = useQdsThemeContext()

  return (
    <Popover
      label="Global Config"
      trigger={
        <HeaderBar.ActionIconButton
          aria-label="Configure global settings"
          icon={Settings}
        />
      }
    >
      <div className="flex flex-col gap-2">
        <Switch
          checked={!hideDemoBrandSwitcher}
          label={
            <div className="text-neutral-secondary flex items-center gap-1">
              <span>Show Brand Switcher</span>{" "}
              <Tooltip
                portalProps={{disabled: true}}
                trigger={<Icon icon={AlertCircle} size="xs" />}
              >
                Toggle whether the brand switcher shows above every demo
              </Tooltip>
            </div>
          }
          onCheckedChange={(prevState) => setHideDemoBrandSwitcher(!prevState)}
          size="sm"
        />

        <Select
          clearable={false}
          collection={themeOptCollection}
          contentProps={{style: {width: 124}}}
          label={
            <span className="flex items-center gap-1">
              <span>Demo Brand</span>

              <Tooltip
                portalProps={{disabled: true}}
                trigger={
                  <Icon className="inline-block" icon={AlertCircle} size="xs" />
                }
              >
                Change the brand applied to each demo component
              </Tooltip>
            </span>
          }
          onValueChange={(valueStrings, details) =>
            setBrand(details.items[0].id)
          }
          placeholder="Brand"
          portalProps={{disabled: true}}
          size="sm"
          value={[brand || "qualcomm"]}
        />
      </div>
    </Popover>
  )
}

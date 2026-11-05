// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {ChevronDown, ChevronUp} from "lucide-react"

import {useMenuContext} from "@qualcomm-ui/react-core/menu"
import {useNumberInputContext} from "@qualcomm-ui/react-core/number-input"
import {Portal} from "@qualcomm-ui/react-core/portal"
import type {IdProp} from "@qualcomm-ui/react-core/system"
import {Icon} from "@qualcomm-ui/react/icon"
import {Menu} from "@qualcomm-ui/react/menu"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsNumberInputContext} from "./qds-number-input-context.js"

export interface NumberInputUnitSelectProps extends IdProp {}

function NumberInputUnitSelectTriggerContent(): ReactElement {
  const menuContext = useMenuContext()

  return (
    <Icon
      data-number-input-part="chevron"
      icon={menuContext.open ? ChevronUp : ChevronDown}
      size="sm"
    />
  )
}

export function NumberInputUnitSelect({
  id,
}: NumberInputUnitSelectProps): ReactElement {
  const numberInputContext = useNumberInputContext()
  const qdsNumberInputContext = useQdsNumberInputContext()

  const unitOptions = numberInputContext.unitOptions ?? []
  const selectedValue = numberInputContext.unit

  const menuSize =
    qdsNumberInputContext.size === "lg" ? "md" : qdsNumberInputContext.size
  const selectedOption = unitOptions.find((opt) => opt.value === selectedValue)
  const displayLabel = selectedOption?.label ?? ""

  const buttonBindings = mergeProps(
    numberInputContext.getUnitSelectBindings(),
    qdsNumberInputContext.getUnitSelectBindings(),
  )

  const handleValueChange = (newValue: string) => {
    numberInputContext.setUnit(newValue)
  }

  return (
    <Menu.Root size={menuSize}>
      <Menu.Trigger id={id}>
        <button {...buttonBindings}>
          <span>{displayLabel}</span>
          <NumberInputUnitSelectTriggerContent />
        </button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.RadioItemGroup
              onValueChange={handleValueChange}
              value={selectedValue}
            >
              {unitOptions.map((option) => (
                <Menu.RadioItem key={option.value} value={option.value}>
                  <Menu.ItemLabel>
                    {option.displayText ?? option.label}
                  </Menu.ItemLabel>
                  <Menu.ItemIndicator />
                </Menu.RadioItem>
              ))}
            </Menu.RadioItemGroup>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}

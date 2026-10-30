// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactNode, useRef, useState} from "react"

import {AudioLines} from "lucide-react"

import {Icon} from "@qualcomm-ui/react/icon"
import {Switch} from "@qualcomm-ui/react/switch"

export function AccessibilityPanel(): ReactNode {
  const switchRef = useRef<HTMLInputElement>(null)
  const [checked, setChecked] = useState(true)
  const [focused, setFocused] = useState(false)

  return (
    <div className="border-neutral-01 bg-neutral-01 overflow-hidden rounded-lg border">
      <div
        className="flex min-h-14 items-center px-4 py-3"
        onBlur={() => setFocused(false)}
        onFocus={() => setFocused(true)}
      >
        <Switch
          checked={checked}
          hiddenInputProps={{ref: switchRef}}
          label="Notifications"
          onCheckedChange={setChecked}
        />
      </div>
      {/*
       * Simulated output for sighted users. Hidden from assistive tech so
       * screen reader users don't hear the announcement twice.
       */}
      <div
        aria-hidden
        className="border-neutral-01 bg-neutral-00 text-neutral-secondary flex min-h-12 items-center gap-3 border-t px-4 py-3"
      >
        {focused ? (
          <>
            <Icon icon={AudioLines} size="sm" />
            <span className="font-code-xs flex-1">
              &ldquo;Notifications, checkbox,{" "}
              {checked ? "checked" : "unchecked"}&rdquo;
            </span>
          </>
        ) : (
          <span className="font-body-sm">
            Focus the switch to see what a screen reader announces
          </span>
        )}
      </div>
    </div>
  )
}

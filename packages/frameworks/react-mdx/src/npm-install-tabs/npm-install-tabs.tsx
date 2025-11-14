// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {Tab, Tabs, type TabsRootProps} from "@qualcomm-ui/react/tabs"
import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"
import {
  type PackageManager,
  useMdxDocsContext,
} from "@qualcomm-ui/react-mdx/context"
import {ensureArray} from "@qualcomm-ui/utils/array"

/**
 * A simple component that provides an npm install command for each
 * available package manager. The selected package manager is saved to the docs
 * context.
 */
export interface NpmCommandTabsProps extends Omit<TabsRootProps, "children"> {
  /**
   * If true, the corresponding `dev` tag will be added to each install command.
   */
  dev?: boolean

  /**
   * The command
   */
  packages: string | string[]
}

export function NpmInstallTabs({
  dev,
  packages: packagesProp,
  ...props
}: NpmCommandTabsProps): ReactElement {
  const packages = ensureArray(packagesProp).join(" ")

  const {packageManager = "npm", setPackageManager} = useMdxDocsContext()

  const copyCommands = {
    npm: `npm i${dev ? " --save-dev" : ""} ${packages}`,
    pnpm: `pnpm add${dev ? " -D" : ""} ${packages}`,
    yarn: `yarn add${dev ? " -D" : ""} ${packages}`,
  }

  return (
    <Tabs.Root
      onValueChange={(value) => {
        setPackageManager?.(value as PackageManager)
      }}
      size="lg"
      value={packageManager}
      {...props}
    >
      <Tabs.List>
        <Tabs.Indicator />
        <Tab.Root value="pnpm">
          <Tab.Button>pnpm</Tab.Button>
        </Tab.Root>
        <Tab.Root value="npm">
          <Tab.Button>npm</Tab.Button>
        </Tab.Root>
        <Tab.Root value="yarn">
          <Tab.Button>yarn</Tab.Button>
        </Tab.Root>
      </Tabs.List>

      <Tabs.Panel className="npm-install-tabs__panel" value="pnpm">
        <CodeHighlight
          className="mdx"
          code={copyCommands.pnpm}
          disableCopy
          language="bash"
          preProps={{
            style: {borderTopLeftRadius: 0, borderTopRightRadius: 0},
          }}
        />
      </Tabs.Panel>

      <Tabs.Panel className="npm-install-tabs__panel" value="npm">
        <CodeHighlight
          className="mdx"
          code={copyCommands.npm}
          disableCopy
          language="bash"
          preProps={{
            style: {borderTopLeftRadius: 0, borderTopRightRadius: 0},
          }}
        />
      </Tabs.Panel>

      <Tabs.Panel className="npm-install-tabs__panel" value="yarn">
        <CodeHighlight
          className="mdx"
          code={copyCommands.yarn}
          disableCopy
          language="bash"
          preProps={{
            style: {borderTopLeftRadius: 0, borderTopRightRadius: 0},
          }}
        />
      </Tabs.Panel>
    </Tabs.Root>
  )
}

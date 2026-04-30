// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {describe, expect, it} from "vitest"

import {noButtonInHeaderBar} from "../../src/rules/no-button-in-header-bar"
import {applyAllFixesToFile, runRule} from "../helpers/run-rule"

describe("no-button-in-header-bar", () => {
  describe("direct case", () => {
    it("flags Button directly inside HeaderBar", () => {
      const {findings} = runRule(noButtonInHeaderBar, {
        "pages/dashboard.tsx": `
          import {Button} from "@qualcomm-ui/react/button"
          import {HeaderBar} from "@qualcomm-ui/react/header-bar"

          export const Dashboard = () => (
            <HeaderBar>
              <Button>Save</Button>
            </HeaderBar>
          )
        `,
      })
      expect(findings).toHaveLength(1)
      expect(findings[0].violation.ruleId).toBe("no-button-in-header-bar")
      expect(findings[0].violation.severity).toBe("error")
      expect(findings[0].violation.fixable).toBe(true)
    })

    it("flags Button inside HeaderBar.Root", () => {
      const {findings} = runRule(noButtonInHeaderBar, {
        "pages/dashboard.tsx": `
          import {Button} from "@qualcomm-ui/react/button"
          import {HeaderBar} from "@qualcomm-ui/react/header-bar"

          export const Dashboard = () => (
            <HeaderBar.Root>
              <Button>Save</Button>
            </HeaderBar.Root>
          )
        `,
      })
      expect(findings).toHaveLength(1)
    })

    it("flags Button nested more than one level deep", () => {
      const {findings} = runRule(noButtonInHeaderBar, {
        "pages/dashboard.tsx": `
          import {Button} from "@qualcomm-ui/react/button"
          import {HeaderBar} from "@qualcomm-ui/react/header-bar"

          export const Dashboard = () => (
            <HeaderBar>
              <div>
                <span>
                  <Button>Save</Button>
                </span>
              </div>
            </HeaderBar>
          )
        `,
      })
      expect(findings).toHaveLength(1)
    })

    it("flags aliased Button", () => {
      const {findings} = runRule(noButtonInHeaderBar, {
        "pages/dashboard.tsx": `
          import {Button as Btn} from "@qualcomm-ui/react/button"
          import {HeaderBar} from "@qualcomm-ui/react/header-bar"

          export const Dashboard = () => (
            <HeaderBar>
              <Btn>Save</Btn>
            </HeaderBar>
          )
        `,
      })
      expect(findings).toHaveLength(1)
    })

    it("flags Button inside namespaced HeaderBar import", () => {
      const {findings} = runRule(noButtonInHeaderBar, {
        "pages/dashboard.tsx": `
          import {Button} from "@qualcomm-ui/react/button"
          import * as QUI from "@qualcomm-ui/react/header-bar"

          export const Dashboard = () => (
            <QUI.HeaderBar>
              <Button>Save</Button>
            </QUI.HeaderBar>
          )
        `,
      })
      expect(findings).toHaveLength(1)
    })

    it("does not flag Button outside HeaderBar", () => {
      const {findings} = runRule(noButtonInHeaderBar, {
        "pages/dashboard.tsx": `
          import {Button} from "@qualcomm-ui/react/button"
          import {HeaderBar} from "@qualcomm-ui/react/header-bar"

          export const Dashboard = () => (
            <div>
              <HeaderBar>
                <span>Title</span>
              </HeaderBar>
              <Button>Save</Button>
            </div>
          )
        `,
      })
      expect(findings).toHaveLength(0)
    })

    it("does not flag Button from a non-QUI package", () => {
      const {findings} = runRule(noButtonInHeaderBar, {
        "pages/dashboard.tsx": `
          import {Button} from "some-other-lib"
          import {HeaderBar} from "@qualcomm-ui/react/header-bar"

          export const Dashboard = () => (
            <HeaderBar>
              <Button>Save</Button>
            </HeaderBar>
          )
        `,
      })
      expect(findings).toHaveLength(0)
    })

    it("does not flag when HeaderBar is from a non-QUI package", () => {
      const {findings} = runRule(noButtonInHeaderBar, {
        "pages/dashboard.tsx": `
          import {Button} from "@qualcomm-ui/react/button"
          import {HeaderBar} from "some-other-lib"

          export const Dashboard = () => (
            <HeaderBar>
              <Button>Save</Button>
            </HeaderBar>
          )
        `,
      })
      expect(findings).toHaveLength(0)
    })

    it("does not flag HeaderBar.ActionButton (the correct usage)", () => {
      const {findings} = runRule(noButtonInHeaderBar, {
        "pages/dashboard.tsx": `
          import {HeaderBar} from "@qualcomm-ui/react/header-bar"

          export const Dashboard = () => (
            <HeaderBar>
              <HeaderBar.ActionButton onClick={() => {}}>Save</HeaderBar.ActionButton>
            </HeaderBar>
          )
        `,
      })
      expect(findings).toHaveLength(0)
    })
  })

  describe("cross-file (wrapped) case", () => {
    it("flags Button inside a wrapper that renders HeaderBar", () => {
      const {findings} = runRule(noButtonInHeaderBar, {
        "components/app-header.tsx": `
          import {HeaderBar} from "@qualcomm-ui/react/header-bar"

          export function AppHeader({children}: {children?: React.ReactNode}) {
            return <HeaderBar>{children}</HeaderBar>
          }
        `,
        "pages/dashboard.tsx": `
          import {Button} from "@qualcomm-ui/react/button"
          import {AppHeader} from "../components/app-header"

          export const Dashboard = () => (
            <AppHeader>
              <Button>Save</Button>
            </AppHeader>
          )
        `,
      })
      expect(findings).toHaveLength(1)
      expect(findings[0].violation.file).toBe("/pages/dashboard.tsx")
    })

    it("resolves through a two-level wrapper chain", () => {
      const {findings} = runRule(noButtonInHeaderBar, {
        "components/inner.tsx": `
          import {HeaderBar} from "@qualcomm-ui/react/header-bar"
          export const Inner = ({children}: {children?: React.ReactNode}) =>
            <HeaderBar>{children}</HeaderBar>
        `,
        "components/outer.tsx": `
          import {Inner} from "./inner"
          export const Outer = ({children}: {children?: React.ReactNode}) =>
            <Inner>{children}</Inner>
        `,
        "pages/dashboard.tsx": `
          import {Button} from "@qualcomm-ui/react/button"
          import {Outer} from "../components/outer"
          export const Dashboard = () =>
            <Outer><Button>Save</Button></Outer>
        `,
      })
      expect(findings).toHaveLength(1)
    })

    it("does not flag when a wrapper's root is a non-HeaderBar element", () => {
      const {findings} = runRule(noButtonInHeaderBar, {
        "components/sidebar.tsx": `
          export function Sidebar({children}: {children?: React.ReactNode}) {
            return <aside>{children}</aside>
          }
        `,
        "pages/dashboard.tsx": `
          import {Button} from "@qualcomm-ui/react/button"
          import {Sidebar} from "../components/sidebar"
          export const Dashboard = () =>
            <Sidebar><Button>Save</Button></Sidebar>
        `,
      })
      expect(findings).toHaveLength(0)
    })

    it("does not flag when a wrapper has ambiguous (conditional) root", () => {
      const {findings} = runRule(noButtonInHeaderBar, {
        "components/maybe-header.tsx": `
          import {HeaderBar} from "@qualcomm-ui/react/header-bar"
          export function MaybeHeader({children, show}: {children?: React.ReactNode, show: boolean}) {
            if (show) return <HeaderBar>{children}</HeaderBar>
            return <div>{children}</div>
          }
        `,
        "pages/dashboard.tsx": `
          import {Button} from "@qualcomm-ui/react/button"
          import {MaybeHeader} from "../components/maybe-header"
          export const Dashboard = () =>
            <MaybeHeader show><Button>Save</Button></MaybeHeader>
        `,
      })
      expect(findings).toHaveLength(0)
    })
  })

  describe("codemod", () => {
    it("swaps <Button> for <HeaderBar.ActionButton> preserving children and attributes", () => {
      const before = `import {Button} from "@qualcomm-ui/react/button"
import {HeaderBar} from "@qualcomm-ui/react/header-bar"

export const Dashboard = () => (
  <HeaderBar>
    <Button onClick={handle} aria-label="Save changes">Save</Button>
  </HeaderBar>
)
`
      const after = applyAllFixesToFile(
        noButtonInHeaderBar,
        {"pages/dashboard.tsx": before},
        "pages/dashboard.tsx",
      )

      expect(after).toContain(
        `<HeaderBar.ActionButton onClick={handle} aria-label="Save changes">Save</HeaderBar.ActionButton>`,
      )
      expect(after).not.toContain(`<Button`)
    })

    it("swaps aliased Button tag names", () => {
      const before = `import {Button as Btn} from "@qualcomm-ui/react/button"
import {HeaderBar} from "@qualcomm-ui/react/header-bar"

export const Dashboard = () => (
  <HeaderBar>
    <Btn>Save</Btn>
  </HeaderBar>
)
`
      const after = applyAllFixesToFile(
        noButtonInHeaderBar,
        {"pages/dashboard.tsx": before},
        "pages/dashboard.tsx",
      )

      expect(after).toContain(
        `<HeaderBar.ActionButton>Save</HeaderBar.ActionButton>`,
      )
      expect(after).not.toContain(`<Btn>`)
    })

    it("swaps multiple violations in the same file", () => {
      const before = `import {Button} from "@qualcomm-ui/react/button"
import {HeaderBar} from "@qualcomm-ui/react/header-bar"

export const Dashboard = () => (
  <HeaderBar>
    <Button>Save</Button>
    <Button>Cancel</Button>
  </HeaderBar>
)
`
      const after = applyAllFixesToFile(
        noButtonInHeaderBar,
        {"pages/dashboard.tsx": before},
        "pages/dashboard.tsx",
      )

      const matches = after.match(/<HeaderBar\.ActionButton>/g) ?? []
      expect(matches).toHaveLength(2)
      expect(after).not.toContain(`<Button>`)
    })
  })
})

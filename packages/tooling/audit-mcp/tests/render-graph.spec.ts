// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {ModuleKind, Project, ScriptTarget} from "ts-morph"
import {describe, expect, it} from "vitest"

import {buildRenderGraph} from "../src/rules/render-graph"

function buildProjectWith(files: Record<string, string>): Project {
  const project = new Project({
    compilerOptions: {
      jsx: 2,
      module: ModuleKind.ESNext,
      strict: true,
      target: ScriptTarget.ES2022,
    },
    skipFileDependencyResolution: true,
    useInMemoryFileSystem: true,
  })
  for (const [path, source] of Object.entries(files)) {
    const normalized = path.startsWith("/") ? path : `/${path}`
    project.createSourceFile(normalized, source)
  }
  return project
}

describe("render graph", () => {
  it("resolves a direct-wrap function declaration to its QUI root", () => {
    const project = buildProjectWith({
      "app-header.tsx": `
        import {HeaderBar} from "@qualcomm-ui/react/header-bar"
        export function AppHeader({children}) {
          return <HeaderBar>{children}</HeaderBar>
        }
      `,
    })
    const graph = buildRenderGraph(project)
    expect(graph.resolveWrapper("AppHeader")).toBe("HeaderBar")
  })

  it("resolves arrow-function variable components", () => {
    const project = buildProjectWith({
      "app-header.tsx": `
        import {HeaderBar} from "@qualcomm-ui/react/header-bar"
        export const AppHeader = ({children}) => <HeaderBar>{children}</HeaderBar>
      `,
    })
    const graph = buildRenderGraph(project)
    expect(graph.resolveWrapper("AppHeader")).toBe("HeaderBar")
  })

  it("resolves through a multi-level wrapper chain", () => {
    const project = buildProjectWith({
      "inner.tsx": `
        import {HeaderBar} from "@qualcomm-ui/react/header-bar"
        export const Inner = ({children}) => <HeaderBar>{children}</HeaderBar>
      `,
      "outer.tsx": `
        import {Inner} from "./inner"
        export const Outer = ({children}) => <Inner>{children}</Inner>
      `,
    })
    const graph = buildRenderGraph(project)
    expect(graph.resolveWrapper("Outer")).toBe("HeaderBar")
  })

  it("returns null for wrappers with conditional roots", () => {
    const project = buildProjectWith({
      "maybe.tsx": `
        import {HeaderBar} from "@qualcomm-ui/react/header-bar"
        export function Maybe({children, show}) {
          if (show) return <HeaderBar>{children}</HeaderBar>
          return <div>{children}</div>
        }
      `,
    })
    const graph = buildRenderGraph(project)
    expect(graph.resolveWrapper("Maybe")).toBeNull()
  })

  it("returns null for unknown wrapper names", () => {
    const graph = buildRenderGraph(buildProjectWith({}))
    expect(graph.resolveWrapper("DoesNotExist")).toBeNull()
  })

  it("returns null for wrappers whose root is an intrinsic element", () => {
    const project = buildProjectWith({
      "sidebar.tsx": `
        export function Sidebar({children}) {
          return <aside>{children}</aside>
        }
      `,
    })
    const graph = buildRenderGraph(project)
    expect(graph.resolveWrapper("Sidebar")).toBeNull()
  })

  it("ignores non-component functions (lowercase names)", () => {
    const project = buildProjectWith({
      "util.tsx": `
        export function helper() { return <div /> }
      `,
    })
    const graph = buildRenderGraph(project)
    expect(graph.resolveWrapper("helper")).toBeNull()
  })

  it("breaks cycles safely", () => {
    const project = buildProjectWith({
      "a.tsx": `
        import {B} from "./b"
        export const A = ({children}) => <B>{children}</B>
      `,
      "b.tsx": `
        import {A} from "./a"
        export const B = ({children}) => <A>{children}</A>
      `,
    })
    const graph = buildRenderGraph(project)
    expect(graph.resolveWrapper("A")).toBeNull()
    expect(graph.resolveWrapper("B")).toBeNull()
  })
})

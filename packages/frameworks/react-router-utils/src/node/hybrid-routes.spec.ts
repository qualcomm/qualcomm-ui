// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {mkdir, mkdtemp, rm, writeFile} from "node:fs/promises"
import {tmpdir} from "node:os"
import {dirname, join} from "node:path"
import {afterEach, describe, expect, test} from "vitest"

import {
  type ConfigRoute,
  type DefineRouteFunction,
  type DefineRoutesFunction,
  hybridRoutes,
  type RouteManifest,
} from "./hybrid-routes.js"

let tempDir: string | undefined

afterEach(async () => {
  if (tempDir) {
    await rm(tempDir, {force: true, recursive: true})
    tempDir = undefined
  }
})

describe("hybridRoutes", () => {
  describe("default strategy", () => {
    test.each([
      {
        expected: {parentId: "root", path: "privacy"},
        name: "creates a normal route from a filename",
        routeFiles: ["privacy.jsx"],
        routeId: "routes/privacy",
      },
      {
        expected: {parentId: "root", path: "pages/tos"},
        name: "creates URL segments from dots without a layout route",
        routeFiles: ["pages.tos.jsx"],
        routeId: "routes/pages.tos",
      },
      {
        expected: {parentId: "root", path: "about"},
        name: "creates a parent layout route from a filename",
        routeFiles: ["about.jsx"],
        routeId: "routes/about",
      },
      {
        expected: {parentId: "routes/about", path: "contact"},
        name: "nests a dotted route under its matching layout",
        routeFiles: ["about.jsx", "about.contact.jsx"],
        routeId: "routes/about.contact",
      },
      {
        expected: {index: true, parentId: "routes/about", path: ""},
        name: "creates an index route from an index filename",
        routeFiles: ["about.jsx", "about.index.jsx"],
        routeId: "routes/about.index",
      },
      {
        expected: {index: true, parentId: "routes/about", path: ""},
        name: "supports _index as an index route alias",
        routeFiles: ["about.jsx", "about._index.jsx"],
        routeId: "routes/about._index",
      },
      {
        expected: {parentId: "root", path: "about/company"},
        name: "uses a trailing underscore to bypass a parent layout",
        routeFiles: ["about.jsx", "about_.company.jsx"],
        routeId: "routes/about_.company",
      },
      {
        expected: {parentId: "root", path: "app/projects/:id/roadmap"},
        name: "uses a trailing underscore to bypass a parent layout in a deep route",
        routeFiles: ["app.jsx", "app_.projects.$id.roadmap.tsx"],
        routeId: "routes/app_.projects.$id.roadmap",
      },
      {
        expected: {parentId: "root", path: ""},
        name: "creates a pathless layout from a leading underscore",
        routeFiles: ["_auth.jsx"],
        routeId: "routes/_auth",
      },
      {
        expected: {parentId: "routes/_auth", path: "login"},
        name: "nests a route under a pathless layout",
        routeFiles: ["_auth.jsx", "_auth.login.jsx"],
        routeId: "routes/_auth.login",
      },
      {
        expected: {parentId: "root", path: "users/:userId"},
        name: "creates a dynamic parameter from a leading dollar sign",
        routeFiles: ["users.$userId.jsx"],
        routeId: "routes/users.$userId",
      },
      {
        expected: {parentId: "root", path: "docs/*"},
        name: "creates a splat route from a bare dollar sign",
        routeFiles: ["docs.$.jsx"],
        routeId: "routes/docs.$",
      },
      {
        expected: {parentId: "root", path: "reports/archive?"},
        name: "creates an optional static segment from parentheses",
        routeFiles: ["reports.(archive).jsx"],
        routeId: "routes/reports.(archive)",
      },
      {
        expected: {parentId: "root", path: "reports/:year?"},
        name: "creates an optional dynamic segment from parentheses",
        routeFiles: ["reports.($year).jsx"],
        routeId: "routes/reports.($year)",
      },
      {
        expected: {parentId: "root", path: "dashboard"},
        name: "omits the route suffix from the URL",
        routeFiles: ["dashboard.route.jsx"],
        routeId: "routes/dashboard.route",
      },
    ])("$name", async ({expected, routeFiles, routeId}) => {
      const appDir = await createAppRoutes(routeFiles)

      const routes = hybridRoutes("routes", createDefineRoutes(), {
        appDir,
      })

      expect(routes[routeId]).toMatchObject(expected)
    })
  })

  describe("react-router-directory-groups strategy", () => {
    test.each([
      {
        expected: {parentId: "root", path: "privacy"},
        name: "creates a normal route from a filename",
        routeFiles: ["privacy.jsx"],
        routeId: "routes/privacy",
      },
      {
        expected: {parentId: "root", path: "pages/tos"},
        name: "creates URL segments from dots without a layout route",
        routeFiles: ["pages.tos.jsx"],
        routeId: "routes/pages.tos",
      },
      {
        expected: {parentId: "root", path: "about"},
        name: "creates a parent layout route from a filename",
        routeFiles: ["about.jsx"],
        routeId: "routes/about",
      },
      {
        expected: {parentId: "routes/about", path: "contact"},
        name: "nests a dotted route under its matching layout",
        routeFiles: ["about.jsx", "about.contact.jsx"],
        routeId: "routes/about.contact",
      },
      {
        expected: {index: true, parentId: "routes/about", path: ""},
        name: "creates an index route from an index filename",
        routeFiles: ["about.jsx", "about.index.jsx"],
        routeId: "routes/about.index",
      },
      {
        expected: {index: true, parentId: "routes/about", path: ""},
        name: "supports _index as an index route alias",
        routeFiles: ["about.jsx", "about._index.jsx"],
        routeId: "routes/about._index",
      },
      {
        expected: {parentId: "root", path: "about/company"},
        name: "uses a trailing underscore to bypass a parent layout",
        routeFiles: ["about.jsx", "about_.company.jsx"],
        routeId: "routes/about_.company",
      },
      {
        expected: {parentId: "root", path: "app/projects/:id/roadmap"},
        name: "uses a trailing underscore to bypass a parent layout in a deep route",
        routeFiles: ["app.jsx", "app_.projects.$id.roadmap.tsx"],
        routeId: "routes/app_.projects.$id.roadmap",
      },
      {
        expected: {parentId: "root", path: ""},
        name: "creates a pathless layout from a leading underscore",
        routeFiles: ["_auth.jsx"],
        routeId: "routes/_auth",
      },
      {
        expected: {parentId: "routes/_auth", path: "login"},
        name: "nests a route under a pathless layout",
        routeFiles: ["_auth.jsx", "_auth.login.jsx"],
        routeId: "routes/_auth.login",
      },
      {
        expected: {parentId: "root", path: "users/:userId"},
        name: "creates a dynamic parameter from a leading dollar sign",
        routeFiles: ["users.$userId.jsx"],
        routeId: "routes/users.$userId",
      },
      {
        expected: {parentId: "root", path: "docs/*"},
        name: "creates a splat route from a bare dollar sign",
        routeFiles: ["docs.$.jsx"],
        routeId: "routes/docs.$",
      },
      {
        expected: {parentId: "root", path: "reports/archive?"},
        name: "creates an optional static segment from parentheses",
        routeFiles: ["reports.(archive).jsx"],
        routeId: "routes/reports.(archive)",
      },
      {
        expected: {parentId: "root", path: "reports/:year?"},
        name: "creates an optional dynamic segment from parentheses",
        routeFiles: ["reports.($year).jsx"],
        routeId: "routes/reports.($year)",
      },
      {
        expected: {parentId: "root", path: "dashboard"},
        name: "omits the route suffix from the URL",
        routeFiles: ["dashboard.route.jsx"],
        routeId: "routes/dashboard.route",
      },
    ])("$name", async ({expected, routeFiles, routeId}) => {
      const appDir = await createAppRoutes(routeFiles)

      const routes = hybridRoutes("routes", createDefineRoutes(), {
        appDir,
        routingStrategy: "react-router-directory-groups",
      })

      expect(routes[routeId]).toMatchObject(expected)
    })
  })

  test("plus route groups discover plus folders and route files", async () => {
    const appDir = await createAppRoutes([
      "_index.mdx",
      "api/page-frontmatter.mdx",
      "api/page-frontmatter.route.mdx",
      "guide+/route.mdx",
      "guide+/markdown.ts",
      "guide+/advanced+/deep-topic.ts",
      "plain/ignored.ts",
    ])

    const routes = hybridRoutes("routes", createDefineRoutes(), {
      appDir,
    })

    expect(Object.keys(routes).sort()).toEqual([
      "routes/_index",
      "routes/api/page-frontmatter.route",
      "routes/guide+/advanced+/deep-topic",
      "routes/guide+/markdown",
      "routes/guide+/route",
    ])
    expect(routes["routes/guide+/route"]).toMatchObject({
      file: "routes/guide+/route.mdx",
      parentId: "root",
      path: "guide",
    })
    expect(routes["routes/guide+/markdown"]).toMatchObject({
      file: "routes/guide+/markdown.ts",
      parentId: "routes/guide+/route",
      path: "markdown",
    })
    expect(routes["routes/guide+/advanced+/deep-topic"]).toMatchObject({
      file: "routes/guide+/advanced+/deep-topic.ts",
      parentId: "routes/guide+/route",
      path: "advanced/deep-topic",
    })
    expect(routes["routes/api/page-frontmatter.route"]).toMatchObject({
      file: "routes/api/page-frontmatter.route.mdx",
      parentId: "root",
      path: "api/page-frontmatter",
    })
  })

  test("directory groups discover route files in plain folders", async () => {
    const appDir = await createAppRoutes(["api/page-frontmatter.mdx"])

    const routes = hybridRoutes("routes", createDefineRoutes(), {
      appDir,
      routingStrategy: "react-router-directory-groups",
    })

    expect(routes["routes/api/page-frontmatter"]).toMatchObject({
      file: "routes/api/page-frontmatter.mdx",
      parentId: "root",
      path: "api/page-frontmatter",
    })
  })

  test("directory groups nest route files under a plain-folder layout", async () => {
    const appDir = await createAppRoutes([
      "guide/route.mdx",
      "guide/markdown.ts",
    ])

    const routes = hybridRoutes("routes", createDefineRoutes(), {
      appDir,
      routingStrategy: "react-router-directory-groups",
    })

    expect(routes["routes/guide/markdown"]).toMatchObject({
      file: "routes/guide/markdown.ts",
      parentId: "routes/guide/route",
      path: "markdown",
    })
  })

  test("directory groups preserve deeper URL segments under the nearest layout", async () => {
    const appDir = await createAppRoutes([
      "guide/route.mdx",
      "guide/advanced/deep-topic.ts",
    ])

    const routes = hybridRoutes("routes", createDefineRoutes(), {
      appDir,
      routingStrategy: "react-router-directory-groups",
    })

    expect(routes["routes/guide/advanced/deep-topic"]).toMatchObject({
      file: "routes/guide/advanced/deep-topic.ts",
      parentId: "routes/guide/route",
      path: "advanced/deep-topic",
    })
  })

  test("directory groups exclude route files in private folders", async () => {
    const appDir = await createAppRoutes(["guide/_demos/ignored.mdx"])

    const routes = hybridRoutes("routes", createDefineRoutes(), {
      appDir,
      routingStrategy: "react-router-directory-groups",
    })

    expect(routes).toEqual({})
  })

  test("directory groups keep plus folders that start with an underscore", async () => {
    const appDir = await createAppRoutes(["_public+/login.ts"])

    const routes = hybridRoutes("routes", createDefineRoutes(), {
      appDir,
      routingStrategy: "react-router-directory-groups",
    })

    expect(routes["routes/_public+/login"]).toMatchObject({
      file: "routes/_public+/login.ts",
      parentId: "root",
      path: "login",
    })
  })
})

async function createAppRoutes(routeFiles: string[]): Promise<string> {
  tempDir = await mkdtemp(join(tmpdir(), "hybrid-routes-test-"))
  const routesDir = join(tempDir, "routes")

  for (const routeFile of routeFiles) {
    const filePath = join(routesDir, routeFile)
    await mkdir(dirname(filePath), {recursive: true})
    await writeFile(filePath, "", "utf-8")
  }

  return tempDir
}

function createDefineRoutes(): DefineRoutesFunction {
  return (callback) => {
    const routes: RouteManifest = {}
    const parentIds: string[] = []

    const defineRoute: DefineRouteFunction = (
      path,
      file,
      optionsOrChildren,
      children,
    ) => {
      const id = file.replace(/\.[^/.]+$/, "")
      const route: ConfigRoute = {file, id}
      const parentId = parentIds.at(-1)
      const options =
        typeof optionsOrChildren === "function" ? undefined : optionsOrChildren
      const childRoutes =
        typeof optionsOrChildren === "function" ? optionsOrChildren : children

      if (path !== undefined) {
        route.path = path
      }
      if (options?.index) {
        route.index = true
      }
      if (parentId) {
        route.parentId = parentId
      }

      routes[id] = route

      if (childRoutes) {
        parentIds.push(id)
        childRoutes()
        parentIds.pop()
      }
    }

    callback(defineRoute)

    return routes
  }
}

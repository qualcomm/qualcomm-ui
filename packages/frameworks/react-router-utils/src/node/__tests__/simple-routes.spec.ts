// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {mkdirSync, rmSync, writeFileSync} from "node:fs"
import {join} from "node:path"
import {afterEach, beforeEach, describe, expect, test} from "vitest"

import {
  type RouteConfig,
  type SimpleRouteManifest,
  simpleRoutes,
} from "../simple-routes"

const FIXTURES_DIR = join(__dirname, "fixtures")
const APP_DIR = join(FIXTURES_DIR, "app")
const ROUTES_DIR = join(APP_DIR, "routes")

function createRouteFile(path: string): void {
  const fullPath = join(ROUTES_DIR, path)
  const dir = fullPath.substring(0, fullPath.lastIndexOf("/"))
  mkdirSync(dir, {recursive: true})
  writeFileSync(fullPath, `export default function() { return null }`)
}

function normalizeRouteId(file: string): string {
  let id = file.replace(/\.[^/.]+$/, "")
  // Normalize route.tsx to folder ID
  id = id.replace(/\/route$/, "")
  // Handle _folder.tsx pattern (e.g., routes/about/_about -> routes/about)
  const match = id.match(/^(.+\/([^/]+))\/_\2$/)
  if (match) {
    id = match[1]
  }
  return id
}

function mockDefineRoutes(
  callback: (
    route: (
      path: string | undefined,
      file: string,
      optionsOrChildren?: {index?: boolean} | (() => void),
      children?: () => void,
    ) => void,
  ) => void,
): SimpleRouteManifest {
  const routes: SimpleRouteManifest = {}
  const parentStack: string[] = []

  function defineRoute(
    path: string | undefined,
    file: string,
    optionsOrChildren?: {index?: boolean} | (() => void),
    children?: () => void,
  ): void {
    const isIndex =
      typeof optionsOrChildren === "object" && optionsOrChildren?.index
    const childrenFn =
      typeof optionsOrChildren === "function" ? optionsOrChildren : children

    const id = normalizeRouteId(file)
    const parentId = parentStack[parentStack.length - 1]

    const route: RouteConfig = {
      file,
      id,
      parentId,
      path: path || undefined,
    }

    if (isIndex) {
      route.index = true
    }

    routes[id] = route

    if (childrenFn) {
      parentStack.push(id)
      childrenFn()
      parentStack.pop()
    }
  }

  callback(defineRoute)
  return routes
}

describe("simpleRoutes", () => {
  beforeEach(() => {
    rmSync(ROUTES_DIR, {force: true, recursive: true})
    mkdirSync(ROUTES_DIR, {recursive: true})
  })

  afterEach(() => {
    rmSync(ROUTES_DIR, {force: true, recursive: true})
  })

  describe("basic routes", () => {
    test("creates index route from index.tsx", () => {
      createRouteFile("index.tsx")

      const routes = simpleRoutes("routes", mockDefineRoutes, {
        appDir: APP_DIR,
      })

      expect(routes["routes/index"]).toBeDefined()
      expect(routes["routes/index"].index).toBe(true)
      // Index routes have undefined path since they use the parent path
      expect(routes["routes/index"].path).toBeUndefined()
    })

    test("creates simple route from about.tsx", () => {
      createRouteFile("about.tsx")

      const routes = simpleRoutes("routes", mockDefineRoutes, {
        appDir: APP_DIR,
      })

      expect(routes["routes/about"]).toBeDefined()
      expect(routes["routes/about"].path).toBe("about")
    })

    test("creates route from folder with route.tsx", () => {
      createRouteFile("account/route.tsx")

      const routes = simpleRoutes("routes", mockDefineRoutes, {
        appDir: APP_DIR,
      })

      expect(routes["routes/account"]).toBeDefined()
      expect(routes["routes/account"].path).toBe("account")
    })

    test("creates route from folder with _folder.tsx", () => {
      createRouteFile("about/_about.tsx")

      const routes = simpleRoutes("routes", mockDefineRoutes, {
        appDir: APP_DIR,
      })

      expect(routes["routes/about"]).toBeDefined()
      expect(routes["routes/about"].path).toBe("about")
    })
  })

  describe("nested routes", () => {
    test("creates nested routes with layout", () => {
      createRouteFile("posts.tsx")
      createRouteFile("posts/index.tsx")
      createRouteFile("posts/recent.tsx")

      const routes = simpleRoutes("routes", mockDefineRoutes, {
        appDir: APP_DIR,
      })

      expect(routes["routes/posts"]).toBeDefined()
      expect(routes["routes/posts/index"]).toBeDefined()
      expect(routes["routes/posts/index"].index).toBe(true)
      expect(routes["routes/posts/index"].parentId).toBe("routes/posts")
      expect(routes["routes/posts/recent"]).toBeDefined()
      expect(routes["routes/posts/recent"].parentId).toBe("routes/posts")
    })

    test("creates deeply nested routes", () => {
      createRouteFile("settings/profile/index.tsx")
      createRouteFile("settings/profile/avatar.tsx")

      const routes = simpleRoutes("routes", mockDefineRoutes, {
        appDir: APP_DIR,
      })

      expect(routes["routes/settings/profile/index"]).toBeDefined()
      expect(routes["routes/settings/profile/avatar"]).toBeDefined()
    })
  })

  describe("dynamic params", () => {
    test("creates dynamic route with $param", () => {
      createRouteFile("posts/$postId.tsx")

      const routes = simpleRoutes("routes", mockDefineRoutes, {
        appDir: APP_DIR,
      })

      expect(routes["routes/posts/$postId"]).toBeDefined()
      expect(routes["routes/posts/$postId"].path).toBe(":postId")
    })

    test("creates nested dynamic routes", () => {
      createRouteFile("users/$userId/posts/$postId.tsx")

      const routes = simpleRoutes("routes", mockDefineRoutes, {
        appDir: APP_DIR,
      })

      expect(routes["routes/users/$userId/posts/$postId"]).toBeDefined()
    })

    test("creates dynamic route in folder", () => {
      createRouteFile("posts/$postId/index.tsx")
      createRouteFile("posts/$postId/comments.tsx")

      const routes = simpleRoutes("routes", mockDefineRoutes, {
        appDir: APP_DIR,
      })

      expect(routes["routes/posts/$postId/index"]).toBeDefined()
      expect(routes["routes/posts/$postId/comments"]).toBeDefined()
    })
  })

  describe("splat routes", () => {
    test("creates splat route with $.tsx", () => {
      createRouteFile("files/$.tsx")

      const routes = simpleRoutes("routes", mockDefineRoutes, {
        appDir: APP_DIR,
      })

      expect(routes["routes/files/$"]).toBeDefined()
      expect(routes["routes/files/$"].path).toBe("*")
    })
  })

  describe("pathless layouts", () => {
    test("creates pathless layout with _ prefix", () => {
      createRouteFile("_auth.tsx")
      createRouteFile("_auth/login.tsx")
      createRouteFile("_auth/register.tsx")

      const routes = simpleRoutes("routes", mockDefineRoutes, {
        appDir: APP_DIR,
      })

      expect(routes["routes/_auth"]).toBeDefined()
      // Pathless layouts have undefined path
      expect(routes["routes/_auth"].path).toBeUndefined()
      expect(routes["routes/_auth/login"]).toBeDefined()
      expect(routes["routes/_auth/login"].path).toBe("login")
      expect(routes["routes/_auth/login"].parentId).toBe("routes/_auth")
    })
  })

  describe("layout escaping", () => {
    test("escapes layout with trailing _", () => {
      createRouteFile("posts.tsx")
      createRouteFile("posts/index.tsx")
      createRouteFile("posts_/$postId/edit.tsx")

      const routes = simpleRoutes("routes", mockDefineRoutes, {
        appDir: APP_DIR,
      })

      expect(routes["routes/posts"]).toBeDefined()
      expect(routes["routes/posts/index"]).toBeDefined()
      expect(routes["routes/posts_/$postId/edit"]).toBeDefined()
      // The escaped route should NOT have posts as parent
      expect(routes["routes/posts_/$postId/edit"].parentId).not.toBe(
        "routes/posts",
      )
    })
  })

  describe("optional segments", () => {
    test("creates optional segment with (segment)", () => {
      createRouteFile("docs/(lang).tsx")

      const routes = simpleRoutes("routes", mockDefineRoutes, {
        appDir: APP_DIR,
      })

      expect(routes["routes/docs/(lang)"]).toBeDefined()
      expect(routes["routes/docs/(lang)"].path).toBe("lang?")
    })

    test("creates optional param with ($param)", () => {
      createRouteFile("users/($userId).tsx")

      const routes = simpleRoutes("routes", mockDefineRoutes, {
        appDir: APP_DIR,
      })

      expect(routes["routes/users/($userId)"]).toBeDefined()
      expect(routes["routes/users/($userId)"].path).toBe(":userId?")
    })
  })

  describe("file filtering", () => {
    test("ignores .server files", () => {
      createRouteFile("about.tsx")
      createRouteFile("about.server.tsx")

      const routes = simpleRoutes("routes", mockDefineRoutes, {
        appDir: APP_DIR,
      })

      expect(routes["routes/about"]).toBeDefined()
      expect(routes["routes/about.server"]).toBeUndefined()
    })

    test("ignores .client files", () => {
      createRouteFile("about.tsx")
      createRouteFile("about.client.tsx")

      const routes = simpleRoutes("routes", mockDefineRoutes, {
        appDir: APP_DIR,
      })

      expect(routes["routes/about"]).toBeDefined()
      expect(routes["routes/about.client"]).toBeUndefined()
    })

    test("respects ignoredFiles option", () => {
      createRouteFile("about.tsx")
      createRouteFile("__tests__/test.tsx")

      const routes = simpleRoutes("routes", mockDefineRoutes, {
        appDir: APP_DIR,
        ignoredFiles: ["__tests__"],
      })

      expect(routes["routes/about"]).toBeDefined()
      expect(routes["routes/__tests__/test"]).toBeUndefined()
    })
  })

  describe("root parentId", () => {
    test("sets parentId to root for top-level routes", () => {
      createRouteFile("about.tsx")
      createRouteFile("contact.tsx")

      const routes = simpleRoutes("routes", mockDefineRoutes, {
        appDir: APP_DIR,
      })

      expect(routes["routes/about"].parentId).toBe("root")
      expect(routes["routes/contact"].parentId).toBe("root")
    })
  })
})

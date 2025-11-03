import {ESLintUtils} from "@typescript-eslint/utils"
import {existsSync, readFileSync} from "node:fs"
import {dirname, join, parse, posix, resolve as resolvePath} from "node:path"
import ts from "typescript"

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://example.com/rule/${name}`,
)

const tsconfigCache = new Map()

function toPosixPath(path) {
  return posix.normalize(path.replace(/\\/g, "/"))
}

function readTsconfig(tsconfigPath) {
  if (tsconfigCache.has(tsconfigPath)) {
    return tsconfigCache.get(tsconfigPath)
  }
  const {config, error} = ts.readConfigFile(tsconfigPath, (filename) =>
    readFileSync(filename, "utf8"),
  )
  const result = error ? null : config
  tsconfigCache.set(tsconfigPath, result)
  return result
}

function findTsconfig(startPath) {
  let currentDir = dirname(startPath)
  while (parse(currentDir).root !== currentDir) {
    const tsconfigPath = join(currentDir, "tsconfig.json")
    if (existsSync(tsconfigPath)) {
      return tsconfigPath
    }
    currentDir = dirname(currentDir)
  }
  return null
}

function parsePathAliases(tsconfig, tsconfigDir) {
  const paths =
    (tsconfig.compilerOptions && tsconfig.compilerOptions.paths) || {}
  return Object.entries(paths).flatMap(([pattern, mappings]) =>
    (Array.isArray(mappings) ? mappings : [mappings]).map((mapping) => {
      if (pattern.includes("*")) {
        const rootPath = mapping.split("*")[0]
        const absoluteRoot = toPosixPath(resolvePath(tsconfigDir, rootPath))
        return {
          isWildcard: true,
          mapping,
          pattern,
          rootDir: absoluteRoot.endsWith("/")
            ? absoluteRoot
            : `${absoluteRoot}/`,
        }
      } else {
        const mappedFile = toPosixPath(resolvePath(tsconfigDir, mapping))
        const mappedDir = dirname(mappedFile)
        return {
          isWildcard: false,
          mappedFile,
          mapping,
          pattern,
          rootDir: mappedDir.endsWith("/") ? mappedDir : `${mappedDir}/`,
        }
      }
    }),
  )
}

function findAliasRoot(absolutePath, aliases) {
  for (const alias of aliases) {
    if (alias.isWildcard) {
      if (absolutePath.startsWith(alias.rootDir)) {
        return alias
      }
    } else {
      if (
        absolutePath === alias.rootDir.slice(0, -1) ||
        absolutePath === alias.mappedFile ||
        absolutePath.startsWith(alias.rootDir)
      ) {
        return alias
      }
    }
  }
  return null
}

function generateAlias(absolutePath, aliases) {
  for (const alias of aliases) {
    if (alias.isWildcard) {
      if (absolutePath.startsWith(alias.rootDir)) {
        const relativePath = absolutePath.slice(alias.rootDir.length)
        let pathWithoutExtension = relativePath.replace(/\.[^.]+$/, "")
        if (
          alias.mapping.endsWith("/index.ts") &&
          pathWithoutExtension.endsWith("/index")
        ) {
          pathWithoutExtension = pathWithoutExtension.slice(0, -6)
        }
        if (!pathWithoutExtension.includes("/")) {
          const [prefix, suffix] = alias.pattern.split("*")
          return prefix + pathWithoutExtension + suffix
        }
      }
    } else {
      if (
        absolutePath === alias.rootDir.slice(0, -1) ||
        absolutePath === alias.mappedFile
      ) {
        return alias.pattern
      }
    }
  }
  return null
}

function getModuleInfo(filePath, rootDir) {
  const relative = filePath.slice(rootDir.length)
  const segments = relative.split("/").filter(Boolean)
  const dirSegments = segments.slice(0, -1)
  const isRootFile = segments.length === 1 && segments[0].includes(".")
  const isModuleDir = segments.length === 1 && !segments[0].includes(".")
  const module =
    segments.length > 1 ? segments[0] : isModuleDir ? segments[0] : null
  return {
    dirPath: dirSegments.join("/"),
    isRootFile,
    module,
    segments,
  }
}

function canUseRelativeImport(currentInfo, targetInfo) {
  if (currentInfo.dirPath === targetInfo.dirPath) {
    return true
  }
  if (currentInfo.isRootFile && targetInfo.isRootFile) {
    return true
  }
  if (currentInfo.module && targetInfo.module) {
    return currentInfo.module === targetInfo.module
  }
  return false
}

export const importFromTsconfigPaths = createRule({
  create(context) {
    const fileName = context.getFilename()
    const tsconfigPath = findTsconfig(fileName)
    if (!tsconfigPath) {
      return {}
    }
    const tsconfig = readTsconfig(tsconfigPath)
    if (!tsconfig) {
      return {}
    }

    const aliases = parsePathAliases(tsconfig, dirname(tsconfigPath))
    const currentFilePath = toPosixPath(resolvePath(fileName))

    function checkImport(importPath, node) {
      if (!importPath.startsWith(".")) {
        return
      }
      const absoluteTarget = toPosixPath(
        resolvePath(dirname(fileName), importPath),
      )
      const currentAliasRoot = findAliasRoot(currentFilePath, aliases)
      if (!currentAliasRoot) {
        return
      }
      const suggestedAlias = generateAlias(absoluteTarget, aliases)
      const targetAliasRoot = findAliasRoot(absoluteTarget, aliases)

      if (
        currentAliasRoot &&
        targetAliasRoot &&
        currentAliasRoot.rootDir === targetAliasRoot.rootDir
      ) {
        const bothCouldBeWildcard = aliases.some(
          (a) => a.isWildcard && a.rootDir === currentAliasRoot.rootDir,
        )
        if (bothCouldBeWildcard) {
          const currentInfo = getModuleInfo(
            currentFilePath,
            currentAliasRoot.rootDir,
          )
          const targetInfo = getModuleInfo(
            absoluteTarget,
            targetAliasRoot.rootDir,
          )
          if (canUseRelativeImport(currentInfo, targetInfo)) {
            return
          }
        } else if (!currentAliasRoot.isWildcard) {
          const currentDir = `${toPosixPath(dirname(currentFilePath))}/`
          const targetDir = `${toPosixPath(dirname(absoluteTarget))}/`
          const currentRelative = currentDir.slice(
            currentAliasRoot.rootDir.length,
          )
          const targetRelative = targetDir.slice(targetAliasRoot.rootDir.length)
          const sameDirectory = currentRelative === targetRelative
          const targetIsAncestor =
            targetRelative.length > 0 &&
            currentRelative.startsWith(targetRelative)
          const currentIsAncestor =
            currentRelative.length > 0 &&
            targetRelative.startsWith(currentRelative)
          if (sameDirectory || targetIsAncestor || currentIsAncestor) {
            return
          }
        }
      }
      context.report({
        data: {importPath},
        fix: suggestedAlias
          ? (fixer) => {
              const quote = node.raw?.startsWith('"') ? '"' : "'"
              return fixer.replaceText(
                node,
                `${quote}${suggestedAlias}${quote}`,
              )
            }
          : undefined,
        messageId: "externalRelative",
        node,
      })
    }
    return {
      ExportAllDeclaration(node) {
        if (node.source) {
          checkImport(String(node.source.value), node.source)
        }
      },
      ExportNamedDeclaration(node) {
        if (node.source) {
          checkImport(String(node.source.value), node.source)
        }
      },
      ImportDeclaration(node) {
        checkImport(String(node.source.value), node.source)
      },
      ImportExpression(node) {
        if (node.source.type === "Literal") {
          checkImport(String(node.source.value), node.source)
        }
      },
    }
  },
  defaultOptions: [],
  meta: {
    docs: {
      description:
        "Enforces TS path aliases; offers fixes for illegal relative imports.",
    },
    fixable: "code",
    messages: {
      externalRelative:
        'relative import "{{importPath}}" leaves the module defined by a path alias',
    },
    schema: [],
    type: "problem",
  },
  name: "valid-path-alias",
})

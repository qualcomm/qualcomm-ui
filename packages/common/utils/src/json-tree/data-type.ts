// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import {getPreviewOptions, keyPathToKey} from "./node-conversion"
import {getProp, isObj, typeOf} from "./shared"
import type {
  JsonDataTypeOptions,
  JsonNode,
  JsonNodeElement,
  JsonNodeHastElement,
  JsonNodePreviewOptions,
  JsonNodeText,
  JsonNodeType,
} from "./types"

// /////////////////////////////////////////////////////////////////////////////////////////

const generatePreviewText = (items: string[], hasMore: boolean): string => {
  return ` ${items.join(", ")}${hasMore ? ", … " : " "}`
}

const ENTRIES_KEY = "[[Entries]]"

// Helper functions for creating hast-compatible nodes
const txt = (
  value: string | number | boolean | null | undefined,
): JsonNodeText => ({
  type: "text",
  value,
})

const jsx = (
  tagName: "span" | "div" | "a",
  properties: JsonNodeElement["properties"] = {},
  children: Array<JsonNodeElement | JsonNodeText> = [],
): JsonNodeElement => ({
  children,
  properties,
  tagName,
  type: "element",
})

const formatValueMini = (child: JsonNode): string => {
  if (child.type === "string") {
    return `"${child.value}"`
  }
  if (child.type === "null") {
    return "null"
  }
  if (child.type === "undefined" || child.type === "symbol") {
    return "undefined"
  }
  if (child.type === "object") {
    return "{…}"
  }
  if (child.type === "array") {
    return "[…]"
  }
  if (child.type === "set") {
    return "Set(…)"
  }
  if (child.type === "map") {
    return "Map(…)"
  }
  if (child.type === "iterable") {
    return "Iterable(…)"
  }
  if (child.type === "function") {
    return "ƒ(…)"
  }
  return String(child.value)
}

const formatValue = (value: unknown): string => {
  if (value === null) {
    return "null"
  }
  if (value === undefined) {
    return "undefined"
  }
  if (typeof value === "string") {
    return `"${value}"`
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value)
  }
  if (value instanceof Date) {
    return value.toISOString()
  }
  if (value instanceof Set) {
    return `Set(${value.size})`
  }
  if (value instanceof Map) {
    return `Map(${value.size})`
  }
  if (Array.isArray(value)) {
    return `Array(${value.length})`
  }
  if (typeof value === "object") {
    return "Object"
  }
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  return String(value)
}

// /////////////////////////////////////////////////////////////////////////////////////////

function dataType<T = unknown>(opts: JsonDataTypeOptions<T>) {
  return opts
}

// /////////////////////////////////////////////////////////////////////////////////////////

export const NullType: JsonDataTypeOptions<null> = dataType<null>({
  check(value) {
    return value === null
  },
  description: "null",
  node({keyPath, value}) {
    return {
      keyPath,
      type: "null",
      value,
    }
  },
  previewElement() {
    return jsx("span", {}, [txt("null")])
  },
  type: "null",
})

// /////////////////////////////////////////////////////////////////////////////////////////

export const UndefinedType: JsonDataTypeOptions<undefined> =
  dataType<undefined>({
    check(value) {
      return value === undefined
    },
    description: "undefined",
    node({keyPath, value}) {
      return {
        keyPath,
        type: "undefined",
        value,
      }
    },
    previewElement() {
      return jsx("span", {}, [txt("undefined")])
    },
    type: "undefined",
  })

// /////////////////////////////////////////////////////////////////////////////////////////

export const SymbolType: JsonDataTypeOptions<symbol> = dataType<symbol>({
  check(value) {
    return typeof value === "symbol"
  },
  description(node) {
    return String(node.value)
  },
  node({keyPath, value}) {
    return {
      keyPath,
      type: "symbol",
      value,
    }
  },
  previewElement(node) {
    return jsx("span", {}, [txt(node.value.toString())])
  },
  type: "symbol",
})

// /////////////////////////////////////////////////////////////////////////////////////////

export const BigIntType: JsonDataTypeOptions<bigint> = dataType<bigint>({
  check(value) {
    return typeof value === "bigint"
  },
  description(node) {
    return `${node.value}n`
  },
  node({keyPath, value}) {
    return {
      keyPath,
      type: "bigint",
      value,
    }
  },
  previewElement(node) {
    return jsx("span", {}, [txt(`${node.value}n`)])
  },
  type: "bigint",
})

// /////////////////////////////////////////////////////////////////////////////////////////

export const SetType: JsonDataTypeOptions<Set<unknown>> = dataType<
  Set<unknown>
>({
  check(value) {
    return value instanceof Set
  },
  description(node) {
    return `Set(${node.value.size})`
  },
  node({createNode, keyPath, value}) {
    const entriesChildren = Array.from(value).map((item, index) =>
      createNode([ENTRIES_KEY, index.toString()], item),
    )

    const entriesNode: JsonNode = {
      children: entriesChildren,
      isNonEnumerable: true,
      keyPath: [...keyPath, ENTRIES_KEY],
      type: "array",
      value: Array.from(value),
    }

    const sizeNode = createNode(["size"], value.size)

    return {
      children: [entriesNode, sizeNode],
      keyPath,
      type: "set",
      value,
    }
  },
  previewElement(node, opts) {
    const preview = this.previewText?.(node, opts) ?? ""
    const size = node.value.size

    const children: Array<JsonNodeElement | JsonNodeText> = [
      jsx("span", {kind: "constructor"}, [txt(`Set(${size})`)]),
      jsx("span", {kind: "brace"}, [txt(" {")]),
    ]
    if (preview) {
      children.push(jsx("span", {kind: "preview-text"}, [txt(preview)]))
    }
    children.push(jsx("span", {kind: "brace"}, [txt("}")]))

    return jsx("span", {}, children)
  },
  previewText(node, opts) {
    const maxItems = opts.maxPreviewItems
    const entries = Array.from(node.value)
    const values = entries.slice(0, maxItems).map(formatValue)
    const hasMore = entries.length > maxItems
    return generatePreviewText(values, hasMore)
  },
  type: "set",
})

// /////////////////////////////////////////////////////////////////////////////////////////

export const WeakSetType: JsonDataTypeOptions<WeakSet<WeakKey>> = dataType<
  WeakSet<WeakKey>
>({
  check(value) {
    return value instanceof WeakSet
  },
  description: "WeakSet",
  node({keyPath, value}) {
    return {
      keyPath,
      type: "weakset",
      value,
    }
  },
  previewElement() {
    return jsx("span", {}, [
      jsx("span", {kind: "constructor"}, [txt("WeakSet")]),
      jsx("span", {kind: "brace"}, [txt(" {")]),
      jsx("span", {kind: "preview"}, [txt(" [[Entries]]: not enumerable ")]),
      jsx("span", {kind: "brace"}, [txt("}")]),
    ])
  },
  type: "weakset",
})

// /////////////////////////////////////////////////////////////////////////////////////////

export const WeakMapType: JsonDataTypeOptions<WeakMap<WeakKey, WeakKey>> =
  dataType<WeakMap<WeakKey, WeakKey>>({
    check(value) {
      return value instanceof WeakMap
    },
    description: "WeakMap",
    node({keyPath, value}) {
      return {
        keyPath,
        type: "weakmap",
        value,
      }
    },
    previewElement() {
      return jsx("span", {}, [
        jsx("span", {kind: "constructor"}, [txt("WeakMap")]),
        jsx("span", {kind: "brace"}, [txt(" {")]),
        jsx("span", {kind: "preview"}, [txt(" [[Entries]]: not enumerable ")]),
        jsx("span", {kind: "brace"}, [txt("}")]),
      ])
    },
    type: "weakmap",
  })

// /////////////////////////////////////////////////////////////////////////////////////////

const REGEX_KEYS = [
  "lastIndex",
  "dotAll",
  "flags",
  "global",
  "hasIndices",
  "ignoreCase",
  "multiline",
  "source",
  "sticky",
  "unicode",
]

export const RegexType: JsonDataTypeOptions<RegExp> = dataType<RegExp>({
  check(value) {
    return value instanceof RegExp
  },
  description(node) {
    return String(node.value)
  },
  node({createNode, keyPath, value}) {
    const children = REGEX_KEYS.map((key) =>
      createNode([key], getProp(value, key)),
    )
    return {
      children,
      keyPath,
      type: "regex",
      value,
    }
  },
  previewElement(node) {
    return jsx("span", {}, [txt(String(node.value))])
  },
  type: "regex",
})

// /////////////////////////////////////////////////////////////////////////////////////////

const DATA_VIEW_KEYS = ["byteLength", "byteOffset", "buffer"]

export const DataViewType: JsonDataTypeOptions<DataView<ArrayBufferLike>> =
  dataType<DataView>({
    check(value) {
      return value instanceof DataView
    },
    description(node) {
      return `DataView(${node.value.byteLength})`
    },
    node({createNode, keyPath, value}) {
      const children = DATA_VIEW_KEYS.map((key) =>
        createNode([key], getProp(value, key)),
      )
      return {
        children,
        keyPath,
        type: "dataview",
        value,
      }
    },
    previewElement(node) {
      const dataView = node.value
      return jsx("span", {}, [
        jsx("span", {kind: "constructor"}, [
          txt(`DataView(${dataView.byteLength})`),
        ]),
        jsx("span", {kind: "brace"}, [txt(" { ")]),
        jsx("span", {kind: "preview"}, [
          txt(
            ` buffer: ArrayBuffer(${dataView.buffer.byteLength}), byteOffset: ${dataView.byteOffset} `,
          ),
        ]),
        jsx("span", {kind: "brace"}, [txt(" }")]),
      ])
    },
    type: "dataview",
  })

// /////////////////////////////////////////////////////////////////////////////////////////

const URL_KEYS = [
  "href",
  "origin",
  "protocol",
  "username",
  "password",
  "host",
  "hostname",
  "port",
  "pathname",
  "search",
  "searchParams",
  "hash",
]

export const UrlType: JsonDataTypeOptions<URL> = dataType<URL>({
  check(value) {
    return typeOf(value) === "[object URL]"
  },
  description: "URL",
  node({createNode, keyPath, value}) {
    const children = URL_KEYS.map((key) =>
      createNode([key], Reflect.get(value, key)),
    )
    return {
      children,
      keyPath,
      type: "url",
      value,
    }
  },
  previewElement(node, opts) {
    const url = node.value as any
    const maxItems = opts.maxPreviewItems
    const previewKeys = URL_KEYS.slice(0, maxItems)
    const preview = previewKeys.map((key) => `${key}: '${url[key]}'`).join(", ")
    const hasMore = URL_KEYS.length > maxItems
    return jsx("span", {}, [
      jsx("span", {kind: "constructor"}, [txt("URL")]),
      jsx("span", {kind: "brace"}, [txt(" { ")]),
      jsx("span", {kind: "preview-text"}, [
        txt(` ${preview}${hasMore ? ", …" : ""} `),
      ]),
      jsx("span", {kind: "brace"}, [txt(" }")]),
    ])
  },
  type: "url",
})

// /////////////////////////////////////////////////////////////////////////////////////////

export const URLSearchParamsType: JsonDataTypeOptions<URLSearchParams> =
  dataType<URLSearchParams>({
    check(value) {
      return typeOf(value) === "[object URLSearchParams]"
    },
    description: "URLSearchParams",
    node({createNode, keyPath, value}) {
      const entriesChildren = Array.from(value.entries()).map(
        ([key, value], index): JsonNode => {
          const keyStr = String(key)
          const keyNode = createNode([ENTRIES_KEY, keyStr, "key"], key)
          const valueNode = createNode([ENTRIES_KEY, keyStr, "value"], value)

          return {
            children: [keyNode, valueNode],
            keyPath: [...keyPath, ENTRIES_KEY, index],
            type: "object",
            value: {[key]: value},
          }
        },
      )

      const entriesNode: JsonNode = {
        children: entriesChildren,
        isNonEnumerable: true,
        keyPath: [...keyPath, "[[Entries]]"],
        type: "array",
        value: Array.from(value.entries()),
      }

      const sizeNode = createNode(["size"], Array.from(value.entries()).length)

      return {
        children: [entriesNode, sizeNode],
        keyPath,
        type: "urlsearchparams",
        value,
      }
    },
    previewElement(node) {
      const params = node.value
      const paramsArray = Array.from(params.entries())
      return jsx("span", {}, [
        jsx("span", {kind: "constructor"}, [txt("URLSearchParams")]),
        jsx("span", {kind: "brace"}, [txt(" { ")]),
        jsx("span", {kind: "preview"}, [txt(`size: ${paramsArray.length}`)]),
        jsx("span", {kind: "brace"}, [txt(" }")]),
      ])
    },
    type: "urlsearchparams",
  })

// /////////////////////////////////////////////////////////////////////////////////////////

const BLOB_KEYS = ["size", "type"]

export const BlobType: JsonDataTypeOptions<Blob> = dataType<Blob>({
  check(value) {
    return typeOf(value) === "[object Blob]"
  },
  description(node) {
    return `Blob(${node.value.size})`
  },
  node({createNode, keyPath, value}) {
    const blobProperties = BLOB_KEYS.map((key) => ({
      key,
      value: Reflect.get(value, key),
    }))
    const children = blobProperties.map(({key, value}) =>
      createNode([key], value),
    )
    return {
      children,
      keyPath,
      type: "blob",
      value,
    }
  },
  previewElement(node) {
    const blob = node.value
    return jsx("span", {}, [
      jsx("span", {kind: "constructor"}, [txt("Blob")]),
      jsx("span", {kind: "brace"}, [txt(" { ")]),
      jsx("span", {kind: "preview"}, [
        txt(
          `size: ${blob.size}, type: '${blob.type || "application/octet-stream"}'`,
        ),
      ]),
      jsx("span", {kind: "brace"}, [txt(" }")]),
    ])
  },
  type: "blob",
})

// /////////////////////////////////////////////////////////////////////////////////////////

const FILE_KEYS = ["name", "size", "type", "lastModified", "webkitRelativePath"]

export const FileType: JsonDataTypeOptions<File> = dataType<File>({
  check(value) {
    return typeOf(value) === "[object File]"
  },
  description(node) {
    return `File(${node.value.size})`
  },
  node({createNode, keyPath, value}) {
    const fileProperties = FILE_KEYS.map((key) => ({
      key,
      value: getProp(value, key) || "",
    }))
    const children = fileProperties.map(({key, value}) =>
      createNode([key], value),
    )
    return {
      children,
      keyPath,
      type: "file",
      value,
    }
  },
  previewElement(node) {
    const file = node.value
    const maxItems = 2
    const hasMore = FILE_KEYS.length > maxItems
    return jsx("span", {}, [
      jsx("span", {kind: "constructor"}, [txt("File")]),
      jsx("span", {kind: "brace"}, [txt(" { ")]),
      jsx("span", {kind: "preview"}, [
        txt(
          `name: '${file.name}', lastModified: ${file.lastModified}${hasMore ? ", …" : ""}`,
        ),
      ]),
      jsx("span", {kind: "brace"}, [txt(" }")]),
    ])
  },
  type: "file",
})

// /////////////////////////////////////////////////////////////////////////////////////////

const getFunctionString = (func: Function): string => {
  try {
    return func.toString()
  } catch {
    switch (func.constructor.name) {
      case "AsyncFunction":
        return "async function () {}"
      case "AsyncGeneratorFunction":
        return "async function * () {}"
      case "GeneratorFunction":
        return "function * () {}"
      default:
        return "function () {}"
    }
  }
}

const FUNCTION_SIGNATURE_REGEX =
  /(?:async\s+)?(?:function\s*\*?\s*)?([^(]*\([^)]*\))/

const getFunctionSignature = (func: Function): string => {
  const funcString = getFunctionString(func)
  const signatureMatch = funcString.match(FUNCTION_SIGNATURE_REGEX)
  return signatureMatch ? signatureMatch[1] : `${func.name || "anonymous"}()`
}

const FUNC_KEYS = ["name", "length", "prototype", "caller", "arguments"]

export const FunctionType: JsonDataTypeOptions<Function> = dataType<Function>({
  check(value) {
    return typeof value === "function"
  },
  description(node) {
    const func = node.value
    const name = func.name || "anonymous"
    const constructorName = func.constructor.name

    switch (constructorName) {
      case "AsyncFunction":
        return `async ƒ ${name}()`
      case "AsyncGeneratorFunction":
        return `async ƒ* ${name}()`
      case "GeneratorFunction":
        return `ƒ* ${name}()`
      default:
        return `ƒ ${name}()`
    }
  },
  node({createNode, keyPath, options, value}) {
    const funcName = value.name || "anonymous"
    const constructorName = value.constructor.name

    // Extract function properties
    const enumerableProperties = []
    const nonEnumerableProperties = []

    // Add the [[Function]] internal property showing the function implementation
    const funcString = getFunctionString(value)
    nonEnumerableProperties.push({key: "[[Function]]", value: funcString})

    // Add function metadata
    enumerableProperties.push({key: "name", value: funcName})
    enumerableProperties.push({key: "length", value: value.length})
    enumerableProperties.push({key: "constructor", value: constructorName})

    // Add any additional enumerable properties
    const additionalProps = Object.getOwnPropertyNames(value)
      .filter((key) => !FUNC_KEYS.includes(key))
      .map((key) => ({key, value: Reflect.get(value, key)}))

    enumerableProperties.push(...additionalProps)

    const enumerableChildren = enumerableProperties.map(({key, value}) =>
      createNode([key], value),
    )

    const nonEnumerableChildren = options?.showNonenumerable
      ? nonEnumerableProperties.map(({key, value}) => {
          const node = createNode([key], value)
          node.isNonEnumerable = true
          return node
        })
      : []

    const children = [...enumerableChildren, ...nonEnumerableChildren]

    return {
      children,
      keyPath,
      type: "function",
      value,
    }
  },
  previewElement(node) {
    const func = node.value
    const signature = getFunctionSignature(func)
    const constructorName = func.constructor.name

    // Show a shortened version if too long
    const preview =
      signature.length > 50 ? `${signature.substring(0, 47)}...` : signature

    let functionTypePrefix = ""
    if (constructorName === "AsyncFunction") {
      functionTypePrefix += "async "
    }
    if (constructorName === "AsyncGeneratorFunction") {
      functionTypePrefix += "async "
    }
    if (
      constructorName === "GeneratorFunction" ||
      constructorName === "AsyncGeneratorFunction"
    ) {
      functionTypePrefix += "ƒ* "
    }
    if (!constructorName.includes("Generator")) {
      functionTypePrefix += "ƒ "
    }

    return jsx("span", {}, [
      jsx("span", {kind: "function-type"}, [txt(functionTypePrefix)]),
      jsx("span", {kind: "function-body"}, [txt(preview)]),
    ])
  },
  type: "function",
})

// /////////////////////////////////////////////////////////////////////////////////////////

export const ArrayBufferType: JsonDataTypeOptions<ArrayBuffer> =
  dataType<ArrayBuffer>({
    check(value) {
      return value instanceof ArrayBuffer
    },
    description(node) {
      return `ArrayBuffer(${node.value.byteLength})`
    },
    node({keyPath, value}) {
      return {
        keyPath,
        type: "arraybuffer",
        value,
      }
    },
    previewElement(node) {
      return jsx("span", {nodeType: "arraybuffer"}, [
        txt(`ArrayBuffer(${node.value.byteLength})`),
      ])
    },
    type: "arraybuffer",
  })

// /////////////////////////////////////////////////////////////////////////////////////////

export const SharedArrayBufferType: JsonDataTypeOptions<SharedArrayBuffer> =
  dataType<SharedArrayBuffer>({
    check(value) {
      return (
        typeof SharedArrayBuffer !== "undefined" &&
        value instanceof SharedArrayBuffer
      )
    },
    description(node) {
      return `SharedArrayBuffer(${node.value.byteLength})`
    },
    node({keyPath, value}) {
      return {
        keyPath,
        type: "sharedarraybuffer",
        value,
      }
    },
    previewElement() {
      return jsx("span", {nodeType: "sharedarraybuffer"}, [
        txt("sharedarraybuffer"),
      ])
    },
    type: "sharedarraybuffer",
  })

// /////////////////////////////////////////////////////////////////////////////////////////

export const BufferType: JsonDataTypeOptions<Buffer<ArrayBufferLike>> =
  dataType<Buffer>({
    check(value) {
      return typeof Buffer !== "undefined" && value instanceof Buffer
    },
    description(node) {
      return `Buffer(${node.value.length})`
    },
    node({keyPath, value}) {
      return {
        keyPath,
        type: "buffer",
        value,
      }
    },
    previewElement(node) {
      const buffer = node.value
      const preview = Array.from(new Uint8Array(buffer).slice(0, 8))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join(" ")
      const hasMore = buffer.length > 8
      return jsx("span", {}, [
        jsx("span", {kind: "constructor"}, [txt(`Buffer(${buffer.length})`)]),
        jsx("span", {kind: "brace"}, [txt(" ['")]),
        jsx("span", {kind: "preview-text"}, [
          txt(preview + (hasMore ? " …" : "")),
        ]),
        jsx("span", {kind: "brace"}, [txt("']")]),
      ])
    },
    type: "buffer",
  })

// /////////////////////////////////////////////////////////////////////////////////////////

export const DateType: JsonDataTypeOptions<Date> = dataType<Date>({
  check(value) {
    return value instanceof Date
  },
  description(node) {
    return String(node.value)
  },
  node({keyPath, value}) {
    return {
      keyPath,
      type: "date",
      value,
    }
  },
  previewElement(node) {
    return jsx("span", {}, [txt(node.value.toISOString())])
  },
  type: "date",
})

// /////////////////////////////////////////////////////////////////////////////////////////

export const MapType: JsonDataTypeOptions<Map<unknown, unknown>> = dataType<
  Map<unknown, unknown>
>({
  check(value) {
    return value instanceof Map
  },
  description(node) {
    return `Map(${node.value.size})`
  },
  node({createNode, keyPath, value}) {
    const entriesChildren = Array.from(value.entries()).map(
      ([key, value], index): JsonNode => {
        const keyStr = String(key)
        const keyNode = createNode([ENTRIES_KEY, keyStr, "key"], key)
        const valueNode = createNode([ENTRIES_KEY, keyStr, "value"], value)
        return {
          children: [keyNode, valueNode],
          keyPath: [...keyPath, ENTRIES_KEY, index],
          type: "object",
          value: {[keyStr]: value},
        }
      },
    )

    const entriesNode: JsonNode = {
      children: entriesChildren,
      isNonEnumerable: true,
      keyPath: [...keyPath, ENTRIES_KEY],
      type: "array",
      value: Array.from(value.entries()),
    }

    const sizeNode = createNode(["size"], value.size)

    return {
      children: [entriesNode, sizeNode],
      keyPath,
      type: "map",
      value,
    }
  },
  previewElement(node, opts) {
    const preview = this.previewText?.(node, opts) || ""
    const size = node.value.size

    const children: Array<JsonNodeElement | JsonNodeText> = [
      jsx("span", {kind: "constructor"}, [txt(`Map(${size})`)]),
      jsx("span", {kind: "brace"}, [txt(" {")]),
    ]
    if (preview) {
      children.push(jsx("span", {kind: "preview-text"}, [txt(preview)]))
    }
    children.push(jsx("span", {kind: "brace"}, [txt("}")]))

    return jsx("span", {}, children)
  },
  previewText(node, opts) {
    const maxItems = opts.maxPreviewItems
    const entries = Array.from(node.value.entries())
    const previews = entries.slice(0, maxItems).map(([key, value]) => {
      const valueDesc = formatValue(value)
      const keyStr = typeof key === "string" ? `"${key}"` : String(key)
      return `${keyStr} => ${valueDesc}`
    })
    const hasMore = entries.length > maxItems
    return generatePreviewText(previews, hasMore)
  },
  type: "map",
})

// /////////////////////////////////////////////////////////////////////////////////////////

const ERROR_KEYS = ["name", "message", "stack"]

export const ErrorType: JsonDataTypeOptions<Error> = dataType<Error>({
  check(value) {
    return value instanceof Error
  },
  description(node) {
    const err = node.value
    return `${err.name}: ${err.message}`
  },
  node({createNode, keyPath, value}) {
    const errorProperties = ERROR_KEYS.map((key) => ({
      key,
      value: Reflect.get(value, key),
    }))

    const additionalProps = Object.getOwnPropertyNames(value)
      .filter((key) => !ERROR_KEYS.includes(key))
      .map((key) => ({key, value: getProp(value, key)}))

    const allProperties = [...errorProperties, ...additionalProps]
    const children = allProperties.map(({key, value}) =>
      createNode([key], value),
    )

    return {
      children,
      keyPath,
      type: "error",
      value,
    }
  },
  previewElement(node) {
    const err = node.value
    return jsx("span", {}, [
      jsx("span", {kind: "constructor"}, [txt(err.name)]),
      jsx("span", {kind: "colon"}, [txt(": ")]),
      jsx("span", {}, [txt(err.message)]),
    ])
  },
  type: "error",
})

function errorStackToElement(stack: string): JsonNodeElement {
  const stackLines = stack?.split("\n").filter((line) => line.trim()) || []
  return jsx(
    "span",
    {},
    stackLines.map((line, index) => {
      const appendNewLine = index < stackLines.length - 1
      return jsx(
        "span",
        {
          kind: "error-stack",
          nodeType: "string",
        },
        [
          jsx("span", {}, [txt(line + (appendNewLine ? "\\n" : ""))]),
          jsx("span", {kind: "operator"}, [txt(appendNewLine ? " +" : "")]),
        ],
      )
    }),
  )
}

// /////////////////////////////////////////////////////////////////////////////////////////

export const HeadersType: JsonDataTypeOptions<Headers> = dataType<Headers>({
  check(value) {
    return typeOf(value) === "[object Headers]"
  },
  description: "Headers",
  node({createNode, keyPath, value}) {
    const entriesChildren = Array.from(value.entries()).map(
      ([key, value], index): JsonNode => {
        const keyStr = String(key)
        const keyNode = createNode([ENTRIES_KEY, keyStr, "key"], key)
        const valueNode = createNode([ENTRIES_KEY, keyStr, "value"], value)
        return {
          children: [keyNode, valueNode],
          keyPath: [...keyPath, ENTRIES_KEY, index],
          type: "object",
          value: {[key]: value},
        }
      },
    )

    const entriesNode: JsonNode = {
      children: entriesChildren,
      isNonEnumerable: true,
      keyPath: [...keyPath, ENTRIES_KEY],
      type: "array",
      value: Array.from(value.entries()),
    }

    return {
      children: [entriesNode],
      keyPath,
      type: "headers",
      value,
    }
  },
  previewElement(node) {
    const headers = node.value
    const entriesArray = Array.from(headers.entries())
    const preview = entriesArray
      .slice(0, 2)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ")
    const hasMore = entriesArray.length > 2
    return jsx("span", {}, [
      jsx("span", {kind: "constructor"}, [
        txt(`Headers(${entriesArray.length})`),
      ]),
      jsx("span", {kind: "brace"}, [txt(" {")]),
      jsx("span", {kind: "preview-text"}, [
        txt(` ${preview}${hasMore ? ", …" : ""} `),
      ]),
      jsx("span", {kind: "brace"}, [txt("}")]),
    ])
  },
  type: "headers",
})

// /////////////////////////////////////////////////////////////////////////////////////////

export const FormDataType: JsonDataTypeOptions<FormData> = dataType<FormData>({
  check(value) {
    return typeOf(value) === "[object FormData]"
  },
  description: "FormData",
  node({createNode, keyPath, value}) {
    const entriesChildren = Array.from(value.entries()).map(
      ([key, value], index): JsonNode => {
        const keyNode = createNode([ENTRIES_KEY, index, "key"], key)
        const valueNode = createNode([ENTRIES_KEY, index, "value"], value)

        return {
          children: [keyNode, valueNode],
          keyPath: [...keyPath, ENTRIES_KEY, index],
          type: "object",
          value: {[key]: value},
        }
      },
    )

    const entriesNode: JsonNode = {
      children: entriesChildren,
      isNonEnumerable: true,
      keyPath: [...keyPath, ENTRIES_KEY],
      type: "array",
      value: Array.from(value.entries()),
    }

    return {
      children: [entriesNode],
      keyPath,
      type: "formdata",
      value,
    }
  },
  previewElement(node) {
    const formData = node.value
    const entriesArray = Array.from(formData.entries())

    const preview = entriesArray
      .slice(0, 2)
      .map(([key, value]) => {
        const valueStr = FileType.check(value)
          ? `File(${(value as File).size})`
          : (value as string)
        return `${key}: ${valueStr}`
      })
      .join(", ")

    const hasMore = entriesArray.length > 2

    return jsx("span", {}, [
      jsx("span", {kind: "constructor"}, [
        txt(`FormData(${entriesArray.length})`),
      ]),
      jsx("span", {kind: "brace"}, [txt(" {")]),
      jsx("span", {kind: "preview-text"}, [
        txt(` ${preview}${hasMore ? ", …" : ""} `),
      ]),
      jsx("span", {kind: "brace"}, [txt("}")]),
    ])
  },
  type: "formdata",
})

// /////////////////////////////////////////////////////////////////////////////////////////

export const ArrayType: JsonDataTypeOptions<unknown[]> = dataType<
  Array<unknown>
>({
  check(value) {
    return Array.isArray(value)
  },
  description(node) {
    return `Array(${node.value.length})`
  },
  node({createNode, keyPath, options, value}) {
    // Handle sparse arrays by showing only slots with actual values
    // This prevents crashes when arrays have holes (e.g., let arr = []; arr[50] =
    // "value")
    const arrayChildren: JsonNode[] = []

    // Use Object.keys to get only the indices that actually have values
    // This automatically handles sparse arrays by skipping undefined slots
    const definedIndices = Object.keys(value)
      .filter((key) => !Number.isNaN(Number(key))) // Only numeric indices
      .map(Number)
      .sort((a, b) => a - b) // Sort numerically

    // Check if we should group the array items
    const chunkSize = options?.groupArraysAfterLength
    const shouldGroup = chunkSize && definedIndices.length > chunkSize

    if (shouldGroup) {
      // Group array items into chunks
      const chunks: number[][] = []

      for (let i = 0; i < definedIndices.length; i += chunkSize) {
        chunks.push(definedIndices.slice(i, i + chunkSize))
      }

      // Create grouped nodes
      for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
        const chunk = chunks[chunkIndex]
        const startIndex = chunk[0]
        const endIndex = chunk[chunk.length - 1]
        const groupKey = `[${startIndex}…${endIndex}]`

        // Create children for this chunk
        const groupChildren = chunk.map((index) =>
          createNode([index.toString()], value[index]),
        )

        // Create the group node
        const groupNode: JsonNode = {
          children: groupChildren,
          isNonEnumerable: false,
          keyPath: [...keyPath, groupKey],
          type: "array",
          value: chunk.map((index) => value[index]),
        }

        arrayChildren.push(groupNode)
      }
    } else {
      // Create nodes normally for smaller arrays
      for (const index of definedIndices) {
        arrayChildren.push(createNode([index.toString()], value[index]))
      }
    }

    // Add length property to show the true size of the array (including sparse
    // slots)
    const lengthChild = createNode(["length"], value.length)

    // Get non-enumerable properties
    const propertyNames = Object.getOwnPropertyNames(value)
    const enumerableKeys = Object.keys(value).filter(
      (key) => !Number.isNaN(Number(key)),
    ) // Only numeric indices
    const nonEnumerableKeys = propertyNames.filter(
      (key) =>
        !enumerableKeys.includes(key) &&
        key !== "length" && // length is already handled above
        Number.isNaN(Number(key)), // exclude numeric indices
    )

    const nonEnumerableChildren = options?.showNonenumerable
      ? nonEnumerableKeys.map((key) => {
          const descriptor = Object.getOwnPropertyDescriptor(value, key)
          const node = createNode([key], Reflect.get(value, key))
          node.isNonEnumerable = true
          node.propertyDescriptor = descriptor
          return node
        })
      : []

    const children = [...arrayChildren, lengthChild, ...nonEnumerableChildren]

    return {
      children,
      keyPath,
      type: "array",
      value,
    }
  },
  previewElement(node, opts) {
    const preview = this.previewText?.(node, opts) || ""
    const count = node.value.length

    const children: Array<JsonNodeElement | JsonNodeText> = []
    if (count > 0) {
      children.push(jsx("span", {kind: "constructor"}, [txt(`(${count}) `)]))
    }
    children.push(jsx("span", {kind: "brace"}, [txt("[")]))
    if (preview) {
      children.push(jsx("span", {kind: "preview-text"}, [txt(preview)]))
    }
    children.push(jsx("span", {kind: "brace"}, [txt("]")]))

    return jsx("span", {}, children)
  },
  previewText(node, opts) {
    const maxItems = opts.maxPreviewItems
    const children = node.children || []
    const enumerableChildren = children.filter(
      (child) =>
        !child.isNonEnumerable && keyPathToKey(child.keyPath) !== "length",
    )
    const values = enumerableChildren.slice(0, maxItems).map(formatValueMini)
    const hasMore = enumerableChildren.length > maxItems
    return generatePreviewText(values, hasMore)
  },
  type: "array",
})

// /////////////////////////////////////////////////////////////////////////////////////////

const typedArrayConstructors = {
  BigInt64Array: "bigint64array",
  BigUint64Array: "biguint64array",
  Float32Array: "float32array",
  Float64Array: "float64array",
  Int8Array: "int8array",
  Int16Array: "int16array",
  Int32Array: "int32array",
  Uint8Array: "uint8array",
  Uint8ClampedArray: "uint8clampedarray",
  Uint16Array: "uint16array",
  Uint32Array: "uint32array",
}

const revertTypedArrayConstructors = Object.fromEntries(
  Object.entries(typedArrayConstructors).map(([key, value]) => [value, key]),
)

const TYPED_ARRAY_KEYS = ["length", "byteLength", "byteOffset", "buffer"]

export const TypedArrayType: JsonDataTypeOptions = dataType<any>({
  check(value) {
    return isObj(value) && value.constructor.name in typedArrayConstructors
  },
  description(node) {
    const typedArray = node.value
    const constructorName = typedArray.constructor.name
    return `${revertTypedArrayConstructors[constructorName]}(${typedArray.length})`
  },
  node({createNode, keyPath, options, value}) {
    const typedArray = value
    const enumerableProperties = TYPED_ARRAY_KEYS.map((key) => ({
      key,
      value: Reflect.get(typedArray, key),
    }))

    const enumerableChildren = enumerableProperties.map(({key, value}) =>
      createNode([key], value),
    )

    const nonEnumerableChildren = options?.showNonenumerable
      ? (() => {
          // Show first few values
          const values = Array.from(typedArray).slice(0, 100) // Limit for performance
          const node = createNode(["[[Values]]"], values)
          node.isNonEnumerable = true
          return [node]
        })()
      : []

    const children = [...enumerableChildren, ...nonEnumerableChildren]

    return {
      children,
      keyPath,
      type: Reflect.get(typedArrayConstructors, value.constructor.name),
      value,
    }
  },
  previewElement(node) {
    const typedArray = node.value
    const constructorName = typedArray.constructor.name
    const preview = Array.from(typedArray).slice(0, 5).join(", ")
    const hasMore = typedArray.length > 5
    return jsx("span", {}, [
      jsx("span", {kind: "constructor"}, [
        txt(`${constructorName}(${typedArray.length})`),
      ]),
      jsx("span", {kind: "brace"}, [txt(" [ ")]),
      jsx("span", {kind: "preview-text"}, [
        txt(preview + (hasMore ? ", …" : "")),
      ]),
      jsx("span", {kind: "brace"}, [txt(" ]")]),
    ])
  },
  type: (value) => Reflect.get(typedArrayConstructors, value.constructor.name),
})

// /////////////////////////////////////////////////////////////////////////////////////////

export const IterableType: JsonDataTypeOptions = dataType<any>({
  check(value) {
    return Boolean(
      value &&
      typeof value === "object" &&
      typeof value[Symbol.iterator] === "function" &&
      !(value instanceof Set) &&
      !(value instanceof Map) &&
      !Array.isArray(value) &&
      !(value instanceof Date) &&
      !(value instanceof RegExp) &&
      !(value instanceof ArrayBuffer),
    )
  },
  description: "Iterable",
  node({createNode, keyPath, value}) {
    const entriesArray = Array.from(value as Iterable<unknown>)
    const entriesChildren = entriesArray.map((item, index) =>
      createNode([ENTRIES_KEY, index], item),
    )
    const entriesNode: JsonNode = {
      children: entriesChildren,
      isNonEnumerable: true,
      keyPath: [...keyPath, ENTRIES_KEY],
      type: "array",
      value: entriesArray,
    }

    // Try to get size/length property
    const sizeValue = value.size ?? value.length ?? entriesArray.length
    const sizeNode = createNode(["size"], sizeValue)

    return {
      children: [entriesNode, sizeNode],
      keyPath,
      type: "iterable",
      value,
    }
  },
  previewElement(node, opts) {
    const preview = SetType.previewText?.(node, opts) ?? ""
    // Use the same calculation as in the node method
    const entriesArray = Array.from(node.value as Iterable<unknown>)
    const size = node.value.size ?? node.value.length ?? entriesArray.length

    const children: Array<JsonNodeElement | JsonNodeText> = [
      jsx("span", {kind: "constructor"}, [txt(`Iterable(${size})`)]),
      jsx("span", {kind: "brace"}, [txt(" {")]),
    ]
    if (preview) {
      children.push(jsx("span", {kind: "preview-text"}, [txt(preview)]))
    }
    children.push(jsx("span", {kind: "brace"}, [txt("}")]))

    return jsx("span", {}, children)
  },
  type: "iterable",
})

// /////////////////////////////////////////////////////////////////////////////////////////

export const ClassType: JsonDataTypeOptions = dataType<any>({
  check(value) {
    return (
      typeof value === "object" &&
      value !== null &&
      value.constructor !== Object
    )
  },
  description(node) {
    return node.constructorName || "Object"
  },
  node({createNode, keyPath, options, value}) {
    const constructorName = value.constructor.name
    const allPropertyNames = Object.getOwnPropertyNames(value)
    const enumerableKeys = Object.keys(value)
    const nonEnumerableKeys = allPropertyNames.filter(
      (key) => !enumerableKeys.includes(key),
    )

    const enumerableChildren = enumerableKeys.map((key) =>
      createNode([key], Reflect.get(value, key)),
    )
    const nonEnumerableChildren = options?.showNonenumerable
      ? nonEnumerableKeys.map((key) => {
          const descriptor = Object.getOwnPropertyDescriptor(value, key)
          const node = createNode([`[[${key}]]`], getProp(value, key))
          node.isNonEnumerable = true
          node.propertyDescriptor = descriptor
          return node
        })
      : []

    const children = [...enumerableChildren, ...nonEnumerableChildren]

    return {
      children,
      constructorName,
      keyPath,
      type: "object",
      value,
    }
  },
  previewElement(node, opts) {
    return ObjectType.previewElement(node, opts)
  },
  previewText(node, opts) {
    return ObjectType.previewText?.(node, opts) || ""
  },
  type: "object",
})

// /////////////////////////////////////////////////////////////////////////////////////////

export const ObjectType: JsonDataTypeOptions<object> = dataType<object>({
  check(value) {
    return typeof value === "object" && value !== null
  },
  description: "Object",
  node({createNode, keyPath, options, value}) {
    const allPropertyNames = Object.getOwnPropertyNames(value)

    const enumerableKeys = Object.keys(value)
    const nonEnumerableKeys = allPropertyNames.filter(
      (key) => !enumerableKeys.includes(key),
    )

    const enumerableChildren = enumerableKeys.map((key) =>
      createNode([key], getProp(value, key)),
    )
    const nonEnumerableChildren = options?.showNonenumerable
      ? nonEnumerableKeys.map((key) => {
          const descriptor = Object.getOwnPropertyDescriptor(value, key)
          const node = createNode([`[[${key}]]`], getProp(value, key))
          node.isNonEnumerable = true
          node.propertyDescriptor = descriptor
          return node
        })
      : []

    const children = [...enumerableChildren, ...nonEnumerableChildren]

    return {
      children,
      keyPath,
      type: "object",
      value,
    }
  },
  previewElement(node, opts) {
    const preview = this.previewText?.(node, opts) ?? ""
    const children: Array<JsonNodeElement | JsonNodeText> = []

    if (node.constructorName) {
      children.push(
        jsx("span", {kind: "constructor"}, [txt(`${node.constructorName} `)]),
      )
    }
    children.push(jsx("span", {kind: "brace"}, [txt("{")]))
    if (preview) {
      children.push(jsx("span", {kind: "preview-text"}, [txt(preview)]))
    }
    children.push(jsx("span", {kind: "brace"}, [txt("}")]))

    return jsx("span", {}, children)
  },
  previewText(node, opts) {
    const maxItems = opts.maxPreviewItems
    const children = node.children || []
    const previews = children.slice(0, maxItems).map((child) => {
      const valueDesc = getNodeTypeDescription(child)
      return `${keyPathToKey(child.keyPath)}: ${valueDesc}`
    })
    const hasMore = children.length > maxItems
    return generatePreviewText(previews, hasMore)
  },
  type: "object",
})

// /////////////////////////////////////////////////////////////////////////////////////////

const ELEMENT_KEYS = [
  "attributes",
  "childElementCount",
  "className",
  "dataset",
  "hidden",
  "id",
  "inert",
  "isConnected",
  "isContentEditable",
  "nodeType",
  "style",
  "tabIndex",
  "tagName",
]

const isSvg = (el: Element): el is SVGSVGElement =>
  typeof el === "object" &&
  el.tagName === "svg" &&
  el.namespaceURI === "http://www.w3.org/2000/svg"

const isHTML = (el: Element): el is HTMLElement =>
  typeof el === "object" && el.namespaceURI === "http://www.w3.org/1999/xhtml"

export const ElementType: JsonDataTypeOptions<SVGElement | HTMLElement> =
  dataType<SVGElement | HTMLElement>({
    check(value) {
      return isSvg(value) || isHTML(value)
    },
    description(node) {
      return typeOf(node.value)
    },

    node({createNode, keyPath, value}) {
      const children = ELEMENT_KEYS.reduce((acc, key) => {
        let childValue = Reflect.get(value, key)

        if (key === "attributes") {
          const attrs = Array.from(value.attributes)
          childValue = attrs.length
            ? Object.fromEntries(attrs.map((attr) => [attr.name, attr.value]))
            : undefined
        }

        if (key === "style") {
          const style = Array.from(value.style)
          childValue = style.length
            ? Object.fromEntries(
                style.map((key) => [key, value.style.getPropertyValue(key)]),
              )
            : undefined
        }

        acc.push(createNode([key], childValue))
        return acc
      }, [] as JsonNode[])

      return {
        children,
        keyPath,
        type: "element",
        value,
      }
    },

    previewElement(node) {
      const el = node.value as Element
      const classList = Array.from(el.classList).slice(0, 3)

      return jsx("span", {}, [
        jsx("span", {kind: "constructor"}, [txt(el.constructor.name)]),
        jsx("span", {}, [txt(" ")]),
        jsx("span", {kind: "preview-text"}, [
          txt(
            `<${el.localName}${el.id ? `#${el.id}` : ""}${classList.length > 0 ? `.${classList.join(".")}` : ""}>`,
          ),
        ]),
      ])
    },

    type: "element",
  })

// /////////////////////////////////////////////////////////////////////////////////////////

const DOCUMENT_KEYS = [
  "title",
  "URL",
  "documentElement",
  "head",
  "body",
  "contentType",
  "readyState",
]
export const DocumentType: JsonDataTypeOptions<Document> = dataType<Document>({
  check(value) {
    return typeOf(value) === "[object HTMLDocument]"
  },
  description: "Document",

  node({createNode, keyPath, value}) {
    const children = DOCUMENT_KEYS.map((key) =>
      createNode([key], Reflect.get(value, key)),
    )
    return {
      children,
      keyPath,
      type: "document",
      value,
    }
  },

  previewElement(node) {
    const doc = node.value
    const url = doc.URL || "unknown"
    return jsx("span", {}, [
      jsx("span", {kind: "constructor"}, [txt("#document")]),
      jsx("span", {kind: "preview-text"}, [txt(` (${url})`)]),
    ])
  },

  type: "document",
})

// /////////////////////////////////////////////////////////////////////////////////////////

const WINDOW_KEYS = [
  "location",
  "navigator",
  "document",
  "innerWidth",
  "innerHeight",
  "devicePixelRatio",
  "origin",
]

export const WindowType: JsonDataTypeOptions<Window> = dataType<Window>({
  check(value) {
    return typeOf(value) === "[object Window]"
  },
  description: "Window",

  node({createNode, keyPath, value}) {
    const children = WINDOW_KEYS.map((key) => {
      const childValue = Reflect.get(value, key)
      return createNode([key], childValue)
    })

    return {
      children,
      keyPath,
      type: "window",
      value,
    }
  },

  previewElement() {
    return jsx("span", {}, [
      jsx("span", {kind: "constructor"}, [txt("Window")]),
      jsx("span", {kind: "preview-text"}, [txt(" { … }")]),
    ])
  },

  type: "window",
})

// /////////////////////////////////////////////////////////////////////////////////////////

const REACT_ELEMENT_KEYS = ["$$typeof", "type", "key", "ref", "props"]

const getElementTypeName = (type: any): string => {
  if (typeof type === "string") {
    return type
  }
  if (typeof type === "function") {
    return type.displayName || type.name || "Component"
  }
  return type?.toString() || "Component"
}

export const ReactElementType: JsonDataTypeOptions = dataType<any>({
  check(value) {
    return isObj(value) && "$$typeof" in value && "props" in value
  },
  description(node) {
    const el = node.value
    return getElementTypeName(el.type)
  },
  node({createNode, keyPath, value}) {
    const children = REACT_ELEMENT_KEYS.reduce((acc, key) => {
      let childValue = Reflect.get(value, key)
      if (key === "type") {
        childValue = getElementTypeName(childValue)
      }
      acc.push(createNode([key], childValue))
      return acc
    }, [] as JsonNode[])

    return {
      children,
      keyPath,
      type: "react-element",
      value,
    }
  },
  previewElement(node, opts) {
    const el = node.value

    const elName = getElementTypeName(el.type)
    const props = Object.entries(el.props)
    const hasMore = props.length > opts.maxPreviewItems

    return jsx("span", {}, [
      txt(`<${elName} `),
      ...props.slice(0, opts.maxPreviewItems).reduce((acc, [key, value]) => {
        if (key === "children") {
          return acc
        }
        acc.push(
          jsx("span", {}, [
            txt(
              ` ${key}=${typeof value === "string" ? `"${value}"` : `{${formatValue(value)}}`}`,
            ),
          ]),
        )
        return acc
      }, [] as JsonNodeElement[]),
      ...(hasMore ? [txt(" …")] : []),
      txt(el.children ? `> {…} </${elName}>` : ` />`),
    ])
  },
  type: "react-element",
})

// /////////////////////////////////////////////////////////////////////////////////////////

const map: Record<string, string> = {
  "\n": "\\n",
  "\t": "\\t",
  "\r": "\\r",
}

const STRING_ESCAPE_REGEXP = /[\n\t\r]/g

export const StringType: JsonDataTypeOptions<string> = dataType<string>({
  check(value) {
    return typeof value === "string"
  },
  description(node, opts) {
    return `"${this.previewText?.(node, opts) ?? node.value}"`
  },
  node({keyPath, value}) {
    return {
      keyPath,
      type: "string",
      value,
    }
  },
  previewElement(node) {
    const serialised = node.value.replace(
      STRING_ESCAPE_REGEXP,
      (_: string) => map[_],
    )
    return jsx("span", {}, [txt(`"${serialised}"`)])
  },
  previewText(node, opts) {
    const serialised = node.value.replace(
      STRING_ESCAPE_REGEXP,
      (_: string) => map[_],
    )
    const preview =
      serialised.slice(0, opts.collapseStringsAfterLength) +
      (serialised.length > opts.collapseStringsAfterLength ? "…" : "")
    return preview
  },
  type: "string",
})

// /////////////////////////////////////////////////////////////////////////////////////////

export const PrimitiveType: JsonDataTypeOptions = dataType<any>({
  check(value) {
    return value !== null && value !== undefined
  },
  description(node) {
    return String(node.value)
  },
  node({keyPath, value}) {
    return {
      keyPath,
      type: typeof value as JsonNodeType,
      value,
    }
  },
  previewElement(node) {
    return jsx("span", {}, [txt(String(node.value))])
  },
  type(value) {
    return typeof value as JsonNodeType
  },
})

// /////////////////////////////////////////////////////////////////////////////////////////

export const dataTypes: JsonDataTypeOptions<any>[] = [
  NullType,
  UndefinedType,
  SymbolType,
  BigIntType,
  FunctionType,

  ArrayBufferType,
  SharedArrayBufferType,
  BufferType,

  DataViewType,
  ErrorType,
  DateType,
  RegexType,

  SetType,
  MapType,

  WeakMapType,
  WeakSetType,

  FileType,
  BlobType,

  ReactElementType,
  WindowType,
  DocumentType,
  ElementType,

  UrlType,
  URLSearchParamsType,
  HeadersType,
  FormDataType,
  ArrayType,
  TypedArrayType,
  IterableType,

  ClassType,
  ObjectType,

  StringType,
  PrimitiveType,
]

// /////////////////////////////////////////////////////////////////////////////////////////

export const jsonNodeToElement = (
  node: JsonNode,
  opts?: Partial<JsonNodePreviewOptions>,
): JsonNodeHastElement => {
  const options = getPreviewOptions(opts)
  const key = keyPathToKey(node.keyPath, {excludeRoot: true})

  if (key === "stack" && typeof node.value === "string") {
    return errorStackToElement(node.value)
  }

  const dataType = dataTypes.find((dataType) => dataType.check(node.value))
  if (!dataType) {
    return jsx("span", {}, [txt(String(node.value))])
  }

  const element = dataType.previewElement(node, options)

  if (!key) {
    element.properties.root = true
  }

  element.properties.kind = "preview"
  element.properties.nodeType =
    typeof dataType.type === "function"
      ? dataType.type(node.value)
      : dataType.type

  return element
}

// /////////////////////////////////////////////////////////////////////////////////////////

export const getNodeTypeDescription = (
  node: JsonNode,
  opts?: Partial<JsonNodePreviewOptions>,
): string => {
  const options = getPreviewOptions(opts)
  const dataType = dataTypes.find((dataType) => dataType.check(node.value))
  if (dataType) {
    return typeof dataType.description === "function"
      ? dataType.description(node, options)
      : dataType.description
  }
  return String(node.value)
}

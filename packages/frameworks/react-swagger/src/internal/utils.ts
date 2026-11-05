// Modified from https://github.com/swagger-api/swagger-ui
// Apache-2.0
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {HTMLAttributes, ReactNode} from "react"

import {sanitizeUrl as braintreeSanitizeUrl} from "@braintree/sanitize-url"
import cssEscape from "css.escape"
import immutable from "immutable"

export function sanitizeUrl(url: unknown) {
  if (typeof url !== "string" || url === "") {
    return ""
  }

  return braintreeSanitizeUrl(url)
}

export function jsFileDownload(
  data: any,
  filename: string,
  mime?: string,
  bom?: any,
) {
  const blobData = typeof bom !== "undefined" ? [bom, data] : [data]
  const blob = new Blob(blobData, {type: mime || "application/octet-stream"})

  const blobURL =
    window.URL && window.URL.createObjectURL
      ? window.URL.createObjectURL(blob)
      : window.webkitURL.createObjectURL(blob)
  const tempLink = document.createElement("a")
  tempLink.style.display = "none"
  tempLink.href = blobURL
  tempLink.setAttribute("download", filename)

  // Safari thinks _blank anchor are pop ups. We only want to set _blank
  // target if the browser does not support the HTML5 download attribute.
  // This allows you to download files in desktop safari if pop up blocking
  // is enabled.
  if (typeof tempLink.download === "undefined") {
    tempLink.setAttribute("target", "_blank")
  }

  document.body.appendChild(tempLink)
  tempLink.click()

  // Fixes "webkit blob resource error 1"
  setTimeout(function () {
    document.body.removeChild(tempLink)
    window.URL.revokeObjectURL(blobURL)
  }, 200)
}

export function stringify(thing: any) {
  if (typeof thing === "string") {
    return thing
  }

  if (thing && thing.toJS) {
    thing = thing.toJS()
  }

  if (typeof thing === "object" && thing !== null) {
    try {
      return JSON.stringify(thing, null, 2)
    } catch {
      return String(thing)
    }
  }

  if (thing === null || thing === undefined) {
    return ""
  }

  return thing.toString()
}

/**
 * The function used to render the application's clientside link component.
 */
export type RenderLink = (
  props: HTMLAttributes<HTMLAnchorElement> & {href: string},
) => ReactNode

// oxlint-disable-next-line typescript/no-unsafe-function-type
export function isFunc(thing: unknown): thing is Function {
  return typeof thing === "function"
}

export function isAbsoluteUrl(url: string) {
  return url.match(/^(?:[a-z]+:)?\/\//i) // Matches http://, HTTP://, https://, ftp://, //example.com,
}

export function addProtocol(url: string) {
  if (!url.match(/^\/\//i)) {
    return url
  } // Checks if protocol is missing e.g. //example.com

  return `${window.location.protocol}${url}`
}

export function buildBaseUrl(selectedServer: any, specUrl: string) {
  if (!selectedServer) {
    return specUrl
  }
  if (isAbsoluteUrl(selectedServer)) {
    return addProtocol(selectedServer)
  }

  return new URL(selectedServer, specUrl).href
}

export function buildUrl(
  url: string,
  specUrl: string,
  {selectedServer = ""} = {},
) {
  if (!url) {
    return undefined
  }
  if (isAbsoluteUrl(url)) {
    return url
  }

  const baseUrl = buildBaseUrl(selectedServer, specUrl)
  if (!isAbsoluteUrl(baseUrl)) {
    return new URL(url, window.location.href).href
  }
  return new URL(url, baseUrl).href
}

/**
 * Safe version of buildUrl function. `selectedServer` can contain server variables
 * which can fail the URL resolution.
 */
export function safeBuildUrl(
  url: string,
  specUrl: string,
  {selectedServer = ""} = {},
) {
  try {
    return buildUrl(url, specUrl, {selectedServer})
  } catch {
    return undefined
  }
}

// suitable for use in URL fragments
export const createDeepLinkPath = (str: string) =>
  typeof str === "string" ? str.trim().replace(/\s/g, "%20") : ""

// suitable for use in CSS classes and ids
export const escapeDeepLinkPath = (str: string) =>
  cssEscape(createDeepLinkPath(str).replace(/%20/g, "_"))

export function getList(iterable: any, keys: any) {
  if (!immutable.Iterable.isIterable(iterable)) {
    return immutable.List()
  }
  const val = iterable.getIn(Array.isArray(keys) ? keys : [keys])
  return immutable.List.isList(val) ? val : immutable.List()
}

export const getExtensions = (defObj: any) =>
  defObj.filter((v: any, k: any) => k.startsWith("x-"))

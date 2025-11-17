// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {DOCUMENT} from "@angular/common"
import {inject, Injectable, REQUEST} from "@angular/core"

import {useCsrCheck} from "@qualcomm-ui/angular-core/common"

@Injectable({
  providedIn: "root",
})
export class ThemeCookieService {
  private readonly document = inject(DOCUMENT)
  private readonly request = inject(REQUEST, {optional: true})

  isBrowser = useCsrCheck()

  private getCookieRegExp(name: string): RegExp {
    const escapedName: string = name.replace(
      /([\[\]{}()|=;+?,.*^$\\])/gi,
      "\\$1",
    )
    return new RegExp(
      `(?:^${escapedName}|;\\s*${escapedName})=(.*?)(?:;|$)`,
      "g",
    )
  }

  /**
   * Get cookie by name, handles both browser and server-side rendering
   */
  get(name: string): string | null {
    name = encodeURIComponent(name)
    const regExp: RegExp = this.getCookieRegExp(name)
    const cookieRes = this.isBrowser()
      ? this.document.cookie
      : this.getRequestCookies()
    if (!cookieRes) {
      return null
    }
    const result = regExp.exec(cookieRes)

    return result?.[1]
      ? this.isBrowser()
        ? decodeURIComponent(result[1])
        : result[1]
      : ""
  }

  /**
   * Helper method to safely get cookies from the request object.
   * Handles both Angular's REQUEST interface and Express's req interface
   */
  private getRequestCookies(): string | null {
    if (!this.request) {
      return null
    }

    if (
      this.request.headers &&
      typeof this.request.headers.get === "function"
    ) {
      return this.request.headers.get("cookie")
    }

    const reqAny = this.request as any
    if (typeof reqAny.get === "function") {
      return reqAny.get("cookie") || reqAny.get("Cookie")
    }

    const headers = this.request.headers
    if (headers && typeof headers === "object") {
      return headers.get("cookie") || headers.get("Cookie")
    }
    return null
  }
}

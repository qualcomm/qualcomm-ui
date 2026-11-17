// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {describe, expect, test} from "vitest"
import {render} from "vitest-browser-react"
import {page} from "vitest/browser"

import {SchemaVariants} from "./schema-property.js"

const pet = {properties: {name: {type: "string"}}, type: "object"}

describe("SchemaVariants", () => {
  test("shows the fields of an array-of-objects alternative", async () => {
    const schema = {oneOf: [{items: pet, type: "array"}, {type: "string"}]}
    await render(<SchemaVariants schema={schema} variants={schema.oneOf} />)

    await expect.element(page.getByText("name", {exact: true})).toBeVisible()
  })
})

import {describe, expect, test} from "vitest"
import {page} from "vitest/browser"
import {render} from "vitest-browser-react"

import {ParameterList} from "../components/operation/parameter-list"
import {SchemaPropertyHeading} from "../components/schema/schema-property-heading"
import {sampleOpenApiDocument} from "../test-utils/sample-openapi-document"
import type {OpenAPIV3_1, ParameterObject, SchemaObject} from "../types"

import petStoreApi from "./__tests__/pet-store.json"
import {ApiReference} from "./api-reference"

describe("ApiReference", () => {
  test("renders full API reference and captures screenshot", async () => {
    await render(<ApiReference document={sampleOpenApiDocument} />)

    // Wait for content to render
    await new Promise((resolve) => setTimeout(resolve, 500))

    await page.screenshot({
      element: document.body,
      path: "screenshots/api-reference-full.png",
    })
  })

  test("renders parameter list correctly", async () => {
    const parameters: ParameterObject[] = [
      {
        description: "Maximum number of pets to return",
        in: "query",
        name: "limit",
        required: false,
        schema: {
          default: 20,
          format: "int32",
          maximum: 100,
          type: "integer",
        } as SchemaObject,
      },
      {
        description: "Filter by pet status",
        in: "query",
        name: "status",
        required: true,
        schema: {
          enum: ["available", "pending", "sold"],
          type: "string",
        } as SchemaObject,
      },
    ]

    await render(
      <ParameterList parameters={parameters} title="Query Parameters" />,
    )

    // Check that parameter names are visible (use exact match to avoid description
    // text)
    await expect.element(page.getByText("limit", {exact: true})).toBeVisible()
    await expect.element(page.getByText("status", {exact: true})).toBeVisible()

    await page.screenshot({
      element: document.body,
      path: "screenshots/parameter-list.png",
    })
  })

  test("renders schema property heading correctly", async () => {
    const schema: SchemaObject = {
      description: "Unique identifier",
      format: "uuid",
      type: "string",
    }

    await render(
      <SchemaPropertyHeading name="userId" value={schema} required />,
    )

    await expect.element(page.getByText("userId")).toBeVisible()

    await page.screenshot({
      element: document.body,
      path: "screenshots/schema-property-heading.png",
    })
  })

  test("renders large spec for debugging", async () => {
    await render(<ApiReference document={petStoreApi as OpenAPIV3_1.Document} />)

    // Wait for content to render
    await new Promise((resolve) => setTimeout(resolve, 500))

    await page.screenshot({
      element: document.body,
      path: "screenshots/api-reference-full-large.png",
    })
  })
})

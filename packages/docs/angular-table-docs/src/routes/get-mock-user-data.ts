import {faker} from "@faker-js/faker"
import type {ActionFunctionArgs} from "react-router"

import {makeUserData} from "~utils/data"

const seeds: string[] = [
  "/features/column-dnd",
  "/features/column-grouping",
  "/features/column-pinning",
  "/features/column-sizing",
  "/features/column-visibility",
  "/features/editable-data",
  "/features/filters",
  "/features/grouping",
  "/features/pagination",
  "/features/pagination-controlled",
  "/features/row-dnd",
  "/features/row-expansion",
  "/features/row-expansion-customization",
  "/features/row-pinning",
  "/features/row-selection",
  "/features/sorting",
  "/features/virtualized-rows",
]

export async function action({request}: ActionFunctionArgs) {
  const referer = request.headers.get("referer")
  const body = await request.json()
  if (referer) {
    const demoUrl = new URL(referer).pathname
    let seed = seeds.indexOf(demoUrl) + 1
    if (!seed && import.meta.env.DEV) {
      console.warn("Faker seed not found for url: ", demoUrl)
    }
    if (body.timestamp) {
      seed = seed ^ body.timestamp
    }
    faker.seed(seed)
  }
  if (process.env.SKIP_LARGE_QUERIES === "true" && body.size[0] > 5000) {
    return Response.json([])
  }
  return Response.json(makeUserData(...body.size))
}

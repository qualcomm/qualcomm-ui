import type {ActionFunctionArgs} from "react-router"

import {makeUserData} from "@qualcomm-ui/react-docs-utils/data/use-user-data"

export async function action({request}: ActionFunctionArgs) {
  const body = await request.json()
  return Response.json(makeUserData(body.count))
}

import type {ActionFunctionArgs} from "react-router"

import {makeUserData} from "@qualcomm-ui/react-table-docs-utils/data"

export async function action({request}: ActionFunctionArgs) {
  const body = await request.json()
  return Response.json(makeUserData(...body.size))
}

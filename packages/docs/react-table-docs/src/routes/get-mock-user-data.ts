import type {ActionFunctionArgs} from "react-router"

import {makeUserData} from "~utils/data"

export async function action({request}: ActionFunctionArgs) {
  const body = await request.json()
  return Response.json(makeUserData(...body.size))
}

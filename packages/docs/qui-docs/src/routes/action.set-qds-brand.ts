import type {ActionFunction, ActionFunctionArgs} from "react-router"

import {qdsBrandCookie} from "../sessions.server"

export const action: ActionFunction = async ({request}: ActionFunctionArgs) => {
  const state = await request.text()

  return Response.json(
    {success: true},
    {
      headers: {"Set-Cookie": await qdsBrandCookie.serialize(state)},
    },
  )
}

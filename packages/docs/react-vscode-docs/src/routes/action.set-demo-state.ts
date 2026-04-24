import type {ActionFunction} from "react-router"

import {createDemoStateUpdateAction} from "@qualcomm-ui/react-router-utils/client"

import {demoStateCookie} from "../sessions.server"

export const action: ActionFunction =
  createDemoStateUpdateAction(demoStateCookie)

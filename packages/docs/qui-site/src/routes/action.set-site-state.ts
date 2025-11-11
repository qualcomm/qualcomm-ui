import {ActionFunction} from "react-router"

import {createUpdateAction} from "@qualcomm-ui/react-router-utils/client"

import {siteStateCookie} from "../sessions.server"

export const action: ActionFunction = createUpdateAction(siteStateCookie)

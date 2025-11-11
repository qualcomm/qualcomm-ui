import {ActionFunction} from "react-router"

import {createThemeAction} from "@qualcomm-ui/react-router-utils/client"

import {themeCookie} from "../sessions.server"

export const action: ActionFunction = createThemeAction(themeCookie)

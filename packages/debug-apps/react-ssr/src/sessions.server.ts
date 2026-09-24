import {createCookie} from "react-router"

export const themeCookie = createCookie("app-theme", {
  // one year
  maxAge: 31449600,
})

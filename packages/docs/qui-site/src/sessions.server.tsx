import {createCookie} from "react-router"

export const themeCookie = createCookie("app-theme", {
  // one year
  maxAge: 31449600,
})

export const siteStateCookie = createCookie("site-state", {
  // one year
  maxAge: 31449600,
})

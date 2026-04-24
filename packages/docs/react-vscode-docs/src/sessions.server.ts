import {createCookie} from "react-router"

export const themeCookie = createCookie("app-theme", {
  // one year
  maxAge: 31449600,
})

export const siteStateCookie = createCookie("site-state", {
  // one year
  maxAge: 31449600,
})

export const qdsBrandCookie = createCookie("qds-brand", {
  // one year
  maxAge: 31449600,
})

export const demoStateCookie = createCookie("demo-state", {maxAge: 3600})

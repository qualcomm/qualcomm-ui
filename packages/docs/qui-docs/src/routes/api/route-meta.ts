import {redirect} from "react-router"

export const loader = () => {
  return redirect("/api/nav-config", 302)
}

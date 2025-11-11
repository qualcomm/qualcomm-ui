import {redirect} from "react-router"

export const loader = async () => {
  return redirect("/api/nav-config", {status: 302})
}

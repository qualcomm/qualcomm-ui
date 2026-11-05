import {redirect} from "react-router"

export const loader = () => {
  return redirect("/pages", {status: 302})
}

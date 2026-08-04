import {redirect} from "react-router"

export function loader() {
  return redirect("/markdown", 302)
}

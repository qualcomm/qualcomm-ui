import {redirect} from "react-router"

export function loader() {
  return redirect("/guide/page-setup", 302)
}

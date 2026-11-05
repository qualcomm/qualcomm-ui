import {redirect} from "react-router"

export function loader() {
  return redirect("/ai-knowledge", 302)
}

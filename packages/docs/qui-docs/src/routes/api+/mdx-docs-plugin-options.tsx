import {redirect} from "react-router"

export const loader = async () => {
  return redirect("/api/qui-docs-config", {status: 302})
}

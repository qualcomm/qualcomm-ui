import {redirect} from "react-router"

export const loader = async () => {
  return redirect("/guide/page-setup", {status: 302})
}

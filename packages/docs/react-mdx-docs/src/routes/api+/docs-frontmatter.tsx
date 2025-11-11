import {redirect} from "react-router"

export const loader = async () => {
  return redirect("/api/page-frontmatter", {status: 302})
}

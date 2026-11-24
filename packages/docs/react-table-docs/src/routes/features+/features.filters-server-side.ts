import {redirect} from "react-router"

export function loader() {
  return redirect("/features/filters-server-side/filter-panel", 301)
}

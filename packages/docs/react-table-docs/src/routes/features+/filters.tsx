import {redirect} from "react-router"

export function loader() {
  return redirect("/features/filters-client-side/filter-panel", 301)
}

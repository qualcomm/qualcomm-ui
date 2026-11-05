import {type LoaderFunction, redirect} from "react-router"

export const loader: LoaderFunction = () => {
  return redirect("/api/qui-docs-config", 302)
}

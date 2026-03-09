import {useSearchParams} from "react-router"

import {NotFound} from "@qualcomm-ui/react-mdx/not-found"

export default function NotFoundPage() {
  const [params] = useSearchParams()
  return <NotFound url={params.get("url")} />
}

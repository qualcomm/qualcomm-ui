import {useMemo} from "react"

import {useJsonViewerStore} from "../stores"
import {isCycleReference} from "../utils"

export function useIsCycleReference(path: (string | number)[], value: any) {
  const rootValue = useJsonViewerStore((store) => store.value)

  return useMemo(
    () =>
      path[path.length - 1] !== "properties" &&
      isCycleReference(rootValue, path, value),
    [path, value, rootValue],
  )
}

import {useJsonViewerStore} from "../stores"

export const useTextColor = () => {
  return useJsonViewerStore((store) => store.colorspace.base07)
}

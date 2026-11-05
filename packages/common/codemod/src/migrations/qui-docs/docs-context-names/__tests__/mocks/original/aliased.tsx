import {useSiteContext as useSite} from "@qualcomm-ui/react-mdx/context"

export function useNavItems() {
  return useSite().navItems
}

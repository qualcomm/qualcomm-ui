import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

export const kbdClasses = {
  root: "qds-kbd",
} as const

export interface QdsKbdBindings {
  className: (typeof kbdClasses)["root"]
}

export function getQdsKbdBindings(normalizer: PropNormalizer): QdsKbdBindings {
  return normalizer.element({className: kbdClasses.root})
}

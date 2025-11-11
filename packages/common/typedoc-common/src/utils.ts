import type {QuiPropDeclaration} from "./types"

export function humanFileSize(size: number) {
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024))
  // @ts-expect-error
  return `${(size / Math.pow(1024, i)).toFixed(2) * 1} ${
    ["B", "kB", "MB", "GB", "TB"][i]
  }`
}

export function isPropRequired(prop: QuiPropDeclaration) {
  return prop.resolvedType.required
}

export function sortTypeDocProps<
  T extends QuiPropDeclaration = QuiPropDeclaration,
>(props: T[], sortRequiredPropsFirst: boolean | undefined) {
  return props.sort((a, b) => {
    if (sortRequiredPropsFirst) {
      if (isPropRequired(a) && !isPropRequired(b)) {
        return -1
      } else if (isPropRequired(b) && !isPropRequired(a)) {
        return 1
      }
    }
    const aName = a.name
    const bName = b.name
    return aName.localeCompare(bName)
  })
}

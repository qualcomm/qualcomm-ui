const ids: Record<string, number> = {}

export function useId(component: object, id: string | undefined | null) {
  if (id) {
    return id
  }
  const name = component.constructor.name
  if (!ids[name]) {
    ids[name] = 1
  }
  const nextId = ids[name]++
  return `«auto::${hashCode(`${name}${nextId.toString(32)}`).toString(32)}»`
}

function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

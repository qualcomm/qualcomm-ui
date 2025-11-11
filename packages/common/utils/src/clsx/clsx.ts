export type ClassValue =
  | ClassArray
  | ClassDictionary
  | string
  | number
  | null
  | boolean
  | undefined
export type ClassDictionary = Record<string, any>
export type ClassArray = ClassValue[]

function toVal(mix: ClassValue) {
  let k
  let y
  let str = ""

  if (typeof mix === "string" || typeof mix === "number") {
    str += mix
  } else if (typeof mix === "object") {
    if (Array.isArray(mix)) {
      const len = mix.length
      for (k = 0; k < len; k++) {
        if (mix[k]) {
          if ((y = toVal(mix[k]))) {
            if (str) {
              str += " "
            }
            str += y
          }
        }
      }
    } else {
      for (y in mix) {
        if (mix?.[y]) {
          if (str) {
            str += " "
          }
          str += y
        }
      }
    }
  }

  return str
}

export function clsx(...classes: ClassValue[]): string {
  let i = 0
  let tmp
  let x
  let str = ""
  const len = classes.length
  for (; i < len; i++) {
    if ((tmp = classes[i])) {
      if ((x = toVal(tmp))) {
        if (str) {
          str += " "
        }
        str += x
      }
    }
  }
  return str
}

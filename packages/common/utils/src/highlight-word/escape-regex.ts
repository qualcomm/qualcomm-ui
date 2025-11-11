export function escapeRegex(term: string): string {
  return term.replace(/[|\\{}()[\]^$+*?.-]/g, (char: string) => `\\${char}`)
}

export function removeCodeAnnotations(code: string): string {
  const annotationRegex = /\/\/\s*\[!code\s*(?:\S.*)?\]/

  return code
    .split("\n")
    .map((line) => {
      // keep the line if it's a ++ diff, as this is used to show the line's
      // addition in code blocks.
      return line.replace(/(?:\/\/\s*)?\[!code \+\+\]/, "")
    })
    .filter((line) => !annotationRegex.test(line))
    .join("\n")
}

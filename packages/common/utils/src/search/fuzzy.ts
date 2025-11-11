/**
 * Computes the Levenshtein distance between two strings. The Levenshtein distance
 * is a measure of the difference between two sequences, defined as the minimum
 * number of single-character edits (insertions, deletions, or substitutions)
 * required to change one string into the other.
 *
 * @param {string} a - The first string to compare.
 * @param {string} b - The second string to compare.
 * @return {number} The Levenshtein distance between the two input strings.
 */
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = []

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1,
        )
      }
    }
  }

  return matrix[b.length][a.length]
}

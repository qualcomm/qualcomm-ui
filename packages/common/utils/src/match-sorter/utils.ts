import {removeAccents} from "./remove-accents"

export const Rankings = {
  ACRONYM: 2,
  CASE_SENSITIVE_EQUAL: 7,
  CONTAINS: 3,
  EQUAL: 6,
  MATCHES: 1,
  NO_MATCH: 0,
  STARTS_WITH: 5,
  WORD_STARTS_WITH: 4,
} as const

export type Rankings = (typeof Rankings)[keyof typeof Rankings]

/**
 * Returns a score based on how spread apart the
 * characters from the stringToRank are within the testString.
 * A number close to rankings.MATCHES represents a loose match. A number close
 * to rankings.MATCHES + 1 represents a tighter match.
 *
 * @param {String} testString - the string to test against
 * @param {String} stringToRank - the string to rank
 * @returns {Number} the number between rankings.MATCHES and
 * rankings.MATCHES + 1 for how well stringToRank matches testString
 */
export function getClosenessRanking(
  testString: string,
  stringToRank: string,
): Rankings {
  let matchingInOrderCharCount = 0
  let charNumber = 0
  function findMatchingCharacter(
    matchChar: undefined | string,
    string: string,
    index: number,
  ) {
    for (let j = index, J = string.length; j < J; j++) {
      const stringChar = string[j]
      if (stringChar === matchChar) {
        matchingInOrderCharCount += 1
        return j + 1
      }
    }
    return -1
  }
  function getRanking(spread: number) {
    const spreadPercentage = 1 / spread
    const inOrderPercentage = matchingInOrderCharCount / stringToRank.length
    const ranking = Rankings.MATCHES + inOrderPercentage * spreadPercentage
    return ranking as Rankings
  }
  const firstIndex = findMatchingCharacter(stringToRank[0], testString, 0)
  if (firstIndex < 0) {
    return Rankings.NO_MATCH
  }
  charNumber = firstIndex
  for (let i = 1, I = stringToRank.length; i < I; i++) {
    const matchChar = stringToRank[i]
    charNumber = findMatchingCharacter(matchChar, testString, charNumber)
    const found = charNumber > -1
    if (!found) {
      return Rankings.NO_MATCH
    }
  }

  const spread = charNumber - firstIndex
  return getRanking(spread)
}

interface PrepareValueForComparisonOptions {
  keepDiacritics?: boolean
}

/**
 * Prepares value for comparison by stringifying it, removing diacritics (if
 * specified)
 *
 * @param {String} value - the value to clean
 * @param {Object} options - {keepDiacritics: whether to remove diacritics}
 * @returns {String} the prepared value
 */
export function prepareValueForComparison(
  value: string,
  {keepDiacritics}: PrepareValueForComparisonOptions,
): string {
  // value might not actually be a string at this point (we don't get to choose)
  // so part of preparing the value for comparison is ensure that it is a string
  value = `${value}` // toString
  if (!keepDiacritics) {
    value = removeAccents(value)
  }
  return value
}

/**
 * Gives a rankings score based on how well the two strings match.
 *
 * @param {String} testString - the string to test against
 * @param {String} stringToRank - the string to rank
 * @param {Object} options - options for the match (like keepDiacritics for comparison)
 * @returns {Number} the ranking for how well stringToRank matches testString
 */
export function getMatchRanking(
  testString: string,
  stringToRank: string,
  options: PrepareValueForComparisonOptions,
): Rankings {
  testString = prepareValueForComparison(testString, options)
  stringToRank = prepareValueForComparison(stringToRank, options)

  // too long
  if (stringToRank.length > testString.length) {
    return Rankings.NO_MATCH
  }

  // case sensitive equals
  if (testString === stringToRank) {
    return Rankings.CASE_SENSITIVE_EQUAL
  }

  // Lower casing before further comparison
  testString = testString.toLowerCase()
  stringToRank = stringToRank.toLowerCase()

  // case insensitive equals
  if (testString === stringToRank) {
    return Rankings.EQUAL
  }

  // starts with
  if (testString.startsWith(stringToRank)) {
    return Rankings.STARTS_WITH
  }

  // word starts with
  if (testString.includes(` ${stringToRank}`)) {
    return Rankings.WORD_STARTS_WITH
  }

  // contains
  if (testString.includes(stringToRank)) {
    return Rankings.CONTAINS
  } else if (stringToRank.length === 1) {
    // If the only character in the given stringToRank
    //   isn't even contained in the testString, then
    //   it's definitely not a match.
    return Rankings.NO_MATCH
  }

  // acronym
  if (getAcronym(testString).includes(stringToRank)) {
    return Rankings.ACRONYM
  }

  // will return a number between rankings.MATCHES and
  // rankings.MATCHES + 1 depending  on how close of a match it is.
  return getClosenessRanking(testString, stringToRank)
}

/**
 * Generates an acronym for a string.
 *
 * @param {String} string the string for which to produce the acronym
 * @returns {String} the acronym
 */
function getAcronym(string: string): string {
  let acronym = ""
  const wordsInString = string.split(" ")
  wordsInString.forEach((wordInString) => {
    const splitByHyphenWords = wordInString.split("-")
    splitByHyphenWords.forEach((splitByHyphenWord) => {
      acronym += splitByHyphenWord.substr(0, 1)
    })
  })
  return acronym
}

export const defaultKeyAttributes = {
  maxRanking: Infinity as Rankings,
  minRanking: -Infinity as Rankings,
}

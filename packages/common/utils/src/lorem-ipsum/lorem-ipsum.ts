// Modified from https://github.com/knicklabs/lorem-ipsum.js
// ISC License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  getStandardDeviation,
  randomFromRange,
  randomPositiveFromRange,
} from "./utils"
import {words} from "./words"

class SeededRandom {
  private seed: number

  constructor(seed: number) {
    this.seed = seed
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280
    return this.seed / 233280
  }

  fromRange(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min
  }

  positiveFromRange(min: number, max: number): number {
    return Math.max(1, this.fromRange(Math.ceil(min), Math.floor(max)))
  }
}

export interface LoremIpsumOptions {
  /**
   * Average number of sentences created for each paragraph (standard deviation is
   * fixed ±25%)
   *
   * @default 5
   */
  avgSentencesPerParagraph?: number
  /**
   * Average number of words created for each sentence (standard deviation is fixed
   * ±25%)
   *
   * @default 8
   */
  avgWordsPerSentence?: number
  /**
   * @default 1
   */
  numParagraphs?: number
  /**
   * If `false`, always generates the same paragraphs in order.
   *
   * @default false
   */
  random?: boolean
  /**
   * Seed for deterministic random generation. If not provided, uses Math.random()
   */
  seed?: number
  /**
   * Start with 'Lorem ipsum odor amet...' to first sentence of first paragraph
   *
   * @default true
   */
  startWithLoremIpsum?: boolean
}

const stDevPercentage = 0.25

class LoremIpsumGenerator {
  private readonly options: Required<Omit<LoremIpsumOptions, "seed">> &
    Pick<LoremIpsumOptions, "seed">
  private readonly rng: SeededRandom | null

  constructor(options: LoremIpsumOptions = {}) {
    this.options = {
      avgSentencesPerParagraph: options.avgSentencesPerParagraph ?? 5,
      avgWordsPerSentence: options.avgWordsPerSentence ?? 8,
      numParagraphs: options.numParagraphs ?? 1,
      random: options.random ?? false,
      seed: options.seed,
      startWithLoremIpsum: options.startWithLoremIpsum ?? true,
    }
    this.rng =
      this.options.seed !== undefined
        ? new SeededRandom(this.options.seed)
        : null
  }

  generate = (): string[] => {
    const createParagraph = this.options.random
      ? this.createRandomParagraph
      : this.createStandardParagraph
    return Array.from({length: this.options.numParagraphs}, (_, i) =>
      createParagraph(i),
    )
  }

  private getRandomWord(): string {
    const index = this.rng
      ? this.rng.fromRange(0, words.length - 1)
      : randomFromRange(0, words.length - 1)
    return words[index]
  }

  private static getWord(i: number): string {
    return words[i % words.length]
  }

  private midPunctuation(sentenceLength: number): {
    position?: number
    punctuation?: string
  } {
    const punctuations = [",", ";"]
    let punctuation: string | undefined
    let position: number | undefined
    if (sentenceLength > 6) {
      const random = this.rng ? this.rng.next() : Math.random()
      const hasPunctuation = random <= 0.25
      if (hasPunctuation) {
        position = this.rng
          ? this.rng.fromRange(2, sentenceLength - 3)
          : randomFromRange(2, sentenceLength - 3)
        const puncIndex = this.rng
          ? this.rng.fromRange(0, punctuations.length - 1)
          : randomFromRange(0, punctuations.length - 1)
        punctuation = punctuations[puncIndex]
      }
    }
    return {position, punctuation}
  }

  private endPunctuation(): "!" | "?" | "." {
    const random = this.rng ? this.rng.next() : Math.random()
    if (random > 0.99) {
      return "!"
    }
    if (random > 0.95) {
      return "?"
    }
    return "."
  }

  private createSentence(withLoremIpsum: boolean): string {
    if (withLoremIpsum) {
      return "Lorem ipsum odor amet, consectetuer adipiscing elit."
    }
    const avgWordsPerSentence = this.options.avgWordsPerSentence
    const stDev = getStandardDeviation(avgWordsPerSentence, stDevPercentage)
    const sentenceLength = this.rng
      ? this.rng.positiveFromRange(
          avgWordsPerSentence - stDev,
          avgWordsPerSentence + stDev,
        )
      : randomPositiveFromRange(
          avgWordsPerSentence - stDev,
          avgWordsPerSentence + stDev,
        )

    const midPunc = this.midPunctuation(sentenceLength)
    let sentence = ""
    for (let i = 0; i < sentenceLength; i += 1) {
      sentence += `${this.getRandomWord()}${
        midPunc.position === i ? midPunc.punctuation : ""
      } `
    }
    sentence = `${
      sentence.charAt(0).toUpperCase() + sentence.substring(1).trim()
    }${this.endPunctuation()}`
    return sentence
  }

  private createStandardParagraph = (paragraphIndex: number): string => {
    let paragraph = ""
    const baseOffset =
      paragraphIndex *
      this.options.avgSentencesPerParagraph *
      this.options.avgWordsPerSentence
    for (let i = 0; i < this.options.avgSentencesPerParagraph; i += 1) {
      let sentence = ""
      for (let j = 0; j < this.options.avgWordsPerSentence; j += 1) {
        sentence += `${LoremIpsumGenerator.getWord(
          baseOffset + i * this.options.avgWordsPerSentence + j,
        )} `
      }
      paragraph += `${
        sentence.charAt(0).toUpperCase() + sentence.slice(1).trim()
      }. `
    }
    return paragraph.trim()
  }

  private createRandomParagraph = (paragraphIndex: number): string => {
    const avgSentencesPerParagraph = this.options.avgSentencesPerParagraph
    const stDev = getStandardDeviation(
      avgSentencesPerParagraph,
      stDevPercentage,
    )
    const paragraphLength = this.rng
      ? this.rng.positiveFromRange(
          avgSentencesPerParagraph - stDev,
          avgSentencesPerParagraph + stDev,
        )
      : randomPositiveFromRange(
          avgSentencesPerParagraph - stDev,
          avgSentencesPerParagraph + stDev,
        )

    let paragraph = ""
    for (let i = 0; i < paragraphLength; i += 1) {
      const withLoremIpsum =
        i === 0 && paragraphIndex === 0 && this.options.startWithLoremIpsum
      paragraph += `${this.createSentence(withLoremIpsum)} `
    }
    return paragraph.trim()
  }
}

export function loremIpsum(opts: LoremIpsumOptions = {}): string[] {
  return new LoremIpsumGenerator(opts).generate()
}

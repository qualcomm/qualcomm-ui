import {booleanAttribute, Component, computed, input} from "@angular/core"

import {numberAttributeOrUndefined} from "@qualcomm-ui/angular-core/attributes"
import type {Booleanish, NumberInput} from "@qualcomm-ui/utils/coercion"
import {loremIpsum, type LoremIpsumOptions} from "@qualcomm-ui/utils/lorem-ipsum"

@Component({
  selector: "[q-lorem-ipsum]",
  template: `
    @for (paragraph of paragraphs(); track $index) {
      <div>{{ paragraph }}</div>
    }
  `,
})
export class LoremIpsumDirective {
  /**
   * Average number of sentences created for each paragraph (standard deviation is
   * fixed ±25%)
   *
   * @default 5
   */
  readonly avgSentencesPerParagraph = input<number | undefined, NumberInput>(
    undefined,
    {
      transform: numberAttributeOrUndefined,
    },
  )

  /**
   * Average number of words created for each sentence (standard deviation is fixed
   * ±25%)
   *
   * @default 8
   */
  readonly avgWordsPerSentence = input<number | undefined, NumberInput>(
    undefined,
    {
      transform: numberAttributeOrUndefined,
    },
  )

  /**
   * @default 1
   */
  readonly numParagraphs = input<number | undefined, NumberInput>(undefined, {
    transform: numberAttributeOrUndefined,
  })

  /**
   * If `false`, always generates the same paragraphs in order.
   *
   * @default false
   */
  readonly random = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Seed for deterministic random generation. If not provided, uses Math.random()
   */
  readonly seed = input<number | undefined, NumberInput>(undefined, {
    transform: numberAttributeOrUndefined,
  })

  /**
   * Start with 'Lorem ipsum odor amet...' to first sentence of first paragraph
   *
   * @default true
   */
  readonly startWithLoremIpsum = input<boolean | undefined, Booleanish>(
    undefined,
    {
      transform: booleanAttribute,
    },
  )

  readonly loremIpsumOptions = computed<LoremIpsumOptions>(() => {
    return {
      avgSentencesPerParagraph: this.avgSentencesPerParagraph(),
      avgWordsPerSentence: this.avgWordsPerSentence(),
      numParagraphs: this.numParagraphs(),
      random: this.random(),
      seed: this.seed(),
      startWithLoremIpsum: this.startWithLoremIpsum(),
    }
  })

  readonly paragraphs = computed(() => loremIpsum(this.loremIpsumOptions()))
}

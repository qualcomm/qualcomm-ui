// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ElementType, ReactNode} from "react"

import {PolymorphicAsElement} from "@qualcomm-ui/react-core/system"
import {loremIpsum, type LoremIpsumOptions} from "@qualcomm-ui/utils/lorem-ipsum"

export interface LoremIpsumProps extends LoremIpsumOptions {
  /**
   * @default 'p'
   */
  paragraphElement?: ElementType
}

export function LoremIpsum({
  paragraphElement = "p",
  ...props
}: LoremIpsumProps): ReactNode {
  const paragraphs = loremIpsum(props)
  return paragraphs.map((paragraph, index) => (
    <PolymorphicAsElement
      key={props.random ? `${paragraph}-${index}` : paragraph}
      as={paragraphElement}
    >
      {paragraph}
    </PolymorphicAsElement>
  ))
}

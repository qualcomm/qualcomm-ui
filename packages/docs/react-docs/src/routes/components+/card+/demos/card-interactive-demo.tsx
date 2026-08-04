import type {ReactElement} from "react"

import {Card} from "@qualcomm-ui/react/card"

export function CardInteractiveDemo(): ReactElement {
  return (
    <div className="flex flex-wrap gap-6">
      {/* preview */}
      <Card.Root
        className="w-64"
        interactive
        render={<button />}
        variant="elevated"
      >
        <Card.Content>
          <Card.Heading>
            <Card.HeadingText>Interactive Card</Card.HeadingText>
          </Card.Heading>
          <Card.ParagraphText>
            Hover or press this card to see the interactive states.
          </Card.ParagraphText>
        </Card.Content>
      </Card.Root>
      {/* preview */}
    </div>
  )
}

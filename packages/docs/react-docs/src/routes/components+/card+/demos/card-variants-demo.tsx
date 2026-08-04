import type {ReactElement} from "react"

import {Card} from "@qualcomm-ui/react/card"

export function CardVariantsDemo(): ReactElement {
  return (
    <div className="flex flex-wrap justify-center gap-6">
      {/* preview */}
      <Card.Root className="w-64" variant="outline">
        <Card.Content>
          <Card.Heading>
            <Card.HeadingText>Outline</Card.HeadingText>
          </Card.Heading>
          <Card.ParagraphText>
            A card with a border and background color.
          </Card.ParagraphText>
        </Card.Content>
      </Card.Root>

      <Card.Root className="w-64" variant="outline-elevated">
        <Card.Content>
          <Card.Heading>
            <Card.HeadingText>Outline Elevated</Card.HeadingText>
          </Card.Heading>
          <Card.ParagraphText>
            A card with a border and subtle elevation.
          </Card.ParagraphText>
        </Card.Content>
      </Card.Root>

      <Card.Root className="w-64" variant="elevated">
        <Card.Content>
          <Card.Heading>
            <Card.HeadingText>Elevated</Card.HeadingText>
          </Card.Heading>
          <Card.ParagraphText>
            A card with a subtle elevation and no border.
          </Card.ParagraphText>
        </Card.Content>
      </Card.Root>
      {/* preview */}
    </div>
  )
}

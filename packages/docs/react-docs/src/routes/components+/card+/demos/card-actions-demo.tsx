import type {ReactElement} from "react"

import {ChevronRight} from "lucide-react"

import {Card} from "@qualcomm-ui/react/card"

export function CardActionsDemo(): ReactElement {
  return (
    <div className="flex flex-wrap gap-6">
      {/* preview */}
      <Card.Root className="w-64 self-start" variant="outline">
        <Card.Content>
          <Card.Heading>
            <Card.HeadingText>Link Action</Card.HeadingText>
          </Card.Heading>
          <Card.ParagraphText>
            Cards can use links to navigate users to related content.
          </Card.ParagraphText>
        </Card.Content>
        <Card.Footer>
          <Card.Link endIcon={ChevronRight}>Learn More</Card.Link>
        </Card.Footer>
      </Card.Root>

      <Card.Root className="w-64" variant="outline">
        <Card.Content>
          <Card.Heading>
            <Card.HeadingText>Button Actions</Card.HeadingText>
          </Card.Heading>
          <Card.ParagraphText>
            Cards can use buttons for primary and secondary actions.
          </Card.ParagraphText>
        </Card.Content>
        <Card.Footer>
          <Card.Button variant="secondary">Cancel</Card.Button>
          <Card.Button variant="primary">Confirm</Card.Button>
        </Card.Footer>
      </Card.Root>
      {/* preview */}
    </div>
  )
}

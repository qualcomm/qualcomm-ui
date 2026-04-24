import type {ReactElement} from "react"

import {User} from "lucide-react"

import {Avatar} from "@qualcomm-ui/react/avatar"
import {Card} from "@qualcomm-ui/react/card"

export function CardShowcaseDemo(): ReactElement {
  return (
    <div className="flex flex-wrap gap-6">
      {/* preview */}
      <Card.Root className="w-72" variant="outline">
        <Card.Media>
          <Card.Avatar>
            <Avatar.Content icon={User} />
          </Card.Avatar>
        </Card.Media>
        <Card.Content>
          <Card.Heading>
            <Card.HeadingText>Card Title</Card.HeadingText>
            <Card.SubheadingText>Subheading</Card.SubheadingText>
          </Card.Heading>

          <Card.SubheadingText>Paragraph Subheading</Card.SubheadingText>
          <Card.ParagraphText>
            This is a small card with media, header, body text, and a footer
            with actions.
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

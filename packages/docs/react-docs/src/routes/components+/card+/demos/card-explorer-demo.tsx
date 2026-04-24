import type {ReactElement} from "react"

import {User} from "lucide-react"

import {Avatar} from "@qualcomm-ui/react/avatar"
import {Card} from "@qualcomm-ui/react/card"

export function CardExplorerDemo(): ReactElement {
  return (
    <Card.Root className="w-72" variant="outline">
      <Card.Media>
        <Card.Avatar>
          <Avatar.Content icon={User} />
        </Card.Avatar>
      </Card.Media>
      <Card.Content>
        <Card.Heading>
          <Card.EyebrowText>Eyebrow</Card.EyebrowText>
          <Card.HeadingText>Card Title</Card.HeadingText>
        </Card.Heading>
        <Card.SubheadingText>Subheading</Card.SubheadingText>
        <Card.ParagraphText>
          A brief description that provides additional context about this card.
        </Card.ParagraphText>
        <Card.Link>Learn more</Card.Link>
      </Card.Content>
      <Card.Footer>
        <Card.Button variant="primary">Action</Card.Button>
      </Card.Footer>
    </Card.Root>
  )
}

import type {ReactElement} from "react"

import {ChevronRight} from "lucide-react"

import {Badge} from "@qualcomm-ui/react/badge"
import {Card} from "@qualcomm-ui/react/card"

export function CardBadgeDemo(): ReactElement {
  return (
    <div className="flex flex-wrap gap-6">
      {/* preview */}
      <Card.Root className="w-72" variant="outline">
        <Card.Badge>
          <Badge emphasis="brand">NEW</Badge>
        </Card.Badge>
        <Card.Content>
          <Card.Heading>
            <Card.HeadingText>Snapdragon X2 Elite</Card.HeadingText>
            <Card.SubheadingText>
              A legendary leap in performance
            </Card.SubheadingText>
          </Card.Heading>
          <Card.ParagraphText>
            Unleash your masterpiece with ultra-premium performance, multi-day
            battery life, and blazing AI processing power.
          </Card.ParagraphText>
        </Card.Content>
        <Card.Footer>
          <Card.Link endIcon={ChevronRight}>Learn More</Card.Link>
        </Card.Footer>
      </Card.Root>
      {/* preview */}
    </div>
  )
}

import type {ReactElement} from "react"

import {ChevronRight} from "lucide-react"

import {Card} from "@qualcomm-ui/react/card"

export function CardMediaDemo(): ReactElement {
  return (
    <div className="flex flex-wrap gap-6">
      {/* preview */}
      <Card.Root className="w-64" variant="outline">
        <Card.Media>
          <img
            alt="Qualcomm automotive technology"
            className="h-40 w-full"
            src="https://react.qui.qualcomm.com/images/auto-vertical-1.png"
          />
        </Card.Media>
        <Card.Content>
          <Card.Heading>
            <Card.HeadingText>Automotive Platform</Card.HeadingText>
            <Card.SubheadingText>Next-gen connectivity</Card.SubheadingText>
          </Card.Heading>
        </Card.Content>
        <Card.Footer>
          <Card.Link endIcon={ChevronRight}>Learn More</Card.Link>
        </Card.Footer>
      </Card.Root>
      {/* preview */}
    </div>
  )
}

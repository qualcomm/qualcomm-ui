import {type ReactElement, useState} from "react"

import type {QdsCardAlignment} from "@qualcomm-ui/qds-core/card"
import {Card} from "@qualcomm-ui/react/card"
import {Radio, RadioGroup} from "@qualcomm-ui/react/radio"

export function CardAlignmentDemo(): ReactElement {
  const [alignment, setAlignment] = useState<QdsCardAlignment>("start")
  return (
    <div className="flex flex-col items-center gap-8">
      {/* preview */}
      <Card.Root alignment={alignment} className="w-80" variant="outline">
        <Card.Content>
          <Card.Heading>
            <Card.EyebrowText>Eyebrow</Card.EyebrowText>
            <Card.HeadingText>Card Title</Card.HeadingText>
            <Card.SubheadingText>Subheading</Card.SubheadingText>
          </Card.Heading>
          <Card.ParagraphText>
            Toggle between start and center alignment to see how heading and
            footer content repositions.
          </Card.ParagraphText>
        </Card.Content>
        <Card.Footer>
          <Card.Button variant="secondary">Cancel</Card.Button>
          <Card.Button variant="primary">Confirm</Card.Button>
        </Card.Footer>
      </Card.Root>
      {/* preview */}

      <RadioGroup.Root
        defaultValue="start"
        name="card-alignment"
        onValueChange={(value) => {
          setAlignment((value as QdsCardAlignment) || "start")
        }}
        orientation="horizontal"
      >
        <RadioGroup.Items>
          <Radio label="start" value="start" />
          <Radio label="center" value="center" />
        </RadioGroup.Items>
      </RadioGroup.Root>
    </div>
  )
}

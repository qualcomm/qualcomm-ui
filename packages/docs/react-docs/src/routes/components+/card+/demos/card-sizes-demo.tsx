import {type ReactElement, useState} from "react"

import {User} from "lucide-react"

import type {QdsCardSize} from "@qualcomm-ui/qds-core/card"
import {Avatar} from "@qualcomm-ui/react/avatar"
import {Card} from "@qualcomm-ui/react/card"
import {Radio, RadioGroup} from "@qualcomm-ui/react/radio"

export function CardSizesDemo(): ReactElement {
  const [size, setSize] = useState<QdsCardSize>("sm")
  const width = size === "sm" ? 256 : size === "md" ? 288 : 324
  return (
    <div className="flex flex-col items-center gap-8">
      {/* preview */}
      <Card.Root size={size} style={{width}} variant="outline">
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
            Resize this card using the controls below to see how spacing and
            typography scale across sizes.
          </Card.ParagraphText>
        </Card.Content>
        <Card.Footer>
          <Card.Button variant="secondary">Cancel</Card.Button>
          <Card.Button variant="primary">Confirm</Card.Button>
        </Card.Footer>
      </Card.Root>
      {/* preview */}

      <RadioGroup.Root
        defaultValue="sm"
        name="card-size"
        onValueChange={(value) => {
          setSize((value as QdsCardSize) || "sm")
        }}
        orientation="horizontal"
      >
        <RadioGroup.Items>
          <Radio label="sm" value="sm" />
          <Radio label="md" value="md" />
          <Radio label="lg" value="lg" />
        </RadioGroup.Items>
      </RadioGroup.Root>
    </div>
  )
}

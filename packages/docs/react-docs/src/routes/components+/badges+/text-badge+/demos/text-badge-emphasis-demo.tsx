import type {ReactElement} from "react"

import {Badge} from "@qualcomm-ui/react/badge"

export default function TextBadgeEmphasisDemo(): ReactElement {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge emphasis="neutral">Neutral</Badge>
        <Badge emphasis="brand">Brand</Badge>
        <Badge emphasis="info">Info</Badge>
        <Badge emphasis="success">Success</Badge>
        <Badge emphasis="warning">Warning</Badge>
        <Badge emphasis="danger">Danger</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge emphasis="blue">blue</Badge>
        <Badge emphasis="cyan">cyan</Badge>
        <Badge emphasis="green">green</Badge>
        <Badge emphasis="kiwi">kiwi</Badge>
        <Badge emphasis="magenta">magenta</Badge>
        <Badge emphasis="orange">orange</Badge>
        <Badge emphasis="purple">purple</Badge>
        <Badge emphasis="red">red</Badge>
        <Badge emphasis="teal">teal</Badge>
        <Badge emphasis="yellow">yellow</Badge>
      </div>
    </div>
  )
}

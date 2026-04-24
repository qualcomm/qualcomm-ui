import type {ReactElement} from "react"

import {Badge} from "@qualcomm-ui/react/badge"

export function TextBadgeEmphasisDemo(): ReactElement {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge emphasis="neutral">neutral</Badge>
        <Badge emphasis="brand">brand</Badge>
        <Badge emphasis="info">info</Badge>
        <Badge emphasis="success">success</Badge>
        <Badge emphasis="warning">warning</Badge>
        <Badge emphasis="danger">danger</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge emphasis="blue">blue</Badge>
        <Badge emphasis="cyan">cyan</Badge>
        <Badge emphasis="teal">teal</Badge>
        <Badge emphasis="lime">lime</Badge>
        <Badge emphasis="green">green</Badge>
        <Badge emphasis="yellow">yellow</Badge>
        <Badge emphasis="amber">amber</Badge>
        <Badge emphasis="orange">orange</Badge>
        <Badge emphasis="red">red</Badge>
        <Badge emphasis="magenta">magenta</Badge>
        <Badge emphasis="violet">violet</Badge>
        <Badge emphasis="purple">purple</Badge>
      </div>
    </div>
  )
}

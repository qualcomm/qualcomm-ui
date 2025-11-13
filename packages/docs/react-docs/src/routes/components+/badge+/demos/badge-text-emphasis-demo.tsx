import type {ReactElement} from "react"

import {Badge} from "@qualcomm-ui/react/badge"

export default function BadgeTextEmphasisDemo(): ReactElement {
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
        <Badge emphasis="cat-1">Cat 1</Badge>
        <Badge emphasis="cat-2">Cat 2</Badge>
        <Badge emphasis="cat-3">Cat 3</Badge>
        <Badge emphasis="cat-4">Cat 4</Badge>
        <Badge emphasis="cat-5">Cat 5</Badge>
        <Badge emphasis="cat-6">Cat 6</Badge>
        <Badge emphasis="cat-7">Cat 7</Badge>
        <Badge emphasis="cat-8">Cat 8</Badge>
        <Badge emphasis="cat-9">Cat 9</Badge>
        <Badge emphasis="cat-10">Cat 10</Badge>
      </div>
    </div>
  )
}

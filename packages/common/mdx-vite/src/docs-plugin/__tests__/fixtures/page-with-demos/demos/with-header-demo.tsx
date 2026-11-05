// @ts-nocheck

import {CardHeader} from "./card-header.js"
import {Card} from "./card.js"

export function WithHeaderDemo() {
  return (
    <Card>
      <CardHeader>Title</CardHeader>
      <p>Card content</p>
    </Card>
  )
}

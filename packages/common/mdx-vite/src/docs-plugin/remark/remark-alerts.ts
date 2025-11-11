// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {PhrasingContent, Root} from "mdast"
import type {Plugin} from "unified"
import {visit} from "unist-util-visit"

const alertLegacyRegex = /^\[!(NOTE|TIP|SUCCESS|WARNING|CAUTION)(\/.*)?\]/i

/**
 * Alerts are a Markdown extension based on the blockquote syntax that you can use
 * to emphasize critical information. On GitHub, they are displayed with distinctive
 * colors and icons to indicate the significance of the content.
 * https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts
 */
export const remarkAlerts: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, "blockquote", (node) => {
      let alertType = ""
      let title = ""
      let isNext = true
      const child = node.children.map((item) => {
        if (isNext && item.type === "paragraph") {
          const firstNode = item.children[0]
          const text = firstNode.type === "text" ? firstNode.value : ""
          const reg = alertLegacyRegex
          const match = text.match(reg)
          if (match) {
            isNext = false
            alertType = match[1].toLocaleLowerCase()
            title = match[2] || alertType.toLocaleUpperCase()
            if (text.includes("\n")) {
              item.children[0] = {
                type: "text",
                value: text.replace(reg, "").replace(/^\n+/, ""),
              }
            }

            if (!text.includes("\n")) {
              const itemChild: PhrasingContent[] = []
              item.children.forEach((item: any, idx: number) => {
                if (idx === 0) {
                  return
                }
                if (idx === 1 && item.type === "break") {
                  return
                }
                itemChild.push(item)
              })
              item.children = [...itemChild]
            }
          }
        }
        return item
      })

      title = title.replace(/^\//, "")

      if (!!alertType) {
        node.data = {
          hName: "div",
          hProperties: {
            class: `qui-notification__root`,
            "data-emphasis":
              alertToEmphasis[alertType as IconType] || "neutral",
            "data-orientation": "vertical",
            dir: "auto",
          },
        }
        node.children = [
          {
            children: [getAlertIcon(alertType as IconType)],
            data: {
              hProperties: {
                class: "qui-notification__icon",
                "data-part": "status-icon",
                "data-scope": "inline-notification",
              },
            },
            type: "paragraph",
          },
          {
            children: [
              {
                type: "text",
                value: title,
              },
            ],
            data: {
              hProperties: {
                class: "qui-notification__label",
                dir: "auto",
              },
            },
            type: "paragraph",
          },
          {
            children: child,
            data: {
              hName: "div",
              hProperties: {
                class: `qui-notification__description`,
                dir: "auto",
              },
            },
            type: "blockquote",
          },
        ]
      }
    })
  }
}

export function getAlertIcon(type: IconType): PhrasingContent {
  const svgChildren = svgData[type] ?? []
  return {
    children: svgChildren,
    data: {
      hName: "svg",
      hProperties: {
        ariaHidden: "true",
        class: "lucide",
        fill: "transparent",
        height: "20",
        stroke: "currentColor",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: "2",
        viewBox: "0 0 24 24",
        width: "20",
      },
    },
    type: "emphasis",
  }
}

type IconType = "note" | "tip" | "success" | "warning" | "caution"

/**
 * These SVG children correspond to the lucide icons matching our
 * {@link https://react.qui.qualcomm.com/components/inline-alert | Alert} component.
 */
const svgData: Record<IconType, PhrasingContent[]> = {
  caution: [
    {
      children: [],
      data: {
        hName: "polygon",
        hProperties: {
          points:
            "7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2",
        },
      },
      type: "emphasis",
    },
    {
      children: [],
      data: {
        hName: "line",
        hProperties: {
          x1: "12",
          x2: "12",
          y1: "8",
          y2: "12",
        },
      },
      type: "emphasis",
    },
    {
      children: [],
      data: {
        hName: "line",
        hProperties: {
          x1: "12",
          x2: "12.01",
          y1: "16",
          y2: "16",
        },
      },
      type: "emphasis",
    },
  ],
  note: [
    {
      children: [],
      data: {
        hName: "circle",
        hProperties: {
          cx: "12",
          cy: "12",
          r: "10",
        },
      },
      type: "emphasis",
    },
    {
      children: [],
      data: {
        hName: "path",
        hProperties: {
          d: "M12 16v-4",
        },
      },
      type: "emphasis",
    },
    {
      children: [],
      data: {
        hName: "path",
        hProperties: {
          d: "M12 8h.01",
        },
      },
      type: "emphasis",
    },
  ],
  success: [
    {
      children: [],
      data: {
        hName: "path",
        hProperties: {
          d: "M20 6 9 17l-5-5",
        },
      },
      type: "emphasis",
    },
  ],
  tip: [
    {
      children: [],
      data: {
        hName: "path",
        hProperties: {
          d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",
        },
      },
      type: "emphasis",
    },
    {
      children: [],
      data: {
        hName: "path",
        hProperties: {
          d: "M9 18h6",
        },
      },
      type: "emphasis",
    },
    {
      children: [],
      data: {
        hName: "path",
        hProperties: {
          d: "M10 22h4",
        },
      },
      type: "emphasis",
    },
  ],
  warning: [
    {
      children: [],
      data: {
        hName: "path",
        hProperties: {
          d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
        },
      },
      type: "emphasis",
    },
    {
      children: [],
      data: {
        hName: "path",
        hProperties: {
          d: "M12 9v4",
        },
      },
      type: "emphasis",
    },
    {
      children: [],
      data: {
        hName: "path",
        hProperties: {
          d: "M12 17h.01",
        },
      },
      type: "emphasis",
    },
  ],
}

const alertToEmphasis: Record<IconType, string> = {
  caution: "danger",
  note: "neutral",
  success: "success",
  tip: "info",
  warning: "warning",
}

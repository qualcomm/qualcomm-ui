import type {ReactElement} from "react"

import {Bot} from "lucide-react"

import {HeaderBar} from "@qualcomm-ui/react/header-bar"
import {Tooltip} from "@qualcomm-ui/react/tooltip"

interface HeaderAiLinkProps {
  modelId: string
}

export function HeaderAiLink(props: HeaderAiLinkProps): ReactElement {
  return (
    <Tooltip
      portalProps={{disabled: true}}
      trigger={
        <HeaderBar.ActionIconButton
          aria-label="AI Chat (QC-only)"
          icon={Bot}
          render={
            <a
              href={`https://qui-ai.sdprd.oks.drekar.qualcomm.com/?model=${props.modelId}`}
              rel="noreferrer"
              target="_blank"
            />
          }
        />
      }
    >
      AI Chat (QC-only)
    </Tooltip>
  )
}

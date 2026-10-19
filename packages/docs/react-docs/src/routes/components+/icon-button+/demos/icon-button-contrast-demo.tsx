import type {ReactElement} from "react"

import {ExternalLink} from "lucide-react"

import {IconButton} from "@qualcomm-ui/react/button"

export function IconButtonContrastDemo(): ReactElement {
  return (
    <div className="grid gap-4">
      {/* preview */}
      <div className="bg-persistent-black flex gap-6 p-4">
        <IconButton
          aria-label="Navigate"
          emphasis="persistent-white"
          icon={ExternalLink}
          variant="fill"
        />
        <IconButton
          aria-label="Navigate"
          emphasis="persistent-white"
          icon={ExternalLink}
          variant="outline"
        />
        <IconButton
          aria-label="Navigate"
          emphasis="persistent-white"
          icon={ExternalLink}
          variant="ghost"
        />
      </div>
      {/* preview */}

      <div className="bg-persistent-white flex gap-6 p-4">
        <IconButton
          aria-label="Navigate"
          emphasis="persistent-black"
          icon={ExternalLink}
          variant="fill"
        />
        <IconButton
          aria-label="Navigate"
          emphasis="persistent-black"
          icon={ExternalLink}
          variant="outline"
        />
        <IconButton
          aria-label="Navigate"
          emphasis="persistent-black"
          icon={ExternalLink}
          variant="ghost"
        />
      </div>
    </div>
  )
}

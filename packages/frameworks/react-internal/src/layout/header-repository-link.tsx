import type {ReactElement} from "react"

import {HeaderBar} from "@qualcomm-ui/react/header-bar"
import {Github} from "@qualcomm-ui/react-mdx/icons"

export function HeaderRepositoryLink(): ReactElement {
  return (
    <HeaderBar.ActionIconButton
      aria-label="Navigate to the Github repository"
      icon={Github}
      render={
        <a
          href="https://github.com/qualcomm/qualcomm-ui"
          rel="noreferrer"
          target="_blank"
        />
      }
    />
  )
}

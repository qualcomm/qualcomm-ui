import type {ReactElement, ReactNode} from "react"

import {Link as ReactRouterLink} from "react-router"

import {HeaderBar, type HeaderBarLogoProps} from "@qualcomm-ui/react/header-bar"
import {MobileSidebar} from "@qualcomm-ui/react-mdx/docs-layout"

import {GithubChangelogLink} from "./github-changelog-link"
import {QuiLogo} from "./qui-logo"

export interface HeaderLogoProps extends HeaderBarLogoProps {
  appTitle: ReactNode
  changelogHref: string
}

export function HeaderLogo({
  appTitle,
  changelogHref,
  ...props
}: HeaderLogoProps): ReactElement {
  return (
    <HeaderBar.Logo {...props}>
      <MobileSidebar>
        <QuiLogo width={20} />
        <HeaderBar.AppTitle>{appTitle}</HeaderBar.AppTitle>
      </MobileSidebar>
      <ReactRouterLink className="flex items-center gap-2" to="/">
        <QuiLogo width={20} />
        <HeaderBar.AppTitle>
          <span className="whitespace-nowrap">{appTitle}</span>
        </HeaderBar.AppTitle>
      </ReactRouterLink>
      <GithubChangelogLink href={changelogHref} />
    </HeaderBar.Logo>
  )
}

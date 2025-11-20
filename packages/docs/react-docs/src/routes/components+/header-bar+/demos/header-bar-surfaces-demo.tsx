import type {ReactElement} from "react"

import {Layers2, LayoutGrid, Moon, Settings} from "lucide-react"

import {Avatar} from "@qualcomm-ui/react/avatar"
import {HeaderBar} from "@qualcomm-ui/react/header-bar"
import {Icon} from "@qualcomm-ui/react/icon"

export function HeaderBarSurfacesDemo(): ReactElement {
  return (
    <div className="flex w-full flex-col gap-4">
      <HeaderBar.Root className="@container">
        <HeaderContent />
      </HeaderBar.Root>

      <HeaderBar.Root className="@container" surface="secondary">
        <HeaderContent />
      </HeaderBar.Root>
    </div>
  )
}

function HeaderContent() {
  return (
    <>
      <HeaderBar.Logo>
        <div className="bg-category-1-subtle rounded-sm p-0.5">
          <Icon icon={Layers2} size="lg" />
        </div>
        <HeaderBar.AppTitle>Qualcomm AI Visualizer</HeaderBar.AppTitle>
      </HeaderBar.Logo>

      <HeaderBar.Divider />

      <HeaderBar.Nav className="hidden @min-[580px]:flex">
        <HeaderBar.NavItem>Home</HeaderBar.NavItem>

        <HeaderBar.NavItem>
          <Icon icon={Settings} />
          Settings
        </HeaderBar.NavItem>
      </HeaderBar.Nav>

      <HeaderBar.ActionBar className="hidden @min-[285px]:flex">
        <HeaderBar.ActionIconButton icon={Moon} />
        <HeaderBar.ActionIconButton icon={Settings} />
        <HeaderBar.ActionButton
          className="hidden @min-[450px]:inline-flex"
          startIcon={LayoutGrid}
        >
          Apps
        </HeaderBar.ActionButton>

        <HeaderBar.Divider className="hidden @min-[375px]:block" />

        <Avatar.Root
          className="hidden @min-[375px]:flex"
          size="xs"
          variant="contrast"
        >
          <Avatar.Content>JD</Avatar.Content>
        </Avatar.Root>
      </HeaderBar.ActionBar>
    </>
  )
}

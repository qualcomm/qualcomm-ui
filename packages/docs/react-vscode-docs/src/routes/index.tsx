import type {ReactNode} from "react"

import {ChevronRight} from "lucide-react"
import {Link as ReactRouterLink} from "react-router"

import {Button} from "@qualcomm-ui/react/button"
import {Divider} from "@qualcomm-ui/react/divider"
import {Link} from "@qualcomm-ui/react/link"

export default function HomePage(): ReactNode {
  return (
    <div className="flex w-full flex-col pt-8">
      <h1 className="md:font-heading-xxxl font-heading-xl my-0 inline-flex flex-col gap-1">
        <span>Your React toolkit for</span>
        <span>VS Code experiences</span>
      </h1>
      <div className="font-body-xl text-neutral-secondary mt-8 flex flex-col gap-1">
        <span>Shared QUI behavior with styling that follows</span>
        <span>the user&apos;s VS Code theme</span>
      </div>
      <Divider className="my-8" />
      <div className="mt-8 flex flex-wrap gap-4">
        <Button
          endIcon={ChevronRight}
          render={<ReactRouterLink to="/installation" viewTransition />}
          size="lg"
          variant="outline"
        >
          Get Started
        </Button>
        <Button
          render={<ReactRouterLink to="/components/overview" viewTransition />}
          size="lg"
          variant="ghost"
        >
          Browse Components
        </Button>
      </div>
      <div className="mt-8 grid gap-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="hex-bg shadow-low border-neutral-01 col-span-1 flex flex-col justify-center gap-5 rounded-xl border px-6 py-6">
            <h2 className="font-heading-lg inline-flex flex-col gap-1">
              <span>Themed by</span>
              <span>the VS Code host</span>
            </h2>
            <p className="font-body-md text-neutral-secondary my-0">
              The library uses host colors and fonts so extension interfaces can
              follow the user&apos;s editor settings.
            </p>
            <Link
              render={<ReactRouterLink to="/theming/overview" viewTransition />}
              size="md"
            >
              Explore host theming
            </Link>
          </div>
          <div className="shadow-low border-neutral-01 col-span-1 flex flex-col justify-center gap-5 rounded-xl border px-6 py-8 lg:col-span-2">
            <h2 className="font-heading-lg">
              Shared behavior, dedicated styling
            </h2>
            <p className="font-body-md text-neutral-secondary my-0">
              React VS Code is a sibling of QUI React. It reuses the
              design-agnostic core and React bindings, with its own appearance
              props and VS Code token mappings.
            </p>
            <p className="font-body-md text-neutral-secondary my-0">
              The documentation uses the same QUI Docs layout as React and
              Angular. Component previews use VS Code styling within their
              preview containers.
            </p>
          </div>
        </div>
        <div className="shadow-low border-neutral-01 flex flex-col gap-5 rounded-xl border px-6 py-8">
          <h2 className="font-heading-lg">NextGen preview</h2>
          <p className="font-body-md text-neutral-secondary my-0">
            The package is under development. The host stylesheet and workspace
            build are available; React components are not exported yet.
            Typography is the first planned deliverable.
          </p>
          <Link
            render={
              <ReactRouterLink to="/components/typography" viewTransition />
            }
            size="md"
          >
            Review typography requirements
          </Link>
        </div>
      </div>
    </div>
  )
}

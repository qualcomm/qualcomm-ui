import type {ReactNode} from "react"

import {ChevronRight} from "lucide-react"
import {Link as ReactRouterLink} from "react-router"

import {LinkOverlayPanel} from "@qualcomm-ui/react-internal/layout"
import {Button} from "@qualcomm-ui/react/button"
import {Divider} from "@qualcomm-ui/react/divider"
import {Link} from "@qualcomm-ui/react/link"

import {QdsDemo} from "~components/demo"

interface Feature {
  description: string
  href: string
  name: string
}

const features: Feature[] = [
  {
    description: "Single and multi-column sorting",
    href: "/features/sorting",
    name: "Sorting",
  },
  {
    description: "Column and global filters",
    href: "/features/filters",
    name: "Filtering",
  },
  {
    description: "Client-side or server-side",
    href: "/features/pagination",
    name: "Pagination",
  },
  {
    description: "Group rows by column values",
    href: "/features/grouping",
    name: "Grouping",
  },
  {
    description: "Inline cell editing",
    href: "/features/editable-data",
    name: "Editable Data",
  },
  {
    description: "Pin columns to either side",
    href: "/features/column-pinning",
    name: "Column Pinning",
  },
  {
    description: "Reorder columns with drag and drop",
    href: "/features/column-dnd",
    name: "Column Ordering",
  },
  {
    description: "Select single rows or entire groups",
    href: "/features/row-selection",
    name: "Row Selection",
  },
]

export default function HomePage(): ReactNode {
  return (
    <div className="flex w-full flex-col pt-8">
      <h1 className="md:font-heading-xxxl font-heading-xl my-0 inline-flex flex-col gap-1">
        <span>Data tables for</span>
        <span>Qualcomm user experiences</span>
      </h1>
      <div className="font-body-xl text-neutral-secondary mt-8 flex flex-col gap-1">
        <span>Headless table logic paired with</span>
        <span>components from the Qualcomm Design System</span>
      </div>
      <Divider className="my-8" />
      <div className="mt-8 flex gap-4">
        <Button
          endIcon={ChevronRight}
          render={<ReactRouterLink to="/installation" viewTransition />}
          size="lg"
          variant="outline"
        >
          Get Started
        </Button>
        <Button
          render={<ReactRouterLink to="/features/basic" viewTransition />}
          size="lg"
          variant="ghost"
        >
          Browse Features
        </Button>
      </div>

      <div className="mt-8 grid gap-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="hex-bg shadow-low border-neutral-01 col-span-1 flex flex-col justify-center gap-5 rounded-xl border px-6 py-6">
            <h2 className="font-heading-lg inline-flex flex-col gap-1">
              <span>Themed with</span>
              <span>QDS out of the box</span>
            </h2>
            <div className="font-body-md text-neutral-secondary">
              Tables are built on the Qualcomm Design System, with light and
              dark themes for each Qualcomm brand.
            </div>
          </div>
          <LinkOverlayPanel
            className="shadow-low col-span-1 block h-full overflow-hidden rounded-xl lg:col-span-2"
            href="https://ds.qualcomm.com/home"
          >
            <img
              alt="Qualcomm Design System Gen 3.0"
              className="qui-docs__theme-image"
              data-theme="dark"
              src="/images/home/qds-dark.avif"
              width="100%"
            />
            <img
              alt="Qualcomm Design System Gen 3.0"
              className="qui-docs__theme-image"
              data-theme="light"
              src="/images/home/qds-light.avif"
              width="100%"
            />
          </LinkOverlayPanel>
        </div>

        <div className="shadow-low border-neutral-01 flex min-w-0 flex-col gap-5 rounded-xl border px-6 py-8">
          <h2 className="font-heading-lg inline-flex flex-col gap-1">
            Packed with features
          </h2>
          <div className="font-body-md text-neutral-secondary">
            Pagination, row pinning, row selection, sorting, and filtering in a
            single table. Each feature is isolated: use as many or as few as you
            need.
          </div>
          <QdsDemo className="min-w-0" name="KitchenSinkDemo" />
          <div className="font-body-sm text-neutral-secondary">
            Demo data is generated with{" "}
            <Link href="https://fakerjs.dev/" size="sm" target="_blank">
              faker-js
            </Link>
            . None of the data is real.
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center">
          <h2 className="font-heading-xl my-0 text-center">
            Use only what you need
          </h2>
          <div className="font-body-md text-neutral-secondary mt-3 mb-8">
            Every feature is opt-in and composes with the rest
          </div>
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <ReactRouterLink
                key={feature.name}
                className="shadow-low border-neutral-01 hover:bg-neutral-02 flex flex-col gap-2 rounded-xl border px-5 py-4 no-underline"
                to={feature.href}
                viewTransition
              >
                <span className="font-heading-sm text-neutral-primary">
                  {feature.name}
                </span>
                <span className="font-body-sm text-neutral-secondary">
                  {feature.description}
                </span>
              </ReactRouterLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

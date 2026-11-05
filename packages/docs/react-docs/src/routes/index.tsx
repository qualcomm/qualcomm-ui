import type {ReactNode} from "react"

import {ChevronRight} from "lucide-react"
import {Link as ReactRouterLink} from "react-router"

import {AccessibilityPanel} from "@qualcomm-ui/react-internal/accessibility-panel"
import {ButtonSpecPanel} from "@qualcomm-ui/react-internal/button-spec-panel"
import {LinkOverlayPanel} from "@qualcomm-ui/react-internal/layout"
import {Button} from "@qualcomm-ui/react/button"
import {Divider} from "@qualcomm-ui/react/divider"
import {Link} from "@qualcomm-ui/react/link"

interface Framework {
  href: string
  logoDark: string
  logoLight: string
  name: string
}

const frameworks: Framework[] = [
  {
    href: "/setup/nextjs",
    logoDark: "/images/home/logos/nextjs-dark.svg",
    logoLight: "/images/home/logos/nextjs-light.svg",
    name: "Next.js",
  },
  {
    href: "/setup/react-router",
    logoDark: "/images/home/logos/react-router-dark.svg",
    logoLight: "/images/home/logos/react-router-light.svg",
    name: "React Router",
  },
  {
    href: "/setup/tanstack-start",
    logoDark: "/images/home/logos/tanstack-dark.svg",
    logoLight: "/images/home/logos/tanstack-light.svg",
    name: "TanStack Start",
  },
  {
    href: "/setup/vite",
    logoDark: "/images/home/logos/vite.svg",
    logoLight: "/images/home/logos/vite.svg",
    name: "Vite / Other",
  },
]

export default function HomePage(): ReactNode {
  return (
    <div className="flex w-full flex-col pt-8">
      <h1 className="md:font-heading-xxxl font-heading-xl my-0 inline-flex flex-col gap-1">
        <span>Your React toolkit for</span>
        <span>Qualcomm user experiences</span>
      </h1>
      <div className="font-body-xl text-neutral-secondary mt-8 flex flex-col gap-1">
        <span>Accessible, themed components built on</span>
        <span>the Qualcomm Design System</span>
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
          render={<ReactRouterLink to="/components/overview" viewTransition />}
          size="lg"
          variant="ghost"
        >
          Browse Components
        </Button>
      </div>

      {/* Feature showcase */}
      <div className="mt-8 grid gap-6">
        {/* QDS */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="hex-bg shadow-low border-neutral-01 col-span-1 flex flex-col justify-center gap-5 rounded-xl border px-6 py-6">
            <h2 className="font-heading-lg inline-flex flex-col gap-1">
              <span>Themed with</span>
              <span>QDS out of the box</span>
            </h2>
            <div className="font-body-md text-neutral-secondary">
              Every component is built on the Qualcomm Design System, with light
              and dark themes for each Qualcomm brand.
            </div>
          </div>
          <LinkOverlayPanel
            className="shadow-low col-span-1 block h-full overflow-hidden rounded-xl lg:col-span-2"
            href="https://ds.qualcomm.com/home"
          >
            <img
              alt="Qualcomm Design System Gen 3.0"
              className="block"
              src="/images/home/qds.avif"
              width="100%"
            />
          </LinkOverlayPanel>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="shadow-low border-neutral-01 col-span-1 flex flex-col gap-5 rounded-xl border px-6 py-8">
            <h2 className="font-heading-lg inline-flex flex-col gap-1">
              Accessible by default
            </h2>
            <div className="font-body-md text-neutral-secondary">
              Built with{" "}
              <Link
                href="https://www.w3.org/WAI/standards-guidelines/aria/"
                size="md"
                target="_blank"
              >
                WAI-ARIA authoring guidelines
              </Link>
              . Keyboard support, focus management, and screen reader semantics
              come standard.
            </div>
            <AccessibilityPanel />
          </div>

          <div className="shadow-low border-neutral-01 col-span-2 flex flex-col justify-center gap-5 rounded-xl border px-6 py-8">
            <h2 className="font-heading-lg inline-flex flex-col gap-1">
              SSR-ready
            </h2>
            <div className="font-body-md text-neutral-secondary">
              Choose your framework
            </div>
            <div className="grid grid-cols-2 gap-4">
              {frameworks.map((framework) => (
                <ReactRouterLink
                  key={framework.name}
                  className="border-neutral-01 hover:bg-neutral-02 flex flex-col items-center gap-3 rounded-lg border px-3 py-4 no-underline"
                  to={framework.href}
                  viewTransition
                >
                  <img
                    alt=""
                    className="theme-image h-10"
                    data-theme="dark"
                    src={framework.logoDark}
                  />
                  <img
                    alt=""
                    className="theme-image h-10"
                    data-theme="light"
                    src={framework.logoLight}
                  />
                  <span className="font-heading-sm text-neutral-primary">
                    {framework.name}
                  </span>
                </ReactRouterLink>
              ))}
            </div>
          </div>
        </div>

        {/* Specs */}
        <div className="mt-8 flex flex-col items-center">
          <h2 className="font-heading-xl my-0 text-center">
            Consistent by design
          </h2>
          <div className="font-body-md text-neutral-secondary mt-3 mb-8">
            Every component draws from the same design tokens
          </div>
          <ButtonSpecPanel />
        </div>
      </div>
    </div>
  )
}

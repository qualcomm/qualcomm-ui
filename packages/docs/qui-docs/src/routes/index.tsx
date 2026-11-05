import type {ReactNode} from "react"

import {ChevronRight} from "lucide-react"
import {Link as ReactRouterLink} from "react-router"

import {LinkOverlayPanel} from "@qualcomm-ui/react-internal/layout"
import {Button} from "@qualcomm-ui/react/button"
import {Divider} from "@qualcomm-ui/react/divider"

import mdxDark from "../assets/images/mdx-dark.svg"
import mdxLight from "../assets/images/mdx-light.svg"
import darkDocs from "../assets/images/new-design-dark.avif"
import lightDocs from "../assets/images/new-design-light.avif"
import qds from "../assets/images/qds.avif"
import routingDark from "../assets/images/routing-dark.avif"
import routingLight from "../assets/images/routing-light.avif"
import vite from "../assets/images/vite.svg"

export default function HomePage(): ReactNode {
  return (
    <div className="flex w-full flex-col pt-8">
      <h1 className="md:font-heading-xxxl font-heading-xl my-0 inline-flex flex-col gap-1">
        <span>Make beautiful documentation</span>
        <span>with React and Markdown</span>
      </h1>
      <div className="font-body-xl text-neutral-secondary mt-8 flex flex-col gap-1">
        <span>Simple and flexible documentation tools</span>
        <span>without compromising the developer experience</span>
      </div>
      <Divider className="my-8" />
      <div className="mt-8">
        <Button
          endIcon={ChevronRight}
          render={<ReactRouterLink to="/introduction" viewTransition />}
          size="lg"
          variant="outline"
        >
          Get Started
        </Button>
      </div>

      {/* Feature showcase */}
      <div className="mt-8 grid gap-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="col-span-1 lg:col-span-2">
            <LinkOverlayPanel href="/introduction">
              <img
                alt="Docs"
                className="qui-docs__theme-image border-neutral-01 shadow-medium rounded-xl border"
                data-theme="dark"
                src={darkDocs}
                width="100%"
              />
              <img
                alt="Docs"
                className="qui-docs__theme-image border-neutral-01 shadow-medium rounded-xl border"
                data-theme="light"
                src={lightDocs}
                width="100%"
              />
            </LinkOverlayPanel>
          </div>
          <div className="col-span-1">
            <LinkOverlayPanel
              className="shadow-medium border-neutral-01 relative flex h-full w-full flex-col items-center justify-center rounded-xl border px-4 py-6"
              href="https://mdxjs.com/"
              target="_blank"
            >
              <img
                alt="MDX"
                className="qui-docs__theme-image mb-6"
                data-theme="dark"
                src={mdxDark}
                width="150px"
              />
              <img
                alt="MDX"
                className="qui-docs__theme-image mb-6"
                data-theme="light"
                src={mdxLight}
                width="150px"
              />

              <h2 className="font-heading-lg max-w-87.5 text-center">
                MDX powered
              </h2>

              <div className="font-body-md text-neutral-secondary mt-3 px-4 text-center">
                Plain markdown for agents, polished docs for humans. Styling and
                navigation are generated automatically.
              </div>
            </LinkOverlayPanel>
          </div>
        </div>

        {/* QDS row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="hex-bg shadow-medium border-neutral-01 relative col-span-1 flex h-full flex-col justify-center gap-5 rounded-xl border px-6 py-6">
            <h2 className="font-heading-lg inline-flex flex-col gap-1">
              <span>Themed with</span>
              <span>QDS out of the box</span>
            </h2>
            <div className="font-body-md text-neutral-secondary">
              Every component is built with QUI on the Qualcomm Design System,
              with light and dark themes for each Qualcomm brand.
            </div>
          </div>
          <LinkOverlayPanel
            className="shadow-medium col-span-1 overflow-hidden rounded-xl lg:col-span-2"
            href="https://ds.qualcomm.com/home"
          >
            <img
              alt="Qualcomm Design System Gen 3.0"
              className="block"
              src={qds}
              width="100%"
            />
          </LinkOverlayPanel>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <LinkOverlayPanel href="https://vitejs.dev/" target="_blank">
            <div className="shadow-medium border-neutral-01 relative col-span-1 flex h-full flex-col items-center justify-center gap-4 rounded-xl border px-4 py-6">
              <img alt="Vite" src={vite} width={150} />
              <div className="font-heading-sm max-w-50 text-center">
                Powered by Vite
              </div>
            </div>
          </LinkOverlayPanel>

          <div className="shadow-medium border-neutral-01 @container relative col-span-1 min-h-75 overflow-hidden rounded-xl border px-6 py-6 lg:col-span-2">
            <div className="flex h-full flex-col items-center justify-center gap-6 @2xl:flex-row">
              <div className="flex flex-col gap-5 @2xl:max-w-80">
                <h2 className="font-heading-lg z-20 inline-flex flex-col gap-1">
                  <span>Full-text search,</span>
                  <span>zero configuration</span>
                </h2>
                <div className="font-body-md text-neutral-secondary">
                  Our Vite plugin indexes your markdown content automatically
                  and instantly.
                </div>
              </div>

              <img
                alt="Full Text Search"
                className="qui-docs__theme-image shadow-low w-full max-w-100 min-w-0 rounded-lg bg-transparent @2xl:flex-1 @2xl:self-end"
                data-theme="dark"
                src={routingDark}
              />
              <img
                alt="Full Text Search"
                className="qui-docs__theme-image shadow-low w-full max-w-100 min-w-0 rounded-lg bg-transparent @2xl:flex-1 @2xl:self-end"
                data-theme="light"
                src={routingLight}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

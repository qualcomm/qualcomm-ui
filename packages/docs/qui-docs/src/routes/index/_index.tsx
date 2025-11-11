import {ReactNode, useEffect, useRef} from "react"

import {ChevronRightIcon} from "lucide-react"
import {Link} from "react-router"

import {Button} from "@qualcomm-ui/react/button"

import docs from "../../assets/images/docs-2-final.webp"
import mdx from "../../assets/images/mdx.svg"
import vite from "../../assets/images/vite.svg"
import fullText from "../../assets/videos/polymorphic.mp4"

import {FeatureCard, LinkOverlayPanel} from "./components"

export default function HomePage(): ReactNode {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    videoRef.current!.playbackRate = 1.75
  }, [])

  return (
    <div className="flex w-full flex-col gap-8 pt-8">
      <h1 className="q-font-heading-xxxl inline-flex flex-col gap-1">
        <span>Make beautiful documentation</span>
        <span>with React and Markdown</span>
      </h1>
      <div className="q-font-body-xl flex flex-col gap-1">
        <span>Simple, powerful, and flexible documentation tools</span>
        <span>without compromising the developer experience</span>
      </div>
      <div className="mb-2">
        <Button
          emphasis="primary"
          endIcon={ChevronRightIcon}
          render={<Link to="/introduction" viewTransition />}
          variant="fill"
        >
          Get Started
        </Button>
      </div>

      {/* Feature showcase */}
      <div className="grid gap-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="col-span-1 lg:col-span-2">
            <div className="q-font-heading-md mb-4 text-center md:mb-0 md:hidden">
              A complete documentation solution in minutes
            </div>

            <LinkOverlayPanel href="/introduction">
              <div className="q-font-heading-md absolute top-2 hidden w-full justify-center md:top-4 md:flex lg:top-4">
                A complete documentation solution in minutes
              </div>
              <img
                alt="Docs"
                className="border-neutral-01 shadow-medium rounded-xl border"
                src={docs}
                width="100%"
              />
            </LinkOverlayPanel>
          </div>
          <div className="col-span-1">
            <FeatureCard className="feature-card-1 flex h-full w-full flex-col items-center justify-center gap-5 px-4 py-6">
              <img alt="MDX" src={mdx} width="150px" />

              <div className="q-font-heading-sm-subtle max-w-[350px] text-center">
                With{" "}
                <a
                  className="q-text-link"
                  href="https://mdxjs.com/"
                  rel="noreferrer"
                  target="_blank"
                >
                  MDX
                </a>
                , you can use React Components in Markdown.
              </div>
            </FeatureCard>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <LinkOverlayPanel href="https://vitejs.dev/" target="_blank">
            <FeatureCard className="feature-card-1 col-span-1 flex h-full flex-col items-center justify-center gap-4 px-4 py-6">
              <img alt="Vite" src={vite} width={150} />
              <div className="q-font-heading-sm-subtle max-w-[200px] text-center">
                Powered by Vite
              </div>
            </FeatureCard>
          </LinkOverlayPanel>

          <FeatureCard className="bg-2 relative col-span-1 hidden min-h-[300px] items-center gap-5 overflow-hidden px-6 py-6 xl:col-span-2 xl:flex">
            <div className="hidden max-w-[320px] flex-col gap-5 xl:flex">
              <h2 className="q-font-heading-lg inline-flex flex-col gap-1">
                <span>Full-text search,</span>
                <span>zero configuration</span>
              </h2>
              <div className="q-font-body-md z-20">
                Our Vite plugin indexes your markdown content automatically and
                instantly. HMR support is enabled by default.
              </div>
            </div>

            <video
              ref={videoRef}
              autoPlay
              className="absolute top-4 right-0 overflow-hidden xl:opacity-70"
              loop
              muted
              playsInline
              src={fullText}
            />
          </FeatureCard>
        </div>
      </div>
    </div>
  )
}

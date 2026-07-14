// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {Portal, type PortalProps} from "@qualcomm-ui/react-core/portal"
import {CoreTour} from "@qualcomm-ui/react-core/tour"

import {TourArrow, type TourArrowProps} from "./tour-arrow.js"
import {TourBackdrop, type TourBackdropProps} from "./tour-backdrop.js"
import {TourContent, type TourContentProps} from "./tour-content.js"
import {TourPositioner, type TourPositionerProps} from "./tour-positioner.js"
import {TourSpotlight, type TourSpotlightProps} from "./tour-spotlight.js"

export interface TourFloatingPortalProps {
  arrowProps?: TourArrowProps | undefined
  backdropProps?: TourBackdropProps | undefined
  children?: ReactNode
  contentProps?: TourContentProps | undefined
  portalProps?: PortalProps | undefined
  positionerProps?: TourPositionerProps | undefined
  spotlightProps?: TourSpotlightProps | undefined
}

export function TourFloatingPortal({
  arrowProps,
  backdropProps,
  children,
  contentProps,
  portalProps,
  positionerProps,
  spotlightProps,
}: TourFloatingPortalProps): ReactElement {
  return (
    <CoreTour.Context>
      {(tour) =>
        tour.open && tour.step ? (
          <Portal {...portalProps}>
            {tour.step.backdrop ? <TourBackdrop {...backdropProps} /> : null}
            <TourSpotlight {...spotlightProps} />
            <TourPositioner {...positionerProps}>
              <TourContent {...contentProps}>
                {tour.step.arrow ? <TourArrow {...arrowProps} /> : null}
                {children}
              </TourContent>
            </TourPositioner>
          </Portal>
        ) : null
      }
    </CoreTour.Context>
  )
}

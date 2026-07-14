// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {tourClasses} from "@qualcomm-ui/qds-core/tour"

import {
  TourActionTrigger,
  type TourActionTriggerProps,
} from "./tour-action-trigger.js"
import {
  TourCloseButton,
  type TourCloseButtonProps,
} from "./tour-close-button.js"
import {TourContext} from "./tour-context.js"
import {TourDescription, type TourDescriptionProps} from "./tour-description.js"
import {
  TourFloatingPortal,
  type TourFloatingPortalProps,
} from "./tour-floating-portal.js"
import {TourHeading, type TourHeadingProps} from "./tour-heading.js"
import {
  TourProgressText,
  type TourProgressTextProps,
} from "./tour-progress-text.js"
import {TourRoot, type TourRootProps} from "./tour-root.js"

export interface TourProps extends Omit<TourRootProps, "children"> {
  actionTriggerProps?:
    | Omit<TourActionTriggerProps, "action" | "children">
    | undefined
  children?: ReactNode
  closeButtonProps?: TourCloseButtonProps | undefined
  descriptionProps?: TourDescriptionProps | undefined
  floatingPortalProps?: TourFloatingPortalProps | undefined
  headingProps?: TourHeadingProps | undefined
  progressTextProps?: TourProgressTextProps | undefined
}

function DefaultTourContent({
  actionTriggerProps,
  closeButtonProps,
  descriptionProps,
  headingProps,
  progressTextProps,
}: Pick<
  TourProps,
  | "actionTriggerProps"
  | "closeButtonProps"
  | "descriptionProps"
  | "headingProps"
  | "progressTextProps"
>): ReactElement {
  return (
    <TourContext>
      {(tour) =>
        tour.step ? (
          <>
            <TourHeading {...headingProps}>{tour.step.heading}</TourHeading>
            <TourDescription {...descriptionProps}>
              {tour.step.description}
            </TourDescription>
            <TourProgressText {...progressTextProps}>
              {tour.getProgressText()}
            </TourProgressText>
            {tour.step.actions?.length ? (
              <div className={tourClasses.actionGroup}>
                {tour.step.actions.map((action, index) => (
                  <TourActionTrigger
                    {...actionTriggerProps}
                    key={`${action.label}-${index}`}
                    action={action}
                  >
                    {action.label}
                  </TourActionTrigger>
                ))}
              </div>
            ) : null}
            <TourCloseButton {...closeButtonProps} />
          </>
        ) : null
      }
    </TourContext>
  )
}

export function SimpleTour({
  actionTriggerProps,
  children,
  closeButtonProps,
  descriptionProps,
  floatingPortalProps,
  headingProps,
  progressTextProps,
  ...props
}: TourProps): ReactElement {
  return (
    <TourRoot {...props}>
      {children}
      <TourFloatingPortal {...floatingPortalProps}>
        <DefaultTourContent
          actionTriggerProps={actionTriggerProps}
          closeButtonProps={closeButtonProps}
          descriptionProps={descriptionProps}
          headingProps={headingProps}
          progressTextProps={progressTextProps}
        />
      </TourFloatingPortal>
    </TourRoot>
  )
}

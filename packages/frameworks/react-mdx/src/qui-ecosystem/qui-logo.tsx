// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComponentPropsWithRef, ReactElement} from "react"

export interface QuiLogoProps extends ComponentPropsWithRef<"svg"> {}

export function QuiLogo(props: QuiLogoProps): ReactElement {
  return (
    <svg
      fill="none"
      viewBox="0 0 274 330.268"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#a)">
        <path
          d="M273.511 80.948 137.505 0 .489 80.746v168.776l137.016 80.746 136.006-80.948V80.948Z"
          fill="url(#b)"
        />
        <path
          d="M35.718 193.075V98.042l67.194-39.695 77.607 45.952v89.167l-28.882 17.012v-89.167l-48.922-28.94-38.116 22.635v61.057l29.275 17.403v-61.009l28.882 17.089v77.748l28.881 17.208 57.567-34.005v-34.043l29.078-17.169v68.009l-86.645 51.232-57.763-34.22V227.49l-58.156-34.415Z"
          fill="#fff"
        />
        <path
          d="m238.282 99.41-29.078 17.208v36.762l29.078-17.207V99.411Z"
          fill="#fff"
        />
      </g>
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="b"
          x1={-117.824}
          x2={342.989}
          y1={-140.364}
          y2={222.856}
        >
          <stop offset={0.346} stopColor="#1A83FE" />
          <stop offset={0.567} stopColor="#3253DC" />
          <stop offset={0.784} stopColor="#741FDF" />
        </linearGradient>
        <clipPath id="a">
          <path d="M0 0h274v330.268H0z" fill="#fff" />
        </clipPath>
      </defs>
    </svg>
  )
}

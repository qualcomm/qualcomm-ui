import type {ComponentPropsWithRef, ReactElement} from "react"

export function AppLogo(props: ComponentPropsWithRef<"svg">): ReactElement {
  return (
    <svg
      fill="none"
      height={24}
      width={24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0 3a3 3 0 0 1 3-3h18a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3Z"
        fill="#01278A"
      />
      <mask
        height={20}
        id="a"
        maskUnits="userSpaceOnUse"
        style={{
          maskType: "alpha",
        }}
        width={20}
        x={2}
        y={2}
      >
        <path
          d="m15.35 12 4.567 2.608a.833.833 0 0 1 0 1.45l-7.084 4.059a1.666 1.666 0 0 1-1.666 0l-7.084-4.059a.832.832 0 0 1 0-1.45L8.65 12m4.183 1.45a1.666 1.666 0 0 1-1.666 0L4.083 9.392a.833.833 0 0 1 0-1.45l7.084-4.059a1.666 1.666 0 0 1 1.666 0l7.084 4.059a.833.833 0 0 1 0 1.45l-7.084 4.058Z"
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
        />
      </mask>
      <g mask="url(#a)">
        <path d="M2 2h20v20H2z" fill="#fff" />
      </g>
    </svg>
  )
}

export type NamedColorspace = {
  author: string
  scheme: string
} & Colorspace

export type Colorspace = {
  base0A: string
  base0B: string
  base0C: string
  base0D: string
  base0E: string
  base0F: string
  base00: string
  base01: string
  base02: string
  base03: string
  base04: string
  base05: string
  base06: string
  base07: string
  base08: string
  base09: string
}

export const lightColorspace: NamedColorspace = {
  author: "mac gainor (https://github.com/mac-s-g)",
  base0A: "#ffd500",
  base0B: "#859900",
  base0C: "#6c71c4",
  base0D: "#586e75",
  base0E: "#2aa198",
  base0F: "#268bd2",
  base00: "rgba(0, 0, 0, 0)",
  base01: "rgb(245, 245, 245)",
  base02: "rgb(235, 235, 235)",
  base03: "#93a1a1",
  base04: "rgba(0, 0, 0, 0.3)",
  base05: "#586e75",
  base06: "#073642",
  base07: "#002b36",
  base08: "#d33682",
  base09: "#cb4b16",
  scheme: "Light Theme",
}

export const darkColorspace: NamedColorspace = {
  author: "Chris Kempson (http://chriskempson.com)",
  base0A: "#f7ca88",
  base0B: "#a1b56c",
  base0C: "#86c1b9",
  base0D: "#7cafc2",
  base0E: "#a5d6ff",
  base0F: "#e8e8e8",
  base00: "#181818",
  base01: "#282828",
  base02: "#383838",
  base03: "#585858",
  base04: "#b8b8b8",
  base05: "#d8d8d8",
  base06: "#e8e8e8",
  base07: "#d2a8ff",
  base08: "#ab4642",
  base09: "#a5d6ff",
  scheme: "Dark Theme",
}

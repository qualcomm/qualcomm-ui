import {ESLint} from "eslint"
import {defineConfig} from "eslint/config"
import {type InfiniteDepthConfigWithExtends, parser} from "typescript-eslint"

import fsdPlugin from "../index"

export const pathPrefix = "./tests/src"

const flatConfig: InfiniteDepthConfigWithExtends[] = [
  {
    ignores: ["node_modules", "dist", "**/*dist", "dist/**/*"],
  },
  {
    languageOptions: {
      parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
  },
  {
    extends: [fsdPlugin.configs.publicApi],
    files: ["**/*.ts"],
  },
  {
    extends: [fsdPlugin.configs.layers, fsdPlugin.configs.segments],
    files: ["**/*.ts"],
    rules: {
      "import/order": "off",
      "prettier/prettier": "off",
      "unused-imports/no-unused-imports": "off",
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.spec.json",
        },
      },
    },
  },
]

export function getLinter() {
  return new ESLint({
    overrideConfig: defineConfig(flatConfig as any),
    overrideConfigFile: true,
  })
}

/**
 * Intelligently trims and strips indentation from multi-line strings.
 */
export function dedent(
  templ: TemplateStringsArray | string,
  ...values: unknown[]
): string {
  let strings = Array.from(typeof templ === "string" ? [templ] : templ)

  // 1. Remove trailing whitespace.
  strings[strings.length - 1] = strings[strings.length - 1].replace(
    /\r?\n([\t ]*)$/,
    "",
  )

  // 2. Find all line breaks to determine the highest common indentation level.
  const indentLengths = strings.reduce((arr: number[], str) => {
    const matches = str.match(/\n([\t ]+|(?!\s).)/g)
    if (matches) {
      return arr.concat(
        matches.map((match) => match.match(/[\t ]/g)?.length ?? 0),
      )
    }
    return arr
  }, [])

  // 3. Remove the common indentation from all strings.
  if (indentLengths.length) {
    const pattern = new RegExp(`\n[\t ]{${Math.min(...indentLengths)}}`, "g")

    strings = strings.map((str) => str.replace(pattern, "\n"))
  }

  // 4. Remove leading whitespace.
  strings[0] = strings[0].replace(/^\r?\n/, "")

  // 5. Perform interpolation.
  let string = strings[0]

  values.forEach((value, i) => {
    string += (value as string) + strings[i + 1]
  })

  return string
}

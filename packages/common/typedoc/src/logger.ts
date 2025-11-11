// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import chalk from "chalk"

export class TimeLogger {
  private startTime: number = 0

  constructor(public enabled: boolean | undefined) {}

  get elapsedTime() {
    return chalk.magenta.bold(
      `${((Date.now() - this.startTime) / 1000).toFixed(2)}s`,
    )
  }

  start(text?: string) {
    this.startTime = Date.now()
    if (this.enabled && text) {
      console.log(text)
    }
  }

  succeed(text: string) {
    if (this.enabled) {
      console.log(`${chalk.green("✔")} ${text}`)
    }
  }

  failed(text: string) {
    if (this.enabled) {
      console.log(`${chalk.red("✖")} ${text}`)
    }
  }
}

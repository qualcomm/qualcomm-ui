import type {Job} from "~entities/job" // fail
import {globalSideUi} from "~entities/job/ui" // fail
import type {ToolConfig} from "~shared/tool-config"

import {toolConfigUi} from "../../../shared/tool-config/ui" // fail
import {getJob} from "../../job/api/get-job" // fail
import {getJobInternal} from "../../job/api/internal/get-job-internal" // fail
import type {ToolModel} from "../model"

import {internalToolUi} from "./internal"
import {sideUi} from "./side-ui"

export function toolUi(toolConfig: ToolConfig) {
  const badJob: Job = {
    name: "hello",
  }
  const toolModel: ToolModel = {
    hello: "world",
  }
  console.debug(toolModel)
  console.debug(toolConfig)
  globalSideUi()
  getJob(badJob)
  getJobInternal()
  toolConfigUi("")
  sideUi()
}

internalToolUi()

import {Job} from "../model" // pass
import {jobUi} from "../ui" // fail

export function getJob(job: Job) {
  console.debug(job)
  jobUi()
}

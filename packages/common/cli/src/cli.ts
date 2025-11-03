import {program} from "@commander-js/extra-typings"

import {addPublishAngularCommands, addPublishCommands} from "./modules"

program.allowUnknownOption(false)

addPublishCommands()
addPublishAngularCommands()

program.parse(process.argv)

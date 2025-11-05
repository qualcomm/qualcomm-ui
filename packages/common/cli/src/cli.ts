// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {program} from "@commander-js/extra-typings"

import {addPublishAngularCommands, addPublishCommands} from "./modules"

program.allowUnknownOption(false)

addPublishCommands()
addPublishAngularCommands()

program.parse(process.argv)

// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {normalizeProps} from "@qualcomm-ui/angular-core/machine"
import {createQdsTableApi} from "@qualcomm-ui/qds-core/table"

export const qdsTableApi = createQdsTableApi(normalizeProps)

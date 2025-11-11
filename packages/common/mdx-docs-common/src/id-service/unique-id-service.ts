// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export class UniqueIdService {
  pathname: string = ""
  private idMap: Record<string, string> = {}

  reset() {
    this.idMap = {}
  }

  add(idParam: string): string {
    let id = idParam
    let count = 1
    // if two headings have the same id, we append an integer to the new id to make
    // it unique.
    while (this.idMap[id]) {
      id = `${idParam}-${count++}`
    }
    this.idMap[id] = id
    return id
  }
}

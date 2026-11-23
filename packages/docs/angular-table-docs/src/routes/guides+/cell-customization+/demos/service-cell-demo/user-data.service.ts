import {Injectable, signal} from "@angular/core"

export interface User {
  accountStatus: string
  averageSessionDuration: number
  country: string
  lastVisitedAt: string
  role: string
  username: string
}

@Injectable()
export class UserDataService {
  readonly data = signal<User[]>([
    {
      accountStatus: "active",
      averageSessionDuration: 12,
      country: "US",
      lastVisitedAt: "02 Sep 2026 07:21:43 PDT",
      role: "user",
      username: "john_pond1",
    },
    {
      accountStatus: "suspended",
      averageSessionDuration: 35,
      country: "US",
      lastVisitedAt: "02 Oct 2026 08:52:36 PDT",
      role: "user",
      username: "anne.m15",
    },
    {
      accountStatus: "pending",
      averageSessionDuration: 0,
      country: "US",
      lastVisitedAt: "19 Mar 2026 04:55:19 PDT",
      role: "admin",
      username: "joe_dirte",
    },
  ])

  updateStatus(rowIndex: number, status: string) {
    this.data.update((users) =>
      users.map((user, index) =>
        index === rowIndex ? {...user, accountStatus: status} : user,
      ),
    )
  }
}

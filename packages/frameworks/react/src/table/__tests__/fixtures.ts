export interface GuideUser {
  children?: GuideUser[]
  id: string
  internalCode: string
  name: string
  rank?: number
  role: "Admin" | "Guest" | "Member"
  status: "Active" | "Pending" | "Suspended"
  team: "Kernel" | "Platform" | "Research"
  visits: number
}

const users: GuideUser[] = [
  {
    id: "ada",
    internalCode: "Q-101",
    name: "Ada Lovelace",
    rank: 2,
    role: "Admin",
    status: "Active",
    team: "Platform",
    visits: 12,
  },
  {
    id: "alice",
    internalCode: "Q-102",
    name: "Alice Johnson",
    role: "Member",
    status: "Active",
    team: "Platform",
    visits: 9,
  },
  {
    id: "alicia",
    internalCode: "Q-103",
    name: "Alicia Stone",
    rank: 4,
    role: "Admin",
    status: "Pending",
    team: "Research",
    visits: 20,
  },
  {
    id: "grace",
    internalCode: "Q-104",
    name: "Grace Hopper",
    rank: 1,
    role: "Member",
    status: "Active",
    team: "Research",
    visits: 16,
  },
  {
    id: "linus",
    internalCode: "Q-105",
    name: "Linus Torvalds",
    rank: 3,
    role: "Guest",
    status: "Suspended",
    team: "Kernel",
    visits: 4,
  },
  {
    id: "margaret",
    internalCode: "Q-106",
    name: "Margaret Hamilton",
    rank: 5,
    role: "Member",
    status: "Active",
    team: "Platform",
    visits: 25,
  },
]

const hierarchicalUsers: GuideUser[] = [
  {
    children: [
      {
        id: "mina",
        internalCode: "Q-201",
        name: "Mina Lovelace",
        rank: 6,
        role: "Member",
        status: "Active",
        team: "Platform",
        visits: 7,
      },
      {
        id: "noah",
        internalCode: "Q-202",
        name: "Noah Lovelace",
        rank: 7,
        role: "Guest",
        status: "Pending",
        team: "Platform",
        visits: 2,
      },
    ],
    id: "ada",
    internalCode: "Q-101",
    name: "Ada Lovelace",
    rank: 2,
    role: "Admin",
    status: "Active",
    team: "Platform",
    visits: 12,
  },
  {
    children: [
      {
        id: "sara",
        internalCode: "Q-203",
        name: "Sara Hopper",
        rank: 8,
        role: "Member",
        status: "Active",
        team: "Research",
        visits: 6,
      },
    ],
    id: "grace",
    internalCode: "Q-104",
    name: "Grace Hopper",
    rank: 1,
    role: "Member",
    status: "Active",
    team: "Research",
    visits: 16,
  },
  {
    id: "linus",
    internalCode: "Q-105",
    name: "Linus Torvalds",
    rank: 3,
    role: "Guest",
    status: "Suspended",
    team: "Kernel",
    visits: 4,
  },
]

function cloneUser(user: GuideUser): GuideUser {
  return {
    ...user,
    children: user.children?.map(cloneUser),
  }
}

export function makeGuideUsers(): GuideUser[] {
  return users.map(cloneUser)
}

export function makeHierarchicalGuideUsers(): GuideUser[] {
  return hierarchicalUsers.map(cloneUser)
}

export function getServerPage(pageIndex: number, pageSize: number): GuideUser[] {
  return makeGuideUsers().slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
}

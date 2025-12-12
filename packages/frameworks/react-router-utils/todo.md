| Filename              | Route Path              | Component Output                  |
|-----------------------|-------------------------|-----------------------------------|
| ʦ __root.tsx          |                         | `<Root>`                          |
| ʦ index.tsx           | / (exact)               | `<Root><RootIndex>`               |
| ʦ about.tsx           | /about                  | `<Root><About>`                   |
| ʦ posts.tsx           | /posts                  | `<Root><Posts>`                   |
| 📂 posts              |                         |                                   |
| ┄ ʦ index.tsx         | /posts (exact)          | `<Root><Posts><PostsIndex>`       |
| ┄ ʦ $postId.tsx       | /posts/$postId          | `<Root><Posts><Post>`             |
| 📂 posts_             |                         |                                   |
| ┄ 📂 $postId          |                         |                                   |
| ┄ ┄ ʦ edit.tsx        | /posts/$postId/edit     | `<Root><EditPost>`                |
| ʦ settings.tsx        | /settings               | `<Root><Settings>`                |
| 📂 settings           |                         | `<Root><Settings>`                |
| ┄ ʦ profile.tsx       | /settings/profile       | `<Root><Settings><Profile>`       |
| ┄ ʦ notifications.tsx | /settings/notifications | `<Root><Settings><Notifications>` |
| ʦ _pathlessLayout.tsx |                         | `<Root><PathlessLayout>`          |
| 📂 _pathlessLayout    |                         |                                   |
| ┄ ʦ route-a.tsx       | /route-a                | `<Root><PathlessLayout><RouteA>`  |
| ┄ ʦ route-b.tsx       | /route-b                | `<Root><PathlessLayout><RouteB>`  |
| 📂 files              |                         |                                   |
| ┄ ʦ $.tsx             | /files/$                | `<Root><Files>`                   |
| 📂 account            |                         |                                   |
| ┄ ʦ route.tsx         | /account                | `<Root><Account>`                 |
| ┄ ʦ overview.tsx      | /account/overview       | `<Root><Account><Overview>`       |

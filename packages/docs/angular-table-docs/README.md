# QUI Angular Docs

Docs site for QUI Angular components. Uses React Router for SSR and a custom approach to embed Angular demos without full SSR overhead, which isn't even possible because we're rendering Angular components in an SSR'd React app.

## Diet SSR/SSG

Angular demos get lightweight static site generation: pre-rendered HTML shows instantly, then hydrates with the actual Angular component after the client loads.

### How It Works

1. React Router handles SSR for docs content and navigation
2. Angular demos compile separately to `dist/browser/main.js`, copied to `public/main.js`
3. `<angular-demo>` custom element ([angular-demo-module/code-demo.component.ts](angular-demo-module/angular-demo.component.ts)) bridges React and Angular
4. On page load, the React demo component ([src/components/demo/qds-demo.tsx](src/components/demo/qds-demo.tsx)) loads the Angular bundle and calls `window.__bootstrapCodeDemo()` to initialize all demos
5. Playwright ([scripts/build-demo-html.ts](scripts/build-demo-html.ts)) crawls the site after an initial build and captures rendered HTML of each demo, storing it in[angular-demo-module/generated/demo-elements.json](angular-demo-module/generated/demo-elements.json). This HTML gets injected during SSR to prevent FOUC
6. Users see static HTML immediately. Angular bundle loads and hydrates in ~200ms
7. Some CSS magic makes the swap between the static HTML and hydrated Angular bundles appear seamless

### Build Process

Three stages:

1. Compile Angular, generate TypeDoc, build React Router site with SSR
2. Start prod server, crawl pages with Playwright to capture demo HTML
3. Re-run step 1. with pre-rendered HTML

Pre-rendered HTML matches the initial runtime output

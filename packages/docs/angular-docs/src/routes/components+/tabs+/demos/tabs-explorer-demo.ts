import {Component} from "@angular/core"

import {TabsModule} from "@qualcomm-ui/angular/tabs"

@Component({
  imports: [TabsModule],
  selector: "tabs-explorer-demo",
  template: `
    <div defaultValue="documents" q-tabs-root>
      <div q-tabs-list>
        <div q-tabs-indicator></div>
        <div q-tab-root value="documents">
          <button q-tab-button>Documents</button>
          <button aria-label="Dismiss Documents" q-tab-dismiss-button></button>
        </div>
        <div q-tab-root value="products">
          <button q-tab-button>Products</button>
          <button aria-label="Dismiss Products" q-tab-dismiss-button></button>
        </div>
        <div q-tab-root value="software">
          <button q-tab-button>Software</button>
          <button aria-label="Dismiss Software" q-tab-dismiss-button></button>
        </div>
      </div>
      <div q-tabs-panel value="documents">Documents content</div>
      <div q-tabs-panel value="products">Products content</div>
      <div q-tabs-panel value="software">Software content</div>
    </div>
  `,
})
export class TabsExplorerDemo {}

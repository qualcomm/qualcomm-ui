import {Component} from "@angular/core"

import {TabsModule} from "@qualcomm-ui/angular/tabs"

@Component({
  imports: [TabsModule],
  selector: "tabs-horizontal-demo",
  template: `
    <!-- preview -->
    <div defaultValue="documents" q-tabs-root>
      <div q-tabs-list>
        <div q-tabs-indicator></div>
        <div q-tab-root value="documents">
          <button q-tab-button>Documents</button>
        </div>
        <div q-tab-root value="products">
          <button q-tab-button>Products</button>
        </div>
        <div q-tab-root value="software">
          <button q-tab-button>Software</button>
        </div>
        <div q-tab-root value="hardware">
          <button q-tab-button>Hardware</button>
        </div>
      </div>
      <div q-tabs-panel value="documents">Documents</div>
      <div q-tabs-panel value="products">Products</div>
      <div q-tabs-panel value="software">Software</div>
      <div q-tabs-panel value="hardware">Hardware</div>
    </div>
    <!-- preview -->
  `,
})
export class TabsHorizontalDemo {}

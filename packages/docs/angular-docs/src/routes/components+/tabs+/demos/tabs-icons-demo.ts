import {Component} from "@angular/core"
import {Code, Cpu, FileText, Smartphone} from "lucide-angular"

import {TabsModule} from "@qualcomm-ui/angular/tabs"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

@Component({
  imports: [TabsModule],
  providers: [provideIcons({Code, Cpu, FileText, Smartphone})],
  selector: "tabs-icons-demo",
  template: `
    <div class="flex flex-col gap-6">
      <div q-tabs-root>
        <div q-tabs-list>
          <div q-tabs-indicator></div>
          <div q-tab-root value="documents">
            <button endIcon="FileText" q-tab-button>Documents</button>
          </div>
          <div q-tab-root value="products">
            <button endIcon="Smartphone" q-tab-button>Products</button>
          </div>
          <div q-tab-root value="software">
            <button endIcon="Code" q-tab-button>Software</button>
          </div>
          <div q-tab-root value="hardware">
            <button endIcon="Cpu" q-tab-button>Hardware</button>
          </div>
        </div>
      </div>
      <div iconVariant="filled" q-tabs-root>
        <div q-tabs-list>
          <div q-tabs-indicator></div>
          <div q-tab-root value="documents">
            <button endIcon="FileText" q-tab-button>Documents</button>
          </div>
          <div q-tab-root value="products">
            <button endIcon="Smartphone" q-tab-button>Products</button>
          </div>
          <div q-tab-root value="software">
            <button endIcon="Code" q-tab-button>Software</button>
          </div>
          <div q-tab-root value="hardware">
            <button endIcon="Cpu" q-tab-button>Hardware</button>
          </div>
        </div>
      </div>
      <div q-tabs-root variant="contained">
        <div q-tabs-list>
          <div q-tabs-indicator></div>
          <div q-tab-root value="documents">
            <button endIcon="FileText" q-tab-button>Documents</button>
          </div>
          <div q-tab-root value="products">
            <button endIcon="Smartphone" q-tab-button>Products</button>
          </div>
          <div q-tab-root value="software">
            <button endIcon="Code" q-tab-button>Software</button>
          </div>
          <div q-tab-root value="hardware">
            <button endIcon="Cpu" q-tab-button>Hardware</button>
          </div>
        </div>
      </div>
      <div iconVariant="filled" q-tabs-root variant="contained">
        <div q-tabs-list>
          <div q-tabs-indicator></div>
          <div q-tab-root value="documents">
            <button endIcon="FileText" q-tab-button>Documents</button>
          </div>
          <div q-tab-root value="products">
            <button endIcon="Smartphone" q-tab-button>Products</button>
          </div>
          <div q-tab-root value="software">
            <button endIcon="Code" q-tab-button>Software</button>
          </div>
          <div q-tab-root value="hardware">
            <button endIcon="Cpu" q-tab-button>Hardware</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TabsIconsDemo {}

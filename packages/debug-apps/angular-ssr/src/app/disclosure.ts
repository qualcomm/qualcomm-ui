import {Component} from "@angular/core"
import {RouterLink} from "@angular/router"
import {Home} from "lucide-angular"

import {AccordionModule} from "@qualcomm-ui/angular/accordion"
import {ActionGroupDirective} from "@qualcomm-ui/angular/action-group"
import {BreadcrumbsModule} from "@qualcomm-ui/angular/breadcrumbs"
import {ButtonModule} from "@qualcomm-ui/angular/button"
import {CollapsibleModule} from "@qualcomm-ui/angular/collapsible"
import {IconDirective} from "@qualcomm-ui/angular/icon"
import {PaginationModule} from "@qualcomm-ui/angular/pagination"
import {TabsModule} from "@qualcomm-ui/angular/tabs"
import {LoremIpsumDirective} from "@qualcomm-ui/angular-core/lorem-ipsum"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

@Component({
  imports: [
    AccordionModule,
    ActionGroupDirective,
    BreadcrumbsModule,
    ButtonModule,
    CollapsibleModule,
    IconDirective,
    LoremIpsumDirective,
    PaginationModule,
    RouterLink,
    TabsModule,
  ],
  providers: [provideIcons({Home})],
  selector: "app-disclosure-demo",
  styles: `
    .section {
      margin-bottom: 3rem;
    }

    .section-title {
      font: var(--font-static-heading-md-default);
      margin-bottom: 1rem;
      color: var(--color-text-neutral-primary);
    }

    .demo-container {
      padding: 2rem;
      border: 1px solid var(--color-border-neutral-01);
      border-radius: 8px;
      background-color: var(--color-background-neutral-01);
    }
  `,
  template: `
    <div
      class="container"
      style="max-width: 1200px; margin: 0 auto; padding: 2rem;"
    >
      <h1 style="font-size: 2rem; font-weight: 700; margin-bottom: 2rem;">
        Disclosure
      </h1>

      <div class="section">
        <h2 class="section-title">Accordion</h2>
        <div class="demo-container">
          <div style="width: 24rem;" q-accordion>
            <div q-accordion-item-root value="a">
              <button q-accordion-item-trigger>
                <span q-accordion-item-text>Accordion Text 1</span>
                <span q-accordion-item-secondary-text>Secondary text</span>
                <q-accordion-item-indicator />
              </button>
              <div q-accordion-item-content>
                <div q-lorem-ipsum></div>
              </div>
            </div>

            <div q-accordion-item-root value="b">
              <button q-accordion-item-trigger>
                <span q-accordion-item-text>Accordion Text 2</span>
                <span q-accordion-item-secondary-text>Secondary text</span>
                <q-accordion-item-indicator />
              </button>
              <div q-accordion-item-content>
                <div q-lorem-ipsum></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Breadcrumbs</h2>
        <div class="demo-container">
          <nav aria-label="Breadcrumbs" q-breadcrumbs-root>
            <ol q-breadcrumbs-list>
              <li q-breadcrumb-item>
                <a q-breadcrumb-item-trigger routerLink="/">
                  <svg q-breadcrumb-item-icon qIcon="Home"></svg>
                  Home
                </a>
              </li>
              <li disabled q-breadcrumb-item>
                <a routerLink="/components">Components</a>
              </li>
              <li q-breadcrumb-item>
                <a
                  aria-current="page"
                  q-breadcrumb-item-trigger
                  routerLink="/components/breadcrumbs"
                >
                  Breadcrumbs
                </a>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Collapsible</h2>
        <div class="demo-container">
          <div style="display: flex; flex-direction: column; align-items: center;" q-collapsible-root>
            <button
              style="margin-top: 0.75rem; margin-bottom: 0.75rem;"
              emphasis="primary"
              q-button
              q-collapsible-trigger
              variant="fill"
            >
              Toggle
            </button>
            <div q-collapsible-content>
              <div
                style="display: flex; height: 12rem; width: 18rem; flex-direction: column; border-radius: 0.125rem; border: 1px solid var(--color-border-neutral-01); padding: 1rem;"
              >
                Content
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Pagination</h2>
        <div class="demo-container">
          <div count="120" defaultPageSize="10" q-pagination-root>
            <div q-action-group>
              <button q-pagination-prev-trigger></button>
              <q-pagination-page-items />
              <button q-pagination-next-trigger></button>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Tabs</h2>
        <div class="demo-container">
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
        </div>
      </div>
    </div>
  `,
})
export class DisclosureDemo {}

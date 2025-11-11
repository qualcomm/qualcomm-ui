import {Component, signal} from "@angular/core"
import {Plus} from "lucide-angular"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {TabsModule} from "@qualcomm-ui/angular/tabs"
import {LoremIpsumDirective} from "@qualcomm-ui/angular-core/lorem-ipsum"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

interface Item {
  content: string
  id: string
  title: string
}

@Component({
  imports: [TabsModule, LoremIpsumDirective, ButtonModule],
  providers: [provideIcons({Plus})],
  selector: "tabs-add-remove-demo",
  template: `
    <div
      q-tabs-root
      [value]="selectedTab()"
      (valueChanged)="selectedTab.set($event)"
    >
      <div q-tabs-list>
        @for (tab of tabs(); track tab.id) {
          <div q-tab-root [value]="tab.id">
            <button q-tab-button>{{ tab.title }} {{ tab.id }}</button>
            <button
              q-tab-dismiss-button
              [aria-label]="'Dismiss ' + tab.title + ' ' + tab.id"
              (click)="removeTab(tab.id)"
            ></button>
          </div>
        }

        <button
          q-button
          size="sm"
          startIcon="Plus"
          variant="ghost"
          (click)="addTab()"
        >
          Add Tab
        </button>
      </div>
      @for (tab of tabs(); track tab.id) {
        <div q-tabs-panel [value]="tab.id">
          <div class="font-heading-xs text-neutral-primary my-6">
            {{ tab.content }} {{ tab.id }}
          </div>
          <div class="font-body-sm text-neutral-primary">
            <div q-lorem-ipsum></div>
          </div>
        </div>
      }
    </div>
  `,
})
export class TabsAddRemoveDemo {
  protected readonly tabs = signal<Item[]>([
    {content: "Tab Content", id: "1", title: "Tab"},
    {content: "Tab Content", id: "2", title: "Tab"},
    {content: "Tab Content", id: "3", title: "Tab"},
    {content: "Tab Content", id: "4", title: "Tab"},
  ])

  protected readonly selectedTab = signal<string | null>(this.tabs()[0].id)

  addTab() {
    const newTabs = [...this.tabs()]

    newTabs.push({
      content: `Tab Body`,
      id: `${parseInt(this.tabs()[newTabs.length - 1]?.id ?? "0") + 1}`,
      title: `Tab`,
    })

    this.tabs.set(newTabs)
    this.selectedTab.set(newTabs[newTabs.length - 1].id)
  }

  removeTab = (id: string) => {
    if (this.tabs().length > 1) {
      const newTabs = [...this.tabs()].filter((tab) => tab.id !== id)
      this.tabs.set(newTabs)
      if (this.selectedTab() === id) {
        this.selectedTab.set(newTabs[0].id)
      }
    }
  }
}

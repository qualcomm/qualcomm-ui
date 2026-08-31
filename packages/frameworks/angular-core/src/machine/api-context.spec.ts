import {
  Component,
  computed,
  Directive,
  inject,
  Injectable,
  signal,
} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test} from "vitest"
import {page} from "vitest/browser"

import {ApiContextDirective} from "./api-context.directive"
import {BaseApiContextService} from "./api-context.service"

interface CounterApi {
  count: number
  increment: () => void
}

@Injectable()
class CounterContextService extends BaseApiContextService<CounterApi> {}

@Directive({
  providers: [CounterContextService],
  selector: "[counterRoot]",
})
class CounterRootDirective {
  private readonly contextService = inject(CounterContextService)
  private readonly count = signal(0)

  constructor() {
    this.contextService.init(
      computed<CounterApi>(() => ({
        count: this.count(),
        increment: () => this.count.update((count) => count + 1),
      })),
    )
  }
}

@Directive({selector: "[counterContext]"})
class CounterContextDirective extends ApiContextDirective<CounterApi> {
  constructor() {
    super(inject(CounterContextService), "counterContext")
  }

  static ngTemplateContextGuard(
    _dir: CounterContextDirective,
    _ctx: unknown,
  ): _ctx is {$implicit: CounterApi} {
    return true
  }
}

@Component({
  imports: [CounterContextDirective, CounterRootDirective],
  template: `
    <div counterRoot>
      <ng-container *counterContext="let api">
        <button type="button" (click)="api.increment()">
          count: {{ api.count }}
        </button>
      </ng-container>
    </div>
  `,
})
class CounterComponent {}

const counter = () => page.getByRole("button")

describe("ApiContextDirective", () => {
  test("renders the api in the projected template", async () => {
    await render(CounterComponent)

    await expect.element(counter()).toHaveTextContent("count: 0")
  })

  test("updates the projected template when the api changes", async () => {
    await render(CounterComponent)

    await counter().click()

    await expect.element(counter()).toHaveTextContent("count: 1")
  })

  test("keeps the projected element when the api changes", async () => {
    await render(CounterComponent)
    const initial = counter().element()

    await counter().click()
    await expect.element(counter()).toHaveTextContent("count: 1")

    expect(counter().element()).toBe(initial)
    expect(initial.isConnected).toBe(true)
  })

  test("keeps focus on the projected element when the api changes", async () => {
    await render(CounterComponent)

    await counter().click()
    await expect.element(counter()).toHaveTextContent("count: 1")

    await expect.element(counter()).toHaveFocus()
  })
})

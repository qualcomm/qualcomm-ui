import "@angular/compiler"
import "@analogjs/vitest-angular/setup-snapshots"

import {NgModule, provideZonelessChangeDetection} from "@angular/core"
import {getTestBed} from "@angular/core/testing"
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from "@angular/platform-browser/testing"
import {configure} from "@testing-library/angular"

import "./test-styles.css"

configure({
  dom: {
    asyncUtilTimeout: 3000,
    getElementError: (message) => {
      // Create a simpler error without the full DOM tree
      return new Error(
        message
          ?.replace(/\n.*?Expected element.*?\n/s, "\n")
          ?.replace(/\n+/g, "\n")
          ?.trim(),
      )
    },
    testIdAttribute: "data-test-id",
  },
})

@NgModule({
  providers: [provideZonelessChangeDetection()],
})
export class ZonelessTestModule {}

getTestBed().initTestEnvironment(
  [BrowserTestingModule, ZonelessTestModule],
  platformBrowserTesting(),
)

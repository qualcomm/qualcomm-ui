import type {HTMLAttributes} from "react"

import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"
import {page} from "vitest/browser"

import {InlineNotification} from "@qualcomm-ui/react/inline-notification"

import {type MultiComponentTest, runTests} from "~test-utils/runner"

const demoLabel = "Demo Label"
const demoDescription = "Demo Description"
const closeButtonLabel = "Dismiss notification"

const testIds = {
  actionContainer: "inline-notification-action-container",
  closeButton: "inline-notification-close-button",
  description: "inline-notification-description",
  icon: "inline-notification-icon",
  label: "inline-notification-label",
  root: "inline-notification-root",
}

const tests: MultiComponentTest[] = [
  {
    composite() {
      return (
        <InlineNotification.Root>
          <InlineNotification.Icon />
          <InlineNotification.Label>{demoLabel}</InlineNotification.Label>
          <InlineNotification.Description>
            {demoDescription}
          </InlineNotification.Description>
        </InlineNotification.Root>
      )
    },
    simple() {
      return (
        <InlineNotification description={demoDescription} label={demoLabel} />
      )
    },
    testCase: (getComponent) => {
      test("renders label and description", async () => {
        await render(getComponent())
        await expect.element(page.getByText(demoLabel)).toBeVisible()
        await expect.element(page.getByText(demoDescription)).toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <InlineNotification.Root>
          <InlineNotification.Icon />
          <InlineNotification.Label>{demoLabel}</InlineNotification.Label>
          <InlineNotification.CloseButton />
        </InlineNotification.Root>
      )
    },
    simple() {
      return <InlineNotification dismissable label={demoLabel} />
    },
    testCase: (getComponent) => {
      test("close button dismisses notification", async () => {
        await render(getComponent())
        await expect.element(page.getByText(demoLabel)).toBeVisible()

        await page.getByLabelText(closeButtonLabel).click()

        await expect.element(page.getByText(demoLabel)).not.toBeVisible()
      })
    },
  },
  {
    composite(props?: {onDismiss?: () => void}) {
      return (
        <InlineNotification.Root onDismiss={props?.onDismiss}>
          <InlineNotification.Icon />
          <InlineNotification.Label>{demoLabel}</InlineNotification.Label>
          <InlineNotification.CloseButton />
        </InlineNotification.Root>
      )
    },
    simple(props?: {onDismiss?: () => void}) {
      return (
        <InlineNotification
          dismissable
          label={demoLabel}
          onDismiss={props?.onDismiss}
        />
      )
    },
    testCase: (getComponent) => {
      test("onDismiss callback fires when close button is clicked", async () => {
        const onDismiss = vi.fn()
        await render(getComponent({onDismiss}))

        expect(onDismiss).not.toHaveBeenCalled()

        await page.getByLabelText(closeButtonLabel).click()

        await expect.poll(() => onDismiss.mock.calls.length).toBe(1)
      })
    },
  },
  {
    composite() {
      return (
        <InlineNotification.Root data-test-id={testIds.root}>
          <InlineNotification.Icon data-test-id={testIds.icon} />
          <InlineNotification.Label data-test-id={testIds.label}>
            {demoLabel}
          </InlineNotification.Label>
          <InlineNotification.Description data-test-id={testIds.description}>
            {demoDescription}
          </InlineNotification.Description>
          <InlineNotification.ActionContainer
            data-test-id={testIds.actionContainer}
          >
            <a href="#action">Action</a>
          </InlineNotification.ActionContainer>
          <InlineNotification.CloseButton data-test-id={testIds.closeButton} />
        </InlineNotification.Root>
      )
    },
    simple() {
      return (
        <InlineNotification
          action={<a href="#action">Action</a>}
          actionProps={
            {
              "data-test-id": testIds.actionContainer,
            } as HTMLAttributes<HTMLElement>
          }
          closeButtonProps={
            {
              "data-test-id": testIds.closeButton,
            } as HTMLAttributes<HTMLElement>
          }
          data-test-id={testIds.root}
          description={demoDescription}
          descriptionProps={
            {
              "data-test-id": testIds.description,
            } as HTMLAttributes<HTMLElement>
          }
          dismissable
          iconProps={
            {
              "data-test-id": testIds.icon,
            } as HTMLAttributes<HTMLElement>
          }
          label={demoLabel}
          labelProps={
            {
              "data-test-id": testIds.label,
            } as HTMLAttributes<HTMLElement>
          }
        />
      )
    },
    testCase: (getComponent) => {
      test("parts", async () => {
        await render(getComponent())

        await expect.element(page.getByTestId(testIds.root)).toBeVisible()
        await expect.element(page.getByTestId(testIds.icon)).toBeVisible()
        await expect.element(page.getByTestId(testIds.label)).toBeVisible()
        await expect
          .element(page.getByTestId(testIds.description))
          .toBeVisible()
        await expect
          .element(page.getByTestId(testIds.actionContainer))
          .toBeVisible()
        await expect
          .element(page.getByTestId(testIds.closeButton))
          .toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <InlineNotification.Root role="alert">
          <InlineNotification.Icon />
          <InlineNotification.Label>{demoLabel}</InlineNotification.Label>
        </InlineNotification.Root>
      )
    },
    simple() {
      return <InlineNotification label={demoLabel} role="alert" />
    },
    testCase: (getComponent) => {
      test("role='alert' announces assertively", async () => {
        await render(getComponent())

        await expect.element(page.getByRole("alert")).toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <InlineNotification.Root>
          <InlineNotification.Icon />
          <InlineNotification.Label>{demoLabel}</InlineNotification.Label>
        </InlineNotification.Root>
      )
    },
    simple() {
      return <InlineNotification label={demoLabel} />
    },
    testCase: (getComponent) => {
      test("role defaults to 'status'", async () => {
        await render(getComponent())

        await expect.element(page.getByRole("status")).toBeVisible()
      })
    },
  },
]

describe("InlineNotification", () => {
  runTests(tests)
})

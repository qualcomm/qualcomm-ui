import {Component, signal} from "@angular/core"
import {FormsModule, type NgForm} from "@angular/forms"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {SwitchModule} from "@qualcomm-ui/angular/switch"

@Component({
  imports: [SwitchModule, FormsModule, ButtonModule],
  selector: "switch-template-forms",
  template: `
    <form #formRef="ngForm" class="flex w-56 flex-col gap-2">
      <!-- preview -->
      <label
        errorText="Please accept the Terms of Service to continue"
        label="Please accept the Terms of Service"
        name="acceptTerms"
        q-switch
        required
        [(ngModel)]="acceptTerms"
      ></label>
      <!-- preview -->

      <div class="mt-1 grid grid-cols-2 grid-rows-1 gap-3">
        <button
          emphasis="primary"
          q-button
          size="sm"
          type="button"
          variant="outline"
          (click)="reset(formRef)"
        >
          Reset
        </button>
        <button
          emphasis="primary"
          q-button
          size="sm"
          type="submit"
          variant="fill"
        >
          Submit
        </button>
      </div>
    </form>
  `,
})
export class SwitchTemplateFormsDemo {
  readonly acceptTerms = signal<boolean>(false)

  reset(form: NgForm) {
    this.acceptTerms.set(false)
    form.resetForm()
  }
}

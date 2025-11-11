import {Component} from "@angular/core"
import {FormControl, ReactiveFormsModule} from "@angular/forms"

@Component({
  imports: [ReactiveFormsModule],
  selector: "disabled-demo",
  standalone: true,
  template: `
    <form class="grid justify-center gap-2">
      <div class="border-neutral-02 border-1">
        <input name="field-1" [disabled]="true" [formControl]="formControl" />
      </div>
    </form>
  `,
})
export class FormDisabledDemo {
  formControl = new FormControl<string>("")
}

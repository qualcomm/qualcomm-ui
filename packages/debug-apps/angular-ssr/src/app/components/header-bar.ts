import {Component} from "@angular/core"

@Component({
  styles: `
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .message {
      font: var(--font-static-body-lg-default);
      color: var(--color-text-neutral-secondary);
      text-align: center;
      padding: 4rem 2rem;
    }
  `,
  template: `
    <div class="container">
      <div class="message">
        Header Bar component demos are not yet available in the Angular docs.
      </div>
    </div>
  `,
})
export class HeaderBarPage {}

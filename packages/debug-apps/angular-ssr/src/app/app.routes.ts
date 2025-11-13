import {Routes} from "@angular/router"

import {ButtonsDemo} from "./buttons"
import {DataDisplayDemo} from "./data-display"
import {DisclosureDemo} from "./disclosure"
import {FeedbackDemo} from "./feedback"
import {FormControlsDemo} from "./form-controls"
import {Home} from "./home"
import {OverlaysDemo} from "./overlays"

export const routes: Routes = [
  {path: "", component: Home},
  {path: "buttons", component: ButtonsDemo},
  {path: "form-controls", component: FormControlsDemo},
  {path: "data-display", component: DataDisplayDemo},
  {path: "disclosure", component: DisclosureDemo},
  {path: "feedback", component: FeedbackDemo},
  {path: "overlays", component: OverlaysDemo},
]

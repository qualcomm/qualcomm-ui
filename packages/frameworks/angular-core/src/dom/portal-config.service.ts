import {Injectable} from "@angular/core"

@Injectable({providedIn: "root"})
export class PortalConfigService {
  private _portalNodeId = "q-portal-root"

  get portalNodeId() {
    return this._portalNodeId
  }
}

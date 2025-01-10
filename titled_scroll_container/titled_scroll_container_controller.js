import { TitledScrollContainerModel } from './titled_scroll_container_model.js';
import { TitledScrollContainerView } from './titled_scroll_container_view.js';

export class TitledScrollContainerController {
  constructor(title) {
    this.model = new TitledScrollContainerModel(this, title);
    this.view = new TitledScrollContainerView(this, this.model);
  }

  addToParent(parentDivId) {
    this.view.addToParent(parentDivId);
    this.view.drawContainer();
  }

  // Methods that subclasses might want to override
  onTitleClick() {
    // Default implementation does nothing
  }

  onScroll() {
    // Default implementation does nothing
  }
}
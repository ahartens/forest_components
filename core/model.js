export class Model {
  constructor(controller) {
    this.controller = controller;
    this.view = null;
  }

  setView(view) {
    this.view = view;
  }

  notifyView() {
    if (this.view) {
      this.view.update(this);
    }
  }
} 
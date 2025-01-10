export class View {
  constructor(model, controller) {
    this.model = model;
    this.controller = controller;
  }

  update(model) {
    // To be implemented by child classes
  }
} 
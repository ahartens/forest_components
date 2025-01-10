export class TitledScrollContainerModel {
  constructor(controller) {
    this.controller = controller;
    this.title = "";
    this.dims = {
      height_large: 200,
      height_small: 55,
      font_size_large: 70,
      font_size_small: 25,
      padding_large: 5,
      padding_small: 0,
      button_size_large: 65,
      button_size_small: 35,
      icon_size_large: 60,
      icon_size_small: 40
    };

    // Default buttons configuration
    this.headerButtons = [];
    this.listeners = new Set();
  }

  addListener(listener) {
    this.listeners.add(listener);
  }

  removeListener(listener) {
    this.listeners.delete(listener);
  }

  notifyListeners() {
    this.listeners.forEach(listener => {
      if (listener.onProfileDataChanged) {
        listener.onProfileDataChanged(this.cards);
      }
    });
  }

  set_title(title) {
    this.title = title;
  }

  get_title() {
    return this.title;
  }

  // Method for subclasses to override
  getHeaderButtons() {
    return this.headerButtons;
  }
} 
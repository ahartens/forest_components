import { Controller } from '../core/controller.js';
import { PopupMenuView } from "./popupmenu_view.js";
import { PopupMenuModel } from "./popupmenu_model.js";

export class PopupMenuController extends Controller {
  constructor(items, width) {
    super();
    this._initializeComponents(width);
    this.items = items;  // List of PopupMenuItem instances
  }

  _initializeComponents(width) {
    this.model = new PopupMenuModel(this);
    this.view = new PopupMenuView(this.model, this, width);
  }

  // Method to initialize the popup menu and bind events
  draw_menu(hide=true) {
    this.view.draw(this.items);
    // Hide the menu by default
    if (hide){
      this.view.hide();
    }
  }

  // Show the menu at a specific position
  show_menu(x, y, anchor) {
    if (anchor == 'topright'){
      this.view.show(x-this.view.width, y)
    }
    else if (anchor == 'bottomright'){
      this.view.show(x-this.view.width, window.innerHeight - this.view.height - 80)
    }
    else if (anchor == 'overlay'){
      this.view.show(x - this.view.width, y);
    }
    else{
      this.view.show(x, y);
    }
    this.model.setState('visible');
  }

  // Hide the menu
  hide_menu() {
    this.view.hide();
    this.model.setState('hidden');
  }

  // Handle what happens when an item is clicked
  on_item_click(item) {
    this.hide_menu();  // Hide menu when an item is clicked
  }
}

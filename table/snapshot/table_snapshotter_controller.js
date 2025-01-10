import { Controller } from '../../core/controller.js';
import { TableSnapshotterModel } from './table_snapshotter_model.js';
import { TableSnapshotterView } from './table_snapshotter_view.js';

import { PopupMenuController } from '/src/components/popupmenu/popupmenu_controller.js';
export class TableSnapshotterController extends Controller {
  constructor(delegate, table_controller) {
    super();
    this.delegate = delegate;
    this.table_controller = table_controller;
    this._initializeComponents();
    this._initialize_popup_menu();
  }

  _initializeComponents() {
    this.model = new TableSnapshotterModel(this);
    this.view = new TableSnapshotterView(this.model, this);
  }

  _initialize_popup_menu(){
    this.model.initialize_items();
    this.popupMenuController = new PopupMenuController(this.model.items, 600);

  }

  show_at_button(displayButtonId){
    this.popupMenuController.draw_menu();
    const div = document.getElementById(displayButtonId);
    const rect = div.getBoundingClientRect();
    const x = rect.right;
    const y = rect.bottom + 20;

    this.popupMenuController.show_menu(x+20, y, "topright");

  }

  pop_menu_item_clicked(label) {
    if (label == "Logout") {
        this.popupMenuController.hide_menu();
    }
  }

  add_new_filter(){
    this.model.add_filter_item();
    this.popupMenuController.items = this.model.items;
    this.popupMenuController.draw_menu(false);
    console.log("ADDING A FILTER")
  }

  add_new_sort(){
    this.model.add_sort_item();
    this.popupMenuController.items = this.model.items;
    this.popupMenuController.draw_menu(false);
    console.log("ADDING A SORT")
  }

  remove_filter_or_sort_item(idx, type){
    if (type == 'filter'){
      this.model.remove_filter_or_sort_item(idx);
    } else if (type == 'sort'){
      this.model.remove_sort(idx);
    }
    this.popupMenuController.items = this.model.items;
    this.popupMenuController.draw_menu(false);
    this.onChangeSnapshot();
  }

  create_new_snapshot(){
    console.log("CREATE NEW SNAPSHOT", this)
    if (this.text_input_controller == null){
      this.textInputPopup = new PopupMenuController([this.model.create_snapshot_name_input_item()], 400);
      
    }
    this.textInputPopup.draw_menu();
    const div = document.getElementById('buttonrow_create_new_snapshot');
    const rect = div.getBoundingClientRect();
    const x = rect.right;
    const y = rect.top;
    this.textInputPopup.show_menu(x, y, "topright");
  }

  save_current_snapshot_with_name(name){
    this.textInputPopup.hide_menu();
  }


  save_current_snapshot(){
    console.log("SAVE CURRENT SNAPSHOT")
  }

  onChangeMultiSelectDropdown(){
    this.onChangeSnapshot();
  }
  

  onChangeSnapshot(){
    this.table_controller.onSnapshotChanged(this.model.compileCurrentSnapshot());
  }

  set_sort_by_column(sortitem){
    this.model.set_sort_by_column(sortitem);
    this.table_controller.onSnapshotChanged(this.model.compileCurrentSnapshot());
  }

} 

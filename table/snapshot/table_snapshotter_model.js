import { Model } from '../../core/model.js';
import { PopupMenuItem, PopupMenuItemTitle} from '../../popupmenu/items/popupmenu_item.js';
import { PopupMenuItemFilter} from '../../popupmenu/items/popupmenu_item_filter.js';
import { PopupMenuItemSort} from '../../popupmenu/items/popupmenu_item_sort.js';
import { PopupMenuItemButtonsRow} from '../../popupmenu/items/popupmenu_item_buttons_row.js';
import { PopupMenuItemTextInput} from '../../popupmenu/items/popupmenu_item_text_input.js';
import { GLOBAL_COLORS } from '/forest_global.js';
export class TableSnapshotterModel extends Model {
  constructor(controller) {
    super(controller);
  }

  initialize_items(){

    this.filter_items = [

    ]

    this.sort_items = [

    ]

    this.build_items();
  }

  check_if_column_is_already_filtered(column){
    for (const item of this.filter_items){
      if (item.column == column.name){
        return true;
      }
    }
    return false;
  }

  check_if_column_is_already_sorted(column){
    for (const item of this.sort_items){
      if (item.column == column.name){
        return true;
      }
    }
    return false;
  }

  add_filter_item(){
    // get columns that are not already filtered
    const columns = this.controller.table_controller.model.columns;
    let column_dropdown_items = [];
    for (const column of columns){
      if (!this.check_if_column_is_already_filtered(column)){
        column_dropdown_items.push({value: column.name, label: column.display_name, selections:column.selections});
      }
    }

    const item = new PopupMenuItemFilter("filter", this.controller , column_dropdown_items);
    // insert this item at the 1th index of ilter items
    this.filter_items.unshift(item);
    this.set_idx_for_items(this.filter_items);
    this.build_items();
  }

  add_sort_item(){
    // get columns that are not already sorted
    const columns = this.controller.table_controller.model.columns;
    let column_dropdown_items = [];
    for (const column of columns){
      if (!this.check_if_column_is_already_sorted(column)){
        column_dropdown_items.push({value: column.name, label: column.display_name, selections:column.selections});
      }
    }
    // add the sort item to the sort_items array
    const item = new PopupMenuItemSort("sort", this.controller, column_dropdown_items);
    this.sort_items.unshift(item);
    this.set_idx_for_items(this.sort_items);
    this.build_items();
  }

  build_items(){
    const fstring = `Filters (${this.filter_items.length})`
    const sstring = `Sorts (${this.sort_items.length})`
    this.items = [
      new PopupMenuItemTitle(fstring, this.controller, {
        text: "+",
        onClick: () => this.controller.add_new_filter()
    }),
      ...this.filter_items,
      new PopupMenuItemTitle(sstring, this.controller,{
        text: "+",
        onClick: () => this.controller.add_new_sort()
    }),
      ...this.sort_items,
      new PopupMenuItemTitle("Visibility", this.controller),
      this.create_text_entry_item(),
    ];

  }

  create_text_entry_item(){
    return new PopupMenuItemButtonsRow("buttons_row", this.controller, [
        {
            name: "create_new_snapshot",
            displayName: "Create new view",
            state: "active",
            colorActive: "#4CAF50",
            onClick: () => this.controller.create_new_snapshot()
        },
        {
            name: "save_current_snapshot",
            displayName: "Save changes",
            state: "inactive",
            onClick: () => this.controller.save_current_snapshot()
        }
    ]);
  }


  set_idx_for_items(items){
    for (let i = 0; i < items.length; i++) {
        items[i].idx = i;
    }
  }

  remove_filter_or_sort_item(idx){
    this.filter_items.splice(idx, 1);
    this.set_idx_for_items(this.filter_items);
    this.build_items();
  }

  remove_sort(idx){
    this.sort_items.splice(idx, 1);
    this.set_idx_for_items(this.sort_items);
    this.build_items();
  }


  create_snapshot(){
    // filter items and sort items have a stringify method; a snapshot is a string of these items joined by a separator
    const snapshot_string = this.filter_items.map(item => item.stringify()).join("|") 
                            + "|" + 
                            this.sort_items.map(item => item.stringify()).join("|");
    return snapshot_string;
  }

  create_snapshot_name_input_item(){
    const textInputItem = new PopupMenuItemTextInput("", this, 
        "Name your snapshot...", // watermark
        {
            name: "save_snapshot",
            displayName: "Save",
            state: "active",
            colorActive: GLOBAL_COLORS.highlight,
            onClick: (inputValue) => this.controller.save_current_snapshot_with_name(inputValue)
        }
        );
    return textInputItem;
  }

  compileCurrentSnapshot(){
        return {
            'filters': this.filter_items.map(item => item.state()),
            'sorts': this.sort_items.map(item => item.state())
        }
  }

  set_sort_by_column(sortitem){
    this.sort_items = []
    this.add_sort_item();
    this.sort_items[0].setState(sortitem);
  }
} 

import { PopupMenuItemFilter} from './popupmenu_item_filter.js';
import { GLOBAL_COLORS } from '/src/global.js';

export class PopupMenuItemSort extends PopupMenuItemFilter {

    constructor(label, controller, rightButtonConfig = null) {
        super(label, controller, rightButtonConfig);
        this.type = 'sort'
    }

  _draw_further_dropdowns(){
    const operationDropdown = this._create_dropdown([
      { value: "1", label: "ascending" },
      { value: "2", label: "descending" },
    ], this.filter_option);

    operationDropdown.addEventListener('change', (event) => {
        this.on_operator_selection_changed(event.target.value);
      });

      
    this.contentDiv.appendChild(operationDropdown);

  }

  stringify(){
    return `s_${this.selected_column_name}_${this.selected_operator}`
  }

  state(){
    return {
      'column': this.selected_column_name,
      'ascending': this.selected_operator == "1" ? true : false,
    }
  }

  setState(state){
    this.selected_column_name = state.column;
    this.selected_operator = state.ascending ? "1" : "2";
  }

  on_column_selection_changed(column){
    super.on_column_selection_changed(column);
    this.controller.onChangeSnapshot();
  }

  on_operator_selection_changed(operator){
    super.on_operator_selection_changed(operator);
    this.controller.onChangeSnapshot();
  }

}



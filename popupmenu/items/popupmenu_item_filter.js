import { PopupMenuItem} from './popupmenu_item.js';
import { GLOBAL_COLORS } from '../../forest_global.js';
import { MultiSelectDropdown } from '../../multiselect_dropdown.js';

export class PopupMenuItemFilter extends PopupMenuItem {
  constructor(label, controller, column_dropdown_items = []) {
    super(label, controller);
    this.allow_hover = false;
    this.column_dropdown_items = column_dropdown_items; // Array of options for the dropdown
    this.selected_column_name = null;
    this.type = 'filter'
  }

  // The method to create and return the HTML for the menu item
  draw(width) {
    this.itemDiv = super.draw(width);
    this.itemDiv.style.position = 'relative';
    this.itemDiv.textContent = "";

    this.contentDiv = document.createElement('div');
    this.contentDiv.style.display = 'flex';
    this.contentDiv.style.width = '90%'
    this.itemDiv.appendChild(this.contentDiv);

    const columnDropdown = this._create_dropdown(this.column_dropdown_items, this.selected_column_name);
    this.contentDiv.appendChild(columnDropdown);
    // Add change event listener
    columnDropdown.addEventListener('change', (event) => {
      this.on_column_selection_changed(event.target.value);
    });


    if (this.selected_column_name != null){
      this._draw_further_dropdowns();
    }

    this._draw_remove_button();
    return this.itemDiv;
  }

    _draw_remove_button(){
      this.rightButtonConfig = {
        text: "x",
        onClick: () => this.controller.remove_filter_or_sort_item(this.idx, this.type)
      }
      this._add_right_button(this.itemDiv);
    }

  _draw_further_dropdowns(){
    const operationDropdown = this._create_dropdown([
      { value: "1", label: "equal to" },
      { value: "2", label: "not equal to" },
    ], this.filter_option);

    operationDropdown.addEventListener('change', (event) => {
        this.on_operator_selection_changed(event.target.value);
      });

    this.contentDiv.appendChild(operationDropdown);

    const items = this.selected_column_item.selections.map(selection => ({
        value: selection,
        label: selection
    }));

    const multiSelect = new MultiSelectDropdown({
        items: items,
        selectedItems: this.selected_selections,
        fitContent: true,
        onChange: (selectedValues) => {
            this.onChangeMultiSelectDropdown(selectedValues);
        }
    });

    this.contentDiv.appendChild(multiSelect.getElement());
  }

  onChangeMultiSelectDropdown(selectedValues){
    this.selected_selections = selectedValues;
    this.controller.onChangeMultiSelectDropdown();
  }

  on_column_selection_changed(column){
    for (const item of this.column_dropdown_items){
      console.log("item", item, column)
      if (item.value == column){
        this.selected_column_name = column;
        // get the item from the column_dropdown_items array
        this.selected_column_item = this.column_dropdown_items.find(item => item.value == column);
        this.filter_option = this.filter_option || 'equal to';
        this.selected_selections = this.selected_selections || [];
        this.update();
      }
    }
  }

  on_operator_selection_changed(operator){
    this.selected_operator = operator;
    console.log("ON OPERATOR SELECTION CHANGED", this.selected_operator)
  }

  update(){
    this._draw_further_dropdowns();
  }

  _create_dropdown(options, selected_option){
    const columnDropdown = document.createElement('select');
    columnDropdown.id = 'column' + "_column_dropdown";
    columnDropdown.style.width = '100px';
    columnDropdown.style.height = '35px';
    columnDropdown.style.border = '1px solid transparent';
    columnDropdown.style.borderRadius = '5px';
    columnDropdown.style.padding = '4px 8px';
    columnDropdown.style.marginRight = '10px';
    console.log(GLOBAL_COLORS.header_dark);
    columnDropdown.style.backgroundColor = GLOBAL_COLORS.header;

    // Add a default "Select" option
    const defaultOption = document.createElement('option');
    // If no option is selected, use the first option as default
    if (!selected_option && options.length > 0) {
      selected_option = options[0].value || options[0];
    }
    options.forEach(option => {
      const opt = document.createElement('option');
      opt.value = option.value || option;
      opt.text = option.label || option;
      opt.selected = opt.value === selected_option;
      columnDropdown.appendChild(opt);
  });

    return columnDropdown;
  }

  stringify(){
    const selected = this.selected_selections.join(",");
    return `f_(${this.selected_column_name}_${this.selected_operator}_${selected})`
  }

  state(){
    return {
      'column': this.selected_column_name,
      'operator': this.selected_operator,
      'selections': this.selected_selections
    }
  }

  setState(state){
    this.selected_column_name = state.column;
    this.selected_operator = state.operator;
    this.selected_selections = state.selections;
  }

}



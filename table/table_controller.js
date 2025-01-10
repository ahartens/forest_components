import { TableView } from "./table_view.js";
import { TableModel } from "./table_model.js";
import { TextTableViewPopoverController } from './popovers/text_table_view_popover.js';
import { SelectTableRowPopoverController } from './popovers/select_table_row_popover.js';
import { MultiSelectTableRowPopoverController } from './popovers/multiselect_table_row_popover.js';

export class TableController {
  constructor(delegate) {
    this.delegate = delegate;
    this.model = new TableModel(this);
    this.view = new TableView(this, this.model);

    this.popovers = {
      select: new SelectTableRowPopoverController(this),
      multi_select: new SelectTableRowPopoverController(this),
      text: new TextTableViewPopoverController(this)
    }

  }

  addToParent(parentDivId) {
    this.view.addToParent(parentDivId);
    for (const popover of Object.values(this.popovers)) {
      popover.initialize(this.view.parentDiv);
    }
  }

  setup_event_listeners(delegateCallsByColumn) {
    this.view.setup_event_listeners(delegateCallsByColumn);
  }

  sort_by(column) {
    this.model.sort_by(column);
    this.view.redraw();
  }

  set_data_with_columns(data, columns, columnClickHandlers) {
    this.model.set_data_and_columns(data, columns, columnClickHandlers);
    this.view.redraw();
  }

  redraw() {
    this.view.drawTables();
  }

  setBottomPadding(bottomPadding) {
    this.view.setBottomPadding(bottomPadding);
  }

  setColors(colors) {
    this.view.setColors(colors);
  }

  set_scroll_container_height(height) {
    this.view.set_scroll_container_height(height);
  }

  handleCellDataUpdate(row_item, column, value, isNew) {
    this.delegate.handleCellDataUpdate(row_item, column, value, isNew);
  }

  selectPopoverDelegate_onSelect(value, cellData, column, isNew){
    this.view.tableRow.updateTextContentInCellForItem(cellData.row_item, column);
    this.delegate.handleCellDataUpdate(cellData.row_item, column, value, isNew);
    console.log("SELECTED", value, cellData, column, isNew);
  };

  selectPopoverDelegate_onDeselect(value, cellData, column){
    this.view.tableRow.updateTextContentInCellForItem(cellData.row_item, column);
  };
  
  selectPopoverDelegate_onColumnSelectionsChanged(column, newSelections, deleting = false){
    console.log("CHANGING COLUMN SELECTIONS in tablecontroller", column, newSelections, deleting);
    this.delegate.saveColumnSelections(column, newSelections, deleting);
  };

  selectPopoverDelegate_onDelete(column, newSelections) {
    this.delegate.deleteColumnSelection(selection, cellData, columnInfo);
  }

  showPopover(x, y, cellData, triggerElement, cellDiv, originalBackground) {
    const column = this.model.columns.find(col => col.name === cellData.column);
    
    if (cellData.type === 'select' || cellData.type === 'multi_select') {
      // Ensure selections array exists
      if (!column.selections) {
        column.selections = [];
      }
      this.popovers[cellData.type].show(x, y, cellData, triggerElement, cellDiv, originalBackground, column); 
    } else {
      this.popovers[cellData.type].show(x, y, cellData, triggerElement, cellDiv, originalBackground);
    }
  }

  onSnapshotChanged(snapshot){
    this.model.applySnapshot(snapshot);
    this.view.redraw();
  }

}

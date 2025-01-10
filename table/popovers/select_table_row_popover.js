import { TableViewPopoverModel, TableViewPopoverView, TableViewPopoverController } from './table_view_popover.js';
import { FONT_SIZES, BORDER_RADII, GLOBAL_COLORS } from '/src/global.js'
import {PopupMenuController} from '/src/components/popupmenu/popupmenu_controller.js';
import {PopupMenuItem} from '/src/components/popupmenu/items/popupmenu_item.js';
export class SelectTableRowPopoverModel extends TableViewPopoverModel {
  constructor(controller) {
    super(controller);
    this.selections = [];
    this.filteredSelections = [];
    this.allow_label_edits = true;
  }

  setColumnInfo(columnInfo) {
    this.columnInfo = columnInfo;
    if (columnInfo != null && 'allow_label_edits' in columnInfo) {
      this.allow_label_edits = columnInfo.allow_label_edits;
    } else{
      this.allow_label_edits = true;
    }
    this.selections = columnInfo.selections || [];
    this.filteredSelections = [...this.selections];
  }

  setCellData(cellData) {
    this.cellData = cellData;
  }

  itemIsSelected(value) {
    if (this.columnInfo.name in this.cellData.row_item) {
      // if the value is an array, check if it contains the value
      if (Array.isArray(this.cellData.row_item[this.columnInfo.name])) {
        return this.cellData.row_item[this.columnInfo.name].includes(value);
      } else {
        return this.cellData.row_item[this.columnInfo.name] === value;
      }
    }
    return false;
  }

  removeSelection(value) {
    if (this.columnInfo.type === 'multi_select') {
      // remove the value from the array
      this.cellData.row_item[this.columnInfo.name] = this.cellData.row_item[this.columnInfo.name].filter(item => item !== value);
    } else {
      this.cellData.row_item[this.columnInfo.name] = null;
    }
  }

  onSelect(value, isNew){
    if (this.columnInfo.type === 'multi_select') {
      if (Array.isArray(this.cellData.row_item[this.columnInfo.name])) {
        this.cellData.row_item[this.columnInfo.name].push(value);
      } else {
        this.cellData.row_item[this.columnInfo.name] = [value];
      }
    } else{
      this.cellData.row_item[this.columnInfo.name] = value;
    }

    if (isNew) {
      // Add to selections if it's new
      if (!this.selections.includes(value)) {
        this.selections.push(value);
        this.selections.sort();
      }
    }
  }

  addNewSelection(value) {
    if (!this.selections.includes(value)) {
      this.selections.push(value);
      this.selections.sort();
    }
  }

  deleteSelection(value) {
    this.selections = this.selections.filter(item => item !== value);
    this.filteredSelections = [...this.selections];
    console.log("DELETING SELECTION", value, this.cellData.row_item[this.columnInfo.name]);
    this.cellData.row_item[this.columnInfo.name] = this.cellData.row_item[this.columnInfo.name].filter(item => item !== value);
  }
}

export class SelectTableRowPopoverView extends TableViewPopoverView {
  constructor(model, controller) {
    super(model, controller);
    this.dims = {
      ...this.dims,
      width: '300px',
      minHeight: '300px',
      maxHeight: '400px',
      backgroundColor: '#ffffff',
      padding: '0'
    };
    this._initializeContainer();
    this.hide_on_select = true;
  }

  _initializeContainer() {
    this.container = document.createElement('div');
    this.container.id = 'select-table-row-popover';
    this.container.className = 'select-table-row-popover';
    
    // the entire popover container
    Object.assign(this.container.style, {
      position: 'fixed',
      display: 'none',
      backgroundColor: this.dims.backgroundColor,
      borderRadius: this.dims.borderRadius,
      padding: '10px',
      width: this.dims.width,
      minHeight: this.dims.minHeight,
      maxHeight: this.dims.maxHeight,
      boxShadow: `0 4px ${this.dims.shadowBlur} ${this.dims.shadowSpread} ${this.dims.shadowColor}`,
      border: `1px solid ${this.dims.borderColor}`,
      zIndex: '1000',
      transition: 'opacity 0.15s ease-in-out',
      opacity: '0',
      display: 'flex',
      flexDirection: 'column'
    });

    // Create top input area with tags, input field, and create button
    const inputContainer = document.createElement('div');
    Object.assign(inputContainer.style, {
      position: 'relative',
      flexShrink: 0,
      padding: '4px'  // Add padding for tags
    });

    // Create tags container
    this.tagsContainer = document.createElement('div');
    Object.assign(this.tagsContainer.style, {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '4px',
      marginBottom: '4px',
      minHeight: '20px'
    });

    // Move input field creation here
    this.inputField = document.createElement('input');
    Object.assign(this.inputField.style, {
      width: '100%',
      paddingLeft: '8px',
      paddingRight: '8px',
      height: `${FONT_SIZES.input + 12}px`,
      border: '1px solid #ddd',
      borderRadius: `${BORDER_RADII.small}px`,
      fontSize: `${FONT_SIZES.input}px`,
      marginBottom: '0px'
    });

    // Create create button
    this.createButton = document.createElement('div');
    Object.assign(this.createButton.style, {
      right: '0',
      top: '100%',
      marginTop: '4px',
      border: 'none',
      background: 'none',
      color: GLOBAL_COLORS.button,
      cursor: 'pointer',
      textAlign: 'right',
      fontSize: `${FONT_SIZES.small}px`,
      height: this.model.allow_label_edits ? '26px' : '0px',
    });

    inputContainer.appendChild(this.tagsContainer);
    inputContainer.appendChild(this.inputField);
    inputContainer.appendChild(this.createButton);

    // Create selections container
    this.selectionsContainer = document.createElement('div');
    Object.assign(this.selectionsContainer.style, {
      maxHeight: '300px',
      overflowY: 'auto',
      borderTop: '1px solid #eee'
    });

    this.container.appendChild(inputContainer);
    this.container.appendChild(this.selectionsContainer);
    this.overlay.appendChild(this.container);

    this._setupInputHandlers();
  }

  _setupInputHandlers() {
    this.inputField.addEventListener('input', () => {
      this._filterSelections();
      this._updateCreateButton();
    });

    this.inputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.controller.textEntryOccurred();
      }
    });

    this.createButton.addEventListener('click', () => {
      this.controller.textEntryOccurred();
    });

    // Add delete/backspace handler
    this.inputField.addEventListener('keydown', (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && this.inputField.value === '') {
      }
    });
  }

  _filterSelections() {
    const searchText = this.inputField.value.toLowerCase();
    this.model.filteredSelections = this.model.selections.filter(
      selection => selection.toLowerCase().startsWith(searchText)
    );
    this._renderSelectionItemsList();
  }

  _updateCreateButton() {
    if (this.model.allow_label_edits) {
      const value = this.inputField.value;
      this.createButton.textContent = value ? `Create "${value}"` : '';
      this.createButton.style.height = '26px';
    } else {
      this.createButton.textContent = '';
      this.createButton.style.height = '0px';
    }
  }

  _renderSelectionItemsList() {
    this.selectionsContainer.innerHTML = '';
    this.model.filteredSelections.forEach(selection => {
      const item = document.createElement('div');
      Object.assign(item.style, {
        padding: '8px',
        cursor: 'pointer',
        borderBottom: '1px solid #eee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      });
      
      // Add checkbox for multiple selections
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = this.model.itemIsSelected(selection) ;
      checkbox.id = `checkbox-${this.model.cellData.id}-${this.model.columnInfo.name}-${selection}`;
      
      const label = document.createElement('span');
      label.textContent = selection;
      label.style.flexGrow = '1';

      const ellipsis_button = document.createElement('span');
      ellipsis_button.textContent = '...';
      ellipsis_button.style.cursor = 'pointer';
      ellipsis_button.addEventListener('click', () => {
        // this.controller.onSelect(selection, false);
      });
      
      item.appendChild(checkbox);
      item.appendChild(label);
      item.appendChild(ellipsis_button);
      
      
      item.addEventListener('click', (e) => {
        if (e.target !== checkbox) {
          checkbox.checked = !checkbox.checked;
        }
        this.controller.onSelect(selection, false);
      });
      
      item.addEventListener('mouseover', () => {
        item.style.backgroundColor = '#f5f5f5';
      });
      
      item.addEventListener('mouseout', () => {
        item.style.backgroundColor = '';
      });
      
      ellipsis_button.addEventListener('click', (e) => {
        console.log("ELLIPSIS BUTTON CLICKED", selection);
        this.controller.showPopupMenu(ellipsis_button, selection);
        e.stopPropagation();    
      });
      this.selectionsContainer.appendChild(item);
    });
  }

  show() {
    super.show();
    // this.model.filteredSelections = [...this.model.selections];
    this._updateCreateButton();
    this.inputField.focus();
  }

  _createTagElement(value) {
    // Create tag element
    const tagElement = document.createElement('div');

    tagElement.id = `tag-${this.model.cellData.id}-${this.model.columnInfo.name}-${value}`;
    Object.assign(tagElement.style, {
      display: 'inline-flex',
      alignItems: 'center',
      backgroundColor: '#e0e0e0',
      borderRadius: `${BORDER_RADII.small}px`,
      padding: '4px 8px',
      margin: '2px',
      fontSize: `${FONT_SIZES.small}px`
    });

    // Add value text
    const textSpan = document.createElement('span');
    textSpan.textContent = value;
    textSpan.style.marginRight = '4px';

    // Add delete button
    const deleteButton = document.createElement('span');
    deleteButton.textContent = '×';
    Object.assign(deleteButton.style, {
      cursor: 'pointer',
      marginLeft: '4px',
      fontWeight: 'bold'
    });

    // Add click handler for delete button
    deleteButton.addEventListener('click', (e) => {
      e.stopPropagation();
      this.controller.removeSelection(value);
    });

    tagElement.appendChild(textSpan);
    tagElement.appendChild(deleteButton);
    this.tagsContainer.appendChild(tagElement);
  }

  _renderSelectedItems() {
    // Clear existing tags and input
    this.tagsContainer.innerHTML = '';
    this.inputField.value = '';
    
    if (this.model.columnInfo.name in this.model.cellData.row_item) {
      const value = this.model.cellData.row_item[this.model.columnInfo.name];
      // if value is an array, create a tag for each item
      if (Array.isArray(value)) {
        value.forEach(item => {
          this._createTagElement(item);
        });
      } else {
        this._createTagElement(value);
      }
     
      // Update filtered selections
      this.model.filteredSelections = [...this.model.selections];
      this._renderSelectionItemsList();
      this._updateCreateButton();
    }
  }

  clearTag(value) {
    const tagElement = document.getElementById(`tag-${this.model.cellData.id}-${this.model.columnInfo.name}-${value}`);
    if (tagElement) {
      tagElement.remove();
    }
  }
}

export class SelectTableRowPopoverController extends TableViewPopoverController {

  _initializeComponents(){
    this.model = new SelectTableRowPopoverModel(this);
    this.view = new SelectTableRowPopoverView(this.model, this);
  }


  show(x, y, cellData, triggerElement, cellDiv, originalBackground, columnInfo) {
    this.model.setColumnInfo(columnInfo);
    this.model.setCellData(cellData);
    this.view._renderSelectedItems();
    this.view._renderSelectionItemsList();
    super.show(x, y, cellData, triggerElement, cellDiv, originalBackground);
  }

  textEntryOccurred() {
    const value = this.view.inputField.value.trim();
    if (value) {
      this.model.addNewSelection(value);
      if (this.delegate.selectPopoverDelegate_onColumnSelectionsChanged) {
        this.delegate.selectPopoverDelegate_onColumnSelectionsChanged(this.model.columnInfo, this.model.selections, false);
      }
      this.onSelect(value, true);
    }
  }

  onSelect(value, isNew){
    if (this.model.itemIsSelected(value)) {
      this.removeSelection(value);
      this.view._renderSelectionItemsList();
    } else {
      this.model.onSelect(value, isNew);
      this.delegate.selectPopoverDelegate_onSelect(value, this.model.cellData, this.model.columnInfo);
      this.view._renderSelectedItems();
    }
    if (this.model.columnInfo.type === 'select') {
      this.hide();
    }
  }

  removeSelection(value) {
    this.view.clearTag(value);
    this.view._renderSelectionItemsList();
    this.model.removeSelection(value);
    if (this.delegate.selectPopoverDelegate_onDeselect) {
      this.delegate.selectPopoverDelegate_onDeselect(value, this.model.cellData, this.model.columnInfo);
    }
  }

  showPopupMenu(ellipsis_button, selection) {
    // Create some items for the popup menu
    if (this.popupMenuController == null) {
      const items = [
        new PopupMenuItem("Delete", this),
        new PopupMenuItem("Rename", this),
      ];
      this.popupMenuController = new PopupMenuController(items, 100);
    }
    this.model.currently_active_selection = selection;
    this.popupMenuController.draw_menu();
    // get absolute position of the ellipsis button in the window
    const rect = ellipsis_button.getBoundingClientRect();
    const x = rect.right;  // Add horizontal scroll offset
    const y = rect.bottom; // Add vertical scroll offset
    this.popupMenuController.show_menu(x, y, 'topright');
  }

  pop_menu_item_clicked(label) {
    if (label == "Delete") {
      this.model.deleteSelection(this.model.currently_active_selection);
      this.view._renderSelectionItemsList();
      this.view._renderSelectedItems();
      if (this.delegate.selectPopoverDelegate_onColumnSelectionsChanged) {
        this.delegate.selectPopoverDelegate_onColumnSelectionsChanged(this.model.columnInfo, this.model.selections, true);
      }
    } else if (label == "Rename") {
    }
  }
} 
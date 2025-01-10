import { SelectTableRowPopoverModel, SelectTableRowPopoverView, SelectTableRowPopoverController } from './select_table_row_popover.js';

export class MultiSelectTableRowPopoverModel extends SelectTableRowPopoverModel {
  constructor(controller) {
    super(controller);
    this.selectedItems = new Set(); // Track multiple selections
  }

  toggleSelection(value) {
    if (this.selectedItems.has(value)) {
      this.selectedItems.delete(value);
    } else {
      this.selectedItems.add(value);
    }
    
    if (this.onUpdate) {
      this.onUpdate(Array.from(this.selectedItems));
    }
  }
}

export class MultiSelectTableRowPopoverView extends SelectTableRowPopoverView {
  constructor(model, controller) {
    super(model, controller);
    this.dims.width = '400px'; // Slightly wider for multiple selections
    this.hide_on_select = false;
  }

  _initializeContainer() {
    super._initializeContainer();

    // Create tags container above the input field
    this.tagsContainer = document.createElement('div');
    Object.assign(this.tagsContainer.style, {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '4px',
      padding: '4px',
      minHeight: '30px'
    });

    // Insert tags container before the input container
    this.container.insertBefore(this.tagsContainer, this.container.firstChild);
  }

  _renderTags() {
    this.tagsContainer.innerHTML = '';
    Array.from(this.model.selectedItems).forEach(item => {
      const tag = document.createElement('div');
      Object.assign(tag.style, {
        backgroundColor: '#e0e0e0',
        borderRadius: '4px',
        padding: '2px 6px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '14px'
      });

      const text = document.createElement('span');
      text.textContent = item;

      const removeButton = document.createElement('button');
      Object.assign(removeButton.style, {
        border: 'none',
        background: 'none',
        padding: '0 2px',
        cursor: 'pointer',
        color: '#666',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      });
      removeButton.innerHTML = '×';
      removeButton.title = 'Remove';

      removeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.model.toggleSelection(item);
        this._renderTags();
        this._renderSelectionItemsList();
      });

      tag.appendChild(text);
      tag.appendChild(removeButton);
      this.tagsContainer.appendChild(tag);
    });
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
      checkbox.checked = this.model.selectedItems.has(selection);
      
      const label = document.createElement('span');
      label.textContent = selection;
      label.style.flexGrow = '1';
      
      item.appendChild(checkbox);
      item.appendChild(label);
      
      item.addEventListener('click', (e) => {
        if (e.target !== checkbox) {
          checkbox.checked = !checkbox.checked;
        }
        this._handleSelect(selection);
      });
      
      item.addEventListener('mouseover', () => {
        item.style.backgroundColor = '#f5f5f5';
      });
      
      item.addEventListener('mouseout', () => {
        item.style.backgroundColor = '';
      });
      
      this.selectionsContainer.appendChild(item);
    });
  }

  _handleSelect(selection) {
    this.model.toggleSelection(selection);
    this._renderSelectionItemsList();
    this._renderTags();
  }

  show() {
    super.show();
    this.model.selectedItems.clear(); // Clear previous selections when showing
    this._renderSelectionItemsList();
    this._renderTags();
  }
}

export class MultiSelectTableRowPopoverController extends SelectTableRowPopoverController {
  _initializeComponents() {
    this.model = new MultiSelectTableRowPopoverModel(this);
    this.view = new MultiSelectTableRowPopoverView(this.model, this);
  }

  show(x, y, cellData, triggerElement, cellDiv, originalBackground, columnInfo, onSelect, onUpdate) {
    // Convert existing selections to array if they're passed as string
    if (typeof cellData === 'string') {
      cellData = cellData.split(',').map(item => item.trim()).filter(item => item);
    }
    
    this.model.setColumnInfo(columnInfo);
    this.model.onSelect = onSelect;
    this.model.onUpdate = onUpdate;
    
    // Initialize selected items from cellData
    console.log("cellData IN SHOW", cellData);
    if (cellData.row_item != null && columnInfo.name in cellData.row_item) {
      this.model.selectedItems = new Set(cellData.row_item[columnInfo.name]);
    } else {
      this.model.selectedItems = new Set();
    }
    console.log("columnInfo IN HOSW", columnInfo);
    super.show(x, y, cellData, triggerElement, cellDiv, originalBackground, columnInfo, onSelect, onUpdate);
  }
} 
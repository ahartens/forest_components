import { TableViewPopoverModel, TableViewPopoverView, TableViewPopoverController } from './popovers/table_view_popover.js';
import { TableRow } from './table_row.js';
// Import other popover types as needed

export class TableView {
  constructor(controller, model) {
    this.controller = controller;
    this.model = model;
    if (window.innerWidth < 768) {
      this.scroll_animation_enabled = false;
    }
    else {
      this.scroll_animation_enabled = true;
    }

    this.dims = {
      margin_left: 20,
      bottom_padding: 0,
      cell_padding: {
        top: 10,
        bottom: 10
      }
    };

    this.colors = {
      header_background: '#f9f9f9',
      header_text: '#333',
      row_background: '#fff',
      row_text: '#333'
    };

    this.tableRow = new TableRow(this.controller);
    this.scrollPosition = { top: 0, left: 0 };

    // Initialize view state with default values
    this.viewState = {
      scrollPosition: { top: 0, left: 0 },
    };
  }

  setBottomPadding(bottomPadding) {
    this.dims.bottom_padding = bottomPadding;
  }

  setColors(colors) {
    this.colors = colors;
  }

  set_scroll_container_height(height) {
    this.dims.scroll_container_height = height;
    if (this.scrollContainer){
      this.scrollContainer.style.height = height;
      console.log("setting scroll container height", height)
    }
  }

  addToParent(parentDivId) {
    this.parentDivId = parentDivId;
    this.parentDiv = document.getElementById(parentDivId);
    this.drawTables();
  }

  drawTables() {
    const parentDiv = this._getAndClearParentDiv();
    parentDiv.style.display = 'flex';
    parentDiv.style.flexDirection = 'column';
    
    
    // Create scroll container
    const scrollContainer = this._createScrollContainer();
    const tableDiv = this._createTableContainer();
    const headerContainer = this._createHeaderContainer();
    const bodyContainer = this._createBodyContainer();
    
    this._addHeaderRow(headerContainer);
    this._addDataRows(bodyContainer);
    
    tableDiv.appendChild(headerContainer);
    tableDiv.appendChild(bodyContainer);
    scrollContainer.appendChild(tableDiv);
    parentDiv.appendChild(scrollContainer);

    // Restore scroll position and header state
    if (this.viewState.scrollPosition.top > 0) {
      scrollContainer.scrollTop = this.viewState.scrollPosition.top;
      scrollContainer.scrollLeft = this.viewState.scrollPosition.left;
    }
  }
  
  _getAndClearParentDiv() {
    const parentDiv = document.getElementById(this.parentDivId);
    parentDiv.innerHTML = '';
    parentDiv.style.overflow = 'hidden';
    return parentDiv;
  }

  _createScrollContainer() {
    const scrollContainer = document.createElement('div');
    scrollContainer.className = "scroll_container";
    scrollContainer.style.overflow = 'auto';
    scrollContainer.style.padding = '0';
    scrollContainer.style.margin = '0';
    scrollContainer.style.backgroundColor = this.colors.row_background;
    scrollContainer.style.webkitOverflowScrolling = 'touch'; // Enable smooth scrolling on iOS
    this.scrollContainer = scrollContainer;
    return scrollContainer;
  }
  
  _createTableContainer() {
    const tableDiv = document.createElement('div');
    tableDiv.style.display = 'flex';
    tableDiv.style.flexDirection = 'column';
    tableDiv.style.width = 'fit-content';
    tableDiv.style.minWidth = '100%';
    tableDiv.className = "table_container";
    return tableDiv;
  }

  _createHeaderContainer() {
    const headerContainer = document.createElement('div');
    headerContainer.style.position = 'sticky';
    headerContainer.style.top = '0';
    headerContainer.style.backgroundColor = this.colors.header_background;
    headerContainer.style.zIndex = '4';
    headerContainer.style.willChange = 'transform';
    headerContainer.style.margin = '0';
    headerContainer.style.padding = '0';
    return headerContainer;
  }

  _createBodyContainer() {
    const bodyContainer = document.createElement('div');
    bodyContainer.style.paddingBottom = `${this.dims.bottom_padding}px`;
    return bodyContainer;
  }
  
  _addHeaderRow(container) {
    const headerRow = this._createHeaderRow();
    this.model.columns.forEach(column => {
      const headerCell = this._createHeaderCell(column);
      headerRow.appendChild(headerCell);
    });
    container.appendChild(headerRow);
  }
  
  _createHeaderRow() {
    const headerRow = document.createElement('div');
    headerRow.style.display = 'flex';
    headerRow.style.padding = '0 10px 0 0';
    headerRow.style.backgroundColor = this.colors.header_background;
    headerRow.style.fontWeight = 'bold';
    headerRow.style.position = 'relative';
    headerRow.style.borderBottom = '1px solid #e0e0e0';
    headerRow.style.height = '40px';
    headerRow.style.alignItems = 'center';
    
    return headerRow;
  }
  
  _createHeaderCell(column) {
    const headerCellContainer = document.createElement('div');
    headerCellContainer.style.flex = '0 0 auto';
    headerCellContainer.style.width = `${column.width}px`;
    headerCellContainer.style.position = 'relative';
    headerCellContainer.style.display = 'flex';
    headerCellContainer.dataset.columnIndex = this.model.columns.indexOf(column);

    // Add margin to first column
    if (this.model.columns[0].name === column.name) {
      headerCellContainer.style.paddingLeft = `${this.dims.margin_left}px`;
    }

    // Create drop indicators
    const leftIndicator = this._createDropIndicator('left');
    const rightIndicator = this._createDropIndicator('right');
    
    // Create the cell content
    const headerCell = document.createElement('div');
    headerCell.textContent = this._format_column_name(column);
    headerCell.style.overflow = 'hidden';
    headerCell.style.textOverflow = 'ellipsis';
    headerCell.style.whiteSpace = 'nowrap';
    headerCell.style.cursor = 'grab';
    headerCell.style.flex = '1';
    headerCell.draggable = true;
    
    // Add sort click handler
    headerCell.addEventListener('click', (e) => {
      // Only trigger sort if we're not dragging
      if (!this.isDragging) {
        this.controller.sort_by(column);
      }
    });

    
    // Add drag and drop handlers
    this._addDragHandlers(headerCell, column, leftIndicator, rightIndicator);
    
    // Add resize handle
    const resizeHandle = this._createResizeHandle(column.name);
    
    headerCellContainer.appendChild(leftIndicator);
    headerCellContainer.appendChild(headerCell);
    headerCellContainer.appendChild(rightIndicator);
    headerCellContainer.appendChild(resizeHandle);
    
    return headerCellContainer;
  }

  _format_column_name(column){
    if (column.display_name) {  
      return column.display_name;
    }
    return column.name;
    return column.name.charAt(0).toUpperCase() + column.name.slice(1);
  }

  _createDropIndicator(position) {
    const indicator = document.createElement('div');
    indicator.style.position = 'absolute';
    indicator.style[position] = '0';
    indicator.style.top = '0';
    indicator.style.bottom = '0';
    indicator.style.width = '2px';
    indicator.style.backgroundColor = 'transparent';
    indicator.style.transition = 'background-color 0.2s';
    return indicator;
  }

  _addDragHandlers(headerCell, column, leftIndicator, rightIndicator) {
    headerCell.addEventListener('dragstart', (e) => this._handleDragStart(e, column));
    headerCell.addEventListener('dragend', () => this._handleDragEnd());
    
    // Handle dragover for drop indicators
    headerCell.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (column === this.draggedColumn) return;

      // Calculate if we're on the left or right half of the cell
      const rect = headerCell.getBoundingClientRect();
      const isLeftHalf = e.clientX - rect.left < rect.width / 2;
      
      // Clear all indicators first
      this._clearDropIndicators();
      
      // Get indices for position calculation
      const sourceIndex = this.model.columns.indexOf(this.draggedColumn);
      const targetIndex = this.model.columns.indexOf(column);
      
      // Show indicator only if drop would result in a change
      if ((isLeftHalf && targetIndex > sourceIndex) || 
          (!isLeftHalf && targetIndex < sourceIndex) ||
          (targetIndex !== sourceIndex + 1 && targetIndex !== sourceIndex - 1)) {
        if (isLeftHalf) {
          leftIndicator.style.backgroundColor = '#007bff';
        } else {
          rightIndicator.style.backgroundColor = '#007bff';
        }
      }
      
      e.dataTransfer.dropEffect = 'move';
    });

    // Handle drop
    headerCell.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (column === this.draggedColumn) return;

      const rect = headerCell.getBoundingClientRect();
      const isLeftHalf = e.clientX - rect.left < rect.width / 2;
      
      const sourceIndex = this.model.columns.indexOf(this.draggedColumn);
      let targetIndex = this.model.columns.indexOf(column);
      
      if (!isLeftHalf) {
        targetIndex++;
      }
      
      if (targetIndex !== sourceIndex && targetIndex !== sourceIndex + 1) {
        if (targetIndex > sourceIndex) {
          targetIndex--;
        }
        
        // Capture exact state before any changes
        const exactScrollTop = this.scrollContainer.scrollTop;
        const exactScrollLeft = this.scrollContainer.scrollLeft;
        
        // Reorder columns
        this.model.columns.splice(sourceIndex, 1);
        this.model.columns.splice(targetIndex, 0, this.draggedColumn);
        
        // Redraw
        this.drawTables();
        
        // Immediately restore exact state
        const newScrollContainer = this.parentDiv.querySelector('div[style*="overflow: auto"]');
        newScrollContainer.scrollTop = exactScrollTop;
        newScrollContainer.scrollLeft = exactScrollLeft;
        
        // Force header height
      }
      
      this._clearDropIndicators();
    });
    
    // Change cursor on drag
    headerCell.addEventListener('mousedown', () => headerCell.style.cursor = 'grabbing');
    headerCell.addEventListener('mouseup', () => headerCell.style.cursor = 'grab');
  }

  _handleDragStart(e, column) {
    this.isDragging = true;
    this.draggedColumn = column;
    e.target.style.opacity = '0.4';
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', column);
  }

  _handleDragEnd() {
    const headers = document.querySelectorAll('[draggable="true"]');
    headers.forEach(header => header.style.opacity = '1');
    this._clearDropIndicators();
    this.draggedColumn = null;
    
    // Reset dragging state after a short delay to allow click event to be processed
    setTimeout(() => {
      this.isDragging = false;
    }, 0);
  }

  _clearDropIndicators() {
    const indicators = document.querySelectorAll('div[style*="background-color: rgb(0, 123, 255)"]');
    indicators.forEach(indicator => indicator.style.backgroundColor = 'transparent');
  }

  _createResizeHandle(columnName) {
    const handle = document.createElement('div');
    handle.style.position = 'absolute';
    handle.style.right = '0';
    handle.style.top = '0';
    handle.style.bottom = '0';
    handle.style.width = '8px';
    handle.style.cursor = 'col-resize';
    handle.style.backgroundColor = 'transparent';
    
    let startX, startWidth;
    const view = this;
    
    handle.addEventListener('mousedown', (e) => {
      startX = e.pageX;
      const column = view.model.columns.find(col => col.name === columnName);
      startWidth = column.width;
      
      document.addEventListener('mousemove', resize);
      document.addEventListener('mouseup', stopResize);
      e.preventDefault();
    });
    
    const resize = (e) => {
      const diff = e.pageX - startX;
      const newWidth = Math.max(50, startWidth + diff);
      const column = view.model.columns.find(col => col.name === columnName);
      column.width = newWidth;

      // Update all cells in this column directly (now includes both header and data cells)
      const columnIndex = view.model.columns.findIndex(col => col.name === columnName);
      const cells = document.querySelectorAll(`div[data-column-index="${columnIndex}"]`);
      cells.forEach(cell => {
        cell.style.width = `${newWidth}px`;
      });
    };
    
    const stopResize = () => {
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', stopResize);
    };
    
    return handle;
  }
  
  _addDataRows(container) {
    this.model.items.forEach(item => {
      const rowDiv = this._createDataRow(item);
      container.appendChild(rowDiv);
    });
  }
  
  _createDataRow(item) {
    return this.tableRow.createRow(item);
  }

  redraw() {
    // Save scroll position and header state before redraw
    const scrollContainer = this.parentDiv.querySelector('div[style*="overflow: auto"]');
    
    if (scrollContainer) {
      this.scrollPosition = {
        top: scrollContainer.scrollTop,
        left: scrollContainer.scrollLeft
      };
    }

    // Redraw the table
    this.drawTables();

    // Restore scroll position and header state
    const newScrollContainer = this.parentDiv.querySelector('div[style*="overflow: auto"]');
    if (newScrollContainer && this.scrollPosition) {
      newScrollContainer.scrollTop = this.scrollPosition.top;
      newScrollContainer.scrollLeft = this.scrollPosition.left;
    }
  }

  // Add methods to save and restore view state
  saveViewState() {
    const scrollContainer = this.parentDiv.querySelector('div[style*="overflow: auto"]');
    if (scrollContainer) {
      this.viewState.scrollPosition = {
        top: scrollContainer.scrollTop,
        left: scrollContainer.scrollLeft
      };
    }
  }
}

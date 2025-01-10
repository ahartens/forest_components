import { FONT_SIZES, BORDER_RADII, GLOBAL_COLORS } from '/src/global.js'

export class TableRow {
  constructor(tableView) {
    this.controller = tableView;
  }

  createRow(item) {
    const rowDiv = document.createElement('div');
    rowDiv.style.display = 'flex';
    rowDiv.style.padding = '0';
    rowDiv.style.position = 'relative';
    rowDiv.style.minHeight = '40px';
    
    // Add a pseudo-border with adjusted margins
    const borderDiv = document.createElement('div');
    borderDiv.style.position = 'absolute';
    borderDiv.style.bottom = '0';
    borderDiv.style.left = `${this.controller.view.dims.margin_left + 10}px`;
    borderDiv.style.right = '10px';
    borderDiv.style.height = '1px';
    borderDiv.style.backgroundColor = '#eee';
    
    this.controller.model.columns.forEach((column, index) => {
      const cellDiv = this.createCell(item, column, index === 0);
      rowDiv.appendChild(cellDiv);
    });
    
    rowDiv.appendChild(borderDiv);
    return rowDiv;
  }

  createCell(item, column, isFirstColumn) {
    const cellDiv = document.createElement('div');
    cellDiv.style.flex = '0 0 auto';
    cellDiv.style.width = `${column.width}px`;
    cellDiv.style.overflow = 'hidden';
    cellDiv.style.whiteSpace = 'nowrap';
    cellDiv.style.position = 'relative';
    cellDiv.style.height = '100%';
    cellDiv.style.display = 'flex';
    cellDiv.style.alignItems = 'center';
    cellDiv.dataset.columnIndex = this.controller.model.columns.indexOf(column);
    cellDiv.id = `cell-${item.id}-${column.name}`;

    // Add padding container to maintain cell highlight while having internal padding
    const paddingContainer = document.createElement('div');
    paddingContainer.style.flex = '1';
    paddingContainer.style.paddingTop = `${this.controller.view.dims.cell_padding.top}px`;
    paddingContainer.style.paddingBottom = `${this.controller.view.dims.cell_padding.bottom}px`;
    paddingContainer.style.display = 'flex';
    paddingContainer.style.alignItems = 'center';
    
    if (isFirstColumn) {
      paddingContainer.style.paddingLeft = `${this.controller.view.dims.margin_left}px`;
    }

    const textSpan = this.addTextContent(cellDiv, item, column);
    

    const fadeDiv = document.createElement('div');
    fadeDiv.style.position = 'absolute';
    fadeDiv.style.right = '0';
    fadeDiv.style.top = '0';
    fadeDiv.style.bottom = '0';
    fadeDiv.style.width = '20px';
    fadeDiv.style.background = 'linear-gradient(to right, transparent, #ffffff)';
    
    cellDiv.appendChild(paddingContainer);
    paddingContainer.appendChild(textSpan);
    cellDiv.appendChild(fadeDiv);
    
    return cellDiv;
  }

  formatDate(content) {
    const date = new Date(content);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Reset time portions to compare dates properly
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
      return 'Today';
    } else if (date.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    } else {
      // Check if date is within last week
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      
      if (date >= weekAgo) {
        // Get day name
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        return dayName;
      } else {
        // Default format DD.MM.YY
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);
        return `${day}.${month}.${year}`;
      }
    }
  }

  addTextContent(cellDiv, item, column, textSpan) {
    if (!textSpan) {
      textSpan = document.createElement('span');
      textSpan.className = 'text-span';
      cellDiv.appendChild(textSpan);
    }
    if (column.name in item) {
      const content = item[column.name];
      if (column.type === 'select') {
        // Single select - one span with rounded borders
        if (content) {
          this.createSelectSpan(content, cellDiv);
        }

      } else if (column.type === 'multi_select') {
        // Multi-select - multiple spans with rounded borders
        this.createSelectSpan(content, cellDiv);
      } else if (column.type === 'date') {
        textSpan.textContent = this.formatDate(content);
      } else {
        textSpan.textContent = Array.isArray(content) ? content.join(', ') : content;
      }
    } else {
      textSpan.textContent = '\u00A0'.repeat(10);
      textSpan.style.minWidth = '50px';
      textSpan.style.display = 'inline-block';
    }
    textSpan.style.cursor = 'pointer';

    this.addClickHandler(textSpan, cellDiv, item, column);
    return textSpan;
  }

  updateTextContentInCellForItem(item, column) {
    const cellDiv = document.getElementById(`cell-${item.id}-${column.name}`);
    const textSpan = cellDiv.querySelector('.text-span');
    this.addTextContent(cellDiv, item, column, textSpan);
  }


  _createSingleSelectSpan(content) {
    const span = document.createElement('span');
    span.textContent = content;
    span.style.backgroundColor = GLOBAL_COLORS.header; // Light blue background - consider moving to globals
    span.style.color = GLOBAL_COLORS.text; // Blue text - consider moving to globals
    span.style.borderRadius = `${BORDER_RADII.small}px`; // Rounded corners - consider moving to globals
    span.style.padding = '2px 8px';
    span.style.fontSize = FONT_SIZES.small;
    span.style.display = 'inline-block';
    return span;
  }

  createSelectSpan(content, cellDiv) {
    // get the child span with class 'text-span'
    let textSpan;
    if (cellDiv.classList.contains('text-span')) {
      textSpan = cellDiv;
    } else {
      textSpan = cellDiv.querySelector('.text-span');
    }
    textSpan.textContent = '';
    if (Array.isArray(content)) {
      content.forEach(value => {
        const itemSpan = this._createSingleSelectSpan(value);
        textSpan.appendChild(itemSpan);
        // Add space between items
        textSpan.appendChild(document.createTextNode(' '));
      });
    }
    else {
      const itemSpan = this._createSingleSelectSpan(content);
      textSpan.appendChild(itemSpan);
    }
  }

  addClickHandler(textSpan, cellDiv, item, column) {
    // deactivate teh textspan so it does not allow click events (is invisible to clicks)
    textSpan.style.pointerEvents = 'none';
    cellDiv.addEventListener('click', (e) => {
      e.stopPropagation();
      const rect = cellDiv.getBoundingClientRect();
      
      // Store original background color
      const originalBackground = cellDiv.style.backgroundColor || '';
      
      // Use viewport-relative coordinates
      const popoverX = rect.left;
      const popoverY = rect.top;
      
      const content = item[column.name];
      if (this.controller.model.columnClickHandlers[column.name]) {
        this.controller.model.columnClickHandlers[column.name](content, item);
      } else {
        this.controller.showPopover(popoverX, popoverY, {
          column: column.name,
          row_item: item,
          value: content || '',
          type: column.type
        }, textSpan, cellDiv, originalBackground);
      }
    });
  }
} 
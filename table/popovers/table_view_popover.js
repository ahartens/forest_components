export class TableViewPopoverModel {
    constructor(controller) {
      this.controller = controller;
      this.x = 0;
      this.y = 0;
      this.cellData = null;
    }
  
    setPosition(x, y) {
      this.x = x;
      this.y = y;
    }
  
    setCellData(data) {
      this.cellData = data;
    }
  }
  
  export class TableViewPopoverView {
    constructor(model, controller) {
      this.model = model;
      this.controller = controller;
      this.container = null;
      this.overlay = null;
  
      this.dims = {
        borderRadius: '8px',
        padding: '12px',
        width: '300px',
        height: '200px',
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowBlur: '10px',
        shadowSpread: '0',
        backgroundColor: '#f5f5f5',
        borderColor: '#e0e0e0'
      };
  
      this._initializeOverlay();
      this._initializeContainer();

      this._setupEventListeners();
    }
  
    _initializeContainer() {
      this.container = document.createElement('div');
      this.container.id = 'table-view-popover';
      this.container.className = 'table-view-popover';
      
      this.container.style.position = 'absolute';
      this.container.style.display = 'none';
      this.container.style.backgroundColor = this.dims.backgroundColor;
      this.container.style.borderRadius = this.dims.borderRadius;
      this.container.style.padding = this.dims.padding;
      this.container.style.width = this.dims.width;
      this.container.style.height = this.dims.height;
      this.container.style.boxShadow = `0 4px ${this.dims.shadowBlur} ${this.dims.shadowSpread} ${this.dims.shadowColor}`;
      this.container.style.border = `1px solid ${this.dims.borderColor}`;
      this.container.style.zIndex = '1000';
      
      // Add transition for opacity
      this.container.style.transition = 'opacity 0.15s ease-in-out';
      this.container.style.opacity = '0';
  
      // Add test content
      this.container.innerHTML = `
        <div style="color: #333;">
          <h3>Popover Test</h3>
          <p>Cell Value: ${this.model.cellData?.value || 'No value'}</p>
          <p>Column: ${this.model.cellData?.column || 'No column'}</p>
        </div>
      `;
      this.overlay.appendChild(this.container);
    }
  
    _initializeOverlay() {
      this.overlay = document.createElement('div');
      this.overlay.classList.add('table-view-popover-overlay');
      this.overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 200vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0);
        z-index: 999;
        display: none;
      `;

   
    }
  
    _setupEventListeners() {
   // Add click handler to overlay
      this.overlay.addEventListener('click', (e) => {
        // Only hide if the click was directly on the overlay
        if (e.target === this.overlay) {
          console.log("overlay clicked, hiding popover");
          if (this.controller) {
            this.controller.hide();
          }
        }
      });
      this.container.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  
    show() {
      this.parentElement.appendChild(this.overlay);
      this.overlay.style.display = 'block';
      this.container.style.display = 'block';
      
      // Get viewport dimensions
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Get actual height of the container element
      const popoverWidth = parseInt(this.dims.width.replace('px', ''));
      const popoverHeight = this.container.offsetHeight || 200; // fallback to default height
      
      console.log('Dimensions debug:', {
        dims: this.dims,
        containerOffsetHeight: this.container.offsetHeight,
        parsedWidth: popoverWidth,
        parsedHeight: popoverHeight
      });
      
      // Calculate adjusted position to keep popover in viewport
      let adjustedX = this.model.x;
      let adjustedY = this.model.y;
      
      console.log('Position debug:', {
        viewportHeight,
        popoverHeight,
        originalY: adjustedY,
        wouldOverflow: (adjustedY + popoverHeight > viewportHeight)
      });
      
      // Adjust X position if popover would extend beyond right edge
      if (adjustedX + popoverWidth > viewportWidth) {
        adjustedX = viewportWidth - popoverWidth - 20;
        console.log('Adjusted X to:', adjustedX);
      }
      if (window.innerWidth < 1000){
        adjustedX += window.innerWidth;
      }
      
      // Adjust Y position if popover would extend beyond bottom edge
      if (adjustedY + popoverHeight > viewportHeight) {
        const newY = viewportHeight - popoverHeight - 20;
        console.log('Adjusting Y from', adjustedY, 'to', newY);
        adjustedY = newY;
      }
      
      // Ensure popover doesn't go beyond left or top edge
      adjustedX = Math.max(20, adjustedX);
      adjustedY = Math.max(20, adjustedY);
      
      console.log('Final position:', { adjustedX, adjustedY });
      
      // Apply adjusted position
      this.container.style.left = `${adjustedX}px`;
      this.container.style.top = `${adjustedY}px`;
      
      // Force a reflow
      this.container.offsetHeight;
      
      // Fade in
      this.container.style.opacity = '1';
    }
  
    hide() {
      // Fade out
      this.container.style.opacity = '0';
      // Hide after transition
      setTimeout(() => {
        if (this.container.style.opacity === '0') {
          this.container.style.display = 'none';
        }
      }, 150);
      this.overlay.style.display = 'none';
      this.overlay.remove();
    }
  
    initialize(parentElement) {
      this.parentElement = parentElement;
      // parentElement.appendChild(this.overlay);
    }
  }
  
  export class TableViewPopoverController {
    constructor(delegate) {
      this.delegate = delegate;
      this._initializeComponents();
      this.view.controller = this;
      this.triggerElement = null;
      this.activeCell = null;
      this.originalBackground = null;
    }
  
    _initializeComponents(){
      this.model = new TableViewPopoverModel(this);
      this.view = new TableViewPopoverView(this.model, this);
    }
  
    show(x, y, cellData, triggerElement, cellDiv, originalBackground) {
      this.triggerElement = triggerElement;
      this.activeCell = cellDiv;
      this.originalBackground = originalBackground;
      this.model.setPosition(x, y);
      this.model.setCellData(cellData);
      this.view.show();
    }
  
    hide() {
      // Restore original background color
      if (this.activeCell) {
        this.activeCell.style.backgroundColor = this.originalBackground || '';
        this.activeCell = null;
        this.originalBackground = null;
      }
      this.view.hide();
    }
  
    handleClickOutside(event) {
      // if (!this.view.container.contains(event.target) && 
      //     this.triggerElement !== event.target &&
      //     !this.triggerElement?.contains(event.target)) {
      //   this.hide();
      //   console.log('Click outside popover');
      // }
    }

    initialize(parentElement) {
      this.parentElement = parentElement;
      this.view.initialize(parentElement);
    }
  }
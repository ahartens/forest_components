import { View } from '../core/view.js';
import { GLOBAL_COLORS } from '/src/global.js';

export class PopupMenuView extends View {
  constructor(model, controller, width) {
    super(model, controller);
    this.width = Math.min(width, window.innerWidth - 20);
    this.menuDiv = null;
    this.overlay = null;
  }

  draw(items) {
    // Create overlay first
    if (this.overlay == null) {
        this.overlay = document.createElement('div');
        this.overlay.classList.add('popup-menu-overlay');
        this.overlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0);
          z-index: 1001;
          display: none;
        `;

        // Add click handler to overlay
        this.overlay.addEventListener('click', function(){
          console.log('overlay clicked', this);
          this.controller.hide_menu();
        }.bind(this));
    }
    
    // Create menu    
    if (this.menuDiv == null) {
      this.menuDiv = document.createElement('div');
      this.menuDiv.classList.add('popup-menu');
      this.menuDiv.style.zIndex = '1002';
      this.menuDiv.style.boxShadow = '0px 10px 40px rgba(0, 0, 0, 0.4)';
      this.menuDiv.style.border = `1px solid ${GLOBAL_COLORS.header_dark}`;
      this.menuDiv.style.borderRadius = '30px';
      this.menuDiv.style.overflow = 'hidden';
      this.menuDiv.style.backgroundColor = GLOBAL_COLORS.header;
      this.menuDiv.style.width = `${this.width}px`;
      // Removed fixed height to let it fit content
    } else {
      this.menuDiv.innerHTML = '';
    }

    // Iterate through each item and append its 'drawn' HTML to the menu
    items.forEach(item => {
      const itemDiv = item.draw(this.width);
      this.menuDiv.appendChild(itemDiv);
    });

    items.forEach(item => {
      item.finished_adding_to_dom();
    });
  }

  // Show the popup at specific coordinates
  show(x, y) {
    document.body.appendChild(this.overlay);
    document.body.appendChild(this.menuDiv);
    if (this.menuDiv && this.overlay) {
      this.menuDiv.style.left = x + 'px';
      this.menuDiv.style.top = y + 'px';
      this.menuDiv.classList.remove('hide');
      this.menuDiv.classList.add('show');
      this.overlay.style.display = 'block';
    }
  }

  // Hide the popup
  hide() {
    if (this.menuDiv && this.overlay) {
      this.menuDiv.classList.remove('show');
      this.menuDiv.classList.add('hide');
      this.overlay.style.display = 'none';
      // remove from dom
      this.menuDiv.remove();
      this.overlay.remove();
    }
  }
}

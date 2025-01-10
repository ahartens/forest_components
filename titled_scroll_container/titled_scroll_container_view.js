export class TitledScrollContainerView {
  constructor(controller, model) {
    this.controller = controller;
    this.model = model;
    this.lastHeaderHeight = this.model.dims.height_large;
    this.contentBackgroundColor = 'white';
    this.headerBackgroundColor = 'white';

    // Add styles to document
    const style = document.createElement('style');
    style.textContent = `
      .header-button {
        outline: none !important;
        -webkit-tap-highlight-color: transparent;
      }
      .header-button:hover {
        background-color: #f0f0f0 !important;
      }
      .header-button:focus {
        outline: none !important;
        box-shadow: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  addToParent(parentDivId) {
    this.parentDiv = document.getElementById(parentDivId);
    this.drawContainer();
  }

  drawContainer() {
    console.log("DRAWING CONTAINER", this.model.title);
    this.parentDiv.innerHTML = '';
    this.parentDiv.style.height = '100vh';
    this.parentDiv.style.display = 'flex';
    this.parentDiv.style.flexDirection = 'column';
    this.parentDiv.style.overflow = 'hidden';
    this.parentDiv.style.backgroundColor = 'white';

    // Create header
    this.headerElement = this.createHeader();
    this.parentDiv.appendChild(this.headerElement);

    // Create scroll container
    const scrollContainer = document.createElement('div');
    scrollContainer.style.height = `calc(100vh - ${this.model.dims.height_small}px)`;
    scrollContainer.style.overflow = 'auto';
    scrollContainer.style.padding = '0';
    scrollContainer.style.margin = '0';
    scrollContainer.style.backgroundColor = this.contentBackgroundColor;
    scrollContainer.style.flex = '1';
    
    // Create content container for subclasses to add to
    this.contentContainer = document.createElement('div');
    console.log("CREATING CONTENT CONTAINER", this.contentContainer);
    this.contentContainer.style.padding = '20px';
    scrollContainer.appendChild(this.contentContainer);

    this.scrollContainer = scrollContainer;
    // Setup scroll handling
    this.setupScrollHandling(scrollContainer, this.headerElement);

    this.parentDiv.appendChild(scrollContainer);
  }

  setupScrollHandling(scrollContainer, headerElement) {
    let lastScrollTop = scrollContainer.scrollTop;
    
    scrollContainer.addEventListener('scroll', (event) => {
      if (event.target !== scrollContainer) return;

      const scrollTop = Math.round(scrollContainer.scrollTop);
      
      // Check if we're at the bottom
      const isAtBottom = scrollContainer.scrollHeight - scrollContainer.scrollTop === scrollContainer.clientHeight;
      
      // Ignore small changes when at the bottom
      if (isAtBottom && Math.abs(scrollTop - lastScrollTop) < 2) return;
      
      // Normal scroll handling
      if (Math.abs(scrollTop - lastScrollTop) < 1) return;

      this.handleHeaderResize(scrollTop, headerElement);
      lastScrollTop = scrollTop;
    });
  }

  handleHeaderResize(scrollTop, headerElement) {
    const maxScroll = this.model.dims.height_large - this.model.dims.height_small;
    
    // Handle fast scrolling past transition point
    if (scrollTop > maxScroll) {
      this.updateHeaderSize(this.model.dims.height_small, headerElement);
      headerElement.style.borderBottom = '1px solid #e0e0e0';
      return;
    }
    
    // Normal scroll handling
    if (scrollTop <= maxScroll) {
      const newHeight = Math.max(
        this.model.dims.height_small,
        this.model.dims.height_large - scrollTop
      );
      
      if (Math.abs(newHeight - this.lastHeaderHeight) >= 1) {
        this.updateHeaderSize(newHeight, headerElement);
      }
      
      // Set border based on scroll position
      headerElement.style.borderBottom = scrollTop === 0 ? 'none' : '1px solid #e0e0e0';
    }
  }

  updateHeaderSize(height, header) {
    header.style.height = `${height}px`;
    this.lastHeaderHeight = height;

    const progress = (height - this.model.dims.height_small) / 
                    (this.model.dims.height_large - this.model.dims.height_small);

    const title = header.querySelector('.header-title');
    const fontSize = this.model.dims.font_size_small + 
                    (this.model.dims.font_size_large - this.model.dims.font_size_small) * progress;
    const padding = this.model.dims.padding_small + 
                   (this.model.dims.padding_large - this.model.dims.padding_small) * progress;

    title.style.fontSize = `${Math.round(fontSize)}px`;
    title.style.transition = 'font-size 0.08s ease-out';
  }

  // Method for subclasses to override
  getContentContainer() {
    return this.contentContainer;
  }

  getHeaderElement() {
    return this.headerElement;
  }

  setContentBackgroundColor(color) {
    console.log("SETTING CONTENT COLOR", color);
    this.scrollContainer.style.backgroundColor = color;
    this.contentContainer.style.backgroundColor = color;
    this.contentBackgroundColor = color;
  }

  setHeaderBackgroundColor(color) {
    console.log("SETTING HEADER COLOR", color);
    this.headerElement.style.backgroundColor = color;
    this.headerBackgroundColor = color;
  }


  createHeader() {
    const header = document.createElement('div');
    header.style.position = 'sticky';
    header.style.top = '0';
    header.style.width = '100%';
    header.style.backgroundColor = this.headerBackgroundColor;
    header.style.zIndex = '5';
    header.style.height = `${this.model.dims.height_large}px`;
    header.style.transition = 'height 0.08s ease-out';
    
    // Calculate text width using Canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = `${this.model.dims.font_size_large}px SNPro-Black`;
    const textWidth = context.measureText(this.model.title || 'Untitled').width;

    const maxWidth = this.parentDiv.offsetWidth-40; // Use parent div width
    if (textWidth > maxWidth) {
        const scaleFactor = maxWidth / textWidth;
        this.model.dims.font_size_large = Math.floor(this.model.dims.font_size_large * scaleFactor);
    }

    const titleSection = document.createElement('div');
    titleSection.classList.add('header-title');
    titleSection.style.position = 'absolute';
    titleSection.style.bottom = `${this.model.dims.padding_large}px`;
    titleSection.style.left = `20px`;
    titleSection.style.fontFamily = 'SNPro-Black';
    titleSection.style.color = '#000';
    titleSection.style.fontSize = `${this.model.dims.font_size_large}px`;
    titleSection.textContent = this.model.title || 'Untitled';
    // titleSection.style.transition = 'font-size 0.08s ease-in-out';

    // Buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('header-buttons');
    buttonsContainer.style.position = 'absolute';
    buttonsContainer.style.top = '10px';
    buttonsContainer.style.right = '20px';
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.gap = '10px';
    buttonsContainer.style.alignItems = 'center';
    buttonsContainer.style.height = '40px';
    buttonsContainer.style.minWidth = '100px';

    this.model.getHeaderButtons().forEach(buttonConfig => {
      const button = this.createButton(buttonConfig);
      if (buttonConfig.text) {
        button.style.height = '35px';
        button.style.minWidth = '80px';
      } else {
        button.style.width = `${this.model.dims.button_size_small}px`;
        button.style.height = `${this.model.dims.button_size_small}px`;
      }
      buttonsContainer.appendChild(button);
    });

    header.appendChild(titleSection);
    header.appendChild(buttonsContainer);

    return header;
  }

  createButton(buttonConfig) {
    const button = document.createElement('button');
    button.classList.add('header-button');
    button.style.padding = '8px 15px';
    button.style.borderRadius = '10px';
    button.style.border = 'none';
    button.style.backgroundColor = 'transparent';
    button.style.cursor = 'pointer';
    button.style.margin = '0';
    button.style.marginBottom = '5px';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    button.style.fontFamily = 'SNPro-Bold';
    button.style.color = buttonConfig.color || '#000000';
    if (buttonConfig.icon) {
      button.style.width = `${this.model.dims.button_size_large}px`;
      button.style.height = `${this.model.dims.button_size_large}px`;
      const icon = document.createElement('img');
      icon.classList.add('header-icon');
      icon.src = buttonConfig.icon;
      icon.style.width = `${this.model.dims.icon_size_large}px`;
      icon.style.height = `${this.model.dims.icon_size_large}px`;
      button.appendChild(icon);
    } else if (buttonConfig.text) {
      button.style.fontSize = '16px';
      button.textContent = buttonConfig.text;
    }

    if (buttonConfig.onClick) {
      button.addEventListener('click', () => {
        if (this.controller[buttonConfig.onClick]) {
          this.controller[buttonConfig.onClick]();
        }
      });
    }

    return button;
  }
} 
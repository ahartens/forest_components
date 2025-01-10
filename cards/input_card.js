import { Card } from "/src/components/cards/card.js";

export class InputCard extends Card {
  constructor(cardData, onSave, allowDisplay = true) {
    super(cardData);
    this.onSave = onSave;
    this.isEditing = false;
    this.inputElements = [];
    
    // Bind methods
    this.cancel = this.cancel.bind(this);
    this.save = this.save.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    
    this.element = this.createCard();
    this.setAllowDisplay(allowDisplay);
  }

  setAllowDisplay(allowDisplay) {
    this.allowDisplay = allowDisplay;
    if (!this.allowDisplay) {
      this.enterInputState();
    }
  }

  createHeader() {
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.width = '100%';

    // Title
    const title = this.createTitle();

    // Buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.gap = '10px';

    // Edit button
    this.editButton = this.createButton('Edit', () => this.toggleEdit());
    buttonsContainer.appendChild(this.editButton);

    // Save button (hidden initially)
    this.saveButton = this.createButton('Save', () => this.save());
    this.saveButton.style.display = 'none';
    buttonsContainer.appendChild(this.saveButton);

    // Cancel button (hidden initially)
    this.cancelButton = this.createButton('Cancel', () => this.cancel());
    this.cancelButton.style.display = 'none';
    buttonsContainer.appendChild(this.cancelButton);

    header.appendChild(title);
    header.appendChild(buttonsContainer);
    return header;
  }

  createButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.padding = '5px 10px';
    button.style.borderRadius = '6px';
    button.style.border = 'none';
    button.style.backgroundColor = '#f0f0f0';
    button.style.cursor = 'pointer';
    button.addEventListener('click', onClick);
    return button;
  }

  createDisplayElement(item) {
    const textElement = document.createElement('div');
    textElement.style.display = 'flex';
    textElement.style.justifyContent = 'space-between';
    textElement.style.width = '100%';

    // If item is hidden, don't create display element
    if (item.hidden) {
      textElement.style.display = 'none';
      return textElement;
    }

    const titleSpan = document.createElement('span');
    titleSpan.style.fontWeight = 'bold';
    titleSpan.style.color = '#333';
    titleSpan.textContent = item.title;

    const contentSpan = document.createElement('span');
    contentSpan.style.color = '#000';
    contentSpan.style.marginLeft = '20px';
    contentSpan.textContent = item.content;

    textElement.appendChild(titleSpan);
    textElement.appendChild(contentSpan);

    return textElement;
  }

  createItem(item) {
    const container = document.createElement('div');
    // Hide if item.type is 'hidden' or 'info' in display mode
    const shouldBeHidden = item.type === 'hidden' || item.type === 'info';
    container.style.display = shouldBeHidden && !this.isEditing ? 'none' : 'flex';
    container.style.flexDirection = 'column';
    container.style.minHeight = '40px';
    container.style.width = '100%';
    container.style.padding = '10px 0';
    
    // Create both display and input elements
    const textElement = this.createDisplayElement(item);
    
    // Title label for edit mode
    const titleLabel = document.createElement('div');
    titleLabel.style.fontWeight = 'bold';
    titleLabel.style.color = '#333';
    titleLabel.style.marginBottom = '5px';
    titleLabel.textContent = item.title;
    titleLabel.style.display = 'none';
    
    // Info text for 'info' type
    const infoText = document.createElement('div');
    infoText.style.color = '#ff0000';  // Red text
    infoText.style.display = 'none';
    infoText.textContent = item.content;
    
    // Input field (hidden initially)
    const input = document.createElement('input');
    input.type = item.type === 'hidden' ? 'password' : 'text';
    input.value = item.content || '';
    input.style.display = 'none';
    input.style.width = '100%';
    input.style.padding = '5px';
    input.style.borderRadius = '4px';
    input.style.border = '1px solid #ccc';

    container.appendChild(textElement);
    container.appendChild(titleLabel);
    container.appendChild(input);
    container.appendChild(infoText);  // Add info text element

    // Store references
    this.inputElements.push({
      container,
      textElement,
      titleLabel,
      input,
      infoText,
      originalContent: item.content,
      item: item
    });

    return container;
  }

  enterDisplayState() {
    this.isEditing = false;
    
    // Clear and rebuild content
    this.clearContent();
    
    // Rebuild with display elements visible
    this.cardData.items.forEach(item => {
      const itemElement = this.createItem(item);
      // Hidden and info items stay hidden in display mode
      if (item.type === 'hidden' || item.type === 'info') {
        itemElement.style.display = 'none';
      }
      this.contentContainer.appendChild(itemElement);
    });
    
    // Update button visibility
    this.editButton.style.display = 'block';
    this.saveButton.style.display = 'none';
    this.cancelButton.style.display = 'none';
  }

  enterInputState() {
    this.isEditing = true;
    
    // Clear and rebuild content
    this.clearContent();
    
    // Rebuild with input fields visible
    this.cardData.items.forEach(item => {
      const itemElement = this.createItem(item);
      const input = itemElement.querySelector('input');
      const textElement = itemElement.querySelector('div');
      const titleLabel = itemElement.children[1];
      const infoText = itemElement.lastChild;
      
      // Show all items in edit mode
      itemElement.style.display = 'flex';
      textElement.style.display = 'none';
      titleLabel.style.display = 'block';
      
      if (item.type === 'info') {
        input.style.display = 'none';
        infoText.style.display = 'block';
      } else {
        input.style.display = 'block';
        infoText.style.display = 'none';
      }
      
      this.contentContainer.appendChild(itemElement);
    });
    
    // Update button visibility
    this.editButton.style.display = 'none';
    this.saveButton.style.display = 'block';
    this.cancelButton.style.display = 'block';
  }

  clearContent() {
    // Clear the card content (everything except the header)
    while (this.element.children.length > 1) {
      this.element.removeChild(this.element.lastChild);
    }
    while (this.contentContainer.children.length > 1) {
      this.contentContainer.removeChild(this.contentContainer.lastChild);
    }
    // Clear the input elements array before adding new ones
    this.inputElements = [];
    this.element.appendChild(this.contentContainer);  
  }

  toggleEdit() {
    if (this.allowDisplay) {
      if (!this.isEditing) {
        this.enterInputState();
      } else {
        this.enterDisplayState();
      }
    }
  }

  save() {
    // Update original content and create updated items
    const updatedItems = this.inputElements.map(({input, item}) => {
      const updatedItem = {
        title: item.title,
        content: input.value
      };
      return updatedItem;
    });
    
    // Call save callback with updated data
    if (this.onSave) {
      this.onSave({
        title: this.cardData.title,
        items: updatedItems
      });
    }
    if (this.allowDisplay) {
      // Update original content references
      this.inputElements.forEach(element => {
        element.originalContent = element.input.value;
    });
      this.isEditing = false;
      this.toggleEdit();
    }
  }

  cancel() {
    this.isEditing = true;  // Set to true because toggleEdit will switch it to false
    this.toggleEdit();
  }
} 
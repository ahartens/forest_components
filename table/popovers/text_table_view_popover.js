import { TableViewPopoverModel, TableViewPopoverView, TableViewPopoverController } from './table_view_popover.js';

export class TextTableViewPopoverView extends TableViewPopoverView {
  constructor(model, controller) {
    super(model, controller);
    this.dims = {
      ...this.dims,  // Inherit base dims
      width: '300px',
      height: 'auto',
      minHeight: '100px',
      maxHeight: '300px',
      padding: '12px',
    };
  }

  _initializeContainer() {
    super._initializeContainer();
    
    // Create and style the textarea
    this.textArea = document.createElement('textarea');
    this.textArea.style.width = '100%';
    this.textArea.style.height = '100%';
    this.textArea.style.minHeight = this.dims.minHeight;
    this.textArea.style.maxHeight = this.dims.maxHeight;
    this.textArea.style.padding = '8px';
    this.textArea.style.border = '1px solid #ddd';
    this.textArea.style.borderRadius = '4px';
    this.textArea.style.resize = 'vertical';
    this.textArea.style.fontFamily = 'inherit';
    this.textArea.style.fontSize = '14px';
    this.textArea.style.lineHeight = '1.4';
    this.textArea.style.outline = 'none';
    
    // Add event listeners for auto-resize
    this.textArea.addEventListener('input', () => {
      this.textArea.style.height = 'auto';
      this.textArea.style.height = `${Math.min(this.textArea.scrollHeight, parseInt(this.dims.maxHeight))}px`;
    });

    // Clear existing content and add textarea
    this.container.innerHTML = '';
    this.container.appendChild(this.textArea);
  }

  show() {
    super.show();
    
    // Set the textarea value and focus it
    this.textArea.value = this.model.cellData?.value || '';
    
    // Focus and select all text
    setTimeout(() => {
      this.textArea.focus();
      this.textArea.select();
    }, 0);
  }

  hide() {
    // Save changes before hiding if needed
    if (this.model.cellData?.value !== this.textArea.value) {
      // Here you would typically trigger a save event
      console.log('Text changed:', this.textArea.value);
    }
    super.hide();
  }

  // Optional: Add methods for handling text changes
  getValue() {
    return this.textArea.value;
  }

  setValue(value) {
    this.textArea.value = value || '';
  }
}

export class TextTableViewPopoverModel extends TableViewPopoverModel {
  constructor(controller) {
    super(controller);
  }
}

export class TextTableViewPopoverController extends TableViewPopoverController {

  _initializeComponents(){
    this.model = new TextTableViewPopoverModel(this);
    this.view = new TextTableViewPopoverView(this.model, this);
  }
}
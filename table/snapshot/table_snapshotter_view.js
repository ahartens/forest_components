import { View } from '../../core/view.js';

export class TableSnapshotterView extends View {
  constructor(model, controller) {
    super(model, controller);
    this.undoButton = null;
    this.redoButton = null;
  }

  initialize(parentElement) {
    super.initialize(parentElement);
    this._createButtons();
    this._updateButtonStates();
  }

  _createButtons() {
    this.undoButton = document.createElement('button');
    this.undoButton.innerHTML = '↩️ Undo';
    this.undoButton.classList.add('table-snapshot-undo');
    
    this.redoButton = document.createElement('button');
    this.redoButton.innerHTML = '↪️ Redo';
    this.redoButton.classList.add('table-snapshot-redo');

    this.parentElement.appendChild(this.undoButton);
    this.parentElement.appendChild(this.redoButton);

    this._setupEventListeners();
  }

  _setupEventListeners() {
    this.undoButton.addEventListener('click', () => {
      this.controller.undo();
    });

    this.redoButton.addEventListener('click', () => {
      this.controller.redo();
    });
  }

  _updateButtonStates() {
    this.undoButton.disabled = !this.model.canUndo();
    this.redoButton.disabled = !this.model.canRedo();
  }
} 
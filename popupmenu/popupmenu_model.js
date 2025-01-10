import { Model } from '../core/model.js';

export class PopupMenuModel extends Model {
  constructor(controller) {
    super(controller);
    this.state = 'hidden';
  }

  setState(state) {
    this.state = state;
  }

  getState() {
    return this.state;
  }
}
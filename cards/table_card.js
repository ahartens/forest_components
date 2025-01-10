import { Card } from './card.js';
import { TableController } from '../table/table_controller.js';

export class TableCard extends Card {
  constructor(cardData) {
    super(cardData);
    this.tableController = new TableController(this);
    this.tableController.setColors({
        header_background: 'white',
        header_text: 'black',
        row_background: 'white',
        row_text: 'black'
      });
  }

  createCard() {
    const card = super.createCard();
    this.contentContainer.style.paddingLeft = '0px';
    this.contentContainer.style.paddingRight = '0px';
    this.contentContainer.style.paddingTop = '0px';
    this.contentContainer.style.paddingBottom = '0px';
    // Create container for table
    this.tableContainer = document.createElement('div');
    this.tableContainer.id = `table-${Date.now()}`; // Generate unique ID
    this.contentContainer.appendChild(this.tableContainer);
    return card;
  }

  loadCard(){
    if (this.cardData.columns && this.cardData.tableData) {
        this.tableController.addToParent(this.tableContainer.id);
        this.tableController.set_data_with_columns(
          this.cardData.tableData,
          this.cardData.columns,
          this.cardData.columnClickHandlers || {}
        );
      }
  }

  reloadCard(cardData){
    this.cardData = cardData;
    this.tableController.set_data_with_columns(
        this.cardData.tableData,
        this.cardData.columns,
        this.cardData.columnClickHandlers || {}
      );
  }
} 
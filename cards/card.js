export class Card {
  constructor(cardData) {
    console.log("Card constructor data:", cardData);
    this.cardData = cardData;
    this.inputElements = [];
  }

  createCard() {
    const card = document.createElement('div');
    card.style.backgroundColor = 'white';
    card.style.borderRadius = '20px';
    card.style.paddingTop = '20px';
    card.style.paddingBottom = '20px';
    card.style.paddingLeft = '0px';
    card.style.paddingRight = '0px';
    card.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.gap = '15px';
    card.style.width = '100%';
    card.style.marginBottom = '20px';
    card.style.backgroundColor = 'white';
    card.style.border = '1px solid #e0e0e0';
    // Card header (title)
    const header = this.createHeader();
    card.appendChild(header);

    this.contentContainer = document.createElement('div');
    this.contentContainer.style.padding = '20px';
    card.appendChild(this.contentContainer);

    // Card items
    if (this.cardData.items) {
      this.cardData.items.forEach((item, index) => {
        const itemElement = this.createItem(item);
        this.contentContainer.appendChild(itemElement);
      });
    }
    this.element = card;
    return card;
  }

  createHeader() {
    return this.createTitle();
  }

  createTitle(){
    const title = document.createElement('div');
    title.style.fontSize = '30px';
    title.style.fontFamily = 'SNPro-Black';
    title.style.color = '#333';
    title.textContent = this.cardData.title;
    title.style.paddingLeft = '20px';
    title.style.paddingRight = '20px';
    return title;
  }

  createItem(item) {
    const itemElement = document.createElement('div');
    itemElement.style.display = 'flex';
    itemElement.style.justifyContent = 'space-between';
    itemElement.style.alignItems = 'center';
    itemElement.style.minHeight = '40px';
    itemElement.style.fontSize = '16px';
    itemElement.style.color = '#666';
    itemElement.style.padding = '10px 20px';
    itemElement.style.width = '100%';
    itemElement.style.flexShrink = '0';
    
    // Create title element
    const titleSpan = document.createElement('span');
    titleSpan.style.fontWeight = 'bold';
    titleSpan.style.color = '#333';
    titleSpan.style.flexShrink = '0';
    titleSpan.textContent = item.title;
    
    // Create content element
    const contentSpan = document.createElement('span');
    contentSpan.style.color = '#000';
    contentSpan.style.marginLeft = '20px';
    contentSpan.style.flexShrink = '1';
    contentSpan.textContent = item.content;
    contentSpan.style.backgroundColor = '#d0d0d0';  

    itemElement.appendChild(titleSpan);
    itemElement.appendChild(contentSpan);
    
    return itemElement;
  }
} 
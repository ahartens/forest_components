export class MultiSelectDropdown {
    constructor(options = {
        items: [],
        selectedItems: [],
        width: '200px',
        placeholder: 'Select options...',
        onChange: null,
        fitContent: false
    }) {
        this.items = options.items || [];
        this.selectedItems = options.selectedItems || [];
        this.width = options.width || '200px';
        this.placeholder = options.placeholder || 'Select options...';
        this.onChange = options.onChange;
        this.fitContent = options.fitContent || false;
        this.element = this._createDropdown();
    }

    _createDropdown() {
        const dropdownWrapper = this._createWrapper();
        const displayButton = this._createDisplayButton();
        const dropdownContent = this._createDropdownContent();

        this._addOptionsToDropdown(dropdownContent);
        this._setupEventListeners(displayButton, dropdownContent);

        dropdownWrapper.appendChild(displayButton);
        dropdownWrapper.appendChild(dropdownContent);

        return dropdownWrapper;
    }

    _createWrapper() {
        const dropdownWrapper = document.createElement('div');
        Object.assign(dropdownWrapper.style, {
            width: this.width,
            position: 'relative',
            display: 'inline-block'
        });
        return dropdownWrapper;
    }

    _createDisplayButton() {
        const buttonContainer = document.createElement('div');
        Object.assign(buttonContainer.style, {
            position: 'relative',
            width: '100%'
        });

        const displayButton = document.createElement('button');
        Object.assign(displayButton.style, {
            width: '100%',
            minHeight: '35px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            padding: '4px 8px',
            paddingRight: '30px', // Make room for the caret
            marginRight: '10px',
            textAlign: 'left',
            backgroundColor: 'white',
            color: 'black',
            whiteSpace: this.fitContent ? 'normal' : 'nowrap',
            overflow: 'hidden',
            textOverflow: this.fitContent ? 'clip' : 'ellipsis'
        });

        if (this.fitContent) {
            displayButton.style.height = 'auto';
            displayButton.style.wordBreak = 'break-word';
        } else {
            displayButton.style.height = '35px';
        }

        // Add caret
        const caret = document.createElement('img');
        caret.src = '/assets/icons/nav-arrow-down.svg';
        Object.assign(caret.style, {
            position: 'absolute',
            right: '15px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '12px',
            height: '12px',
            pointerEvents: 'none' // Ensure it doesn't interfere with button clicks
        });

        this._updateDisplayText(displayButton);
        buttonContainer.appendChild(displayButton);
        buttonContainer.appendChild(caret);
        return buttonContainer;
    }

    _createDropdownContent() {
        const dropdownContent = document.createElement('div');
        Object.assign(dropdownContent.style, {
            display: 'none',
            position: 'absolute',
            backgroundColor: 'rgba(0,0,0,0)',
            width: '100%',
            border: '1px solid #ccc',
            borderRadius: '5px',
            marginTop: '2px',
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: '1000'
        });
        return dropdownContent;
    }

    _addOptionsToDropdown(dropdownContent) {
        this.items.forEach(item => {
            const optionDiv = this._createOptionDiv(item);
            dropdownContent.appendChild(optionDiv);
        });
    }

    _createOptionDiv(item) {
        const optionDiv = document.createElement('div');
        Object.assign(optionDiv.style, {
            padding: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'white'
        });

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = item.value || item;
        checkbox.style.marginRight = '8px';
        checkbox.checked = this.selectedItems.includes(item.value || item);

        const label = document.createElement('span');
        label.textContent = item.label || item;

        optionDiv.appendChild(checkbox);
        optionDiv.appendChild(label);

        this._setupOptionEventListeners(optionDiv, checkbox);

        return optionDiv;
    }

    _setupEventListeners(displayButton, dropdownContent) {
        // Toggle dropdown and rotate caret on button click
        const button = displayButton.querySelector('button');
        const caret = displayButton.querySelector('img');
        
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = dropdownContent.style.display !== 'none';
            dropdownContent.style.display = isOpen ? 'none' : 'block';
            caret.style.transform = isOpen ? 
                'translateY(-50%)' : 
                'translateY(-50%) rotate(180deg)';
        });

        // Close dropdown and reset caret when clicking outside
        document.addEventListener('click', () => {
            dropdownContent.style.display = 'none';
            caret.style.transform = 'translateY(-50%)';
        });
    }

    _setupOptionEventListeners(optionDiv, checkbox) {
        optionDiv.addEventListener('click', (e) => {
            if (e.target !== checkbox) {
                checkbox.checked = !checkbox.checked;
            }
            this._handleSelectionChange();
        });
    }

    _handleSelectionChange() {
        const selectedValues = Array.from(this.element.querySelectorAll('input[type="checkbox"]:checked'))
            .map(cb => cb.nextElementSibling.textContent);
        
        this.selectedItems = selectedValues;
        this._updateDisplayText(this.element.querySelector('button'));

        if (this.onChange) {
            this.onChange(selectedValues);
        }
    }

    _updateDisplayText(button) {
        const text = this.selectedItems.length ? 
            this.selectedItems.join(', ') : 
            this.placeholder;

        if (this.fitContent) {
            button.textContent = text;
            button.style.height = 'auto';
        } else {
            button.textContent = text;
            if (button.scrollWidth > button.clientWidth) {
                // Find how many items we can show before adding "..."
                const items = this.selectedItems;
                let displayText = '';
                let i = 0;
                
                button.textContent = ''; // Clear to measure accurately
                while (i < items.length) {
                    const testText = i === 0 ? 
                        items[i] : 
                        displayText + ', ' + items[i];
                    
                    button.textContent = testText + '...';
                    if (button.scrollWidth > button.clientWidth) {
                        button.textContent = displayText + '...';
                        break;
                    }
                    
                    displayText = testText;
                    i++;
                }
                
                if (i === items.length) {
                    button.textContent = displayText;
                }
            }
        }
    }

    // Public methods
    getElement() {
        return this.element;
    }

    getSelectedItems() {
        return this.selectedItems;
    }

    setSelectedItems(items) {
        this.selectedItems = items;
        const checkboxes = this.element.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = items.includes(checkbox.value);
        });
        this._updateDisplayText(this.element.querySelector('button'));
    }
} 
import { GLOBAL_COLORS } from '../forest_global.js';
class SplitNavigationModel {
    constructor() {
        this.dims = {
            leftPanelWidth: 300, // Default width in pixels
            minWidth: 300,
            maxWidth: 600,
            borderWidth: 1,
            borderHoverWidth: 4,
            borderColor: '#e0e0e0',
            borderHoverColor: '#808080'
        };
    }

    updateLeftPanelWidth(width) {
        width = Math.max(this.dims.minWidth, Math.min(width, this.dims.maxWidth));
        this.dims.leftPanelWidth = width;
        return width;
    }
}

class SplitNavigationView {
    constructor(parentDivId, model, controller) {
        this.parentDiv = document.getElementById(parentDivId);
        this.model = model;
        this.controller = controller;
        this.isDragging = false;
        this.hideButtonDims = {
            width: 40,
            height: 40,
            margin: 10,
            borderRadius: 4,
            padding: 4,
        };
        this.setupLayout();
    }

    setupLayout() {
        // Clear parent div
        this.parentDiv.innerHTML = '';
        this.parentDiv.style.display = 'flex';
        this.parentDiv.style.position = 'relative';
        this.parentDiv.style.width = '100%';
        this.parentDiv.style.height = '100%';
        
        // Create left navigation panel
        this.leftPanel = document.createElement('div');
        this.leftPanel.id = "left_panel";
        this.leftPanel.style.width = `${this.model.dims.leftPanelWidth}px`;
        this.leftPanel.style.height = '100%';
        this.leftPanel.style.position = 'relative';

        this.leftPanelContent = document.createElement('div');
        this.leftPanelContent.id = "left_panel_content";
        this.leftPanelContent.style.width = '100%';
        this.leftPanelContent.style.height = '100%';
        this.leftPanel.appendChild(this.leftPanelContent);
        
        // Create resizer border
        this.resizer = document.createElement('div');
        this.resizer.style.position = 'absolute';
        this.resizer.style.right = '-5px';
        this.resizer.style.top = '0';
        this.resizer.style.bottom = '0';
        this.resizer.style.width = '10px';
        this.resizer.style.cursor = 'col-resize';
        this.resizer.style.zIndex = '6';
        
        // Create visual line element inside resizer
        this.resizerLine = document.createElement('div');
        this.resizerLine.style.position = 'absolute';
        this.resizerLine.style.left = '50%';
        this.resizerLine.style.top = '0';
        this.resizerLine.style.bottom = '0';
        this.resizerLine.style.width = `${this.model.dims.borderWidth}px`;
        this.resizerLine.style.backgroundColor = this.model.dims.borderColor;
        this.resizerLine.style.transition = 'width 0.2s, background-color 0.2s';
        
        this.resizer.appendChild(this.resizerLine);

        // Create main content area
        this.mainContent = document.createElement('div');
        this.mainContent.style.flex = '1';
        this.mainContent.style.height = '100%';
        this.mainContent.id = "main_content";
        
        // Add elements to DOM
        this.leftPanel.appendChild(this.resizer);
        this.parentDiv.appendChild(this.leftPanel);
        this.parentDiv.appendChild(this.mainContent);
        
        // Create hide panel button
        const hideButton = document.createElement('div');
        hideButton.style.position = 'absolute';
        hideButton.style.bottom = `${this.hideButtonDims.margin}px`;
        hideButton.style.right = `${this.hideButtonDims.margin}px`;
        hideButton.style.width = `${this.hideButtonDims.width}px`;
        hideButton.style.height = `${this.hideButtonDims.height}px`;
        hideButton.style.cursor = 'pointer';
        hideButton.style.zIndex = '5';
        hideButton.style.borderRadius = '4px';
        hideButton.style.padding = '4px';
        hideButton.style.transition = 'background-color 0.2s ease';

        hideButton.addEventListener('mouseenter', () => {
            hideButton.style.backgroundColor = GLOBAL_COLORS.header_dark;
        });

        hideButton.addEventListener('mouseleave', () => {
            hideButton.style.backgroundColor = 'transparent';
        });

        const hideButtonImg = document.createElement('img');
        // get path to this file, and then to icons folder
        const pathToThisFile = import.meta.url;
        const pathToIconsFolder = pathToThisFile.split('/').slice(0, -1).join('/') + '/icons/';
        hideButtonImg.src = pathToIconsFolder + 'fast-arrow-left.svg';
        hideButtonImg.style.width = '100%';
        hideButtonImg.style.height = '100%';
        hideButton.appendChild(hideButtonImg);

        hideButton.addEventListener('click', () => {
            this.controller.clickedOnHideLeftPanel();
        });

        this.leftPanel.appendChild(hideButton);
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.resizer.addEventListener('mouseenter', () => {
            if (!this.isDragging) {
                this.resizerLine.style.width = `${this.model.dims.borderHoverWidth}px`;
                this.resizerLine.style.backgroundColor = this.model.dims.borderHoverColor;
            }
        });

        this.resizer.addEventListener('mouseleave', () => {
            if (!this.isDragging) {
                this.resizerLine.style.width = `${this.model.dims.borderWidth}px`;
                this.resizerLine.style.backgroundColor = this.model.dims.borderColor;
            }
        });

        this.resizer.addEventListener('mousedown', (e) => {
            this.controller.startDragging(e);
        });

        document.addEventListener('mousemove', (e) => {
            this.controller.onDrag(e);
        });

        document.addEventListener('mouseup', () => {
            this.controller.stopDragging();
        });
    }

    updateLeftPanelWidth(width) {
        this.leftPanel.style.width = `${width}px`;
    }

    displayLeftPanel(leftPanelController) {
        leftPanelController.addToParent(this.leftPanelContent.id);
    }

    displayRightPanel(rightPanelController) {
        rightPanelController.addToParent(this.mainContent.id);
    }

    clearRightPanel() {
        this.mainContent.innerHTML = '';
    }
}

export class SplitNavigationController {
    constructor(parentDivId, delegate) {
        this.delegate = delegate;
        this.model = new SplitNavigationModel();
        this.view = new SplitNavigationView(parentDivId, this.model, this);
        this.isDragging = false;
        this.startX = 0;
        this.startWidth = 0;
    }

    setRightPanel(rightPanelController) {
        this.rightPanelController = rightPanelController;
        this.view.displayRightPanel(rightPanelController);
    }

    setLeftPanel(leftPanelController) {
        this.leftPanelController = leftPanelController;
        this.view.displayLeftPanel(leftPanelController);
    }

    startDragging(event) {
        this.isDragging = true;
        this.startX = event.clientX;
        this.startWidth = this.model.dims.leftPanelWidth;
        document.body.style.cursor = 'col-resize';
    }

    onDrag(event) {
        if (!this.isDragging) return;
        
        const delta = event.clientX - this.startX;
        const newWidth = this.model.updateLeftPanelWidth(this.startWidth + delta);
        this.view.updateLeftPanelWidth(newWidth);
    }

    stopDragging() {
        this.isDragging = false;
        document.body.style.cursor = 'default';
    }

    on_dom_load() {
    }

    clearRightPanel() {
        this.view.clearRightPanel();
    }

    clickedOnHideLeftPanel() {
        if (this.delegate.switchViews) {
            this.delegate.switchViews();
        }
    }
} 
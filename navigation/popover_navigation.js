import { GLOBAL_COLORS } from '../forest_global.js';

class PopoverNavigationModel {
    constructor() {
        this.dims = {
            leftPanelWidth: 300,      // Width of the panel in pixels
            animationDuration: 300,    // Duration of slide animation in ms
            mouseDetectionZone: 100,    // Zone in pixels from left edge that triggers panel
            leftHiddenPosition: -300,  // Starting position (off-screen)
            leftVisiblePosition: 0     // Final position (visible)
        };
        this.isVisible = false;
    }

    setVisibility(isVisible) {
        this.isVisible = isVisible;
        return this.isVisible;
    }
}

class PopoverNavigationView {
    constructor(parentDivId, model, controller) {
        this.parentDiv = document.getElementById(parentDivId);
        this.model = model;
        this.controller = controller;
        this.hideButtonDims = {
            width: 40,
            height: 40,
            margin: 10,
            borderRadius: 4,
            padding: 4,
        };
        this.setupLayout();
        this.setupEventListeners();
    }

    setupLayout() {
        // Clear parent div
        this.parentDiv.innerHTML = '';
        this.parentDiv.style.display = 'flex';
        this.parentDiv.style.position = 'relative';
        
        // Create left navigation panel
        this.leftPanel = document.createElement('div');
        this.leftPanel.id = "popover_left_panel";
        this.leftPanel.style.cssText = `
            position: fixed;
            left: ${this.model.dims.leftHiddenPosition}px;
            top: 0;
            width: ${this.model.dims.leftPanelWidth}px;
            height: 100%;
            background-color: white;
            box-shadow: 2px 0 5px rgba(0,0,0,0.1);
            transition: left ${this.model.dims.animationDuration}ms ease;
            z-index: 1100;
        `;

        this.leftPanelContent = document.createElement('div');
        this.leftPanelContent.id = "popover_left_panel_content";
        this.leftPanelContent.style.width = '100%';
        this.leftPanelContent.style.height = '100%';
        this.leftPanel.appendChild(this.leftPanelContent);
        
        // Create main content area
        this.mainContent = document.createElement('div');
        this.mainContent.style.flex = '1';
        this.mainContent.style.height = '100%';
        this.mainContent.id = "popover_main_content";
        
        // Add elements to DOM
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
        hideButton.style.borderRadius = `${this.hideButtonDims.borderRadius}px`;
        hideButton.style.padding = `${this.hideButtonDims.padding}px`;
        hideButton.style.transition = 'background-color 0.2s ease';

        hideButton.addEventListener('mouseenter', () => {
            hideButton.style.backgroundColor = GLOBAL_COLORS.header_dark;
        });

        hideButton.addEventListener('mouseleave', () => {
            hideButton.style.backgroundColor = 'transparent';
        });

        const hideButtonImg = document.createElement('img');
        const pathToThisFile = import.meta.url;
        const pathToIconsFolder = pathToThisFile.split('/').slice(0, -1).join('/') + '/icons/';
        hideButtonImg.src = pathToIconsFolder + 'fast-arrow-right.svg';
        hideButtonImg.style.width = '100%';
        hideButtonImg.style.height = '100%';
        hideButton.appendChild(hideButtonImg);

        hideButton.addEventListener('click', () => {
            this.controller.clickedOnHideLeftPanel();
        });

        this.leftPanel.appendChild(hideButton);
    }

    setupEventListeners() {
        // Mouse movement detection zone
        this.mouseDetector = document.createElement('div');
        this.mouseDetector.style.cssText = `
            position: fixed;
            left: 0;
            top: 0;
            width: ${this.model.dims.mouseDetectionZone}px;
            height: 100%;
            z-index: 999;
        `;
        document.body.appendChild(this.mouseDetector);

        // Show panel when mouse enters detection zone
        this.mouseDetector.addEventListener('mouseenter', () => {
            this.controller.showPanel();
        });

        // Hide panel when mouse leaves the panel
        this.leftPanel.addEventListener('mouseleave', () => {
            this.controller.hidePanel();
        });

        // Add click listener to the entire left panel
        this.leftPanel.addEventListener('click', (event) => {
            // Check if we clicked anything interactive
            if (event.target.closest('a, button, .hierarchical-list-item, [role="button"]')) {
                this.controller.hidePanel();
            }
        });
    }

    showPanel() {
        this.leftPanel.style.left = `${this.model.dims.leftVisiblePosition}px`;
    }

    hidePanel() {
        this.leftPanel.style.left = `${this.model.dims.leftHiddenPosition}px`;
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

export class PopoverNavigationController {
    constructor(parentDivId, delegate) {
        this.delegate = delegate;
        this.model = new PopoverNavigationModel();
        this.view = new PopoverNavigationView(parentDivId, this.model, this);
    }

    showPanel() {
        if (!this.model.isVisible) {
            this.model.setVisibility(true);
            this.view.showPanel();
        }
    }

    hidePanel() {
        if (this.model.isVisible) {
            this.model.setVisibility(false);
            this.view.hidePanel();
        }
    }

    setRightPanel(rightPanelController) {
        this.rightPanelController = rightPanelController;
        this.view.displayRightPanel(rightPanelController);
        this.hidePanel();
    }

    setLeftPanel(leftPanelController) {
        this.leftPanelController = leftPanelController;
        this.view.displayLeftPanel(leftPanelController);
        
        // If the left panel controller has a hierarchical list, add click handling
        if (leftPanelController.element) {
            leftPanelController.element.addEventListener('click', () => {
                this.hidePanel();
            });
        }
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
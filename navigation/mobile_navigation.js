import {GLOBAL_COLORS} from "../forest_global.js";

class MobileNavigationModel {
    constructor() {
        this.dims = {
            animationDuration: 300,    // Duration of slide animation in ms
            buttonWidth: 100,          // Width of navigation button
            buttonHeight: 45,          // Height of navigation button
            buttonColor: GLOBAL_COLORS.accent,    // Button background color
            buttonTextColor: 'black',  // Button text color
            buttonFontSize: 14,        // Button font size in px
            buttonFontFamily: 'SNPro-Bold', // Button font family
        };
        this.currentView = 'left';     // 'left' or 'right'
    }

    setCurrentView(view) {
        if (view !== 'left' && view !== 'right') return;
        this.currentView = view;
        return this.currentView;
    }
}

class MobileNavigationView {
    constructor(parentDivId, model, controller) {
        this.parentDiv = document.getElementById(parentDivId);
        this.model = model;
        this.controller = controller;
        this.setupLayout();
    }

    setupLayout() {
        // Clear parent div
        this.parentDiv.innerHTML = '';
        this.parentDiv.style.cssText = `
            position: absolute;
            background-color: red;
            color: black;
            top: 0;
            left: 0;
            width: 200vw;
            height: 100vh;
            display: flex;
            transition: transform ${this.model.dims.animationDuration}ms ease;
            // overflow: hidden;
        `;
        
        // Create left panel
        this.leftPanel = document.createElement('div');
        this.leftPanel.id = "mobile_left_panel";
        this.leftPanel.style.cssText = `
            width: 100vw;
            height: 100vh;
            flex-shrink: 0;
            position: relative;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
            overscroll-behavior: none;
        `;

        // Create right panel
        this.rightPanel = document.createElement('div');
        this.rightPanel.id = "mobile_right_panel";
        this.rightPanel.style.cssText = `
            width: 100vw;
            height: 100vh;
            flex-shrink: 0;
            position: relative;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
            overscroll-behavior: none;
        `;

        // Create navigation button with icon
        this.navButton = document.createElement('button');
        this.navButton.style.cssText = `
            position: fixed;
            left: 103vw;
            bottom: 90px;
            width: ${this.model.dims.buttonHeight}px;
            height: ${this.model.dims.buttonHeight}px;
            background-color: ${this.model.dims.buttonColor};
            color: ${this.model.dims.buttonTextColor};
            border: none;
            border-radius: ${this.model.dims.buttonHeight/2}px;
            cursor: pointer;
            z-index: 10000;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            outline: none;
            transform: translateZ(0);
            -webkit-transform: translateZ(0);
            padding: 8px;  // Add padding for the icon
        `;

        // Create and add the menu icon
        const menuIcon = document.createElement('img');
        menuIcon.src = "/assets/icons/menu-scale.svg";
        menuIcon.style.cssText = `
            width: 24px;
            height: 24px;
            object-fit: contain;
            pointer-events: none;
            user-select: none;
            -webkit-user-select: none;
        `;
        
        this.navButton.appendChild(menuIcon);

        // Add elements to DOM
        this.parentDiv.appendChild(this.leftPanel);
        this.parentDiv.appendChild(this.rightPanel);
        this.parentDiv.appendChild(this.navButton);
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.navButton.addEventListener('click', () => {
            this.controller.showLeft();
        });
    
        // Add touch event handling for edge swipe
        let touchStartX = 0;
        let touchStartY = 0;
        const edgeSize = 30; // Size of edge detection zone in pixels
    
        this.rightPanel.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
    
        this.rightPanel.addEventListener('touchmove', (e) => {
            if (this.model.currentView !== 'right') return;
    
            const touchX = e.touches[0].clientX;
            const touchY = e.touches[0].clientY;
            const deltaX = touchX - touchStartX;
            const deltaY = Math.abs(touchY - touchStartY);
    
            // Check if touch started from left edge
            if (touchStartX <= edgeSize) {
                // Ensure horizontal swipe (not vertical)
                if (deltaX > 50 && deltaY < 30) {
                    e.preventDefault();
                    this.controller.showLeft();
                }
            }
        });
    }

    showLeft() {
        this.parentDiv.style.transform = 'translate3d(0, 0, 0)';
        this.parentDiv.style.top = '0px';
    }
    
    showRight() {
        this.parentDiv.style.transform = 'translate3d(-100vw, 0, 0)';
        this.parentDiv.style.top = '0px';

    }

    displayLeftPanel(leftPanelController) {
        leftPanelController.addToParent(this.leftPanel.id);
        this.showLeft()
    }

    displayRightPanel(rightPanelController) {
        rightPanelController.addToParent(this.rightPanel.id);
        this.showRight()
    }

    clearRightPanel() {
        this.rightPanel.innerHTML = '';
        this.rightPanel.appendChild(this.navButton); // Preserve the nav button
    }

    show() {
        this.parentDiv.style.display = 'flex';
    }

    hide() {
        this.parentDiv.style.display = 'none';
    }
}

export class MobileNavigationController {
    constructor(parentDivId) {
        this.model = new MobileNavigationModel();
        this.view = new MobileNavigationView(parentDivId, this.model, this);
    }

    showLeft() {
        this.model.setCurrentView('left');
        this.view.showLeft();
    }

    showRight() {
        this.model.setCurrentView('right');
        this.view.showRight();
    }

    setRightPanel(rightPanelController) {
        this.rightPanelController = rightPanelController;
        this.view.displayRightPanel(rightPanelController);
    }

    setLeftPanel(leftPanelController) {
        this.leftPanelController = leftPanelController;
        this.view.displayLeftPanel(leftPanelController);
    }

    clearRightPanel() {
        this.view.clearRightPanel();
    }

    show() {
        this.view.show();
    }

    hide() {
        this.view.hide();
    }
} 
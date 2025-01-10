import { MobileNavigationController } from './mobile_navigation.js';
import { SplitNavigationController } from './split_navigation.js';
import { PopoverNavigationController } from './popover_navigation.js';
export class NavigationManager {
    constructor(parentDivId) {
        this.parentDivId = parentDivId;
        this.leftPanelController = null;
        this.rightPanelController = null;
        this.currentNavigationController = null;
        this.set_navigation_controller();
        
        // Add event listener to handle window resize
        window.addEventListener('resize', () => this.set_navigation_controller());
    }

    set_navigation_controller() {
        const screenWidth = window.innerWidth;
        const isMobile = screenWidth < 800;

        if (isMobile && !(this.currentNavigationController instanceof MobileNavigationController)) {
            this.currentNavigationController = new MobileNavigationController(this.parentDivId);
            console.log("SETTING MOBILE NAVIGATION CONTROLLER");
        } else if (!isMobile && !(this.currentNavigationController instanceof SplitNavigationController)) {
            this.currentNavigationController = new SplitNavigationController(this.parentDivId, this);
            // this.currentNavigationController = new PopoverNavigationController(this.parentDivId);
            console.log("SETTING SPLIT NAVIGATION CONTROLLER");
        }
        this.assignLeftAndRightPanelContent();

    }

    assignLeftAndRightPanelContent(){
        // Maintain left and right panels
        if (this.leftPanelController) {
            this.currentNavigationController.setLeftPanel(this.leftPanelController);
        }
        if (this.rightPanelController) {
            this.currentNavigationController.setRightPanel(this.rightPanelController);
        }
    }

    setLeftPanel(leftPanelController) {
        this.leftPanelController = leftPanelController;
        if (this.currentNavigationController) {
            this.currentNavigationController.setLeftPanel(leftPanelController);
        }
    }

    setRightPanel(rightPanelController) {
        this.rightPanelController = rightPanelController;
        if (this.currentNavigationController) {
            this.currentNavigationController.setRightPanel(rightPanelController);
        }
    }

    clearRightPanel() {
        if (this.currentNavigationController) {
            this.currentNavigationController.clearRightPanel();
        }
    }

    switchViews() {
        // cehck if this.currentNavigationController is a split navigation controller
        if (this.currentNavigationController instanceof SplitNavigationController) {
            this.currentNavigationController = new PopoverNavigationController(this.parentDivId, this);
        } else if (this.currentNavigationController instanceof PopoverNavigationController) {
            this.currentNavigationController = new SplitNavigationController(this.parentDivId, this);
        }
        this.assignLeftAndRightPanelContent();
    }
} 
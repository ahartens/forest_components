import { PopupMenuItem } from "./popupmenu_item.js";
import { GLOBAL_COLORS } from "/forest_global.js";

export class PopupMenuItemButtonsRow extends PopupMenuItem {
    constructor(label, controller, buttons = []) {
        super(label, controller);
        this.buttons = buttons;
        // this.dimensions.height = 100; // Increased height to accommodate input and buttons
        this.allow_hover = false;
    }

    draw(width) {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("popup-menu-item");
        itemDiv.style.width = width + "px";
        itemDiv.style.minHeight = this.dimensions.height + "px";
        itemDiv.style.padding = "15px";
        itemDiv.style.display = "flex";
        itemDiv.style.flexDirection = "column";
        itemDiv.style.gap = "15px";

        // Add button container
        const buttonContainer = this._createButtonContainer();
        this.buttons.forEach(buttonConfig => {
            const button = this._createButton(buttonConfig);
            buttonContainer.appendChild(button);
        });
        itemDiv.appendChild(buttonContainer);

        return itemDiv;
    }

    _createButtonContainer() {
        const container = document.createElement("div");
        Object.assign(container.style, {
            display: "flex",
            justifyContent: "space-between",
            margin: "0 10px",
            gap: "10px"
        });
        return container;
    }

    _createButton(config) {
        const button = document.createElement("button");
        button.textContent = config.displayName || config.name;
        button.id = `buttonrow_${config.name}`
        
        const isActive = config.state === 'active';
        const buttonColor = isActive ? (config.colorActive || GLOBAL_COLORS.highlight) : 'transparent';
        const textColor = isActive ? 'white' : GLOBAL_COLORS.text;

        Object.assign(button.style, {
            flex: "1",
            padding: "8px 15px",
            borderRadius: "15px",
            border: "1px solid " + GLOBAL_COLORS.text,
            backgroundColor: buttonColor,
            color: textColor,
            cursor: "pointer",
            transition: "all 0.2s ease",
            fontSize: "14px",
            fontFamily: "SNPro-Regular"
        });

        // Hover effects
        button.addEventListener("mouseenter", () => {
            if (!isActive) {
                button.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
            }
        });

        button.addEventListener("mouseleave", () => {
            if (!isActive) {
                button.style.backgroundColor = "transparent";
            }
        });

        if (config.onClick) {
            button.addEventListener("click", (e) => {
                e.stopPropagation();
                config.onClick();
            });
        }

        return button;
    }
} 
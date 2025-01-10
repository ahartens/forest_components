import { PopupMenuItem } from "./popupmenu_item.js";
import { GLOBAL_COLORS } from "/forest_global.js";

export class PopupMenuItemTextInput extends PopupMenuItem {
    constructor(label, controller, watermark = "", button = {
        name: "submit",
        displayName: "Submit",
        state: "inactive",
        colorActive: GLOBAL_COLORS.highlight,
        onClick: null
    }) {
        super(label, controller);
        this.watermark = watermark;
        this.button = button;
        this.dimensions.height = 70; // Height for single row with padding
        this.allow_hover = false;
    }

    draw(width) {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("popup-menu-item");
        itemDiv.style.width = width + "px";
        itemDiv.style.minHeight = this.dimensions.height + "px";
        itemDiv.style.padding = "15px";
        itemDiv.style.display = "flex";
        itemDiv.style.alignItems = "center";
        itemDiv.style.gap = "10px";

        // Add text input
        const textInput = this._createTextInput();
        itemDiv.appendChild(textInput);

        // Add button
        const button = this._createButton(this.button);
        itemDiv.appendChild(button);

        this.itemDiv = itemDiv;
        return itemDiv;
    }

    _createTextInput() {
        const input = document.createElement("input");
        Object.assign(input.style, {
            flex: "1",
            height: "35px",
            lineHeight: "35px", // Match height for vertical centering
            padding: "0 15px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "14px",
            outline: "none",
            fontFamily: "SNPro-Regular",
            boxSizing: "border-box" // Include padding and border in height calculation
        });

        // Set watermark (placeholder)
        input.placeholder = this.watermark;

        input.addEventListener("focus", () => {
            input.style.borderColor = GLOBAL_COLORS.highlight;
        });

        input.addEventListener("blur", () => {
            input.style.borderColor = "#ccc";
        });

        // Handle Enter key
        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter" && this.button.onClick) {
                this.button.onClick(input.value);
            }
        });

        return input;
    }

    _createButton(config) {
        const button = document.createElement("button");
        button.textContent = config.displayName || config.name;
        
        const isActive = config.state === 'active';
        const buttonColor = isActive ? (config.colorActive || GLOBAL_COLORS.highlight) : 'transparent';
        const textColor = isActive ? 'white' : GLOBAL_COLORS.text;

        Object.assign(button.style, {
            height: "35px", // Match input height
            lineHeight: "35px", // Match height for vertical centering
            padding: "0 15px",
            borderRadius: "15px",
            border: "1px solid " + GLOBAL_COLORS.text,
            backgroundColor: buttonColor,
            color: textColor,
            cursor: "pointer",
            transition: "all 0.2s ease",
            fontSize: "14px",
            fontFamily: "SNPro-Regular",
            whiteSpace: "nowrap", // Prevent button text from wrapping
            boxSizing: "border-box" // Include padding and border in height calculation
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
                config.onClick(this.getInputValue());
            });
        }

        return button;
    }

    getInputValue() {
        const input = this.itemDiv?.querySelector('input');
        return input ? input.value : '';
    }

    setInputValue(value) {
        const input = this.itemDiv?.querySelector('input');
        if (input) {
            input.value = value;
        }
    }

    focusInput() {
        const input = this.itemDiv?.querySelector('input');
        if (input) {
            input.focus();
        }
    }
} 
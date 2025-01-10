import { drawPlusMinusButton } from "/src/components/buttons.js";
import { GLOBAL_COLORS } from "/src/global.js";
export class PopupMenuItem {
  constructor(label, controller, rightButtonConfig = null) {
    this.label = label;
    this.controller = controller;
    this.rightButtonConfig = rightButtonConfig; // { text: "Button", onClick: () => {} }
    this.dimensions = { width: 100, height: 40 };
    this.allow_hover = true;
  }

  draw(width) {
    this.dimensions.width = width;
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("popup-menu-item");
    itemDiv.style.width = this.dimensions.width + "px";
    itemDiv.style.minHeight = this.dimensions.height + "px";
    itemDiv.style.position = "relative";
    itemDiv.style.display = "flex";
    itemDiv.style.alignItems = "center";
    itemDiv.style.justifyContent = "space-between";
    itemDiv.style.padding = "10px";
    itemDiv.style.cursor = "pointer";
    itemDiv.style.paddingLeft = "20px";
    itemDiv.style.borderBottom = "1px solid transparent";
    itemDiv.style.transition = "background-color 0.3s ease";

    // Create label span
    const labelSpan = document.createElement("span");
    labelSpan.textContent = this.label;
    itemDiv.appendChild(labelSpan);

    this._add_right_button(itemDiv);
    if (this.allow_hover) {
      itemDiv.addEventListener("mouseleave", () => {
        itemDiv.style.backgroundColor = "";
        itemDiv.style.color = "";
      });
    }

    itemDiv.addEventListener(
      "click",
      function () {
        this.controller.pop_menu_item_clicked(this.label);
      }.bind(this)
    );

    return itemDiv;
  }

  finished_adding_to_dom() {}

  _add_right_button(itemDiv){
     // Add right button if configured
     if (this.rightButtonConfig) {
      const button = document.createElement("button");
      button.textContent = this.rightButtonConfig.text;
      Object.assign(button.style, {
        padding: "6px 12px",
        borderRadius: "15px",
        border: "1px solid transparent",
        backgroundColor: "transparent",
        color: this.rightButtonConfig.color || 'black',
        cursor: "pointer",
        transition: "background-color 0.2s ease",
        marginRight: "10px"
      });

      button.addEventListener("mouseenter", () => {
        button.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
      });

      button.addEventListener("mouseleave", () => {
        button.style.backgroundColor = "transparent";
      });

      if (this.rightButtonConfig.onClick) {
        button.addEventListener("click", (e) => {
          e.stopPropagation(); // Prevent item click when clicking button
          this.rightButtonConfig.onClick();
        });
      }

      itemDiv.appendChild(button);
    }
  }
}

export class PopupMenuPlusMinusItem {
  constructor(label, controller, id, onclickfunction) {
    this.label = label; // Label or name of the menu item
    this.id = id;
    this.controller = controller;
    this.dimensions = { width: 100, height: 50 }; // Item size (optional)
    this.onclickfunction = onclickfunction;
  }

  // The method to create and return the HTML for the menu item
  draw(width) {
    this.dimensions.width = width;

    const itemDiv = document.createElement("div");
    itemDiv.classList.add("popup-menu-item");
    itemDiv.style.width = this.dimensions.width + "px";
    itemDiv.style.height = this.dimensions.height + "px";
    itemDiv.textContent = this.label; // The label of the item

    // Set relative positioning for the itemDiv
    itemDiv.style.position = "relative"; // So that controls are positioned relative to this div

    const controls = document.createElement("div");
    controls.style.width = "100px"; // Fixed width for controls div
    controls.style.height = this.dimensions.height + "px";
    controls.id = this.id + "control-div";

    // Set absolute positioning to align to the right
    controls.style.position = "absolute";
    controls.style.right = "0"; // Align controls div to the right
    controls.style.top = "0"; // Align it at the top (you can adjust if needed)

    // Append controls to the itemDiv
    itemDiv.appendChild(controls);

    return itemDiv;
  }

  finished_adding_to_dom() {
    drawPlusMinusButton({
      parent_div: this.id + "control-div",
      button_div_id: "",
      circleDiameter: 25,
      lineLength: 10,
      lineStrokeWidth: 3,
      lineStrokeColor: "red",
      circleStrokeWidth: 1,
      circleStrokeColor: "red",
      onclickfunction: this.onclickfunction,
    });
  }
}


export class PopupMenuItemTitle extends PopupMenuItem{
  constructor(label, controller, rightButtonConfig = null) {
    super(label, controller, rightButtonConfig);
    this.allow_hover = false;
  }

  // The method to create and return the HTML for the menu item
  draw(width) {
    const itemDiv = super.draw(width);
    itemDiv.style.fontSize = '20px';
    itemDiv.style.fontFamily = 'SNPro-Black';
    itemDiv.style.paddingLeft = '20px';
    itemDiv.style.paddingTop = '20px';
    return itemDiv;
  }
  
}
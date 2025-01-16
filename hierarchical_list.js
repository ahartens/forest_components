export class HierarchicalList {
    constructor(data, dims, backgroundWidth, backgroundHeight, keyForId) {
        this.data = data; // Hierarchically organized data structure
        this.dims = dims; // Dictionary for font styles per level
        this.backgroundWidth = backgroundWidth; // Width of the background
        this.backgroundHeight = backgroundHeight; // Height of the background
        this.nMarginPixels = 15; // Indentation for child levels
        this.borderRadius = 10; // Border radius for the labels
        this.keyForId = keyForId || null; // Key for the id in the data
        this.lastClickedItem = null; // Add this line
        this.bottomPadding = dims.bottomPadding || 20;
        
        // Add CSS style for highlighted items
        const style = document.createElement('style');
        style.textContent = `
            .hierarchical-list-highlighted {
                background-color: #e0e0e0 !important;
            }
        `;
        document.head.appendChild(style);
    }

    createList() {
        // Find parent div
        const parentDiv = document.getElementById(this.parentDivId);

        // Clear previous content if any
        parentDiv.innerHTML = "";

        // Set up the background container
        const backgroundDiv = document.createElement("div");
        backgroundDiv.id = "HierarchicalList_background";
        backgroundDiv.style.width = "100%";
        backgroundDiv.style.height = "100%";
        backgroundDiv.style.overflow = "auto";
        backgroundDiv.style.backgroundColor = "#f9f9f9"; // Optional background color
        backgroundDiv.style.padding = "10px";
        backgroundDiv.style.paddingBottom = `${this.bottomPadding}px`;
        parentDiv.appendChild(backgroundDiv);

        // Recursive function to create list elements
        const createItem = (items, level = 0) => {
            const ul = document.createElement("ul");
            ul.style.listStyleType = "none";
            ul.style.margin = "0";
            ul.style.padding = "0";

            items.forEach((item) => {
                const li = document.createElement("li");
                li.style.paddingTop = "3px";
                const itemLabel = document.createElement("div");
                
                // Create a container for the entire row (icon+text and right button)
                const rowContainer = document.createElement("div");
                rowContainer.style.display = "flex";
                rowContainer.style.justifyContent = "space-between";
                rowContainer.style.alignItems = "center";
                rowContainer.style.width = "100%";
                // Remove any default padding/margin that might affect border radius
                rowContainer.style.margin = "0";
                rowContainer.style.borderRadius = `${this.borderRadius}px`;
                rowContainer.style.padding = "2px 8px";

                // Create a container for icon and text
                const labelContent = document.createElement("div");
                labelContent.style.display = "flex";
                labelContent.style.alignItems = "center";
                labelContent.style.gap = "10px";
                
                // Add icon if it exists
                if (item.icon) {
                    const icon = document.createElement("img");
                    icon.src = item.icon;
                    const fontSize = this.dims[level]?.fontSize || "16px";
                    const iconSize = parseInt(fontSize) * 0.9 + 'px';
                    icon.style.width = iconSize;
                    icon.style.height = iconSize;
                    icon.style.objectFit = "contain";
                    labelContent.appendChild(icon);
                }
                
                // Add text
                const textSpan = document.createElement("span");
                textSpan.textContent = item.name;
                labelContent.appendChild(textSpan);

                // Add the content container to the row container
                rowContainer.appendChild(labelContent);

                // Add right button if specified
                if (item.rightButton) {
                    const button = document.createElement("button");
                    button.style.display = "flex";
                    button.style.alignItems = "center";
                    button.style.gap = "5px";
                    

                    
                    // Add button text
                    const buttonText = document.createElement("span");
                    buttonText.textContent = item.rightButton.title;
                    button.appendChild(buttonText);
                    
                    button.id = item.rightButton.id || `right-button-${item.rightButton.title.replace(/\s+/g, '-')}`;
                    button.style.marginLeft = "20px";
                    button.style.marginRight = "10px";
                    button.style.padding = "5px 15px";
                    button.style.borderRadius = "100px";
                    button.style.border = "1px solid #ccc";
                    button.style.backgroundColor = "#f8f8f8";
                    button.style.color = "black";
                    button.style.cursor = "pointer";
                    button.style.fontSize = "14px";
                    // Add image if specified
                    if (item.rightButton.image) {
                        const img = document.createElement("img");
                        img.src = item.rightButton.image;
                        img.style.width = "30px";  // Adjust size as needed
                        img.style.height = "30px";
                        button.appendChild(img);
                        button.style.padding = "5px 10px 5px 5px";
                        button.style.border = "0px solid #ccc";


                    }
                    if (this.keyForId) {
                        console.log("Setting button id:", item[this.keyForId]);
                        button.id = `${item[this.keyForId]}-button`;
                    }
                    
                    // Hover effect
                    button.addEventListener("mouseover", () => {
                        button.style.backgroundColor = "#e8e8e8";
                    });
                    button.addEventListener("mouseout", () => {
                        button.style.backgroundColor = "#f8f8f8";
                    });

                    // Add click handler if provided
                    if (item.rightButton.onClick) {
                        button.addEventListener("click", (e) => {
                            e.stopPropagation();  // Prevent event bubbling
                            item.rightButton.onClick();
                        });
                    }

                    rowContainer.appendChild(button);
                }

                // Style the label container
                // itemLabel.style.padding = "4px 8px";
                rowContainer.style.marginLeft = `${level * this.nMarginPixels}px`;
                rowContainer.style.width = `calc(100% - ${level * this.nMarginPixels}px)`;

                itemLabel.style.borderRadius = `${this.borderRadius}px`;
                itemLabel.style.cursor = item.children && item.collapsible ? "pointer" : "default";
                itemLabel.style.width = "100%";

                // Add the row container to the label
                itemLabel.appendChild(rowContainer);

                // Hover effects
                itemLabel.addEventListener("mouseover", () => {
                    if (!rowContainer.classList.contains('hierarchical-list-highlighted')) {
                        rowContainer.style.backgroundColor = "#eee";
                    }
                });
                itemLabel.addEventListener("mouseout", () => {
                    if (!rowContainer.classList.contains('hierarchical-list-highlighted')) {
                        rowContainer.style.backgroundColor = "transparent";
                    }
                });

                // Apply styling from dims
                const fontSize = this.dims[level]?.fontSize || "16px";
                const fontFamily = this.dims[level]?.fontFamily || "SNPro-Regular";
                itemLabel.style.fontSize = fontSize;
                itemLabel.style.fontFamily = fontFamily;

                li.appendChild(itemLabel);

                if (item.children) {
                    const childUl = createItem(item.children, level + 1);
                    childUl.classList.add('hierarchical-list-children');
                    li.appendChild(childUl);
                    
                    // Set initial state
                    if (!item.isHidden) {
                        // Allow next frame to establish initial state for transition
                        requestAnimationFrame(() => {
                            childUl.classList.add('expanded');
                        });
                    }

                    // Only add click handler if item is collapsible
                    if (item.collapsible) {
                        itemLabel.style.cursor = "pointer"; // Only show pointer cursor if collapsible
                        
                        itemLabel.addEventListener("click", (e) => {
                            e.stopPropagation();
                            // Handle collapsible behavior
                            if (item.children && item.collapsible) {
                                item.isHidden = !item.isHidden;
                                childUl.classList.toggle('expanded');
                            }

                            // // Call onClick handler if it exists don't think this is necessary because of below?
                            // if (item.onClick) {
                            //     item.onClick();
                            // }
                        });
                    } else {
                        // For non-collapsible items, always show children
                        childUl.classList.add('expanded');
                        item.isHidden = false;
                    }

                    itemLabel.addEventListener("click", (e) => {
                        // Remove highlight from previously clicked item
                        const previousHighlight = document.querySelector('.hierarchical-list-highlighted');
                        if (previousHighlight) {
                            previousHighlight.classList.remove('hierarchical-list-highlighted');
                            previousHighlight.style.backgroundColor = "transparent";
                        }
                        
                        // Add highlight to current item
                        rowContainer.classList.add('hierarchical-list-highlighted');
                        
                        if (item.onClick) {
                            item.onClick();
                        }
                    });
                }

                ul.appendChild(li);
            });

            return ul;
        };

        // Build the list
        const list = createItem(this.data);
        backgroundDiv.appendChild(list);
    }

    addToParent(parentDivId) {
        this.parentDivId = parentDivId;
        this.createList();
    }

    updateData(newData) {
        this.data = newData;
        // Recreate the list with the new data
        this.createList();
    }

    updateItem(path, newItem) {
        // path is an array of indices to reach the item
        let current = this.data;
        for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]].children;
        }
        current[path[path.length - 1]] = newItem;
        this.createList();
    }
}

export class SlideSliderController {
    constructor(x, y, svg, gridDimensions, parentController, startKey) {
        this.svg = svg;
        this.x = x;
        this.y = y;
        this.parentController = parentController;
        this.gridDimensions = gridDimensions;
        // Define dimensions and other parameters
        this.dims = {
            size: {
                width: this.gridDimensions.widthCol * 7,
                height: this.gridDimensions.heightRow * 2,
            }, // Size of the control
            margin: { top: 10, right: 10, bottom: 10, left: 10 }, // Margins for layout
            backgroundColor: "transparent", // Background color
            borderRadius: 10, // Border radius for rounded corners
            nDuplications: 3,
        };

        this.currentKey = startKey;
        this.chordData = ["C", "D", "E", "F", "G", "A", "B"];

        this.state = {
            x: 0,
            y: y,
        };

        this.#setInitXPosition();
        // Call the internal method to draw the key selection control group
        this.drawKeySelectionControl();

        // Bind the drag event to the control
        this.bindDragEvents();
    }

    setKey(key) {
        this.currentKey = key;
        this.#setInitXPosition();
        this.parentController.keyChanged(key);
    }

    #setInitXPosition() {
        const idxStartKey = this.chordData.indexOf(this.currentKey);
        const keyX = this.gridDimensions.widthCol * idxStartKey;
        this.state.initX = -this.gridDimensions.widthCol * 7 - keyX;
        this.state.initKeyIdx = idxStartKey;
    }

    // Method to draw the control group
    drawKeySelectionControl() {
        this.controlGroup = this.svg
            .append("g")
            .attr("transform", `translate(${this.state.x}, ${this.state.y})`)
            .attr("class", "key-selection-control");

        // Draw the background rect within the group
        this.drawBackground();
        this.drawGrid();
    }

    // Method to draw the background of the key selection control
    drawBackground() {
        this.controlGroup
            .append("rect")
            .attr("width", this.dims.size.width)
            .attr("height", this.dims.size.height)
            .attr("rx", this.dims.borderRadius) // Rounded corners
            .attr("ry", this.dims.borderRadius)
            .attr("fill", "transparent")
            .attr("stroke", "black")
            .attr("stroke-width", 1);
    }

    // Method to show the control (make it visible)
    show() {
        this.controlGroup.style("display", "block");
    }

    // Method to hide the control (make it invisible)
    hide() {
        this.controlGroup.style("display", "none");
    }

    // Method to handle drag events and update the position of the control
    bindDragEvents() {
        const dragHandler = d3
            .drag()
            .on("start", (event) => this.handleDragStart(event))
            .on("drag", (event) => this.handleDrag(event))
            .on("end", (event) => this.handleDragEnd(event));

        this.svg.call(dragHandler); // Bind the drag behavior to the controlGroup
    }

    handleDragStart(event) {
        this.state.startX = event.x;
        this.controlGroup.attr(
            "transform",
            `translate(${this.state.initX}, ${this.state.y})`,
        );
        this.show();
        this.state.idx = 0;
    }

    handleDrag(event) {
        const newX = event.x - this.state.startX + this.state.initX;
        //const newX = event.x;
        const newY = 0;

        this.controlGroup.attr("transform", `translate(${newX}, ${newY})`);
        this.state.x = newX;
        this.state.y = newY;

        let index = Math.floor(
            (event.x - this.state.startX + this.gridDimensions.widthCol / 2) /
                this.gridDimensions.widthCol,
        );
        if (index != this.state.idx) {
            this.state.idx = -index;
            if (this.state.idx < 0) {
                this.state.idx = 7 + this.state.idx;
            }

            this.state.idx = (this.state.idx + this.state.initKeyIdx) % 7;
            this.currentKey = this.chordData[this.state.idx];
            this.parentController.keyChanged(this.currentKey);
        }
    }

    handleDragEnd(event) {
        this.hide();
        this.state.x = 0;
        this.state.y = 0;
        this.#setInitXPosition();
        this.parentController.finalKeyChange();
    }

    drawGrid() {
        const rectHeight =
            this.gridDimensions.heightRow -
            this.gridDimensions.marginCell.top -
            this.gridDimensions.marginCell.bottom;
        const rectWidth =
            this.gridDimensions.widthCol -
            this.gridDimensions.marginCell.left -
            this.gridDimensions.marginCell.right;

        // const gridData = [];
        // for (let row = 0; row < this.gridDimensions.nRows; row++) {
        //     for (
        //         let col = 0;
        //         col < this.gridDimensions.nColumns * this.dims.nDuplications; // I create n duplicates, so that it appears extended to the left and to the right
        //         col++
        //     ) {
        //         gridData.push({
        //             x:
        //                 col * this.gridDimensions.widthCol +
        //                 this.gridDimensions.marginCell.left,
        //             y:
        //                 row * this.gridDimensions.heightRow +
        //                 this.gridDimensions.marginCell.top,
        //             color: this.gridDimensions.colors[
        //                 (col % 7) % this.gridDimensions.colors.length
        //             ],
        //             row: row,
        //             col: col,
        //             text: this.chordData[col % 7],
        //         });
        //     }
        // }

        // // Append rects to the svg using D3
        // const rects = this.svg
        //     .selectAll(".grid-rect") // Ensure you're selecting by a specific class
        //     .data(gridData);

        // // Use the enter() method to create new rectangles
        // rects
        //     .enter()
        //     .append("rect")
        //     .attr("class", "grid-rect") // Assign a class to the rects for future selection
        //     .attr("x", (d) => d.x)
        //     .attr("y", (d) => d.y)
        //     .attr("width", rectWidth)
        //     .attr("height", rectHeight)
        //     .attr("fill", (d) => d.color)
        //     .attr("stroke", this.gridDimensions.cellStroke)
        //     .attr("stroke-width", this.gridDimensions.cellStrokeWidth)
        //     .on("mouseover", (event, d) => this.handleMouseOver(event, d))
        //     .on("mouseout", (event, d) => this.handleMouseOut(event, d));

        // // Remove any extra rectangles that are no longer bound to data
        // rects.exit().remove();

        // const overlayrects = this.svg
        //     .selectAll(".overlay-rect") // Ensure you're selecting by a specific class
        //     .data(gridData);
        // overlayrects
        //     .enter()
        //     .append("rect")
        //     .attr("class", "overlay-rect") // Assign a class to the rects for future selection
        //     .attr("x", (d) => d.x)
        //     .attr("y", (d) => d.y)
        //     .attr("width", rectWidth)
        //     .attr("height", rectHeight)
        //     .attr("fill", function (d) {
        //         if (d.row == 1) {
        //             return "rgba(0,0,0,.3)";
        //         }
        //         return "transparent";
        //     })
        //     .attr("stroke", this.gridDimensions.cellStroke)
        //     .attr("stroke-width", this.gridDimensions.cellStrokeWidth)
        //     .on("mouseover", (event, d) => this.handleMouseOver(event, d))
        //     .on("mouseout", (event, d) => this.handleMouseOut(event, d));
        // overlayrects.exit().remove();
        // console.log(gridData.length, gridData, "GRID DATA");
        // const texts = this.controlGroup
        //     .selectAll(".key-overlay-texts") // Ensure you're selecting by a specific class
        //     .data(gridData);
        // texts
        //     .enter()
        //     .append("text")
        //     .attr("class", "key-overlay-texts") // Assign a class to the rects for future selection
        //     .attr("x", (d) => d.x + this.gridDimensions.widthCol / 2)
        //     .attr("y", (d) => d.y + this.gridDimensions.heightRow - 5.5)
        //     .attr("text-anchor", "middle")

        //     .text(function (d) {
        //         if (d.row == 0) {
        //             return d.text;
        //         }
        //         return "";
        //     })
        //     .attr("font", "SNPro-Regular")
        //     .attr("font-size", 11)
        //     .attr("fill", function (d) {
        //         if (d.col == 1) {
        //             return "white";
        //         }
        //         return "black";
        //     })
        //     .attr("stroke", function (d) {
        //         if (d.col == 1) {
        //             return "white";
        //         }
        //         return "black";
        //     })
        //     .attr("stroke-width", 1);

        // texts.exit().remove();
    }
}

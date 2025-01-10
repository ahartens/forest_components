import { SEMITONETONOTE, NOTETOSEMITONE } from "/src/util/chromo/chord_to_color.js";

export class KeySelectionControl {
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

    }

    draw(){
        this.drawKeySelectionControl();
        // Bind the drag event to the control
        this.bindDragEvents();
    }

    setKey(key) {
        this.currentKey = key;
        this.#setInitXPosition();
        this.getNotesInCurrentKey();
        this.parentController.keyChanged(key);
    }

    #setInitXPosition() {
        const idxStartKey = this.chordData.indexOf(this.currentKey);
        const keyX = (this.gridDimensions.widthCol + this.gridDimensions.widthBetweenGrid) * idxStartKey;
        this.state.initKeySemitone = NOTETOSEMITONE[this.currentKey];
        this.state.initX = -(this.gridDimensions.widthCol + this.gridDimensions.widthBetweenGrid) * 7 - keyX;
        this.state.initKeyIdx = idxStartKey;
    }

    getNotesInCurrentKey() {
        const notes = [];
        const major_scale = [0, 2, 4, 5, 7, 9, 11];
        for (let i = 0; i < 7; i++) {
            notes.push(SEMITONETONOTE[(this.state.initKeySemitone + major_scale[i]) % 12]);
        }
        return notes;
    }


    // Method to draw the control group
    drawKeySelectionControl() {
        this.controlGroup = this.svg
            .append("g")
            .attr("transform", `translate(${this.state.initX}, ${this.state.y})`)
            .attr("class", "key-selection-control")
            .attr("display", "none");

        // Draw the background rect within the group
        this.drawGrid();
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
        this.parentController.keySelectionStart();
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
        // this.state.y = newY;

        let index = Math.floor(
            (event.x - this.state.startX + this.gridDimensions.widthCol / 2) /
                (this.gridDimensions.widthCol+this.gridDimensions.widthBetweenGrid/2),
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
        this.state.y = 0;
        this.#setInitXPosition();
        this.parentController.finalKeyChange(this.currentKey);
    }

    drawGrid() {
        const gridData = [];
        for (
            let col = 0;
            col < this.gridDimensions.nColumns * this.dims.nDuplications; // I create n duplicates, so that it appears extended to the left and to the right
            col++
        ) {
            gridData.push({
                x:
                    col * (this.gridDimensions.widthCol + this.gridDimensions.widthBetweenGrid),
                y: 0,
                col: col,
                text: this.chordData[col % 7],
            });
        }
        

        const texts = this.controlGroup
            .selectAll(".key-overlay-texts") // Ensure you're selecting by a specific class
            .data(gridData);
        texts
            .enter()
            .append("text")
            .attr("class", "key-overlay-texts") // Assign a class to the rects for future selection
            .attr("x", (d) => d.x)
            .attr("y",  this.gridDimensions.heightRow - 5.5)
            .attr("text-anchor", "middle")
            .text(function (d) {
                    return d.text;
            })
            .attr("font-family", this.gridDimensions.fontLabel)
            .attr("font-size", `${this.gridDimensions.fontSizeLabel}px`)
            .attr("fill", function (d) {
                return "black";
            })
            .attr("stroke", function (d) {
                return "black";
            })
            .attr("stroke-width", 0);

        texts.exit().remove();
    }

    updateGridRects() {
        const dims = this.gridDimensions;


        // Update clip paths
        this.#setInitXPosition();
        this.controlGroup.selectAll(".key-overlay-texts")
            .attr("font-family", this.gridDimensions.fontLabel)
            .attr("font-size", `${this.gridDimensions.fontSizeLabel}px`)
            .attr("x", function(d, i) {
                return (dims.widthCol + dims.widthBetweenGrid) * i + dims.widthCol / 2;
            });
    }
}

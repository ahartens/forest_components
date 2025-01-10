import { KeySelectionControl } from "./key_selection_controller.js";

export class ChromoView {
    constructor(model, controller, parent_svg = null, parentDiv = 'single_song_view') {
        this.model = model;
        this.controller = controller;
        this.svg = parent_svg;
        // Create main groups first
        this.labelGroup = this.svg.append("g")
            .attr("class", "label-group");  // This will be outside the clip-path

        this.gridGroup = this.svg.append("g")
            .attr("class", "grid-group")
            .attr("transform", `translate(${this.model.dimensions.labelWidth}, 0)`);   // This will have the clip-path

        this.addRoundedRectMask();
        // this.drawBorder();
       
        this.keyControl = new KeySelectionControl(
            0,
            0,
            this.gridGroup,
            this.model.dimensions,
            this,
            this.model.currentKey,
        );

        this.drawGrid();
        this.drawLabelBackground()
        this.drawLabel();
        this.keyControl.draw();
        this.updateGridRects();

    }

    addRoundedRectMask() {
        const maskId = "roundedRectMask";
        const dims = this.model.dimensions;

        this.svg
            .append("defs")
            .append("clipPath")
            .attr("id", maskId)
            .append("rect")
            .attr("id", "rounded-rect-mask")
            .attr("x", 0)
            .attr("y", dims.marginCell.top)
            .attr("width", dims.svgWidth)
            .attr("height", dims.svgHeight - dims.marginCell.top - dims.marginCell.bottom)
            .attr("rx", dims.borderRadius)
            .attr("ry", dims.borderRadius);

        // Apply clip-path only to the grid group
        this.gridGroup.attr("clip-path", `url(#${maskId})`);
        this.gridGroup.attr("clip-path", `url(#${maskId})`);

    }

    drawBorder() {
        const dims = this.model.dimensions;
        this.svg
            .append("rect")
            .attr("x", dims.marginCell.left)
            .attr("y", dims.marginCell.top)
            .attr("width", dims.svgWidth - dims.marginCell.left - dims.marginCell.right)
            .attr("height", dims.svgHeight - dims.marginCell.top - dims.marginCell.bottom)
            .attr("rx", dims.borderRadius)
            .attr("ry", dims.borderRadius)
            .attr("fill", "transparent")
            .attr("pointer-events", "none")
            .attr("stroke", "rgba(200,200,200,1)")
            .attr("stroke-width", 2);
    }

    drawLabelBackground() {
        const dims = this.model.dimensions;
        // Draw main rect (top)
        const labelWidth = dims.labelWidth+8;
        this.labelGroup.append("defs")
            .append("clipPath")
            .attr("id", 'labelclipPath')
            .append("rect")
            .attr("y", 0)
            .attr("width", labelWidth)
            .attr("height", dims.heightRow+dims.heightRowMinor)
            .attr("rx", dims.borderRadius)
            .attr("ry", dims.borderRadius);



        this.labelGroup.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", labelWidth)  // Width of label area
            .attr("height", dims.heightRow+dims.heightRowMinor)
            .attr("fill", dims.colors[0])            
            .attr("rx", dims.borderRadius)
            .attr("ry", dims.borderRadius)
            .style("cursor", "pointer")
            .on('click', () => {
                this.controller.clickedOnKey();
            })

        // Draw minor rect (bottom)
        this.labelGroup.append("rect")
            .attr("x", 0)
            .attr("y", dims.heightRow)
            .attr("width",labelWidth)  // Width of label area
            .attr("height", dims.heightRowMinor)
            .attr("fill", "rgba(0,0,0,0.3)")
            .attr("clip-path", (d, i) => `url(#labelclipPath)`);  // Semi-transparent black like the grid
    }

    drawLabel(){
        const dims = this.model.dimensions;
        // Add the "Key of" label and current key display to the unclipped label group
        this.labelGroup.append("text")
            .attr("id", "chromo-label-text")
            .attr("x", 10)
            .attr("y", 20)
            .attr("font-family", dims.fontLabel)
            .attr("font-size", `${14}px`)
            .text("key of")
            .style("pointer-events", "none");  // This makes the text ignore pointer events

    }
    drawGrid() {
        const dims = this.model.dimensions;
        const rectHeight = dims.heightRow - dims.marginCell.top - dims.marginCell.bottom;
        const rectHeightMinor = dims.heightRowMinor - dims.marginCell.top - dims.marginCell.bottom;

        this.chordData = this.keyControl.getNotesInCurrentKey();

        // Create clip paths for each column
        this.gridGroup.append("defs").selectAll("clipPath")
            .data(this.chordData)
            .enter()
            .append("clipPath")
            .attr("id", (d, i) => `clipPath-${i}`)
            .append("rect")
            .attr("y", 0)
            .attr("width", dims.widthCol)
            .attr("height", rectHeight + rectHeightMinor)
            .attr("rx", dims.borderRadius)
            .attr("ry", dims.borderRadius);

        // Draw grid rectangles
        const rects = this.gridGroup.selectAll(".grid-rect")
            .data(this.chordData);

        rects.enter()
            .append("rect")
            .attr("class", "grid-rect")
            .attr("y", d => 0)
            .attr("width", dims.widthCol)
            .attr("height", rectHeight + rectHeightMinor)
            .attr("fill", function(d,i){return dims.colors[i % dims.colors.length]})
            .attr("stroke", dims.cellStroke)
            .attr("rx", dims.borderRadius)
            .attr("ry", dims.borderRadius)
            .attr("stroke-width", dims.cellStrokeWidth);

        // Draw overlay rectangles with clip paths
        const overlayRects = this.gridGroup.selectAll(".overlay-rect")
            .data(this.chordData);

        overlayRects.enter()
            .append("rect")
            .attr("class", "overlay-rect")
            .attr("y", dims.heightRow)
            .attr("width", dims.widthCol)
            .attr("height", dims.heightRowMinor)
            .attr("fill", "rgba(0,0,0,.3)")
            .attr("stroke", dims.cellStroke)
            .attr("stroke-width", dims.cellStrokeWidth)
            .attr("clip-path", (d, i) => `url(#clipPath-${i})`);

            // Draw text labels
        const texts = this.gridGroup.selectAll(".overlay-texts")
            .data(this.chordData);

        texts.enter()
            .append("text")
            .attr("class", "overlay-texts")
            .attr("y", dims.heightRow - 5.5)
            .attr("text-anchor", "middle")
            .text(function(d){return d})
            .attr("font-family", dims.fontLabel)
            .attr("font-size", `${dims.fontSizeLabel}px`)
            .attr("fill", "black")
            .attr("stroke", "black")
            .attr("stroke-width", 0);
        // Update positions
    }

    updateGridRects() {
        const dims = this.model.dimensions;

        // Update clip paths
        this.gridGroup.selectAll("clipPath rect")
            .attr("width", dims.widthCol)
            .attr("x", function(d, i) {
                return (dims.widthCol + dims.widthBetweenGrid) * i;
            });

        // Update grid rectangles
        this.gridGroup.selectAll(".grid-rect")
            .attr("width", dims.widthCol)
            .attr("x", function(d, i) {
                return (dims.widthCol + dims.widthBetweenGrid) * i;
            });

        // Update overlay rectangles
        this.gridGroup.selectAll(".overlay-rect")
            .attr("width", dims.widthCol)
            .attr("x", function(d, i) {
                return (dims.widthCol + dims.widthBetweenGrid) * i;
            });

        this.gridGroup.selectAll(".overlay-texts")
            .attr("x", function(d, i) {
                return (dims.widthCol + dims.widthBetweenGrid) * i + dims.widthCol / 2;
            });

        this.svg.selectAll("#rounded-rect-mask")
            .attr("width", dims.svgWidth);

        if (this.keyControl!= null) {
            this.keyControl.updateGridRects();
        }
    }

    updateKey(key) {
        if (this.keyText) {
            this.keyText.text(key);
        }
        this.keyControl.setKey(key);
    }

    keySelectionStart() {
        this.chordData = ["", "", "", "", "", "", ""];
        this.updateGridText();
    }

    keySelectionEnd() {
        this.chordData = this.keyControl.getNotesInCurrentKey();
        this.updateGridText();
    }

    updateGridText() {
        this.gridGroup.selectAll(".overlay-texts")
            .data(this.chordData)
            .text(d => d);
    }

    keyChanged(key) {
        this.controller.keyChanged(key);
    }

    finalKeyChange(key) {
        this.controller.finalKeyChange(key);
    }

    setFontSize(fontSize) {
        // Update font sizes
        this.labelGroup.selectAll("text")
            .attr("font-size", (d, i) => {
                return i === 0 ? `${fontSize}px` : `${fontSize * 1.5}px`;
            });

        this.gridGroup.selectAll(".overlay-texts")
            .attr("font-size", `${fontSize}px`);

        this.labelGroup.selectAll("#chromo-label-text")
            .attr("font-size", `${10}px`);

        this.updateGridRects();
    }

}
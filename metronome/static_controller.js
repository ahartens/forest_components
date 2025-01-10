import { SlideSliderController } from "/src/components/metronome/sliding_controller.js";
import {DraggableCircle} from "/src/components/metronome/draggable_circle.js";
import { startMetronome, stopMetronome } from "/src/metronome.js";
export class SlideController {
    constructor({
        colors = null,
        nColumns = 20,
        marginCell = { top: 0, bottom: 0, left: 0, right: 0 },
        borderRadius = 10, // Radius for the rounded corners of the mask
        nRows = 2,
        currentKey = "D",
        parentController = null,
        id_parent_div = "single_song_view",
        name = "slider_root_div",
        parent_svg = null,
    } = {}) {
        const widthCol = 300/7;
        const heightRow = 20;
        this.parentController = parentController;
        this.id_parent_div = id_parent_div;
        this.id_root_div = `${name}_root_div`;
        this.id_slider_div = `${name}_slider_div`;
        this.id_label_div = `${name}_label_div`;
        this.parent_svg = parent_svg;

        this.dimensions = {
            widthCol: widthCol, // Width of each column
            heightRow: heightRow, // Height of each row
            svgWidth: 300, // Adjust for margins
            svgHeight: 20, // Adjust for margins
            cellStrokeWidth: 0,
            cellStroke: "transparent",
            nColumns: nColumns, // Number of columns, defaults to 2
            nRows: nRows, // Fixed number of rows
            marginCell: marginCell, // Margin for each cell
            borderRadius: borderRadius, // The radius for the rounded corners
            fontSizeLabel: 25,
            fontLabel: "SNPro-Bold",
            marginsLabel: { top: 10, bottom: 0, left: 10, right: 20 },
            tickColor: "rgba(150,150,150,1)",
            circleColor: "rgba(150,150,150,1)",
            interval: 5,
            widthLabel: 45,  // Width reserved for label
            fontSizeSpeed: 14,  // Font size for speed label
            fontSpeed: "SNPro-Bold",
        };

        this.dimensions.heightKeyLabel = 0;//this.dimensions.fontSizeLabel;
        this.currentSpeed = currentKey;
        this.svg = this.parent_svg;
        this.metronomeIsOn = false;
        this.drawGrid();
        this.createLabel();  // Add label creation

        this.height = this.dimensions.svgHeight + this.dimensions.marginsLabel.top + this.dimensions.marginsLabel.bottom + this.dimensions.heightKeyLabel
        this.circle = new DraggableCircle({
            svg: this.svg,
            initialX: this.dimensions.widthLabel + this.dimensions.marginsLabel.right,
            initialY: this.dimensions.svgHeight / 2,
            radius: 10,
            fill: this.dimensions.circleColor,
            minX: this.dimensions.widthLabel + this.dimensions.marginsLabel.right,
            maxX: this.dimensions.svgWidth,
            onDragStart: (x, y) => {
                if (this.metronomeIsOn) {
                    stopMetronome();
                }
            },
            onDrag: (x, y) => {
                this.updateCirclePosition(x);
            },
            onDragEnd: (x, y) => {
                this.updateCirclePosition(x);
            },
            onClick: (x, y) => {
                this.toggleMetronome();
            }
        });
        this.currentSpeed = 40;
    }

    toggleMetronome() {
        if (this.metronomeIsOn) {
            stopMetronome();
        } else {
            startMetronome(this.currentSpeed);
        }
        this.metronomeIsOn = !this.metronomeIsOn;
    }

    setBPM(bpm) {
        this.currentSpeed = bpm;
        const xPosition = this.getXPositionFromSpeed(this.currentSpeed);
        this.circle.setPosition(
            xPosition, 
            this.dimensions.svgHeight / 2
        );
        // Update label if requested
        if (this.speedLabel) {
            this.speedLabel.text(`${this.currentSpeed} BPM`);
        }
    }

    drawGrid() {
        const rectHeight =
            this.dimensions.heightRow -
            this.dimensions.marginCell.top -
            this.dimensions.marginCell.bottom;
        const rectWidth =
            this.dimensions.widthCol -
            this.dimensions.marginCell.left -
            this.dimensions.marginCell.right;

        // Create a data structure for the grid

        const minSpeed = 40;
        const maxSpeed = 220;

        const marginLeftRight = 5;
        const interval = this.dimensions.interval;
        const nIntervals = Math.ceil((maxSpeed - minSpeed) / interval);
        const widthInterval = (this.dimensions.svgWidth - 2 * marginLeftRight - this.dimensions.widthLabel-this.dimensions.marginsLabel.right) / nIntervals;
        const widthIntervalMarking = 2;
        const heightIntervalMarking = 2;
        const ytop = (this.dimensions.svgHeight - heightIntervalMarking) / 2;

        const gridData = [];
        for (let i = 0; i < nIntervals + 1; i++) {
            gridData.push({
                x: i * widthInterval - widthIntervalMarking / 2 + marginLeftRight + this.dimensions.widthLabel + this.dimensions.marginsLabel.right,
                y: ytop,
                w: widthIntervalMarking,
                h: heightIntervalMarking,
                color: this.dimensions.tickColor,
            });
        }

        const rects = this.svg
            .selectAll(".grid-rect")
            .data(gridData);

        rects
            .enter()
            .append("rect")
            .attr("class", "grid-rect")
            .attr("x", (d) => d.x)
            .attr("y", (d) => d.y)
            .attr("rx", widthIntervalMarking/2)
            .attr("ry", widthIntervalMarking/2)
            .attr("width", (d) => d.w)
            .attr("height", (d) => d.h)
            .attr("fill", (d) => d.color)
            .attr("stroke", this.dimensions.cellStroke)
            .attr("stroke-width", this.dimensions.cellStrokeWidth)
            .on("mouseover", (event, d) => this.handleMouseOver(event, d))
            .on("mouseout", (event, d) => this.handleMouseOut(event, d));

        rects.exit().remove();
    }

    #drawBorder() {
        this.svg
            .append("rect")
            .attr("x", this.dimensions.marginCell.left) // Account for margin on the left
            .attr("y", this.dimensions.marginCell.top) // Account for margin on the top
            .attr("width", this.dimensions.svgWidth)
            .attr("height", this.dimensions.svgHeight)
            .attr("rx", this.dimensions.borderRadius) // Horizontal corner radius
            .attr("ry", this.dimensions.borderRadius)
            .attr("fill", "rgba(200,200,200,.5)")
            .attr("point-events", "none")
            .attr("stroke", "rgba(200,200,200,1)")
            .attr("stroke-width", 2); // Vertical corner radius
    }
    // Event handler for mouseover
    handleMouseOver(event, d) {
        // Add zoom effect or text handling here if necessary
    }

    // Event handler for mouseout
    handleMouseOut(event, d) {
        // Reset zoom effect or text handling here if necessary
    }

    createLabel() {
        this.speedLabel = this.svg
            .append("text")
            .attr("x", 0)
            .attr("y", this.dimensions.svgHeight / 2)
            .attr("dy", "0.35em")  // Vertical alignment
            .attr("text-anchor", "start")
            .attr("font-family", this.dimensions.fontSpeed)
            .attr("font-size", this.dimensions.fontSizeSpeed)
            .style("cursor", "pointer")  // Add pointer cursor
            .text("40 BPM")  // Initial value
            .on("click", () => {
                this.parentController.saveMetronomeBPM(this.currentSpeed);
            });
    }

    updateCirclePosition(x, updateLabel = true) {
        const minSpeed = 40;
        const maxSpeed = 220;
        const marginLeftRight = 5;
        const interval = this.dimensions.interval;
        const nIntervals = Math.ceil((maxSpeed - minSpeed) / interval);
        const widthInterval = (this.dimensions.svgWidth - 2 * marginLeftRight - 
            this.dimensions.widthLabel - this.dimensions.marginsLabel.right) / nIntervals;
        
        // Adjust x calculation to account for label width
        const relativeX = x - marginLeftRight - this.dimensions.widthLabel - this.dimensions.marginsLabel.right;
        const closestTickIndex = Math.round(relativeX / widthInterval);
        const closestTickX = (closestTickIndex * widthInterval) + marginLeftRight + 
            this.dimensions.widthLabel + this.dimensions.marginsLabel.right;
        
        const speed = Math.max(minSpeed, Math.min(maxSpeed, minSpeed + (closestTickIndex * interval)));
        
        // Update label if requested
        if (updateLabel && this.speedLabel) {
            this.speedLabel.text(`${speed} BPM`);
            this.currentSpeed = speed;
        }

        // Update circle position to snap to closest tick
        this.circle.setPosition(
            closestTickX, 
            this.dimensions.svgHeight / 2
        );
        
        return speed;
    }

    getXPositionFromSpeed(speed) {
        const minSpeed = 40;
        const maxSpeed = 220;
        const marginLeftRight = 5;
        const interval = this.dimensions.interval;
        
        // Calculate the tick index based on the speed
        const tickIndex = Math.round((speed - minSpeed) / interval);
        
        // Calculate width of each interval
        const nIntervals = Math.ceil((maxSpeed - minSpeed) / interval);
        const widthInterval = (this.dimensions.svgWidth - 2 * marginLeftRight - 
            this.dimensions.widthLabel - this.dimensions.marginsLabel.right) / nIntervals;
        
        // Calculate x position
        const xPosition = (tickIndex * widthInterval) + marginLeftRight + 
            this.dimensions.widthLabel + this.dimensions.marginsLabel.right;
        
        return xPosition;
    }
}

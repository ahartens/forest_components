export class ClickableLabel {
  constructor(svg, text, x, y, fontSize, fontFamily, delegate) {
    this.svg = svg;
    this.data = text;
    this.x = x;
    this.y = y;
    this.fontSize = fontSize;
    this.fontFamily = fontFamily;
    this.delegate = delegate;
  }
  createLabel() {
    // Split the text into separate <tspan> elements
    
    const label = this.svg
        .append("g")
        .attr("x", 0)
        .attr("y", this.y);

    let xPosition = 0;
    this.data.forEach((item, i) => {
        // Create a canvas context to measure text widths
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        context.font = `${this.fontSize}px ${this.fontFamily}`;


        // Create a group for each word
        const wordGroup = label.append("g")
            .attr("transform", `translate(${xPosition}, 0)`);

        // Get text measurements using canvas context
        const textWidth = context.measureText(item.text).width;
        const textHeight = this.fontSize;
        // Add background rect FIRST
        const rect = wordGroup.append("rect")
            .attr("x", -5)
            .attr("y", -textHeight / 2 - 2)
            .attr("width", textWidth + 10)
            .attr("height", textHeight + 4)
            // .attr("rx", 4)
            // .attr("ry", 4)
            .attr("fill", "black")
            .attr("stroke", "black")
            .style("cursor", "pointer");

        // Add the text SECOND
        const tspan = wordGroup.append("text")
            .attr("x", 0)  // Position relative to group
            .attr("y", 0)  // Position relative to group
            .attr("dy", "0.35em")
            .attr("fill", "white")
            .attr("stroke", "white")
            .attr("stroke-width", 0)
            .attr("font-family", this.fontFamily)
            .attr("font-size", `${this.fontSize}px`)
            .style("cursor", "pointer")
            .text(item.text);

        // Add click handlers
        wordGroup.on("click", () => {
            item.onClick(item.text)
        });

        // Update position for next word
        xPosition += textWidth + 15;

    });
}
}
export function drawXButton(parent_div_id, x_button_div_id, onclick) {
  const width = 50;
  const svg = d3
    .select(parent_div_id)
    .append("svg")
    .attr("id", x_button_div_id)
    .attr("width", width)
    .attr("height", width)
    .on("click", onclick);

  // 'X' Button (close_song)
  const closeSongGroup = svg
    .append("g")
    .attr("id", x_button_div_id)
    .attr("transform", "translate(20, 20)");
  const size = 15;

  const strokewidth = 3;
  closeSongGroup
    .append("line")
    .attr("x1", -size)
    .attr("y1", -size)
    .attr("x2", size)
    .attr("y2", size)
    .attr("stroke", "black")
    .attr("stroke-width", strokewidth);

  closeSongGroup
    .append("line")
    .attr("x1", size)
    .attr("y1", -size)
    .attr("x2", -size)
    .attr("y2", size)
    .attr("stroke", "black")
    .attr("stroke-width", strokewidth);
}

export function drawPlusMinusButton({
  parent_div = "",
  button_div_id = "",
  circleDiameter = 20,
  lineLength = 10,
  lineStrokeWidth = 2,
  lineStrokeColor = "red",
  circleStrokeWidth = 1,
  circleStrokeColor = "red",
  onclickfunction = "",
} = {}) {
  const width = 50;
  // draw upper right x button to close song

  // Size variables
  const circleRadius = circleDiameter / 2;
  // Create the SVG container
  const svg2 = d3
    .select(`#${parent_div}`)
    .append("svg")
    .attr("width", 100)
    .attr("height", 60)
    .attr("fill", "blue"); // Adjusted height to fit the elements
  // Draw the oval background
  svg2
    .append("ellipse")
    .attr("cx", 50)
    .attr("cy", 30)
    .attr("rx", 50)
    .attr("ry", 20)
    .attr("fill", "rgba(0,0,0,0)");

  // Group for the plus button
  const plusGroup = svg2
    .append("g")
    .attr("class", "plus-group")
    .attr("transform", `translate(25, 30)`)
    .on("click", function () {
      onclickfunction("plus");
    });

  // Draw the plus sign circle
  plusGroup
    .append("circle")
    .attr("cx", 0) // Center the circle within the group
    .attr("cy", 0)
    .attr("r", circleRadius)
    .attr("fill", "white")
    .attr("stroke", "black")
    .attr("stroke-width", lineStrokeWidth);

  // Draw the plus sign horizontal line
  plusGroup
    .append("line")
    .attr("x1", -lineLength / 2)
    .attr("y1", 0)
    .attr("x2", lineLength / 2)
    .attr("y2", 0)
    .attr("stroke", "black")
    .attr("stroke-width", lineStrokeWidth)
    .attr("stroke-linecap", "round"); // Rounded line caps

  // Draw the plus sign vertical line
  plusGroup
    .append("line")
    .attr("x1", 0)
    .attr("y1", -lineLength / 2)
    .attr("x2", 0)
    .attr("y2", lineLength / 2)
    .attr("stroke", "black")
    .attr("stroke-width", lineStrokeWidth)
    .attr("stroke-linecap", "round"); // Rounded line caps

  // Group for the minus button
  const minusGroup = svg2
    .append("g")
    .attr("class", "minus-group")
    .attr("transform", `translate(75, 30)`)
    .on("click", function () {
      console.log("Minus button clicked");
      onclickfunction("minus");

      // Add your minus button functionality here
    });

  // Draw the minus sign circle
  minusGroup
    .append("circle")
    .attr("cx", 0) // Center the circle within the group
    .attr("cy", 0)
    .attr("r", circleRadius)
    .attr("fill", "white")
    .attr("stroke", "black")
    .attr("stroke-width", lineStrokeWidth);

  // Draw the minus sign horizontal line
  minusGroup
    .append("line")
    .attr("x1", -lineLength / 2)
    .attr("y1", 0)
    .attr("x2", lineLength / 2)
    .attr("y2", 0)
    .attr("stroke", "black")
    .attr("stroke-width", lineStrokeWidth)
    .attr("stroke-linecap", "round"); // Rounded line caps
}

export function draw_plus_button({
  parent_div = "",
  button_div_id = "",
  circleDiameter = 50,
  lineLength = 40,
  lineStrokeWidth = 5,
  lineStrokeColor = "red",
  circleStrokeWidth = 1,
  circleStrokeColor = "red",
  onclickfunction = "",
} = {}) {
  // Size variables
  const circleRadius = circleDiameter / 2;

  // Create the SVG container with transparent background
  const svg2 = d3
    .select(`#${parent_div}`)
    .append("svg")
    .attr("id", button_div_id)
    .attr("width", circleDiameter + 2 * circleStrokeWidth + 30)
    .attr("height", circleDiameter + 2 * circleStrokeWidth + 30)
    .style("background", "transparent"); // Transparent background

  // Append foreignObject for the blur effect, shaped like a circle with a border
  const foreignDiv = svg2
    .append("foreignObject")
    .attr("width", circleDiameter + 2 * circleStrokeWidth + 30)
    .attr("height", circleDiameter + 2 * circleStrokeWidth + 30)
    .attr("x", circleStrokeWidth)
    .attr("y", circleStrokeWidth)
    .append("xhtml:div")
    .attr("id", "circleBackgroundPlusSign")
    .style("width", `${circleDiameter}px`)
    .style("height", `${circleDiameter}px`)
    // .style("backdrop-filter", "blur(10px)") // CSS blur effect
    .style("position", "relative") // Relative positioning might prevent overlapping issues
    .attr("z-index", 1)
    .style("border-radius", "50%") // Makes the shape circular
    .style("position", "absolute")
    .style("top", "0")
    .style("left", "0")
    .style("background", "white") // Make the div's background transparent
    .style("opacity", 0.6)
    .style("border", `${circleStrokeWidth}px solid ${circleStrokeColor}`) // Add the border with stroke width and color
    // .style("box-shadow", "0px 2px 5px rgba(0, 0, 0, 0.3)") // Minimal shadow by default
    .style("transition", "none")
    .style("z-index", 0); // Smooth transition on hover

  // Add hover effect for the shadow using mouseover and mouseout
  // foreignDiv
  //   .on("mouseover", function () {
  //     console.log("mousing over");
  //     d3.select(this).style("box-shadow", "4px 4px 10px rgba(0, 0, 0, 0.4)"); // Larger shadow on hover
  //   })
  //   .on("mouseout", function () {
  //     d3.select(this).style("box-shadow", "2px 2px 5px rgba(0, 0, 0, 0.3)"); // Back to minimal shadow
  //   });

  // Group for the plus button
  const plusGroup = svg2
    .append("g")
    .attr("id", button_div_id)
    .attr("z-index", 10)
    .attr(
      "transform",
      `translate(${circleDiameter / 2 + circleStrokeWidth}, ${circleDiameter / 2 + circleStrokeWidth})`,
    )
    .on("click", function () {
      onclickfunction();
      console.log("Plus button clicked, but not inside");
      // Add your plus button functionality here
    });

  // Draw the plus sign circle (transparent)
  plusGroup
    .append("circle")
    .attr("cx", 0) // Center the circle within the group
    .attr("cy", 0)
    .attr("r", circleRadius)
    .attr("fill", "transparent") // Circle's background is transparent
    .attr("stroke", "rgba(200,200,200,1)") // Make the stroke transparent for the SVG circle (handled by foreignObject now)
    .attr("id", "circleBackgroundPlusSing")
    .attr("stroke-width", 1); // Set stroke width to 0 for this circle

  // Draw the plus sign horizontal line with rounded ends and stroke color
  plusGroup
    .append("line")
    .attr("z-index", 10)

    .attr("x1", -lineLength / 2)
    .attr("y1", 0)
    .attr("x2", lineLength / 2)
    .attr("y2", 0)
    .attr("stroke", lineStrokeColor) // Line stroke color
    .attr("stroke-width", lineStrokeWidth)
    .attr("stroke-linecap", "round"); // Rounded line caps

  // Draw the plus sign vertical line with rounded ends and stroke color
  plusGroup
    .append("line")
    .attr("x1", 0)
    .attr("y1", -lineLength / 2)
    .attr("x2", 0)
    .attr("y2", lineLength / 2)
    .attr("stroke", lineStrokeColor) // Line stroke color
    .attr("stroke-width", lineStrokeWidth)
    .attr("stroke-linecap", "round"); // Rounded line caps
}

export function drawBackButton({
  parent_div = "",
  button_div_id = "",
  lineLength = 40,
  lineStrokeWidth = 5,
  lineStrokeColor = "black",
  angle = 45, // Angle for the lines
  onclickfunction = () => {},
  labelText = "Back", // The label to display
  labelFontSize = 16, // Font size for the label
  labelColor = "black", // Font color for the label
  labelPadding = 10, // Padding between the arrow and the label
  direction = "left",
} = {}) {
  // Create the SVG container with transparent background
  const svg = d3
    .select(`#${parent_div}`)
    .on("click", function () {
      onclickfunction();
      console.log("Back button clicked");
    })
    .on("mouseover", function () {
      d3.select(`#${button_div_id}_label`)
        .transition()
        .duration(0)
        .style("opacity", 1);
    })
    .on("mouseout", function () {
      d3.select(`#${button_div_id}_label`)
        .transition()
        .duration(10)
        .style("opacity", 0);
    })
    .append("svg")
    .attr("id", button_div_id)
    .attr("width", lineLength * 6)
    .attr("height", lineLength + 2 * lineStrokeWidth + 20)
    .style("background", "transparent"); // Transparent background

  // Group for the back button
  const backButtonGroup = svg
    .append("g")
    .attr("id", button_div_id)
    .attr(
      "transform",
      `translate(${lineLength / 2 + lineStrokeWidth}, ${
        lineLength / 2 + lineStrokeWidth
      })`,
    );

  // Convert the angle to radians for proper calculation
  const radianAngle = (Math.PI / 180) * angle;

  let x1 = (-lineLength / 2) * Math.cos(radianAngle);
  let y1 = (-lineLength / 2) * Math.sin(radianAngle);
  let x2 = (lineLength / 2) * Math.cos(radianAngle);
  let y2 = (lineLength / 2) * Math.sin(radianAngle);

  if (direction == "left") {
    // Calculate the coordinates for the two lines of the back button
    x1 = (lineLength / 2) * Math.cos(radianAngle);
    y1 = (lineLength / 2) * Math.sin(radianAngle);
    x2 = (-lineLength / 2) * Math.cos(radianAngle);
    y2 = (-lineLength / 2) * Math.sin(radianAngle);
  }

  // First line for the back button (top-left to center)
  backButtonGroup
    .append("line")
    .attr("x1", x1)
    .attr("y1", y1)
    .attr("x2", 0)
    .attr("y2", 0)
    .attr("stroke", lineStrokeColor)
    .attr("stroke-width", lineStrokeWidth)
    .attr("stroke-linecap", "round");

  // Second line for the back button (bottom-left to center)
  backButtonGroup
    .append("line")
    .attr("x1", x1)
    .attr("y1", -y1) // Inverted y for the second line
    .attr("x2", 0)
    .attr("y2", 0)
    .attr("stroke", lineStrokeColor)
    .attr("stroke-width", lineStrokeWidth)
    .attr("stroke-linecap", "round");

  backButtonGroup
    .append("text")
    .attr("id", `${button_div_id}_label`)
    .attr("x", lineLength + labelPadding) // Position it to the right of the arrow
    .attr("y", labelFontSize / 3)
    .text(labelText)
    .style("font-size", `${labelFontSize}px`)
    .style("fill", "black")
    .style("opacity", 0)
    .style("transition", "opacity 0.3s ease");
}

export function drawElipsisButton({
  parent_div = "",
  button_div_id = "",
  circleDiameter = 10, // Diameter of the ellipsis circles
  circleSpacing = 15, // Spacing between the circles
  circleColor = "black", // Circle color
  onclickfunction = () => {},
  labelText = "", // Optional label text to display
  labelFontSize = 16, // Font size for the label
  labelColor = "black", // Font color for the label
  labelPadding = 10, // Padding between the ellipsis and the label
} = {}) {
  // Total width of the ellipsis (3 circles + 2 spacings)
  const totalWidth = 150; //circleDiameter * 3 + circleSpacing * 2;

  // Create the SVG container
  const svg = d3
    .select(`#${parent_div}`)
    .on("click", function () {
      onclickfunction();
      console.log("Ellipsis button clicked");
    })
    .on("mouseover", function () {
      d3.select(`#${button_div_id}_label`)
        .transition()
        .duration(0)
        .style("opacity", 1);
    })
    .on("mouseout", function () {
      d3.select(`#${button_div_id}_label`)
        .transition()
        .duration(10)
        .style("opacity", 0);
    })
    .append("svg")
    .attr("id", button_div_id)
    .attr("width", totalWidth + labelPadding * 2) // Adjusted width for circles and label
    .attr("height", circleDiameter + labelFontSize + labelPadding)
    .style("background", "transparent"); // Transparent background

  // Group for the ellipsis circles
  const ellipsisGroup = svg
    .append("g")
    .attr("id", button_div_id)
    .attr("transform", `translate(${100}, ${circleDiameter / 2})`);

  // Draw the three circles for the ellipsis
  [0, 1, 2].forEach((i) => {
    ellipsisGroup
      .append("circle")
      .attr("cx", i * (circleDiameter + circleSpacing)) // Position circles with spacing
      .attr("cy", 0)
      .attr("r", circleDiameter / 2)
      .attr("fill", circleColor);
  });

  // Optional: Add label next to the ellipsis (if labelText is provided)
  if (labelText) {
    svg
      .append("text")
      .attr("id", `${button_div_id}_label`)
      .attr("x", totalWidth + labelPadding) // Position it to the right of the ellipsis
      .attr("y", circleDiameter / 3)
      .text(labelText)
      .style("font-size", `${labelFontSize}px`)
      .style("fill", labelColor)
      .style("opacity", 0) // Hidden by default (revealed on hover)
      .style("transition", "opacity 0.3s ease");
  }
}


export function create_elipsis_button(id, onclickfunction) {
  const elipsisButton = document.createElement('div');
  elipsisButton.id = id
  elipsisButton.style.cssText = `
      width: 40px;
      height: 30px;
      background-color: rgba(255, 255, 255, 0.5);
      border-radius: 10px;
      z-index: 10000;
      cursor: pointer;
      border: 1px solid rgba(255, 255, 255, 1);
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
      user-select: none;
      -webkit-user-select: none;
  `;

  const icon = document.createElement('img');
  icon.src = "/assets/icons/ellipsis.svg";
  icon.style.width = '40px';
  icon.style.height = '30px';
  icon.style.objectFit = "contain";
  icon.style.pointerEvents = "none";
  icon.style.userSelect = "none";
  elipsisButton.appendChild(icon);

  
  // Multiple event handlers for maximum compatibility
  const handleClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      onclickfunction();
  };

  // Add all possible event listeners
  elipsisButton.addEventListener('click', handleClick);

  return elipsisButton;
}
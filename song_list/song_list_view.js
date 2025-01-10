import { draw_plus_button } from "/src/components/buttons.js";
import { drawStringWithWrapping } from "/src/util/draw_wrapped_strings.js";

let cardWidth = 300;
const titleFontSize = 30;
const artistFontSize = 14;

const titleFont = "SNPro-Bold";
const artistFont = "SNPro-Regular";

const hBetweenTextAndRects = 0;

const hListTopMargin = 20;
const textMargin = { top: 40, left: 30, bottom: 10, right: 30 };

const rectsMargin = { top: 0, left: 0, bottom: 0 };

const titleRectMargin = { top: 3, left: 10, bottom: 7, right: 10 };
const artistRectMargin = { top: 2, left: 10, bottom: 6, right: 10 };

//const rectsMargin = {top:textMargin.top + titleFontSize + hBetweenTextAndRects, left:0, bottom:0}
let cardsMargin = { left: 20, right: 20 };

let width = window.innerWidth;
if (width < 800) {
  cardsMargin = { left: 20, right: 20 };
  cardWidth = width - cardsMargin.left - cardsMargin.right;
}

const cardHeight = titleFontSize + textMargin.top + textMargin.bottom + 100, //+ 20,
  hBetweenCards = 25;
let numRectangles = 50; // Number of rectangles to draw per card
const colorrect_horiz_margin = rectsMargin.left;
const colorrect_bottom_margin = rectsMargin.bottom;
const colors = { background: "rgba(225,0,255,1)" };


export class SongListView {
  constructor(controller, parentDivId) {
    this.controller = controller;
    this.parentDivId = parentDivId;

    this.dims = {
      original_drop: { dy: 1, std: 3 },
      target_drop: { dy: 5, std: 8 },
      transition_time_up: 100,
      transition_time_down: 500,
    };
  }

  addToParent(parentDivId) {
    this.#createSVG();
  }

  #createSVG(){
    const songbookDiv = d3.select(`#${this.parentDivId}`).attr("id", "songbookdiv_svg");

    this.svg = songbookDiv
        .append("svg")
        .attr("id", "actual_svg")
        .attr("width", width)
        .attr("fill", "red");

    const defs = this.svg.append("defs");

    const shadowFilter = defs
      .append("filter")
      .attr("id", "drop-shadow-template")
      .attr("height", "150%"); // increase height for shadow space

    this.svg.append("g").attr("id", "songbook_g");

  }

  drawSongbook(songs) {
    this.update(songs);
  }

  gridLayout(data) {
    const columns = 10;

    return data.map((d, i) => ({
      id: i,
      y: (cardHeight + hBetweenCards) * i,
      x: cardsMargin.left,
      title: d.title,
      colors: d.chordsAndColorsData,
      song_string: d.song_string,
      data: d,
    }));
  }

  #drawCardBorder(self, card, d) {
    card
      .selectAll("rect.card-border")
      .data([d])
      .join("rect")
      .attr("class", "card-border")
      .attr("width", cardWidth)
      .attr("height", cardHeight)
      // .attr("rx", 10)
      // .attr("ry", 10)
      .attr("fill", "#ffffff")
      .attr("stroke", "rgb(200,200,200,1)")
      .attr("stroke-width", 2)
      .on("click", function (event, d) {
        self.clicked_on_song(d.data); // Call the method from the captured `self` instance
      });
  }

  #drawCardShadow(self, card, d) {
    // APPLY DROP SHADOW
    card
      .each(function (d, i) {
        // Apply a unique shadow filter to each card
        const cardFilter = defs
          .append("filter")
          .attr("id", `drop-shadow-${d.id}`)
          .attr("height", "150%");

        cardFilter
          .append("feDropShadow")
          .attr("dx", 0)
          .attr("dy", self.dims.original_drop.dy)
          .attr("stdDeviation", self.dims.original_drop.std)
          .attr("flood-color", "rgba(0, 0, 0, 0.3)");

        // Apply the unique filter to each card
        d3.select(this).attr("filter", `url(#drop-shadow-${d.id})`);
      })
      .on("mouseover", function (event, d) {
        const i = d3.select(self).attr("data-index");

        // On hover, lift up the shadow for the current card
        const cardFilter = d3
          .select(`#drop-shadow-${d.id}`)
          .select("feDropShadow");
        cardFilter
          .transition()
          .duration(self.dims.transition_time_up)
          .attr("dy", self.dims.target_drop.dy) // Lift the shadow (closer to the card)
          .attr("stdDeviation", self.dims.target_drop.std); // Increase blur for softer shadow
      })
      .on("mouseout", function (event, d) {
        const i = d3.select(this).attr("data-index");

        // On mouse out, reset the shadow to normal for the current card
        const cardFilter = d3
          .select(`#drop-shadow-${d.id}`)
          .select("feDropShadow");
        cardFilter
          .transition()
          .duration(self.dims.transition_time_down)
          .attr("dy", self.dims.original_drop.dy) // Back to original shadow position
          .attr("stdDeviation", self.dims.original_drop.std); // Reset blur
      });
  }

  #drawColorRects(self, rectsG, d) {
    numRectangles = d.colors.length;

    const rectWidth = (cardWidth - 2 * colorrect_horiz_margin) / numRectangles;

    // Draw the rectangles inside the card
    rectsG
      .selectAll("rect.color-rectangle")
      .data(d.colors)
      .join("rect")
      .attr("class", "color-rectangle")
      .attr("x", (d, i) => i * rectWidth + colorrect_horiz_margin)
      .attr("y", 0)
      .attr("width", (d, i) => (i < numRectangles ? rectWidth : 0))
      .attr("height", cardHeight - rectsMargin.top - rectsMargin.bottom)
      .attr("stroke", "#000000")
      .attr("stroke-width", 0)
      .style("pointer-events", "none")
      .attr("fill", (d, i) => d["color"][0]);
  }

  #drawTitleAndArtist(self, card, d) {
    const titleHeight = drawStringWithWrapping({
      svg: card,
      string: d.title,
      fontSize: titleFontSize,
      font: titleFont,
      margins: textMargin,
      maxWidth: cardWidth,
      rectColor: "black",
      textColor: "white",
      rectMargins: titleRectMargin,
    });

    const artistMargins = {
      top: titleHeight - 5,
      left: textMargin.left + 4,
      bottom: textMargin.bottom,
      right: textMargin.right,
    };

    const artistHeight = drawStringWithWrapping({
      svg: card,
      string: d.data.artist,
      fontSize: artistFontSize,
      font: artistFont,
      margins: artistMargins,
      maxWidth: cardWidth,
      rectColor: "black",
      textColor: "white",
      rectMargins: artistRectMargin,
    });
  }

  update(songs) {
    const self = this; // Capture the correct self.context

    this.svg.attr(
      "height",
      songs.length * cardHeight +
        hBetweenCards * (songs.length - 1) +
        hListTopMargin * 2,
    );

    d3.select("#songbook_g")
      .selectAll("g.card")
      .data(this.gridLayout(songs))
      .join("g")
      .attr("class", "card")
      .attr("transform", (d) => `translate(${d.x}, ${d.y + hListTopMargin})`)
      .each(function (d) {
        let card = d3.select(this);

        // Draw the card's border
        self.#drawCardBorder(self, card, d);
        // self.#drawCardShadow(self, card, d);
        card.attr("data-index", (d, i) => i);

        const rectsG = card
          .append("g")
          .attr(
            "transform",
            `translate(${rectsMargin.left}, ${rectsMargin.top})`,
          );

        self.#drawColorRects(self, rectsG, d);

        self.#drawTitleAndArtist(self, card, d);
      });
  }

  clicked_on_song(songData) {
    // Handle the logic when a song is clicked
    console.log("Song clicked:", songData);
    this.controller.clicked_on_song(songData);
    // Add your logic here for what happens when a song is clicked
  }

  createAddButton(onclickfunction) {
    draw_plus_button({
      parent_div: "add_song_button",
      button_div_id: "add_song_button_svg",
      circleDiameter: 80,
      lineLength: 35,
      lineStrokeWidth: 8,
      lineStrokeColor: "rgba(0,0,0,1)",
      circleStrokeWidth: 1,
      circleStrokeColor: "rgba(255,255,255,1)",
      onclickfunction: onclickfunction,
    });
  }
}

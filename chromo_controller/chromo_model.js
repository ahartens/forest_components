export class ChromoModel {
    constructor(currentKey = "D", colors = null) {
        this.currentKey = currentKey;
        this.dimensions = {
            widthCol: Math.floor(300/7),
            heightRow: 25,
            heightRowMinor: 10,
            cellStrokeWidth: 0,
            cellStroke: "transparent",
            labelWidth: 60,  // Width for "Key of" label area
            nColumns: 7,
            nRows: 2,
            colors: colors || ['#FFD700', '#FF69B4', '#FFBF65', '#FF8FB1', '#FFA07A', '#FFA07A'],
            marginCell: { top: 0, bottom: 0, left: 0, right: 4 },
            borderRadius: 4,
            fontSizeLabel: 18,
            fontSizeKeyText: 10,  // Larger font for the key display
            fontLabel: "SNPro-Bold",
            marginsLabel: { top: 10, bottom: 0, left: 10, right: 10 },
            widthBetweenGrid: 4,
        };

        // Calculate derived dimensions
        this.updateDimensions();
    }

    updateDimensions() {
        const marginCell = this.dimensions.marginCell;
        this.dimensions.svgHeight = this.dimensions.heightRow + 
            this.dimensions.heightRowMinor + 
            marginCell.top + marginCell.bottom;
        
        this.dimensions.widthCol =  this.dimensions.fontSizeLabel+8 + 4////(300 - this.dimensions.labelWidth) / this.dimensions.nColumns;

        this.dimensions.svgWidth = 
            this.dimensions.nColumns * this.dimensions.widthCol + this.dimensions.widthBetweenGrid*(this.dimensions.nColumns-1); // - this.dimensions.labelWidth;
    }

    setKey(key) {
        this.currentKey = key;
    }

    setFontSize(fontSize) {
        this.dimensions.fontSizeLabel = fontSize;
        this.dimensions.fontSizeKeyText = 12; // Keep key text proportionally larger
        this.updateDimensions();
    }
}
import { ChromoModel } from "./chromo_model.js";
import { ChromoView } from "./chromo_view.js";

export class ChromoController {
    constructor({
        colors = null,
        currentKey = "D",
        parentController = null,
        parentDiv = 'single_song_view',
        svg = null,
    } = {}) {
        this.parentController = parentController;
        this.model = new ChromoModel(currentKey, colors);
        this.view = new ChromoView(this.model, this, svg, parentDiv);
        
        // Store height for external use
        this.height = this.model.dimensions.svgHeight;
    }

    setKey(key) {
        this.model.setKey(key);
        this.view.updateKey(key);
        this.view.keySelectionEnd()
    }

    keyChanged(key) {
        this.model.setKey(key);
    }

    finalKeyChange(key) {
        this.view.keySelectionEnd();
        this.parentController.chromoKeyChanged(key);
    }

    keySelectionStart() {
        this.view.keySelectionStart();
    }

    keySelectionEnd() {
        this.view.keySelectionEnd();
    }

    setFontSize(fontSize) {
        this.model.setFontSize(fontSize);
        this.view.setFontSize(fontSize);
    }

    clickedOnKey() {
        this.parentController.saveKey(this.model.currentKey);
    }
} 
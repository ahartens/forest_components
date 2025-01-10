import { SongListView } from "/src/components/song_list/song_list_view.js";
import { SongListModel } from "/src/components/song_list/song_list_model.js";
import { SingleSongController } from "/src/single_song/single_song_controller.js";

export class SongListController {
  constructor(parentDivId) {
    this.view = new SongListView(this, parentDivId);
    this.model = new SongListModel();

    // this.single_song_controller = new SingleSongController();
    this.loaded_songs = false;

    this.view.createAddButton(
      // TODO remove this, move to main_page
      function () {
        this.clicked_on_add_button();
      }.bind(this),
    );
  }

  set_songs(songs) {
    this.model.songs = songs;
  }

  addToParent(parentDivId) {
    this.view.addToParent(parentDivId);
  }

  setup_view(songs) {
    if (this.loaded_songs == false) {
      this.loaded_songs = true;
      this.view.drawSongbook(songs);
    }
  }

  clicked_on_song(song) {
    this.single_song_controller.show_single_song(song);
  }

  on_dom_load() {
    this.single_song_controller.on_dom_load();
  }

  clicked_on_add_button() {
    this.single_song_controller.show_add_new_song();
  }

  show() {
    this.state == "showing";
  }
  hide() {
    this.state == "hidden";
  }
}

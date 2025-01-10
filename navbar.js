export class Navbar {
  constructor(controller) {
    this.tabs = ["SongBook", "Chords"];
    this.parent_controller = controller;
    this.state = this.tabs[0];
    this.loginButton = document.createElement("div");
    console.log("CREATIN?G LOGIN BUTTON", this.loginButton);
    this.user = null;
    this.MOBILE = false;
    if (window.innerWidth < 500) {
      this.MOBILE = true;
    }
    this.drawNavbarContents();

    this.change_navbar_selection(this.tabs[0]);
  }

  on_click_first_tab(tab) {
    this.state = tab;
    if (this.parent_controller != null) {
      this.parent_controller.navbar_changed(this.state);
    }
    this.change_navbar_selection();
  }

  change_navbar_selection() {
    this.tabs.forEach((tab) => {
      const tabElement = document.getElementById(`tab-${tab}`);
      if (tab == this.state) {
        tabElement.classList.add("selected");
      } else {
        tabElement.classList.remove("selected");
      }
    });
  }

  drawNavbarContents() {
    // Create the main navigation bar container
    const navbar = document.getElementById("navbar");
    navbar.className = "navbar";

    // Create the left-side container for logo and tabs
    const navbarLeft = document.createElement("div");
    navbarLeft.className = "navbar-left";

    navbar.appendChild(navbarLeft);

    // Add a logo to the left side
    const logo = document.createElement("div");
    logo.className = "logo";
    navbarLeft.appendChild(logo);

    let className = "navtabs";
    console.log("THIS IS THE STATUS", this.MOBILE);
    if (this.MOBILE == true) {
      className = "navtabs_mobile";
    }
    console.log("NAVBAR CLASS NAME", className);
    // Add the tabs (Songs, Artists, Chords)
    this.tabs.forEach((tab) => {
      const tabElement = document.createElement("div");
      tabElement.textContent = tab;
      tabElement.className = className;
      tabElement.id = `tab-${tab}`;
      tabElement.addEventListener(
        "click",
        function () {
          this.on_click_first_tab(tab);
        }.bind(this),
      ); // Bind the class context to the method
      navbarLeft.appendChild(tabElement);
    });

    // Create the right-side container for login or user info
    const navbarRight = document.createElement("div");
    navbarRight.className = "navbar-right";

    // Otherwise, show the login button
    this.#setUserView();
    this.loginButton.className = `${className} login-button-${className}`;
    navbarRight.appendChild(this.loginButton);

    // Append the left and right containers to the main navbar
    navbar.appendChild(navbarLeft);
    navbar.appendChild(navbarRight);
  }

  #setUserView() {
    if (this.loginButton != null) {
      if (this.user != null) {
        this.loginButton.textContent = this.user.email;
      } else {
        this.loginButton.textContent = "Login";
      }
    }
  }
  setUser(user) {
    this.user = user;
    this.#setUserView();
  }
}

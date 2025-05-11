let panels: { [key: string]: HTMLElement } = {};

function initNavigation() {
  const drawer = document.querySelector(".drawer");
  drawer?.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;

    // Find the closest .nav-item (in case an inner element was clicked)
    const navItem = target.closest(".nav-item") as HTMLElement | null;
    if (!navItem) return;

    if (navItem.ariaDisabled == "true") return;
    const tab = navItem.getAttribute("data-tab");

    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.remove("active");
    });
    // Mark the clicked item as active
    navItem.classList.add("active");

    if (tab) {
      switchTab(tab);
    }
  });
}

function updateNavStates(anyFileOpen: boolean) {
  console.log("Currently any file open:", anyFileOpen)
  document.querySelectorAll(".fileopen-dependant").forEach((item) => {
    if (item.nodeName == "BUTTON") {
      (item as HTMLButtonElement).disabled = !anyFileOpen;
    } else     item.ariaDisabled = anyFileOpen ? null: "true";
  });
}

function switchTab(tabName: string): void {
    // Hide all panel elements.
    Object.keys(panels).forEach((key) => {
      const panel = panels[key];
      panel.style.display = "none";
    });
  
  // Show the target panel if it exists.
  if (panels[tabName]) {
    panels[tabName].style.display = "block";
    console.log(`${tabName} Tab Activated`)
  } else {
    console.error(`Panel for ${tabName} not found.`)
  }
  }
  

export { initNavigation, updateNavStates, switchTab };

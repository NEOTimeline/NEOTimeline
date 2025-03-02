async function loadComponent(id, url) {
    const response = await fetch(url);
    const content = await response.text();
    document.getElementById(id).innerHTML = content;
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    loadComponent("sidebar", "sidebar.html");
  });
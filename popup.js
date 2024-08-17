chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateColor') {
    const colorDisplay = document.getElementById('colorDisplay');
    if (colorDisplay) {
      colorDisplay.style.backgroundColor = request.colorCode;
      colorDisplay.textContent = request.colorCode;
    }
  }
});

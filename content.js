let debounceTimeout;

document.addEventListener('mousemove', function(event) {
  const x = event.clientX;
  const y = event.clientY;

  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }

  debounceTimeout = setTimeout(() => {
    chrome.runtime.sendMessage({
      action: 'captureScreenshot',
      x: x,
      y: y
    });
  }, 100); // 100ms debounce time to reduce the number of requests
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'processScreenshot') {
    const img = new Image();
    img.src = request.dataUrl;

    img.onload = function() {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 1;
      canvas.height = 1;
      context.drawImage(img, request.x, request.y, 1, 1, 0, 0, 1, 1); // Only get the pixel at the cursor location

      const pixel = context.getImageData(0, 0, 1, 1).data;
      const colorCode = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;

      chrome.runtime.sendMessage({
        action: 'updateColor',
        colorCode: colorCode
      });
    };
  }
});

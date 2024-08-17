let lastScreenshotTime = 0;
const screenshotInterval = 500; // 500ms interval to avoid hitting rate limits

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'captureScreenshot') {
    const now = Date.now();

    if (now - lastScreenshotTime > screenshotInterval) {
      lastScreenshotTime = now;
      chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
        chrome.tabs.sendMessage(sender.tab.id, {
          action: 'processScreenshot',
          dataUrl: dataUrl,
          x: request.x,
          y: request.y
        });
      });
    }
  }
});
